import connectDb from "../../db/connection.js";
import moment from "moment";
import {
  saveBatchDispersal,
  transferBatchLivestock,
} from "./dispersals.utils.js";

// handle batch dispersal creations
export async function handleBatchDispersal(req, res) {
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

    // insert dispersal default value to visit tables
    const sql2 =
      "INSERT INTO visits (dispersal_id, visit_date, remarks, visit_again, is_default) VALUES (?, ?, ?, ?, ?)";
    const visitValues = [
      lastInsertedId,
      new Date(),
      "(No Remarks)",
      "Not set",
      true,
    ];
    await db.query(sql2, visitValues);
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
    await saveBatchDispersal(db, payload);
    await db.query("COMMIT");
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error saving batch dispersal information.",
    });
  } finally {
    db.end();
  }

  return res.send({
    success: true,
    message: "Batch Dispersal successfully created.",
  });
}

// handle redispersal
export async function handleBatchRedispersals(req, res) {
  const payload = req.body;

  const {
    beneficiaryId,
    dispersalDate,
    contractDetails,
    redispersalDate,
    previousBeneficiaryId,
    notes,
    livestockRecieved,
  } = payload;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database",
    });
  }

  try {
    await db.query("START TRANSACTION");

    // Check if livestock_recieved already exists
    const checkSql =
      "SELECT * FROM batch_dispersal WHERE livestock_recieved = ?";
    const [checkRows] = await db.query(checkSql, [livestockRecieved]);

    if (checkRows.length > 0) {
      return res.status(400).send({
        success: false,
        message:
          "Livestock Recieved already exists. Try Livestock Redisperse Transfer.",
      });
    }
  } catch (err) {
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error connecting with the database.",
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

    // Insert dispersal default values for visit tables
    const sql2 =
      "INSERT INTO visits (dispersal_id, visit_date, remarks, visit_again, is_default) VALUES (?, ?, ?, ?, ?)";

    const visitValues = [
      lastInsertedId,
      new Date(),
      "(No Remarks)",
      "Not set",
      true,
    ];

    await db.query(sql2, visitValues);
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

    await transferBatchLivestock(db, payload);

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

// get batch list
export async function handleGetBatchDispersalList(req, res) {
  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database.",
    });
  }

  const sql = `SELECT bd.batch_id, bd.livestock_recieved, bd.init_num_heads,bd.age, d.num_of_heads, d.dispersal_date, d.status, d.contract_details, d.notes,
    v.visit_date, v.remarks, v.visit_again, b.full_name AS current_beneficiary, br.barangay_name 
    FROM batch_dispersal bd 
    JOIN dispersals d ON bd.dispersal_id = d.dispersal_id 
    LEFT JOIN (
      SELECT dispersal_id, visit_date, remarks, visit_again 
      FROM visits 
      WHERE (dispersal_id, visit_date) IN (
        SELECT dispersal_id, MAX(visit_date) 
        FROM visits 
        GROUP BY dispersal_id
      )
    ) v ON d.dispersal_id = v.dispersal_id 
    JOIN beneficiaries b ON d.beneficiary_id = b.beneficiary_id 
    JOIN barangays br ON b.barangay_id = br.barangay_id;`;

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
      message: "There was an error retrieving batch dispersal and visit data.",
    });
  } finally {
    db.end();
  }
}

//get info
export async function handleGetBatchDispersalInfo(req, res) {
  const { batch_id } = req.params;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database.",
    });
  }

  const sql =
    "SELECT bd.batch_id, bd.livestock_recieved, bd.init_num_heads,bd.age, d.*, b.full_name AS current_beneficiary, br.barangay_name, v.visit_date, v.remarks, v.visit_again FROM batch_dispersal bd JOIN dispersals d ON bd.dispersal_id = d.dispersal_id JOIN beneficiaries b ON d.beneficiary_id = b.beneficiary_id JOIN barangays br ON b.barangay_id = br.barangay_id LEFT JOIN visits v ON d.dispersal_id = v.dispersal_id WHERE bd.batch_id = ? ORDER BY v.visit_date DESC;";

  try {
    const [rows] = await db.query(sql, [batch_id]);

    if (rows.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Batch dispersal not found",
      });
    }

    const batchDispersalData = rows[0];
    const visits = rows.map((row) => ({
      visit_date: row.visit_date,
      remarks: row.remarks,
      visit_again: row.visit_again,
    }));

    batchDispersalData.visits = visits;

    return res.send({
      success: true,
      batchDispersal: batchDispersalData,
    });
  } catch (err) {
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error fetching batch dispersal records",
    });
  } finally {
    db.end();
  }
}

