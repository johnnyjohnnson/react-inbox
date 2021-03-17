import React from 'react';


const Toolbar = ( { selectAllState, unreadMsgCount, selectOrDeselectAll, changeReadStatus, deleteMessages, labelHandler } ) => {

    let buttonAppearance = "";
    if (selectAllState === "checked") {
        buttonAppearance = "fa fa-check-square-o";
    } else if (selectAllState === "half-checked") {
        buttonAppearance = "fa fa-minus-square-o";
    } else if (selectAllState === "unchecked") {
        buttonAppearance = "fa fa-square-o";
    }

    return (
        <div className="row toolbar">
            <div className="col-md-12">
                <p className="pull-right">
                    <span className="badge badge">{unreadMsgCount}</span>
                    unread messages
                </p>

                <button className="btn btn-default" onClick={selectOrDeselectAll}>
                    <i className={buttonAppearance}></i>
                </button>

                <button className="btn btn-default markAsRead" onClick={changeReadStatus}>
                    Mark As Read
                </button>

                <button className="btn btn-default markAsUnread" onClick={changeReadStatus}>
                    Mark As Unread
                </button>

                <select className="form-control label-select apply" onChange={labelHandler}>
                    <option>Apply label</option>
                    <option value="dev">dev</option>
                    <option value="personal">personal</option>
                    <option value="gschool">gschool</option>
                </select>

                <select className="form-control label-select remove" onChange={labelHandler}>
                    <option >Remove label</option>
                    <option value="dev">dev</option>
                    <option value="personal">personal</option>
                    <option value="gschool">gschool</option>
                </select>

                <button className="btn btn-default" onClick={deleteMessages}>
                    <i className="fa fa-trash-o"></i>
                </button>
            </div>
        </div>
    )
}



export default Toolbar;