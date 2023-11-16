import connectDb from "../../db/connection.js";
import moment from "moment";
import {
  saveDispersalLivestock,
  transferLivestock,
} from "./dispersals.utils.js";

// handle dispersals record creation
export async function handleLivestockDispersal(req, res) {
  const payload = req.body;
  const { beneficiary_id, dispersal_date, contract_details, notes } = payload;

  const db = await connectDb("u429667672_cityvetdb");
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
    "INSERT INTO dispersals (beneficiary_id, dispersal_date, status, contract_details, num_of_heads, notes) VALUES (?, ?, 'Dispersed', ?, ?, 'Write your notes here!')";
  const values = [
    beneficiary_id,
    dispersal_date,
    contract_details || null,
    payload.init_num_heads,
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
    await saveDispersalLivestock(db, payload);

    // Update is_dispersed status to dispersed
    const sql3 =
      "UPDATE livestock SET is_dispersed = true WHERE livestock_id = ?";
    await db.query(sql3, [payload.livestock_id]);

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
    beneficiary_id,
    dispersal_date,
    contract_details,
    notes,
    num_of_heads,
  } = payload;

  const db = await connectDb("u429667672_cityvetdb");
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
      "UPDATE dispersals SET recipient_id = ?, status = 'Transferred', num_of_heads = num_of_heads - 1, redispersal_date = NOW() WHERE dispersal_id = ?";
    const updateValues = [beneficiary_id, dispersal.dispersal_id];
    await db.query(sql3, updateValues);

    // Insert new dispersal
    const sql4 =
      "INSERT INTO dispersals (beneficiary_id, dispersal_date, status, contract_details, redispersal_date, num_of_heads, prev_ben_id, notes) VALUES (?, ?, 'Dispersed', ?, NULL, ?, ?, 'Write your notes here!')";
    const insertValues = [
      beneficiary_id,
      dispersal_date,
      contract_details,
      num_of_heads,
      dispersal.beneficiary_id,
      notes,
    ];

    const [insertRows] = await db.query(sql4, insertValues);
    const newdispersal_id = insertRows.insertId;

    // insert redispersal default values for visit tables
    const sql5 =
      "INSERT INTO visits (dispersal_id, visit_date, remarks, visit_again, is_default) VALUES (?, ?, ?, ?, ?)";
    const visitValues = [
      newdispersal_id,
      new Date(),
      "(No Remarks)",
      "Not set",
      true,
    ];
    await db.query(sql5, visitValues);

    // Transfer the livestock and create new dispersal
    const transferPayload = {
      dispersal_id: newdispersal_id,
      livestock_id: livestock.livestock_id,
      init_num_heads: num_of_heads,
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
    beneficiary_id,
    dispersal_date,
    contract_details,
    redispersal_date,
    prev_ben_id,
    notes,
    livestock_id,
  } = payload;

  const db = await connectDb("u429667672_cityvetdb");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database",
    });
  }

  try {
    await db.query("START TRANSACTION");

    // Check if livestock_id already exists
    const checkSql = "SELECT * FROM single_dispersion WHERE livestock_id = ?";
    const [checkRows] = await db.query(checkSql, [livestock_id]);

    if (checkRows.length > 0) {
      return res.status(400).send({
        success: false,
        message:
          "Livestock ID already exists. Try Livestock Redisperse Transfer.",
      });
    }
  } catch (err) {
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "There was an error connecting eith the database.",
    });
  }

  // if previous beneficiary is specified. update recipient_id of their dispersal

  if (prev_ben_id) {
    const updateSql =
      "UPDATE dispersals SET recipient_id = ?, status = 'Redispersed', redispersal_date =  NOW() WHERE beneficiary_id = ? ";

    const updateValues = [beneficiary_id, prev_ben_id];

    await db.query(updateSql, updateValues);
  }

  let lastInsertedId;

  const sql =
    "INSERT INTO dispersals (beneficiary_id, dispersal_date, status, contract_details, redispersal_date, num_of_heads, prev_ben_id, notes) VALUES (?, ?, 'Dispersed', ?, ?, ?, ?, 'Write your notes here!')";
  const values = [
    beneficiary_id,
    dispersal_date,
    contract_details || null,
    redispersal_date || null,
    payload.init_num_heads,
    prev_ben_id || null,
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
    await transferLivestock(db, payload);

    // update status
    const sql3 =
      "UPDATE livestock SET is_dispersed = true WHERE livestock_id = ?";
    await db.query(sql3, [payload.livestock_id]);

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

  const db = await connectDb("u429667672_cityvetdb");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database.",
    });
  }

  const sql =
    "SELECT d.*, b.full_name AS current_beneficiary, pb.full_name AS previous_beneficiary, rb.full_name AS recipient, e.ear_tag, l.category, l.age, sd.init_num_heads, br.barangay_name, v.visit_date, v.remarks, v.visit_again FROM dispersals d JOIN beneficiaries b ON d.beneficiary_id = b.beneficiary_id LEFT JOIN beneficiaries pb ON d.prev_ben_id = pb.beneficiary_id LEFT JOIN beneficiaries rb ON d.recipient_id = rb.beneficiary_id JOIN single_dispersion sd ON d.dispersal_id = sd.dispersal_id JOIN livestock l ON sd.livestock_id = l.livestock_id JOIN EarTags e ON l.eartag_id = e.eartag_id JOIN barangays br ON b.barangay_id = br.barangay_id JOIN visits v ON d.dispersal_id = v.dispersal_id WHERE d.dispersal_id = ? ORDER BY v.visit_date DESC;";

  try {
    const [rows] = await db.query(sql, [dispersal_id]);

    if (rows.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Dispersal not found",
      });
    }

    const dispersalData = rows[0];
    const visits = rows.map((row) => ({
      visit_date: row.visit_date,
      remarks: row.remarks,
      visit_again: row.visit_again,
    }));

    dispersalData.visits = visits;

    return res.send({
      success: true,
      dispersal: dispersalData,
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
  const db = await connectDb("u429667672_cityvetdb");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database.",
    });
  }

  const sql = `SELECT d.dispersal_id, d.dispersal_date, d.num_of_heads, d.status, d.contract_details,d.notes, b.beneficiary_id,  b.full_name AS current_beneficiary,  e.ear_tag, l.category, l.age, sd.init_num_heads, br.barangay_name,  v.visit_date, v.remarks, v.visit_again 
  FROM dispersals d 
  JOIN beneficiaries b ON d.beneficiary_id = b.beneficiary_id 
  LEFT JOIN beneficiaries pb ON d.prev_ben_id = pb.beneficiary_id 
  LEFT JOIN beneficiaries rb ON d.recipient_id = rb.beneficiary_id 
  JOIN single_dispersion sd ON d.dispersal_id = sd.dispersal_id 
  JOIN livestock l ON sd.livestock_id = l.livestock_id 
  JOIN EarTags e ON l.eartag_id = e.eartag_id 
  JOIN barangays br ON b.barangay_id = br.barangay_id 
  LEFT JOIN (
    SELECT dispersal_id, visit_date, remarks, visit_again 
    FROM visits 
    WHERE (dispersal_id, visit_date) IN (
      SELECT dispersal_id, MAX(visit_date) 
      FROM visits 
      GROUP BY dispersal_id
    )
  ) v ON d.dispersal_id = v.dispersal_id;
  `;

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

