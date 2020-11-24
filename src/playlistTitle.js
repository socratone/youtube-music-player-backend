const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

router.get('/', (req, res) => {
  let db = new sqlite3.Database('./db/database.sqlite3');

  let sql = `SELECT id, title FROM playlist`;

  new Promise((resolve, reject) => {
    db.all(sql, [], (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  }).then(result => {
    console.log('result:', result);
    db.close();
    res.status(200).send(result);
  }).catch(error => {
    res.status(500).send(error);
  });
});

module.exports = router;