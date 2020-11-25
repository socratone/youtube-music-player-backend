const express = require('express');
const app = express();
const cors = require('cors');

const getPlaylist = require('./getPlaylist');
const postNewPlaylist = require('./postNewPlaylist');

app.use(cors());
app.use(express.json()); 
 
app.use('/api/playlist', getPlaylist);
app.use('/api/new-playlist', postNewPlaylist);

app.listen(4000, () => console.log('서버가 4000 포트에서 가동 중입니다.'));
