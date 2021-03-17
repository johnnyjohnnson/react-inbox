import React from 'react';
import { Label } from './Label';




const Message = ({id, message, checkBoxMethod, starMethod}) => {

    return <div className={`row message ${message.read ? "read" : "unread"} ${message.selected ? "selected" : ""}`}>
        <div className="col-xs-1">
            <div className="row">
                <div className="col-xs-2">
                    <input id={id} type="checkbox" checked={message.selected} onChange={checkBoxMethod}/>
                </div>
                <div className="col-xs-2">
                    <i  id={id} className={`star fa ${message.starred ? "fa-star" : "fa-star-o"}`} onClick={starMethod}></i>
                </div>
            </div>
        </div>
        <div className="col-xs-11">
            {
                message.labels.map( (label, i) => <Label key={i} lblMessage={label} />)
            }
            <a href="_blank">
                {message.subject}
            </a>
        </div>
    </div>

}


export default Message;