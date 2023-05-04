const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postPlaylistSongHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  // {
  //   method: 'GET',
  //   path: '/playlists/{id}/songs',
  //   handler: handler.getPlaylistSongHandler,
  //   options: {
  //     auth: 'musicsapp_jwt',
  //   },
  // },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deletePlaylistSongHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];

module.exports = routes;
