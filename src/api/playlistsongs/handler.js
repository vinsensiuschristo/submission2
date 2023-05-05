/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class PlaylistSongHandler {
  constructor(playlistSongService, playlistService, validator) {
    this._playlistSongService = playlistSongService;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);

      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      const { songId } = request.payload;

      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      const playlistSongId = await this._playlistSongService.addPlaylistSong(playlistId, songId);

      const response = h.response({
        status: 'success',
        message: 'Playlist Song berhasil ditambahkan',
        data: {
          playlistSongId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistSongService.deletePlaylistSong(playlistId, songId);
      console.log(playlistId, songId);

      return {
        status: 'success',
        message: 'Playlist Song berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistSongByIdHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      const result = await this._playlistSongService.getPlaylistSongById(playlistId, credentialId);

      return {
        status: 'success',
        data: {
          result,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistSongHandler;
