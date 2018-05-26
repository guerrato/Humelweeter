var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var fs = require('fs')

var pathView = __dirname + '/views/';

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
	
	socket.on('tweet', () => {
		fs.readFile('db.json', 'utf8', function (err, data) {
			if (err) {
				throw err
			}

			obj = JSON.parse(data)
		})
  })
})

http.listen(3000, () => {
	console.log('listening on *:3000');
})