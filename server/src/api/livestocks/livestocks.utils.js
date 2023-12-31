export async function addLivestockData(db, livestockPayload) {
  const sql = "INSERT INTO livestock (type, category, age) VALUES (?,?,?)";

  const values = [
    livestockPayload.type,
    livestockPayload.category,
    livestockPayload.age,
  ];

  try {
    const [rows] = await db.query(sql, values);
    return rows.insertId;
  } catch (err) {
    console.error(err);
    throw new Error("There was an error adding livestock data");
  }
}
