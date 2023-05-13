const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
var faker = require("faker");

router.post("/", auth, async (req, res) => {
  try {
    const { order, rowsPerPage, column, page } = req.body;

    const query = {
      text:
        'SELECT pen_test.id, pen_test.start_at as test_start_at, pen_test."name", ' +
        'attack.type, attack.status, attack.start_at, attack.finished_at ' +
        'FROM pen_test ' +
        'JOIN attack on attack.pen_test_id = pen_test.id ' +
        `ORDER BY ${column} ${order.toUpperCase()}, pen_test.id ${order.toUpperCase()} ` +
        `LIMIT ${rowsPerPage} OFFSET ${rowsPerPage * page - rowsPerPage}`,
    };

    console.log(query.text)
    

    let { rows } = await db.query(query.text);

    let results = []

    for(const row of rows) {
      const found = results.find((e) => e.id == row.id)

      const attack = {
        type: row.type,
        status: row.status,
        start_at: row.start_at,
        finished_at: row.finished_at,
      }

      if(found) {
        found.attacks.push(attack)
      } else {
        results.push({
          id: row.id,
          test_start_at: row.test_start_at,
          name: row.name,
          attacks: [attack]
        })
      }
    }

    res.json(results);
    console.log(rows)
    console.log(results)
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const query = {
      text: "SELECT COUNT(DISTINCT pen_test.id) FROM pen_test JOIN attack on attack.pen_test_id = pen_test.id",
    };

    let { rows } = await db.query(query.text);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.post("/create-pentest", auth, async (req, res) => {
  try {

    const start_at = req.body.isScheduled === '0' ? 'NOW()' : 
      `'${req.body.dateScheduled.replace(/\s+/g, " ")}'`
    console.log(start_at)

    // find out max ID to make next
    let result = await db.query('SELECT MAX(id) FROM pen_test;');
    const attackId = (result.rows[0]?.max ?? 0) + 1

    const query = {
      text:
        'INSERT INTO pen_test (id, "name", gap, target_address, created_at, start_at) ' +
        `VALUES (${attackId}, '${req.body.name}', ${req.body.gap}, '${req.body.address}', NOW(), ${start_at})`
    };

    

    let valuesQ2 = '';
    const attacks = req.body.attacks

    const status = "SCHEDULED";

    const typeTranslator = {
      replay: "Replay Attack",
      eavesdropping: "Eavesdropping"
    }

    let firstTime = true;
    for(const key in attacks) {

      if(attacks[key]) {
        if(!firstTime) 
          valuesQ2 += ','

        firstTime = false;
        valuesQ2 += `('${typeTranslator[key]}', '${status}', ${attackId})`
      }
    }

    const query2 = {
      text:
        'INSERT INTO attack (type, status, pen_test_id) VALUES ' + valuesQ2 
    };

    console.log(query2.text)

    // if there are no attack in test do not create it
    if(firstTime) {
      res.status(500).send("You must select at least 1 attack");
      return;
    }


    await db.query(query.text);
    await db.query(query2.text);


    res.json({});
    console.log(req.body);

  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
}); 

module.exports = router;