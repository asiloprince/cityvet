import connectDb from "../../db/connection.js";

// dispersal and redispersal
export async function handleDispersalsAndRedispersal(req, res) {
  const db = await connectDb("cityvet_program");
  const timePeriod = req.query.timePeriod;

  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database.",
    });
  }

  let sql;
  if (timePeriod === "Week") {
    sql = `
      SELECT 
        YEAR(dispersal_date) AS year,
        MONTH(dispersal_date) AS month,
        WEEK(dispersal_date) AS week,
        'Dispersed' AS status,
        COUNT(*) AS total
      FROM dispersals  
      WHERE dispersal_date IS NOT NULL
      GROUP BY year, month, week

      UNION ALL

      SELECT 
        YEAR(redispersal_date) AS year,
        MONTH(redispersal_date) AS month,
        WEEK(redispersal_date) AS week,
        'Redispersed' AS status,
        COUNT(*) AS total
      FROM dispersals  
      WHERE redispersal_date IS NOT NULL
      GROUP BY year, month, week
    `;
  } else if (timePeriod === "Month") {
    sql = `
      SELECT 
        YEAR(dispersal_date) AS year,
        MONTH(dispersal_date) AS month,
        'Dispersed' AS status,
        COUNT(*) AS total
      FROM dispersals  
      WHERE dispersal_date IS NOT NULL
      GROUP BY year, month

      UNION ALL

      SELECT 
        YEAR(redispersal_date) AS year,
        MONTH(redispersal_date) AS month,
        'Redispersed' AS status,
        COUNT(*) AS total
      FROM dispersals  
      WHERE redispersal_date IS NOT NULL
      GROUP BY year, month
    `;
  } else if (timePeriod === "Year") {
    sql = `
      SELECT 
        YEAR(dispersal_date) AS year,
        'Dispersed' AS status,
        COUNT(*) AS total
      FROM dispersals  
      WHERE dispersal_date IS NOT NULL
      GROUP BY year

      UNION ALL

      SELECT 
        YEAR(redispersal_date) AS year,
        'Redispersed' AS status,
        COUNT(*) AS total
      FROM dispersals  
      WHERE redispersal_date IS NOT NULL
      GROUP BY year
    `;
  }

  try {
    const [rows] = await db.query(sql);

    // Reshape data for charting
    const data = rows.reduce((acc, curr) => {
      const key = `${curr.year}-${curr.month}-${curr.week}`;
      if (!acc[key]) {
        acc[key] = {
          year: curr.year,
          month: curr.month,
          week: curr.week,
          dispersals: 0,
          redispersals: 0,
        };
      }
      if (curr.status === "Dispersed") {
        acc[key].dispersals += curr.total;
      } else if (curr.status === "Redispersed") {
        acc[key].redispersals += curr.total;
      }
      return acc;
    }, {});

    return res.send({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "Error retrieving data",
    });
  } finally {
    db.end();
  }
}

export async function handleUpdates(req, res) {
  const db = await connectDb("cityvet_program");

  if (!db) {
    return res.status(500).send("Error connecting to database");
  }

  // Call refresh stored procedure
  db.query("CALL refresh_data");

  const lastUpdate = req.query.lastUpdate;

  try {
    const results = await db.query(
      `
      SELECT * 
      FROM dispersal_summary
      WHERE updated_at > ?
    `,
      [lastUpdate]
    );

    return res.send({
      success: true,
      data: results,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error getting updates");
  } finally {
    db.end();
  }
}

export async function handleDispersalsPrediction(req, res) {
  const db = await connectDb("cityvet_program");

  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to database",
    });
  }

  try {
    const sql = `
SELECT 
  YEAR(dispersal_date) as year, 
  MONTH(dispersal_date) as month,
  COUNT(*) as total 
FROM dispersals
WHERE YEAR(dispersal_date) = YEAR(CURDATE())
GROUP BY YEAR(dispersal_date), MONTH(dispersal_date)
ORDER BY YEAR(dispersal_date), MONTH(dispersal_date)`;

    const [rows] = await db.query(sql);

    // Send the data to the frontend
    return res.send({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Error processing request",
    });
  } finally {
    db.end();
  }
}

