import connectDb from "../../db/connection.js";

// get beneficiaries info
export async function handleGetBeneficiariesInfo(req, res) {
  const { beneficiary_id } = req.params;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot cnnect to the database" });
  }

  const sql =
    "SELECT beneficiaries.beneficiary_id, full_name, birth_date, mobile, barangays.barangay_name FROM beneficiaries INNER JOIN barangays ON beneficiaries.barangay_id = barangays.barangay_id WHERE beneficiaries.beneficiary_id =?";

  const values = [beneficiary_id];
  let rows;

  try {
    [rows] = await db.query(sql, values);
  } catch (err) {
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "Error fetching Beneficiary information",
    });
  } finally {
    db.end();
  }

  res.send({
    success: true,
    message: "Success fetching Beneficiaries informaions",
    data: rows[0],
  });
}

// fetch/get beneficiaries
export async function handleGetBeneficiariesList(req, res) {
  const db = await connectDb("cityvet_program");

  if (!db) {
    return res
      .status(500)
      .send({ message: "Cannot connect to the database :<" });
  }

  try {
    const [rows] = await db.query(
      "SELECT beneficiaries.beneficiary_id, full_name, birth_date, mobile, barangays.barangay_name FROM beneficiaries INNER JOIN barangays ON beneficiaries.barangay_id = barangays.barangay_id"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching beneficiaries");
  } finally {
    db.end();
  }
}

// handle beneficiaris data creation
export async function handleNewBeneficiaries(req, res) {
  const { fullName, birthDate, mobile, barangayId } = req.body;
  const db = await connectDb("cityvet_program");

  if (!db) {
    return res
      .status(500)
      .send({ message: "Cannot connect to the database :<" });
  }

  try {
    await db.query(
      "INSERT INTO beneficiaries (full_name, birth_date, mobile, barangay_id) VALUES (?,?,?,?)",
      [fullName, birthDate, mobile, barangayId]
    );
    res.status(201).send("New beneficiaries added successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("error adding beneficiary");
  } finally {
    db.end();
  }
}

// update beneficiaries
// update beneficiaries
export async function handleUpdateBeneficiaries(req, res) {
  const payload = req.body;
  const { beneficiary_id } = req.params;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database",
    });
  }

  const sql =
    "SELECT beneficiary_id FROM beneficiaries WHERE beneficiary_id = ?";

  try {
    const [rows] = await db.query(sql, [beneficiary_id]);

    if (rows.length === 0) {
      return res
        .status(500)
        .send({ success: false, message: "Beneficiary not found." });
    }

    // update
    const sql2 =
      "UPDATE beneficiaries SET full_name = ? , birth_date = ?, mobile = ? , barangay_id = ? WHERE beneficiary_id = ?";

    const values = [
      payload.fullName,
      payload.birthDate,
      payload.mobile,
      payload.barangayId,
      beneficiary_id,
    ];

    await db.query(sql2, values);

    return res.send({
      success: true,
      message: "Beneficiary updated successfully.",
    });
  } catch (err) {
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error updating beneficiary data",
    });
  } finally {
    db.end();
  }
}

// delete beneficiaries
export async function handleDeleteBeneficiaries(req, res) {
  const { beneficiary_id } = req.params;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({ message: "Cannot connect to the database" });
  }

  const sql =
    "SELECT COUNT(*) AS count FROM dispersals WHERE beneficiary_id = ?";

  try {
    const [rows] = await db.query(sql, [beneficiary_id]);

    if (rows[0].count > 0) {
      return res.send({
        success: false,
        message:
          "Beneficiary cannot be deleted because of associated dispersals",
      });
    }

    const sql2 = "DELETE FROM beneficiaries WHERE beneficiary_id =?";

    await db.query("START TRANSACTION");
    await db.query(sql2, [beneficiary_id]);
    await db.query("COMMIT");

    return res.send({
      success: true,
      message: "Beneficiary successfully deleted",
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("[DB Error]", err);
    return res.send({
      success: false,
    });
  } finally {
    db.end();
  }
}
