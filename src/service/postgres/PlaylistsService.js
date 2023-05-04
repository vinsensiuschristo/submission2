/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(playlistSongService) {
    this._pool = new Pool();

    this._playlistSongService = playlistSongService;
  }

  async addPlaylist(name, owner) {
    const id = `playlists-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylistById(id) {
    const query = {
      text: 'SELECT p.id, p.name, u.username FROM playlists p INNER JOIN users u ON p.owner = u.id WHERE p.owner = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows;
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal dihapus. Id tidak ditemukan.');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT id, owner FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  // Playlist Song

  async verifyPlaylistAccess(playlistId, songId) {
    try {
      await this.verifyPlaylistOwner(playlistId, songId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._playlistSongService.verifyPlaylistSong(playlistId, songId);
      } catch {
        throw error;
      }
    }
  }

  // async addPlaylistSong(playlistId, songId) {
  //   const id = `playlist-song${nanoid(16)}`;

  //   const query = {
  //     text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
  //     values: [id, playlistId, songId],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rows.length) {
  //     throw new InvariantError('Playlist gagal ditambahkan');
  //   }

  //   return result.rows[0].id;
  // }

  // async verifyPlaylistAccess(id, owner) {
  //   try {
  //     await this.verifyPlaylistOwner(id, owner);
  //   } catch (error) {
  //     if (error instanceof NotFoundError) {
  //       throw error;
  //     }

  //     try {
  //       await this.verifyPlaylistSong(id, owner);
  //     } catch {
  //       throw error;
  //     }
  //   }
  // }

  // async deletePlaylistSong(playlistId, songId) {
  //   const query = {
  //     text: 'DELETE FROM playlist_songs WHERE playlists_id = $1 AND song_id = $2 RETURNING id',
  //     values: [playlistId, songId],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rows.length) {
  //     throw new InvariantError('Playlist Song gagal dihapus');
  //   }
  // }

  // async verifyPlaylistSong(playlistId, songId) {
  //   const query = {
  //     text: 'SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
  //     values: [playlistId, songId],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rows.length) {
  //     throw new InvariantError('Playlist Song gagal diverifikasi');
  //   }
  // }

  // async getPlaylistSongById(playlistId, songId) {}
}

module.exports = PlaylistsService;
