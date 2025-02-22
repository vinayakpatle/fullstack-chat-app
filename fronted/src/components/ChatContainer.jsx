import {useEffect,useRef} from 'react'
import {useChatStore} from '../store/useChatStore';
import {useAuthStore} from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import avatar from "../assets/avatar.png";
import { formatMessageTime } from '../lib/util';

const ChatContainer = () => {
  const {messages,getMessages,isMessagesLoading,selectedUser}=useChatStore();

  const {authUser}=useAuthStore();

  useEffect(()=>{
    getMessages(selectedUser.id);
  },[selectedUser,getMessages])

  if(isMessagesLoading) return (
    <div className='flex-1 flex flex-col overflow-y-auto'>
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>
  )

  return (
    <div className='flex-1 flex flex-col overflow-y-auto'>
      <ChatHeader/>

      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message)=>(
          <div
            key={message.id}
            className={`chat ${message.sender_id===authUser.id ? "chat-end" : "chat-start"}`}
          >
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img
                  src={message.sender_id===authUser.id ? authUser.profile_pic || avatar : selectedUser.profile_pic || avatar}
                  alt={"profile_pic"}
                />
              </div>
            </div>

            <div className='chat-header mb-1'>
              <time className='text-xs opacity-50 ml-1'>
                {formatMessageTime(message.created_at)}
              </time>
            </div>

            <div className='chat-bubble flex flex-col'>
              {message.image && (
                <img
                  src={message.image}
                  alt='Attachment'
                  className=' sm:max-w-[200px] rounded-md mb-2'
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
            
          </div>
        ))}
      </div>

      <MessageInput/>
    </div>
  )
}

export default ChatContainer