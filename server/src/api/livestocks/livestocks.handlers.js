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
      "SELECT eartag_id FROM eartags WHERE ear_tag = ? LIMIT 1",
      [ear_tag]
    );

    if (earTagRows.length === 0) {
      const [insertResult] = await db.query(
        "INSERT INTO eartags (ear_tag) VALUES (?)",
        [ear_tag]
      );
      const eartag_id = insertResult.insertId;

      const lastInsertedId = await addLivestockData(db, payload);

      const sql = "UPDATE Livestock SET eartag_id = ? WHERE livestock_id = ?";
      const values = [eartag_id, lastInsertedId];

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
  const livestock_id = req.params.livestock_id;
  const sql =
    "SELECT livestock.livestock_id,type, category, breed, age,  health, isAlive, eartags.ear_tag FROM livestock INNER JOIN eartags ON livestock.eartag_id = eartags.eartag_id WHERE livestock.eartag_id =? ";

  const values = [livestock_id];
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
    "SELECT livestock.livestock_id, type, category, breed , age,  health, isAlive, eartags.ear_tag FROM livestock INNER JOIN eartags ON livestock.eartag_id = eartags.eartag_id";

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

// handle disperse Livestock list
export async function handleDispersedLivestockList(req, res) {
  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  const sql =
    "SELECT eartags.ear_tag, livestock.type, livestock.category, livestock_id, livestock.is_dispersed FROM livestock INNER JOIN eartags ON livestock.eartag_id = eartags.eartag_id WHERE livestock.is_dispersed = false";

  try {
    const [rows] = await db.query(sql);
    res.send({
      success: true,
      message: "Success fetching dispersed livestock list",
      data: rows,
    });
  } catch (err) {
    console.error("[DB Error]", err);
    res.status(500).send({
      success: false,
      message: "Error fetching dispersed livestock list",
    });
  } finally {
    db.end();
  }
}

// handles updating livestock info
export async function handleUpdateLivestockRecord(req, res) {
  const payload = req.body;
  const livestock_id = req.params.livestock_id;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  try {
    const [livestockRows] = await db.query(
      "SELECT livestock_id FROM livestock WHERE livestock_id = ?",
      [livestock_id]
    );

    if (livestockRows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Livestock not found.",
      });
    }

    // Update livestock data
    const sql =
      "UPDATE Livestock SET type = ?, category = ?, breed = ?, age = ?, health = ?, isAlive = ? WHERE livestock_id = ?";
    const values = [
      payload.type,
      payload.category,
      payload.breed,
      payload.age,
      payload.health,
      payload.isAlive,
      livestock_id,
    ];

    await db.query(sql, values);

    if (
      payload.isAlive === "Deceased" &&
      livestockRows[0].isAlive !== "Deceased"
    ) {
      const sql2 =
        "UPDATE dispersals SET num_of_heads = 0 WHERE dispersal_id IN (SELECT dispersal_id FROM single_dispersion WHERE livestock_id = ?)";

      await db.query(sql2, [livestock_id]);
    }

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
  const livestock_id = req.params.livestock_id;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database." });
  }

  try {
    const [livestockRows] = await db.query(
      "SELECT livestock_id, eartag_id FROM livestock WHERE livestock_id = ?",
      [livestock_id]
    );

    if (livestockRows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Livestock not found.",
      });
    }

    const eartag_id = livestockRows[0].eartag_id;

    const [otherLivestockRows] = await db.query(
      "SELECT livestock_id FROM livestock WHERE eartag_id = ? AND livestock_id != ?",
      [eartag_id, livestock_id]
    );

    const sql = "DELETE FROM livestock WHERE livestock_id = ?";
    await db.query(sql, [livestock_id]);

    if (otherLivestockRows.length === 0) {
      const deleteEarTagSql = "DELETE FROM eartags WHERE eartag_id = ?";
      await db.query(deleteEarTagSql, [eartag_id]);
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
