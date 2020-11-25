const express = require('express');
const app = express();
const cors = require('cors');

const playlist = require('./getPlaylist');

app.use(cors());
 
app.use('/api/playlist_video', playlist);

app.listen(4000, () => console.log('서버가 4000 포트에서 가동 중입니다.'));
