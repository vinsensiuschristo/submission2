const Joi = require('joi');

const PlaylistsPayloadScheme = Joi.object({
  name: Joi.string().required(),
});

const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistsPayloadScheme, PlaylistSongPayloadSchema };
