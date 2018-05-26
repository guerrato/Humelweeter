let app = require('express')()
let http = require('http').Server(app)
let io = require('socket.io')(http)
let fs = require('fs')

let pathView = __dirname + '/views/';

app.get('/', (req, res) => {
	res.sendFile(pathView + 'index.html')
})

app.get('/result', (req, res) => {
	res.sendFile(pathView + 'result.html')
})

app.use("*", (req,res) => {
  res.sendFile(pathView + "index.html");
});

io.on('connection', (socket) => {
	console.log('a user connected');
	
	socket.on('disconnect', () => {
    console.log('user disconnected')
	})
	
	socket.on('tweeted', () => {
		let obj = {}

		fs.readFile('db.json', 'utf8', function (err, data) {
			if (err) {
				throw err
			}

			obj = JSON.parse(data)

			let now = new Date()
			let mm = now.getMonth() + 1
			let dd = now.getDate()

			let date = [now.getFullYear(), (mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0') + dd].join('-')
				 
			if(date in obj) {
				obj[date]['tweet'] += 1
			} else {
				obj = {
					[date]: {
						'tweet': 1,
						'humification': 0
					} 
				}
			}

			fs.writeFile('db.json', JSON.stringify(obj), (err) => {
				if(err) {
					throw err
				}
			})

		})
  })
	
	socket.on('humified', () => {
		let obj = {}

		fs.readFile('db.json', 'utf8', function (err, data) {
			if (err) {
				throw err
			}

			obj = JSON.parse(data)

			let now = new Date()
			let mm = now.getMonth() + 1
			let dd = now.getDate()

			let date = [now.getFullYear(), (mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0') + dd].join('-')
				 
			if(date in obj) {
				obj[date]['humification'] += 1
			} else {
				obj = {
					[date]: {
						'tweet': 0,
						'humification': 1
					} 
				}
			}

			fs.writeFile('db.json', JSON.stringify(obj), (err) => {
				if(err) {
					throw err
				}
		
				console.log("The file was saved!");
			})

		})
  })
})

http.listen(3000, () => {
	console.log('listening on *:3000');
})