export async function handleTotalivestockForEachType(req, res) {
  const db = await connectDb("cityvet_program");

  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to database",
    });
  }

  try {
    const [rows] = await db.query(`
      SELECT
        type,
        COUNT(*) AS total_heads
      FROM livestock  
      GROUP BY type

      UNION ALL

      SELECT
        CASE
          WHEN livestock_received IN ('Broiler Chickens', 'Free Range Chickens') THEN 'Chickens'
          ELSE livestock_received
        END AS type,
        SUM(init_num_heads) AS total_heads
      FROM batch_dispersal
      GROUP BY type;
    `);

    return res.status(200).send({
      message: "Livestock data fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "An error occurred while fetching livestock data",
    });
  }
}

export async function handleBeneficiariesByGender(req, res) {
  const db = await connectDb("cityvet_program");

  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to database",
    });
  }

  try {
    const [rows] = await db.query(`
      SELECT gender, COUNT(*) as count
      FROM beneficiaries
      GROUP BY gender
    `);

    return res.send(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "An error occurred while fetching data",
    });
  }
}

export async function handleDisperseLivestocksStackBar(req, res) {
  const db = await connectDb("cityvet_program");

  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to database",
    });
  }

  try {
    // Query to get livestock data from batch_dispersal and single_dispersion
    const [batchDispersalData] = await db.query(`
      SELECT DATE_FORMAT(dispersal_date, '%Y-%m') as month, livestock_received, init_num_heads
      FROM batch_dispersal
      JOIN dispersals ON batch_dispersal.dispersal_id = dispersals.dispersal_id
    `);

    const [singleDispersalData] = await db.query(`
      SELECT DATE_FORMAT(dispersal_date, '%Y-%m') as month, category, init_num_heads
      FROM single_dispersion
      JOIN dispersals ON single_dispersion.dispersal_id = dispersals.dispersal_id
      JOIN livestock ON single_dispersion.livestock_id = livestock.livestock_id
    `);

    // Combine the data
    const combinedData = [...batchDispersalData, ...singleDispersalData];

    // Process the data for the chart
    const processedData = combinedData.reduce((acc, curr) => {
      const { month, livestock_received, category, init_num_heads } = curr;

      // Use the livestock_received or category as the livestock type
      const livestockType = livestock_received || category;

      // Find the data object for this month
      let monthData = acc.find((data) => data.month === month);

      // If this month is not yet in the accumulator, add it
      if (!monthData) {
        monthData = { month };
        acc.push(monthData);
      }

      // If this livestock type is not yet in this month's object, add it with the initial number of heads
      if (!monthData[livestockType]) {
        monthData[livestockType] = init_num_heads;
      } else {
        // Otherwise, add the initial number of heads to the existing number
        monthData[livestockType] += init_num_heads;
      }

      return acc;
    }, []);

    // Send the processed data for the chart
    res.status(200).send({
      message: "Data retrieved successfully",
      data: processedData,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving data",
      error: error.message,
    });
  }
}

export async function handleLivestockHealthStatus(req, res) {
  const db = await connectDb("cityvet_program");

  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to database",
    });
  }

  try {
    const [rows] = await db.query(`
      SELECT DATE(registration_date) as date, health, COUNT(*) as count
      FROM livestock
      WHERE is_dispersed = true
      GROUP BY date, health
      ORDER BY date ASC
    `);

    res.status(200).send({
      message: "Data retrieved successfully",
      data: rows,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving data",
      error: error.message,
    });
  }
}

export async function handleTotalDispersalAndRedispersal(req, res) {
  const db = await connectDb("cityvet_program");

  if (!db) {
    return res.status(500).send({
      message: "Cannot connect to the database.",
    });
  }

  const sql = `
    SELECT 
      'Dispersed' AS status,
      COUNT(*) AS total
    FROM dispersals  
    WHERE dispersal_date IS NOT NULL

    UNION ALL

    SELECT 
      'Redispersed' AS status,
      COUNT(*) AS total
    FROM dispersals  
    WHERE redispersal_date IS NOT NULL
  `;

  try {
    const [rows] = await db.query(sql);

    // Reshape data for charting
    const data = rows.reduce((acc, curr) => {
      if (curr.status === "Dispersed") {
        acc.dispersals = curr.total;
      } else if (curr.status === "Redispersed") {
        acc.redispersals = curr.total;
      }
      return acc;
    }, {});

    return res.send({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error("[DB Error]", err);
    return res.status(500).send({
      success: false,
      message: "Error retrieving data",
    });
  } finally {
    db.end();
  }
}
