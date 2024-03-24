import React, { useContext } from 'react'
import { ChatContext } from '../../context/ChatContex'
import { AuthContex } from '../../context/AuthContex'

const PotentialChats = () => {
    const {user} = useContext(AuthContex)
    const {potentialChats,createChat,onlineUsers} = useContext(ChatContext)
    // list user
  return (
    <div>
        <div className="all-users">
           {potentialChats && potentialChats.map((u,index)=>{
            return (
                <div className="single-user" 
                key={index} 
                 onClick={()=>createChat(user._id,u._id)}
                >
                    {u.name}
                    <span className={onlineUsers?.some((user)=>user?.userId === u?._id) ? 'user-online': "" }>

                    </span>
                </div>
            )
           })}
        </div>
    </div>
  )
}

export default PotentialChats