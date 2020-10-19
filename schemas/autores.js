const { strict } = require('assert');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	guildId: {
		type: String,
		required: true,
	},
	msg: {
		type: String,
		required: true,
	},
	res: {
		type: String,
		required: true,
	},
	makeId: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('autores', schema);