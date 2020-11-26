const express = require('express');
const router = express.Router();
const Database = require('../Database');
const groupVideosByListId = require('../helper/groupVideosByListId');

const databasePath = './db/database.sqlite3';

router.get('/', async (req, res) => {
  try {
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
    const listTitle = req.body.title.toString();
    const [changes, lastId] = await db.run(sql, [listTitle]);
    await db.close();
    res.status(200).send({ listId: lastId });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = new Database();
    await db.load(databasePath);
    const listTitle = req.body.title.toString();
    const sql = 'UPDATE playlist SET title = ? WHERE id = ?';
    const [changes] = await db.run(sql, [listTitle, id]);
    await db.close();
    res.status(200).send({ playlist: changes });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = new Database();
    await db.load(databasePath);
    const sql1 = 'DELETE FROM playlist_video WHERE pId=?';
    const [changes1] = await db.run(sql1, id);
    console.log(`playlist_video에서 ${changes1}줄의 row가 삭제 됐습니다.`);
    
    const sql2 = 'DELETE FROM playlist WHERE id=?';
    const [changes2] = await db.run(sql2, id);
    console.log(`playlist에서 ${changes2}줄의 row가 삭제 됐습니다.`);
    await db.close();
    res.send({ playlist_video: changes1, playlist: changes2 });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;