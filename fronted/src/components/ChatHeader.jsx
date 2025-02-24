import React from 'react'
import {X} from "lucide-react";
import {useAuthStore} from "../store/useAuthStore";
import {useChatStore} from "../store/useChatStore";
import avatar from "../assets/avatar.png";

const ChatHeader = () => {
  const {selectedUser,setSelectedUser} =useChatStore();
  const {onlineUsers}=useAuthStore();

  return (
    <div className='p-2.5 border-b border-base-300'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {/* avater*/}
          <div className='avatar'>
            <div className='size-10 rounded-full relative'>
              <img src={selectedUser.profile_pic || avatar} alt={selectedUser.full_name}/>
            </div>
          </div>
          {/*user info*/}
          <div>
            <h3 className='font-medium'>{selectedUser.full_name}</h3>
            <p className='text-sm text-base-content/70'>{onlineUsers.includes(selectedUser.id.toString())? "Online" : "Offline"}</p>
          </div>
        </div>

        {/* close button*/}
        <button onClick={()=>setSelectedUser(null)}>
          <X/> 
        </button>
      </div>
    </div>
  )
}

export default ChatHeader