//handle dispersal Activity
export async function handleGetDispersalsActivityRecords(req, res) {
  const db = await connectDb("u429667672_cityvetdb");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database.",
    });
  }

  const sql = `
   SELECT d.dispersal_id, b.full_name AS current_beneficiary, d.registration_date, d.num_of_heads, d.status, br.barangay_name,
       COALESCE(l.category, bd.livestock_received) AS livestock_received
FROM dispersals d
JOIN beneficiaries b ON d.beneficiary_id = b.beneficiary_id
JOIN barangays br ON b.barangay_id = br.barangay_id
LEFT JOIN batch_dispersal bd ON d.dispersal_id = bd.dispersal_id
LEFT JOIN single_dispersion sd ON d.dispersal_id = sd.dispersal_id
LEFT JOIN livestock l ON sd.livestock_id = l.livestock_id
ORDER BY d.registration_date DESC;

  `;

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

  const db = await connectDb("u429667672_cityvetdb");
  if (!db) {
    return res.send({ message: " Cannot connect to the database" });
  }
  try {
    await db.query("START TRANSACTION");

    const sql =
      "UPDATE dispersals SET  contract_details = ? ,  num_of_heads = ? , notes = ? WHERE dispersal_id = ?";
    const {
      contract_details,
      num_of_heads,
      notes,
      visit_date,
      remarks,
      visit_again,
    } = payload;

    const formattedDate = visit_date
      ? moment(visit_date).format("YYYY-MM-DD")
      : null;

    const values = [
      contract_details,
      num_of_heads,
      notes || null,
      dispersal_id,
    ];

    await db.query(sql, values);

    if (payload.init_num_heads) {
      const sql2 =
        "UPDATE single_dispersion SET init_num_heads = ? WHERE dispersal_id = ?";
      const single_dispersionValues = [payload.init_num_heads, dispersal_id];
      await db.query(sql2, single_dispersionValues);
    }

    // Fetch the latest visit record
    const sql3 =
      "SELECT * FROM visits WHERE dispersal_id = ? ORDER BY visit_date DESC LIMIT 1";
    const [rows] = await db.query(sql3, [dispersal_id]);
    const latestVisit = rows[0];

    if (formattedDate) {
      // Check if a record with the same visit_date already exists
      const sq4 =
        "SELECT * FROM visits WHERE dispersal_id = ? AND visit_date = ?";
      const [rows] = await db.query(sq4, [dispersal_id, formattedDate]);

      if (rows.length > 0) {
        // if a record with the same date exists, update that record
        const sql5 =
          "UPDATE visits SET remarks = ?, visit_again = ? WHERE dispersal_id = ? AND visit_date = ?";

        await db.query(sql5, [
          remarks || latestVisit.remarks,
          visit_again || latestVisit.visit_again,
          dispersal_id,
          formattedDate,
        ]);
      } else {
        // if no record with the same date exists, insert new visit records
        const sql6 =
          "INSERT INTO visits (dispersal_id, visit_date, remarks, visit_again) VALUES (?,?,?,?)";

        await db.query(sql6, [
          dispersal_id,
          visit_date,
          remarks || latestVisit.remarks,
          visit_again || latestVisit.visit_again,
        ]);
      }
    } else {
      // if visit_date is not provided, update the latest visit record
      const sql5 =
        "UPDATE visits SET remarks = ?, visit_again = ? WHERE dispersal_id = ? AND visit_date = ?";

      await db.query(sql5, [
        remarks || latestVisit.remarks,
        visit_again || latestVisit.visit_again,
        dispersal_id,
        latestVisit.visit_date,
      ]);
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

  const db = await connectDb("u429667672_cityvetdb");
  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database",
    });
  }

  const sql = "DELETE FROM single_dispersion WHERE dispersal_id = ?";
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
      message: "Dispersal successfully deleted",
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
