const Joi = require('joi');

const PlaylistsPayloadScheme = Joi.object({
  name: Joi.string().required(),
});

module.exports = { PlaylistsPayloadScheme };
