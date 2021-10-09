const { normalize, denormalize } = require("normalizr");

function getNormalizedData(data, schema) {
	return normalize(data, [schema]);
}

function getDenormalizedData(input, schema, entities) {
	return denormalize(input, [schema], entities);
}

module.exports = { getNormalizedData, getDenormalizedData };
