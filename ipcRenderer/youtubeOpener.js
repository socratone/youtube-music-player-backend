const { ipcRenderer } = require('electron');

setTimeout(() => {
  const youtubeOpener = document.getElementById('youtubeOpener');
  youtubeOpener.addEventListener('click', () => {
    ipcRenderer.send('openYoutube');
  });
}, 2000);