// update batch details
export async function handleUpdateBatchDispersalData(req, res) {
  const { batch_id } = req.params;
  const payload = req.body;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.send({ message: " Cannot connect to the database" });
  }
  try {
    await db.query("START TRANSACTION");

    const sql =
      "UPDATE dispersals d JOIN batch_dispersal bd ON d.dispersal_id = bd.dispersal_id SET d.num_of_heads = ?, d.notes = ?, bd.age = ? WHERE bd.batch_id = ?";
    const { num_of_heads, notes, age, visit_date, remarks, visit_again } =
      payload;

    const formattedDate = visit_date
      ? moment(visit_date).format("YYYY-MM-DD")
      : null;

    const values = [num_of_heads, notes, age || null, batch_id];

    await db.query(sql, values);

    // Fetch the latest visit record
    const sql2 =
      "SELECT * FROM visits WHERE dispersal_id IN (SELECT dispersal_id FROM batch_dispersal WHERE batch_id = ?) ORDER BY visit_date DESC LIMIT 1";
    const [rows] = await db.query(sql2, [batch_id]);
    const latestVisit = rows[0];

    if (formattedDate) {
      // Check if a record with the same visit_date already exists
      const sql3 =
        "SELECT * FROM visits WHERE dispersal_id IN (SELECT dispersal_id FROM batch_dispersal WHERE batch_id = ?) AND visit_date = ?";
      const [rows] = await db.query(sql3, [batch_id, formattedDate]);

      if (rows.length > 0) {
        // if a record with the same date exists, update that record
        const sql4 =
          "UPDATE visits SET remarks = ?, visit_again = ? WHERE dispersal_id IN (SELECT dispersal_id FROM batch_dispersal WHERE batch_id = ?) AND visit_date = ?";

        await db.query(sql4, [
          remarks || latestVisit.remarks,
          visit_again || latestVisit.visit_again,
          batch_id,
          formattedDate,
        ]);
      } else {
        // if no record with the same date exists, insert new visit records
        const sql5 =
          "INSERT INTO visits (dispersal_id, visit_date, remarks, visit_again) VALUES ((SELECT dispersal_id FROM batch_dispersal WHERE batch_id = ?),?,?,?)";

        await db.query(sql5, [
          batch_id,
          formattedDate,
          remarks || latestVisit.remarks,
          visit_again || latestVisit.visit_again,
        ]);
      }
    } else {
      // if visit_date is not provided, update the latest visit record
      const sql6 =
        "UPDATE visits SET remarks = ?, visit_again = ? WHERE dispersal_id IN (SELECT dispersal_id FROM batch_dispersal WHERE batch_id = ?) AND visit_date = ?";

      await db.query(sql6, [
        remarks || latestVisit.remarks,
        visit_again || latestVisit.visit_again,
        batch_id,
        latestVisit.visit_date,
      ]);
    }
    await db.query("COMMIT");

    return res.send({
      success: true,
      message: " Batch dispersal data updated successfully.",
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error updating batch dispersal data.",
    });
  } finally {
    db.end();
  }
}

// delete batch dispersal
export async function handleDeleteBatchDispersal(req, res) {
  const { dispersal_id } = req.params;

  const db = await connectDb("cityvet_program");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database",
    });
  }

  const sql = "DELETE FROM batch_dispersal WHERE dispersal_id = ?";
  const sql2 = "DELETE FROM visits WHERE dispersal_id = ?";
  const sql3 = "DELETE FROM dispersals WHERE dispersal_id = ?";

  try {
    await db.query("START TRANSACTION");
    await db.query(sql, [dispersal_id]);
    await db.query(sql2, [dispersal_id]);
    await db.query(sql3, [dispersal_id]);

    await db.query("COMMIT");

    return res.send({
      success: true,
      message: "Batch dispersal successfully deleted",
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("[DB Error]", err);
    return res.send({
      success: false,
      message: "An error occurred while deleting the batch dispersal",
    });
  } finally {
    db.end();
  }
}
