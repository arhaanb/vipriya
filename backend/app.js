const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const rateLimit = require('express-rate-limit')
const User = require('./models/user')
const axios = require('axios')

require('dotenv').config()
const app = express()

// spotify response data
const callSpotifyAPI = (route, token) => {
	return new Promise((resolve, reject) => {
		axios
			.get(`https://api.spotify.com/v1/${route}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				resolve(response.data)
			})
			.catch((err) => {
				console.error('Error:', err.message)
			})
	})
}

// top artists and songs
const getTopTracksAndArtists = (sp_dc) => {
	return new Promise((resolve, reject) => {
		axios
			.get(
				'https://open.spotify.com/get_access_token?reason=transport&productType=web_player',
				{
					headers: {
						Cookie: `sp_dc=${sp_dc}`,
						'User-Agent':
							'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
					},
				}
			)
			.then((res) => {
				const token = res.data.accessToken
				const apiRoute = 'me/top/tracks?limit=50'

				callSpotifyAPI(apiRoute, token)
					.then((responseData) => {
						const songNames = responseData.items.map((item) => item.id).sort()
						const artistNames = [
							...new Set(
								responseData.items.flatMap((item) =>
									item.artists.map((artist) => artist.id)
								)
							),
						].sort()
						const genres = [
							...new Set(
								responseData.items.flatMap((item) =>
									item.artists.flatMap((artist) => artist.genres)
								)
							),
						]
						resolve([songNames, artistNames, genres])
					})
					.catch((err) => {
						console.error('Error:', err.message)
					})
			})
			.catch((err) => {
				console.error('Error:', err.message)
			})
	})
}

// DB Config
const db = process.env.MONGO_URI

// Connect to MongoDB
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.log(err))

// Setting view engine
app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

// Rate limiting
app.set('trust proxy', 1)
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 100, // limit each IP to 100 requests per windowMs (fix this accordingly)
	message: 'too many requests',
})

const path = __dirname + '/dist/'

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

// Sessions
app.use(
	session({
		secret: 'Daddies',
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
)

app.use(flash())

app.use((req, res, next) => {
	res.locals.currentUser = req.user
	next()
})

app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg')
	res.locals.error_msg = req.flash('error_msg')
	res.locals.error = req.flash('error')
	next()
})

app.get('/', (req, res, next) => {
	return res.send('balls')
})

app.get('/users', (req, res, next) => {
	User.find().exec(async function (err, users) {
		if (err) {
			console.log(err)
			return res.send(err)
		} else {
			return res.send(users)
		}
	})
})

app.post('/match', async (req, res, next) => {
	// jacobian distance
	function calculateSimilarity(arr1, arr2) {
		const intersection = arr1.filter((value) => arr2.includes(value))
		//   const union = [...new Set([...arr1, ...arr2])];
		const similarity =
			(2 * intersection.length) /
			(arr1.length + arr2.length - intersection.length)
		return similarity
	}

	getTopTracksAndArtists(sp_dc_one)
		.then(([songNamesOne, artistNamesOne, genresOne]) => {
			getTopTracksAndArtists(sp_dc_two)
				.then(([songNamesTwo, artistNamesTwo, genresTwo]) => {
					const songSimilarity = calculateSimilarity(songNamesOne, songNamesTwo)

					const artistSimilarity = calculateSimilarity(
						artistNamesOne,
						artistNamesTwo
					)

					const genreSimilarity = calculateSimilarity(genresOne, genresTwo)

					const totalCompatibility =
						0.5 * songSimilarity +
						0.25 * artistSimilarity +
						0.25 * genreSimilarity

					console.log('Total Compatibility:', totalCompatibility * 100)
				})
				.catch((err) => {
					console.error('Error:', err.message)
				})
		})

		.catch((err) => {
			console.error('Error:', err.message)
		})
	return res.send('successful')
})

app.post('/register', async (req, res, next) => {
	console.log('here')

	const {
		name,
		password,
		spotifyToken,
		bio,
		age,
		prefferedSex,
		height,
		phone,
		gender,
		image,
		topArtists,
		match,
	} = req.body

	let newname
	let newbio

	// Cleanse the name field
	try {
		const nameResponse = await axios.get(
			'https://community-purgomalum.p.rapidapi.com/json',
			{
				params: { text: name },
				headers: {
					'X-RapidAPI-Key':
						'14f2cca3bcmshf7a6ffcfc2a18ddp1672fejsn6831faa51f14',
					'X-RapidAPI-Host': 'community-purgomalum.p.rapidapi.com',
				},
			}
		)
		newname = nameResponse.data.result
	} catch (error) {
		console.error('Error cleansing name:', error)
	}

	// Cleanse the bio field
	try {
		const bioResponse = await axios.get(
			'https://community-purgomalum.p.rapidapi.com/json',
			{
				params: { text: bio },
				headers: {
					'X-RapidAPI-Key':
						'14f2cca3bcmshf7a6ffcfc2a18ddp1672fejsn6831faa51f14',
					'X-RapidAPI-Host': 'community-purgomalum.p.rapidapi.com',
				},
			}
		)
		newbio = bioResponse.data.result
	} catch (error) {
		console.error('Error cleansing bio:', error)
	}

	const userData = {
		name: newname,
		password,
		spotifyToken,
		bio: newbio,
		age,
		phone,
		prefferedSex,
		height,
		gender,
		image,
		topArtists,
		match,
	}

	console.log(req.body)

	User.create(userData, (error, log) => {
		if (error) {
			console.error(error)
			return res.status(500).json({ error })
		}
		return res.status(201).json({ message: 'User registered successfully' })
	})
	// return res.send('test');
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`)
	console.log(`http://localhost:${PORT}`)
})
