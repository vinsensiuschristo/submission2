/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongService {
  constructor(songService) {
    this._pool = new Pool();
    this._songService = songService;
  }

  async addPlaylistSong(playlistId, songId) {
    const id = `playlist-song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist Song gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: `DELETE FROM playlist_songs 
      WHERE playlist_id = $1 AND song_id = $2
      RETURNING id`,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Musik gagal dihapus dari playlist');
    }
  }

  async verifyPlaylistSong(playlistId, songId) {
    const query = {
      text: 'SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist Song gagal diverifikasi');
    }
  }

  async getPlaylistSongById(playlistId) {
    const queryGetPlaylist = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
      LEFT JOIN users on playlists.owner = users.id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const queryGetSongs = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
      JOIN songs on playlist_songs.song_id = songs.id
      WHERE playlist_id = $1`,
      values: [playlistId],
    };

    const resultPlaylist = await this._pool.query(queryGetPlaylist);
    const songsResult = await this._pool.query(queryGetSongs);

    const playlist = resultPlaylist.rows[0];
    const result = {
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
      songs: songsResult.rows,
    };

    return result;
  }
}

module.exports = PlaylistSongService;
