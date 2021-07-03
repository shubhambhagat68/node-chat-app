const users=[]

//(addUser, removeUser, getUser , getUserInRoom) <=Funtionality Applied

const addUser= ({id,username,room})=>{

	username=username.trim().toLowerCase()
	room=room.trim().toLowerCase()

	//Validate the data
	if(!username || !room){
		return {
			error:"Username And Room Required !!"
		}
	}

	//Check for existing user
	const existingUser= users.find((user)=>{
		return user.room===room && user.username===username
	})

	//Validate Username
	if(existingUser){
		return{
			error:"Username Already Taken!!"
		}
	}

	//Store user
	const user={id,username,room}
	users.push(user)
	return user


}


//Remove User
const removeUser= (id)=>{

	const index = users.findIndex((user)=>user.id===id)

	if(index!=-1){
		return users.splice(index,1)[0]
	}


}

//Get user
const getUser=(id)=>{

	const user = users.find((user)=>user.id===id)
	return user
}


//Get All User In a Room
const getUsersInRoom=(room)=>{
	room=room.trim().toLowerCase()
	 return users.filter((user)=>user.room===room)

}

module.exports={
	addUser,
	removeUser,
	getUser,
	getUsersInRoom
}