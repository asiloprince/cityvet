import connectDb from "../../db/connection.js";
import {
  saveDispersalLivestock,
  transferLivestock,
} from "./dispersals.utils.js";

// handle dispersals record creation
export async function handleLivestockDispersal(req, res) {
  const payload = req.body;
  const { beneficiaryId, dispersalDate, contractDetails, notes } = payload;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database.",
    });
  }

  try {
    await db.query("START TRANSACTION");
  } catch (err) {
    console.error("[DB Connection]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error connecting with the database.",
    });
  }

  let lastInsertedId;

  const sql =
    "INSERT INTO dispersals (beneficiary_id, dispersal_date, status, contract_details, num_of_heads, notes) VALUES (?, ?, 'Dispersed', ?, ?, ?)";
  const values = [
    beneficiaryId,
    dispersalDate,
    contractDetails || null,
    payload.initialNumberOfHeads,
    notes || null,
  ];

  try {
    const [rows] = await db.query(sql, values);
    lastInsertedId = rows.insertId;
  } catch (err) {
    await db.query("ROLLBACK");
    db.end();
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error initializing dispersal data.",
    });
  }

  try {
    payload.dispersal_id = lastInsertedId;
    await saveDispersalLivestock(db, payload);
    await db.query("COMMIT");
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error saving dispersal information.",
    });
  } finally {
    db.end();
  }

  return res.send({
    success: true,
    message: "Dispersal successfully created.",
  });
}

// redisperse starter/breeder or parents
export async function handleRedispersalStarter(req, res) {
  const { dispersal_id } = req.params;
  const payload = req.body;
  const {
    beneficiaryId,
    dispersalDate,
    contractDetails,
    notes,
    initialNumberOfHeads,
  } = payload;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database.",
    });
  }

  try {
    await db.query("START TRANSACTION");

    const sql = "SELECT * FROM dispersals WHERE dispersal_id = ?";
    const [dispersalRows] = await db.query(sql, [dispersal_id]);
    const dispersal = dispersalRows[0];

    // Retrieve the associated livestock
    const sql2 = "SELECT * FROM single_dispersion WHERE dispersal_id = ?";
    const [livestockRows] = await db.query(sql2, [dispersal_id]);
    const livestock = livestockRows[0];

    // Update the previous dispersal
    const sql3 =
      "UPDATE dispersals SET recipient_id = ?, status = 'Archived', num_of_heads = 0, redispersal_date = NOW() WHERE dispersal_id = ?";
    const updateValues = [beneficiaryId, dispersal.dispersal_id];
    await db.query(sql3, updateValues);

    // Insert new dispersal
    const sql4 =
      "INSERT INTO dispersals (beneficiary_id, dispersal_date, status, contract_details, redispersal_date, num_of_heads, prev_ben_id, notes) VALUES (?, ?, 'Dispersed', ?, NULL, ?, ?, ?)";
    const insertValues = [
      beneficiaryId,
      dispersalDate,
      contractDetails,
      initialNumberOfHeads,
      dispersal.beneficiary_id,
      notes,
    ];
    const [insertRows] = await db.query(sql4, insertValues);
    const newdispersal_id = insertRows.insertId;

    // Transfer the livestock and create new dispersal
    const transferPayload = {
      dispersal_id: newdispersal_id,
      livestockId: livestock.livestock_id,
      initialNumberOfHeads: initialNumberOfHeads,
    };
    await transferLivestock(db, transferPayload);

    await db.query("COMMIT");

    return res.send({
      success: true,
      message: "Dispersal successfully created.",
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error saving dispersal information.",
    });
  } finally {
    db.end();
  }
}

// redisperse offsprings
export async function handleRedispersalOffspring(req, res) {
  const payload = req.body;

  const {
    beneficiaryId,
    dispersalDate,
    contractDetails,
    redispersalDate,
    previousBeneficiaryId,
    notes,
  } = payload;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database",
    });
  }

  try {
    await db.query("START TRANSACTION");
  } catch (err) {
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error connecting eith the database.",
    });
  }

  // if previous beneficiary is specified. update recipient_id of their dispersal

  if (previousBeneficiaryId) {
    const updateSql =
      "UPDATE dispersals SET recipient_id = ?, status = 'Redispersed', redispersal_date =  NOW() WHERE beneficiary_id = ? ";

    const updateValues = [beneficiaryId, previousBeneficiaryId];

    await db.query(updateSql, updateValues);
  }

  let lastInsertedId;

  const sql =
    "INSERT INTO dispersals (beneficiary_id, dispersal_date, status, contract_details, redispersal_date, num_of_heads, prev_ben_id, notes) VALUES (?, ?, 'Dispersed', ?, ?, ?, ?, ?)";
  const values = [
    beneficiaryId,
    dispersalDate,
    contractDetails || null,
    redispersalDate || null,
    payload.initialNumberOfHeads,
    previousBeneficiaryId || null,
    notes || null,
  ];
  try {
    const [rows] = await db.query(sql, values);
    lastInsertedId = rows.insertId;
  } catch (err) {
    await db.query("ROLLBACK");
    db.end();
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error initializing dispersal data.",
    });
  }
  try {
    payload.dispersal_id = lastInsertedId;
    await transferLivestock(db, payload);
    await db.query("COMMIT");
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error saving dispersal information.",
    });
  } finally {
    db.end();
  }
  return res.send({
    success: true,
    message: "Dispersal successfully created.",
  });
}

