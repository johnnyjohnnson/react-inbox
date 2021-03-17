import React from 'react';
import Message from './Message';


const MessageList = ({arrayOfMessages, checkBoxMethod, starMethod}) => {
    return <div>
        {
            arrayOfMessages.map( (msg, i) => {
                return <Message key={i} id={msg.id} message={msg} checkBoxMethod={checkBoxMethod} starMethod={starMethod}/>
            })
        }
    </div>
}

export default MessageList;