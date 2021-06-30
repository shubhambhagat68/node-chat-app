const path = require('path')
const http = require('http')
const express= require('express')
const socketio= require('socket.io')
const Filter= require('bad-words')


const app = express()
const server = http.createServer(app)
const io= socketio(server)


const port = process.env.PORT || 3000
const publicDictoryPath= path.join(__dirname,'../public')

app.use(express.static(publicDictoryPath))


io.on('connection',(socket)=>{
	console.log("New Socket Connection")


	socket.emit('message',"Welcome !!")
	socket.broadcast.emit('message',"New User Has Joined")



	socket.on('sendMessage',(message,callback)=>{

		const filter = new Filter()

		if(filter.isProfane(message)){
			return callback("Profanity Not Allowed!")
		}

		io.emit('message',message)
		callback()
	})



	socket.on('sendLocation',(coords,callback)=>{
		io.emit('locationMessage',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
		callback()
	})



	socket.on('disconnect',()=>{
		io.emit('message',"A User Has Left")
	})

})


server.listen(port,()=>{

console.log(`Sever Running at port ${port}`)
})