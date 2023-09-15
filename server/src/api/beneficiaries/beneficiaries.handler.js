import connectDb from "../../db/connection.js";

// fetch/get beneficiaries
export async function getBeneficiaries(req, res) {
  const db = await connectDb("cityvet_program");

  if (!db) {
    return res
      .status(500)
      .send({ message: "Cannot connect to the database :<" });
  }
  try {
    const [rows] = await db.query("SELECT * FROM beneficiaries");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching beneficiaries");
  } finally {
    db.end();
  }
}

export async function addNewBeneficiaries(req, res) {
  const { fullName, birthDate, mobile, address } = req.body;
  const db = await connectDb("cityvet_program");

  if (!db) {
    return res
      .status(500)
      .send({ message: "Cannot connect to the database :<" });
  }

  try {
    await db.query(
      "INSERT INTO beneficiaries (fullName, birthDate, mobile, address) VALUES (?,?,?,?)",
      [fullName, birthDate, mobile, address]
    );
    res.status(201).send("new beneficiaries added successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("error adding beneficiary");
  } finally {
    db.end();
  }
}
