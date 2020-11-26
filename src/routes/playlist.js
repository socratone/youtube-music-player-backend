const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const Database = require('../Database');
const groupVideosByListId = require('../helper/groupVideosByListId');

const databasePath = './db/database.sqlite3';

router.get('/', async (req, res) => {
  try {
    console.log('get 진입')
    const db = new Database();
    await db.load(databasePath);

    // 재생리스트와 재생리스트에 들어 있는 곡 전부를 rows로 가져온다.
    const sql1 = `
      SELECT playlist.id, playlist.title, video.videoId, video.title videoTitle 
      FROM playlist_video
      INNER JOIN playlist ON playlist.id = playlist_video.pId
      INNER JOIN video ON video.id = playlist_video.vId
      ORDER BY playlist.id`;
    const rows1 = await db.get(sql1, []);
    const results = groupVideosByListId(rows1);

    // playlist_video.pId에 없는 playlist.id rows를 찾는다. (= 비어 있는 재생리스트)
    const sql2 = `
      SELECT playlist.id, playlist.title FROM playlist
      LEFT OUTER JOIN playlist_video ON playlist.id = playlist_video.pId
      WHERE playlist_video.pId IS NULL`;
    const rows2 = await db.get(sql2, []);
    await db.close();
    rows2.forEach(row => {
      results.push({ listId: row.id, title: row.title, videos: [] });
    });

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const db = new Database();
    await db.load(databasePath);
    const sql = 'INSERT INTO playlist(title) VALUES(?)';
    const params = req.body.title.toString();
    const lastId = await db.run(sql, [params]);
    await db.close();
    res.status(200).send(lastId);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  let db;
  new Promise((resolve, reject) => { 
    db = new sqlite3.Database('./db/database.sqlite3', error => {
      if (error) reject(error);
      resolve();
    });
  }).then(() => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM playlist_video WHERE pId=?', id, function (error) {
        if (error) reject(error);
        console.log(`playlist_video에서 ${this.changes}줄의 row가 삭제 됐습니다.`);
        resolve();
      });
    }).catch(error => { 
      throw error;
    });
  }).then(() => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM playlist WHERE id=?', id, function (error) {
        if (error) reject(error);
        console.log(`playlist에서 ${this.changes}줄의 row가 삭제 됐습니다.`);
        resolve(this.changes)
      });
    }).catch(error => { 
      throw error;
    });
  }).then(changes => {
    db.close(error => {
      if (error) throw error;
      res.send(changes.toString());
    });
  }).catch(error => {
    console.log('error:', error)
    res.status(500).send(error.message);
  });
});

module.exports = router;