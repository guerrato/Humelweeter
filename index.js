let app = require('express')()
let http = require('http').Server(app)
let io = require('socket.io')(http)
let fs = require('fs')

let pathView = __dirname + '/views/';

function getToday() {
	let now = new Date()
	let mm = now.getMonth() + 1
	let dd = now.getDate()

	return [now.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-')
}

app.get('/', (req, res) => {
	res.sendFile(pathView + 'index.html')
})

app.get('/result', (req, res) => {
	res.sendFile(pathView + 'result.html')
})

app.use("*", (req, res) => {
	res.sendFile(pathView + "index.html")
})

io.on('connection', (socket) => {
	console.log('a user connected')

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})

	socket.on('tweeted', () => {
		let data = {}

		fs.readFile('db.json', 'utf8', function (err, file) {
			if (err) {
				throw err
			}

			if (file != "") {
				data = JSON.parse(file)
			}

			let date = getToday()

			if (date in data) {
				data[date]['tweets'] += 1
			} else {
				data[date] = {
					'tweets': 1,
					'humifications': 0
				}
			}

			fs.writeFile('db.json', JSON.stringify(data), (err) => {
				if (err) {
					throw err
				}

				io.emit('tweeted', data[date])
			})
		})
	})

	socket.on('humified', () => {
		let data = {}

		fs.readFile('db.json', 'utf8', function (err, file) {
			if (err) {
				throw err
			}

			if (file != "") {
				data = JSON.parse(file)
			}

			let date = getToday()

			if (date in data) {
				data[date]['humifications'] += 1
			} else {
				data[date] = {
					'tweets': 0,
					'humifications': 1
				}
			}

			fs.writeFile('db.json', JSON.stringify(data), (err) => {
				if (err) {
					throw err
				}

				io.emit('humified', data[date])
			})
		})	
	})
})

http.listen(3000, () => {
	console.log('listening on *:3000')
})