// get info
export async function handleGetDispersalInfo(req, res) {
  const { dispersal_id } = req.params;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database.",
    });
  }

  const sql =
    "SELECT d.dispersal_id, d.dispersal_date, d.num_of_heads, d.status, d.redispersal_date, b.full_name AS current_beneficiary, pb.full_name AS previous_beneficiary,  rb.full_name AS recipient,  e.ear_tag, l.category, l.age, sd.init_num_heads, br.barangay_name FROM dispersals d  JOIN beneficiaries b ON d.beneficiary_id = b.beneficiary_id LEFT JOIN beneficiaries pb ON d.prev_ben_id = pb.beneficiary_id LEFT JOIN beneficiaries rb ON d.recipient_id = rb.beneficiary_id JOIN single_dispersion sd ON d.dispersal_id = sd.dispersal_id JOIN livestock l ON sd.livestock_id = l.livestock_id JOIN EarTags e ON l.eartag_id = e.eartag_id JOIN barangays br ON b.barangay_id = br.barangay_id WHERE d.dispersal_id = ?;";
  try {
    const [rows] = await db.query(sql, [dispersal_id]);

    if (rows.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Dispersal not found",
      });
    }

    const dispersal = rows[0];
    return res.send({
      success: true,
      dispersal,
    });
  } catch (err) {
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error fetching dispersal records",
    });
  } finally {
    db.end();
  }
}

// get list
export async function handleGetDispersalList(req, res) {
  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database.",
    });
  }

  const sql =
    "SELECT d.dispersal_id, d.dispersal_date, d.num_of_heads, d.status, d.redispersal_date,  b.full_name AS current_beneficiary,   pb.full_name AS previous_beneficiary,  rb.full_name AS recipient,  e.ear_tag, l.category, l.age, sd.init_num_heads, br.barangay_name FROM dispersals d JOIN beneficiaries b ON d.beneficiary_id = b.beneficiary_id LEFT JOIN beneficiaries pb ON d.prev_ben_id = pb.beneficiary_id LEFT JOIN beneficiaries rb ON d.recipient_id = rb.beneficiary_id JOIN single_dispersion sd ON d.dispersal_id = sd.dispersal_id JOIN livestock l ON sd.livestock_id = l.livestock_id JOIN EarTags e ON l.eartag_id = e.eartag_id JOIN barangays br ON b.barangay_id = br.barangay_id;";

  try {
    const [rows] = await db.query(sql);
    return res.send({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error retrieving dispersal data.",
    });
  } finally {
    db.end();
  }
}

// update dispersal data
export async function handleUpdateDispersalData(req, res) {
  const { dispersal_id } = req.params;
  const payload = req.body;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.send({ message: " Cannot connect to the database" });
  }
  try {
    await db.query("START TRANSACTION");

    const sql =
      "UPDATE dispersals SET beneficiary_id = ?, dispersal_date = ? , status = ?, contract_details = ? , redispersal_date = ?, num_of_heads = ? , prev_ben_id = ? , recipient_id = ? , notes = ? WHERE dispersal_id = ?";
    const {
      beneficiaryId,
      dispersal_date,
      status,
      contract_details,
      redispersal_date,
      num_of_heads,
      prev_ben_id,
      recipient_id,
      notes,
    } = payload;

    const values = [
      beneficiaryId,
      dispersal_date,
      status,
      contract_details || null,
      redispersal_date || null,
      num_of_heads,
      prev_ben_id || null,
      recipient_id || null,
      notes || null,
      dispersal_id,
    ];

    await db.query(sql, values);

    if (payload.initialNumberOfHeads) {
      const sql2 =
        "UPDATE single_dispersion SET init_num_heads = ? WHERE dispersal_id = ?";
      const single_dispersionValues = [
        payload.initialNumberOfHeads,
        dispersal_id,
      ];
      await db.query(sql2, single_dispersionValues);
    }
    await db.query("COMMIT");

    return res.send({
      success: true,
      message: " Dispersal data updated successfully.",
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error updating dispersal data.",
    });
  } finally {
    db.end();
  }
}

// delete dispersal records

export async function handleDeleteDispersalRecord(req, res) {
  const { dispersal_id } = req.params;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database",
    });
  }

  const sql = "DELETE FROM single_dispersion WHERE dispersal_id = ?";
  const sql2 = "DELETE FROM dispersals WHERE dispersal_id = ?";

  try {
    await db.query("START TRANSACTION");
    await db.query(sql, [dispersal_id]);
    await db.query(sql2, [dispersal_id]);

    await db.query("COMMIT");

    return res.send({
      success: true,
      message: "Dispersal successfully deleted",
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("[DB Error", err);
    return res.send({
      success: false,
    });
  } finally {
    db.end();
  }
}
