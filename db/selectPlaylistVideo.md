SELECT playlist.title, video.title FROM playlist_video

INNER JOIN playlist ON playlist.id = playlist_video.pId

INNER JOIN video ON video.id = playlist_video.vId;
