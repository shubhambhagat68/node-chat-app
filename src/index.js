const path = require('path')
const http = require('http')
const express= require('express')
const socketio= require('socket.io')
const Filter= require('bad-words')
const {generateMessage,generateLocationMessage}= require('./utils/messages')
const {addUser, removeUser,getUser,getUserInRoom}= require('./utils/users')



const app = express()
const server = http.createServer(app)
const io= socketio(server)


const port = process.env.PORT || 3000
const publicDictoryPath= path.join(__dirname,'../public')

app.use(express.static(publicDictoryPath))


io.on('connection',(socket)=>{
	console.log("New WebSocket Connection")
	

	socket.on('join',({username,room},callback)=>{ 

		const{ error,user}= addUser({id:socket.id,username,room})
	
		if(error){
			return callback(error)
		}

		socket.join(user.room)

		socket.emit('message',generateMessage("FROM ADMIN","Welcome !!"))
		socket.broadcast.to(user.room).emit('message',generateMessage("FROM ADMIN",`${user.username} Has Joined!`))

		callback()

	})



	socket.on('sendMessage',(message,callback)=>{

		const user=getUser(socket.id)
		const filter = new Filter()

		if(filter.isProfane(message)){
			return callback("Profanity Not Allowed!")
		}

		io.to(user.room).emit('message',generateMessage(user.username,message))
		callback()
	})



	socket.on('sendLocation',(coords,callback)=>{
		const user=getUser(socket.id)
		const url=`https://google.com/maps?q=${coords.latitude},${coords.longitude}`
		io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,url))
		callback()
	})



	socket.on('disconnect',()=>{
		const user =removeUser(socket.id)

		if(user){
			io.to(user.room).emit('message',generateMessage("FROM ADMIN",`${user.username} Has Left!`))
		}

	})

})


server.listen(port,()=>{

console.log(`Sever Running at port ${port}`)
})