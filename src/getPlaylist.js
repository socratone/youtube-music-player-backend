const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

router.get('/', (req, res) => {
  let db = new sqlite3.Database('./db/database.sqlite3');

  let sql = `
    SELECT playlist.id, playlist.title, video.videoId, video.title videoTitle FROM playlist_video
    INNER JOIN playlist ON playlist.id = playlist_video.pId
    INNER JOIN video ON video.id = playlist_video.vId`;

  new Promise((resolve, reject) => {
    db.all(sql, [], (error, datas) => {
      if (error) reject(error);
      resolve(datas);
    });
  }).then(datas => {
    // console.log('datas:', datas);
    db.close();

    let listIdIndex = 0;
    let results = [];

    for (let i = 0; i < datas.length; i++) {
      if (datas[i].id > listIdIndex) { // 새로운 id가 나왔을 때 객체를 새로 생성
        listIdIndex++;
        let playlist = {
          listId: listIdIndex,
          title: datas[i].title,
          videos: []
        };
        results.push(playlist);
      }
      const result = results[results.length - 1];
      result.videos.push({ 
        videoId: datas[i].videoId, 
        title: datas[i].videoTitle 
      });
    }
    
    res.status(200).send(results);
  }).catch(error => {
    res.status(500).send(error);
  });
});

module.exports = router;