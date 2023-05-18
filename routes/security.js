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
        `
        SELECT pen_test.id, pen_test.start_at as test_start_at, pen_test."name",
              attack.type, attack.status, attack.start_at, attack.finished_at
        FROM (
          SELECT pen_test.id, pen_test.start_at, pen_test."name",
                ROW_NUMBER() OVER (ORDER BY pen_test.id) AS rn
          FROM pen_test
          ORDER BY pen_test.id
          LIMIT ${rowsPerPage} OFFSET ${rowsPerPage * page - rowsPerPage}
        ) AS pen_test
        JOIN attack ON attack.pen_test_id = pen_test.id
        ORDER BY ${column} ${order.toUpperCase()}, pen_test.id ${order.toUpperCase()}
        `
      

        // 'SELECT pen_test.id, pen_test.start_at as test_start_at, pen_test."name", ' +
        // 'attack.type, attack.status, attack.start_at, attack.finished_at ' +
        // 'FROM pen_test ' +
        // 'JOIN attack on attack.pen_test_id = pen_test.id ' +
        // `ORDER BY ${column} ${order.toUpperCase()}, pen_test.id ${order.toUpperCase()} ` +
        // `LIMIT ${rowsPerPage} OFFSET ${rowsPerPage * page - rowsPerPage}`,
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
      text: "SELECT COUNT(DISTINCT pen_test.id) FROM pen_test",
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


    const r1 = await db.query(query.text);
    const r2 = await db.query(query2.text);

    console.log(req.body)
    console.log(r1.rows)
    console.log(r2.rows)

    res.json({});
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
}); 

router.post("/get-pentest", auth, async (req, res) => {
  try {
    let { order, rowsPerPage, column, page } = req.body;

    if(column === undefined)
      column = "attack.id"
    // attacker address 00ff99bb

    const query = {
      text:
        `
          SELECT pen_test.target_address, pen_test.name, pen_test.id, pen_test.start_at as test_start, pen_test.finished_at as test_finish,
          attack.type, attack.status, attack.start_at, attack.finished_at, attack.id,
          COUNT(uplink_messages.id) AS message_count
          FROM pen_test
          JOIN attack ON attack.pen_test_id = pen_test.id
          FULL JOIN nodes ON (pen_test.target_address = nodes.dev_addr OR nodes.dev_addr = '00ff99bb')
          FULL JOIN uplink_messages ON nodes.id = uplink_messages.node_id AND
              uplink_messages.receive_time BETWEEN COALESCE(attack.start_at, CURRENT_TIMESTAMP) AND COALESCE(attack.finished_at, CURRENT_TIMESTAMP)
          WHERE pen_test.id = $1
          GROUP BY pen_test.target_address, pen_test.name, pen_test.id,
                  attack.type, attack.status, attack.start_at, attack.finished_at, attack.id
        `,
        // 'SELECT pen_test.target_address, pen_test.name, pen_test.id, ' +
        // 'attack.type, attack.status, attack.start_at, attack.finished_at, attack.id ' +
        // 'FROM pen_test ' +
        // 'JOIN attack on attack.pen_test_id = pen_test.id ' +
        // 'WHERE pen_test.id = $1', 
      values: [req.body.testId],
    };
    console.log(query)
    let { rows } = await db.query(query.text, query.values);

    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasnsnsnsnsnns')
    console.log(rows)

    if(rows.length == 0){
      res.json(rows);
      return;
    }

    const result = {
      target_address: rows[0].target_address,
      name: rows[0].name,
      test_start: rows[0].test_start,
      test_finish: rows[0].test_finish,
      attacks: []
    };

    for(const row of rows) {
        const attackFound = result.attacks.find((a) => a.type === row.type);

        
        const attack = {
          id: row.id,
          type: row.type,
          status: row.status,
          start_at: row.start_at,
          finished_at: row.finished_at,
          message_count: row.message_count
        }

        // const uplink = {
        //   receive_time: row.receive_time,
        //   seq: row.seq,
        //   app_data: row.app_data,
        //   dev_addr: row.dev_addr
        // }

        if(attackFound) {
          //attackFound.uplinks.push(uplink)
        } else {
          
          //if row has uplink data add it to attack uplinks
          // if(uplink.dev_addr !== null)
          //   attack.uplinks.push(uplink)

          result.attacks.push(attack)
        }
    }

    console.log(result)
    //console.log(rows)

    //return result as array
    res.json([result]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});


router.post("/get-attack", auth, async (req, res) => {
  try {
    let { order, rowsPerPage, column, page } = req.body;
    console.log(req.body);
    if (column == undefined) {
      column = 'receive_time';
    }
    const query = {
      text:
        'SELECT uplink_messages.receive_time, uplink_messages.seq, uplink_messages.app_data, nodes.dev_addr, attack.status, attack.type, pen_test.name '+
        'FROM pen_test ' +
        'JOIN attack on attack.pen_test_id = pen_test.id ' +
        'FULL JOIN nodes on pen_test.target_address = nodes.dev_addr OR nodes.dev_addr = \'00ff99bb\' '+ 
        'FULL JOIN uplink_messages on nodes.id = uplink_messages.node_id AND ' +
        'uplink_messages.receive_time BETWEEN COALESCE(attack.start_at, CURRENT_TIMESTAMP) AND COALESCE(attack.finished_at, CURRENT_TIMESTAMP) '+
        'WHERE attack.id = $1' +
        `ORDER BY ${column} ${order.toUpperCase()}, attack.id ${order.toUpperCase()} ` +
        `LIMIT ${rowsPerPage} OFFSET ${rowsPerPage * page - rowsPerPage}`,
      values: [req.body.testId],
    };

    let { rows } = await db.query(query.text, query.values);

    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasnsnsnsnsnns')

    res.json(rows);
    return;

  } catch (err) {
    res.status(500).send("Server error");
    console.log(err);
  }
});

router.post("/message-count", auth, async (req, res) => {
  try {
    const query = {
      text: 
      'SELECT COUNT(uplink_messages.id) '+
        'FROM pen_test ' +
        'JOIN attack on attack.pen_test_id = pen_test.id ' +
        'JOIN nodes on (pen_test.target_address = nodes.dev_addr OR nodes.dev_addr = \'00ff99bb\') '+ 
        'JOIN uplink_messages on nodes.id = uplink_messages.node_id AND ' +
        'uplink_messages.receive_time BETWEEN COALESCE(attack.start_at, CURRENT_TIMESTAMP) AND COALESCE(attack.finished_at, CURRENT_TIMESTAMP) '+
        'WHERE attack.id = $1',
    values: [req.body.testId],
    };
    console.log(query);

    let { rows } = await db.query(query.text, query.values);
    console.log(rows);
    console.log(rows.length);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).send("Server error");
    console.log(err);
  }
});

module.exports = router;