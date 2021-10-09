const { normalize, denormalize } = require("normalizr");

function getNormalizedData(data, schema) {
	return normalize(data, [schema]);
}

function getDenormalizedData(data, schema, entities) {
	return denormalize(data, schema, entities);
}

module.exports = { getNormalizedData, getDenormalizedData };
