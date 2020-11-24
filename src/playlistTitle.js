const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

router.get('/', (req, res) => {
  let db = new sqlite3.Database('./db/database.sqlite3');

  let sql = `SELECT id, title FROM playlist`;

  new Promise((resolve, reject) => {
    db.all(sql, [], (error, rows) => {
      if (error) reject(error);
      resolve(rows);
    });
  }).then(rows => {
    console.log('rows:', rows);
    db.close();
    res.status(200).send(rows);
  }).catch(error => {
    res.status(500).send(error);
  });
});

module.exports = router;