const express = require('express');
const app = express();
const cors = require('cors');

const routes = require('./routes');

app.use(cors());
app.use(express.json()); 
 
app.use('/api/playlist', routes.getPlaylist);
app.use('/api/new-playlist', routes.postNewPlaylist);

app.listen(4000, () => console.log('서버가 4000 포트에서 가동 중입니다.'));
