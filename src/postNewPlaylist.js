const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

router.post('/', (req, res) => {
  const db = new sqlite3.Database('./db/database.sqlite3');

  const sql = 'INSERT INTO playlist(title) VALUES(?)';
  const params = req.body.title.toString();

  console.log('req:', req.body)
  new Promise((resolve, reject) => {
    db.run(sql, [params], function (error) {
      if (error) reject(error);
      resolve(this.lastID);
    });
  }).then(datas => {
    db.close();
    res.sendStatus(200).send(datas);
  }).catch(error => {
    res.sendStatus(500).send(error);
  });
});

module.exports = router;