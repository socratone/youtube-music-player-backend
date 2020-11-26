const groupVideosByListId = rows => {
  let results = [];
  let lastId = 0;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].id !== lastId) { // 새로운 id가 나왔을 때 객체를 새로 생성
      lastId = rows[i].id;
      let playlist = {
        listId: lastId,
        title: rows[i].title,
        videos: []
      };
      results.push(playlist);
    }
    const result = results[results.length - 1];
    result.videos.push({ 
      videoId: rows[i].videoId, 
      title: rows[i].videoTitle 
    });
  }
  return results;
}

module.exports = groupVideosByListId;