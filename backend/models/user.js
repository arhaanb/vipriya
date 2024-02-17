var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
	name: String,
	spotifyToken: String,
	bio: String,
	age: String,
	prefferedSex: String,
	height: String,
	gender: String,
	image: {
		type: String,
		default: 'user.jpg',
	},
	phone: String,
	firstUse: {
		type: Number,
		default: 1,
	},

	topArtists: Array,
	match: String,
})

module.exports = mongoose.model('User', UserSchema)
