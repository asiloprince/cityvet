export async function saveDispersalLivestock(db, payload) {
  const sql = "SELECT * FROM single_dispersion WHERE livestock_id = ?";
  const [checkRows] = await db.query(sql, [payload.livestockId]);

  if (checkRows.length > 0) {
    throw new Error(
      "The livestock has already been registered under different beneficiaries."
    );
  }

  const sql2 =
    "INSERT INTO single_dispersion (dispersal_id, livestock_id, init_num_heads) VALUES (?,?,?)";

  const values = [
    payload.dispersal_id,
    payload.livestockId,
    payload.initialNumberOfHeads,
  ];

  try {
    const [rows] = await db.query(sql2, values);
    return rows.insertId;
  } catch (err) {
    console.error(err);
    throw new Error("There was an error saving dispersal data");
  }
}

export async function transferLivestock(db, payload) {
  const sql =
    "INSERT INTO single_dispersion (dispersal_id, livestock_id, init_num_heads) VALUES (?,?,?)";

  const values = [
    payload.dispersal_id,
    payload.livestockId,
    payload.initialNumberOfHeads,
  ];

  try {
    const [rows] = await db.query(sql, values);
    return rows.insertId;
  } catch (err) {
    console.error(err);
    throw new Error("There was an error transferring the livestock");
  }
}
