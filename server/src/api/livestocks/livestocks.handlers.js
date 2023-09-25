import connectDb from "../../db/connection.js";
import { addLivestockData } from "./livestocks.utils.js";

// handle livestock record creations
export async function handleLivestockRegistration(req, res) {
  const payload = req.body;
  const { ear_tag } = payload;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  try {
    // Check if the ear tag exists
    const [earTagRows] = await db.query(
      "SELECT earTagId FROM EarTags WHERE ear_tag = ? LIMIT 1",
      [ear_tag]
    );

    if (earTagRows.length === 0) {
      const [insertResult] = await db.query(
        "INSERT INTO EarTags (ear_tag) VALUES (?)",
        [ear_tag]
      );
      const earTagId = insertResult.insertId;

      const lastInsertedId = await addLivestockData(db, payload);

      const sql = "UPDATE Livestock SET earTagId = ? WHERE livestockId = ?";
      const values = [earTagId, lastInsertedId];

      await db.query(sql, values);

      return res.send({
        success: true,
        message: "Livestock successfully added!",
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "Ear tag is already associated with a livestock.",
      });
    }
  } catch (err) {
    db.end();
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error connecting with the database.",
    });
  } finally {
    db.end();
  }
}

// handle fetching livestock info

export async function handleGetLivestockInfo(req, res) {
  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database" });
  }
  const livestockId = req.params.livestockId;
  const sql =
    "SELECT livestock.livestockId,type, category, breed, age, status, health, isAlive, eartags.ear_tag FROM livestock INNER JOIN eartags ON livestock.earTagId = eartags.earTagId WHERE livestock.earTagId =? ";

  const values = [livestockId];
  let rows;

  try {
    [rows] = await db.query(sql, values);
  } catch (err) {
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "Error fetching livestock information",
    });
  } finally {
    db.end();
  }

  res.send({
    success: true,
    message: "Success fetching livestock informations",
    data: rows[0],
  });
}

export async function handleGetLivestockList(req, res) {
  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  const sql =
    "SELECT livestock.livestockId, type, category, breed , age, status, health, isAlive, eartags.ear_tag FROM livestock INNER JOIN eartags ON livestock.earTagId = eartags.earTagId";

  try {
    const [rows] = await db.query(sql);
    res.send({
      success: false,
      message: "Success fetching livestock list",
      data: rows,
    });
  } catch (err) {
    console.error("[DB Error]", err);
    res.status(500).send({
      success: false,
      message: "Error fetching livestock list",
    });
  } finally {
    db.end();
  }
}

// handles updating livestock info

export async function handleUpdateLivestockRecord(req, res) {
  const payload = req.body;
  const livestockId = req.params.livestockId;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  try {
    const [livestockRows] = await db.query(
      "SELECT livestockId FROM Livestock WHERE livestockId = ?",
      [livestockId]
    );

    if (livestockRows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Livestock not found.",
      });
    }

    // Update livestock data
    const sql =
      "UPDATE Livestock SET type = ?, category = ?, breed = ?, age = ?, status = ?, health = ?, isAlive = ? WHERE livestockId = ?";
    const values = [
      payload.livestockType,
      payload.category,
      payload.breed,
      payload.age,
      payload.status,
      payload.health,
      payload.isAlive,
      livestockId,
    ];

    await db.query(sql, values);

    return res.send({
      success: true,
      message: "Livestock data updated successfully.",
    });
  } catch (err) {
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error updating livestock data.",
    });
  } finally {
    db.end();
  }
}

// handle livestock deletion

export async function handleDeleteLivestockRecord(req, res) {
  const livestockId = req.params.livestockId;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  try {
    const [livestockRows] = await db.query(
      "SELECT livestockId, earTagId FROM Livestock WHERE livestockId = ?",
      [livestockId]
    );

    if (livestockRows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Livestock not found.",
      });
    }

    const earTagId = livestockRows[0].earTagId;

    const [otherLivestockRows] = await db.query(
      "SELECT livestockId FROM Livestock WHERE earTagId = ? AND livestockId != ?",
      [earTagId, livestockId]
    );

    const sql = "DELETE FROM Livestock WHERE livestockId = ?";
    await db.query(sql, [livestockId]);

    if (otherLivestockRows.length === 0) {
      const deleteEarTagSql = "DELETE FROM EarTags WHERE earTagId = ?";
      await db.query(deleteEarTagSql, [earTagId]);
    }

    return res.send({
      success: true,
      message: "Livestock record and associated ear tag deleted successfully.",
    });
  } catch (err) {
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error deleting the livestock record.",
    });
  } finally {
    db.end();
  }
}
