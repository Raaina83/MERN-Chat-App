import React from 'react'
import { useAuthContext } from '../../context/AuthContext'
import useConversation from '../../zustand/useConversation'
import { extractTime } from '../../utils/extractTime';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Message({message}) {
    const {user} = useSelector(state => state.auth)
    // const {selectedConversation} = useConversation();
    const formattedTime = extractTime(message.createdAt);
    const fromMe = user._id === message.senderId._id;
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? user.profile : message.senderId.profile; 
    const name = fromMe ? user.fullName : message.senderId.fullName;

    // const params = useParams()
    // console.log("params message", params)

  return (
    <>
    <div className={`chat ${chatClassName}`}>
        <div className="chat-image avatar">
            <div className="w-10 rounded-full">
                <img alt="Tailwind CSS chat bubble component" src={profilePic} />
            </div>
        </div>
        <div className="chat-header">
        {name}
        <time className="text-xs opacity-50">{formattedTime}</time>
        </div>
        <div className="chat-bubble">{message.message}</div>
        <div className="chat-footer opacity-50">
            Delivered
        </div>
    </div>

    {/* <div className="chat chat-end">

        <div className="chat-image avatar">
            <div className="w-10 rounded-full">
            <img alt="Tailwind CSS chat bubble component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
        </div>

        <div className="chat-header">
             {authUser.fullName}  John Doe
            <time className="text-xs opacity-50">12:46</time>
        </div>

        <div className="chat-bubble">I hate you!</div>

        <div className="chat-footer opacity-50">
            Seen at 12:46
        </div>
        </div> */}

</>
  )
}

export default Message