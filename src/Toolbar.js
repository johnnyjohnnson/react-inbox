import React from 'react';


const Toolbar = ( { toggleComposeForm, selectAllState, unreadMsgCount, selectOrDeselectAll, changeReadStatus, deleteMessages, labelHandler } ) => {

    let buttonAppearance = "";
    let disabledState = false;
    if (selectAllState === "checked") {
        buttonAppearance = "fa fa-check-square-o";
    } else if (selectAllState === "half-checked") {
        buttonAppearance = "fa fa-minus-square-o";
    } else if (selectAllState === "unchecked") {
        buttonAppearance = "fa fa-square-o";
        disabledState = true;
    }

    return (
        <div className="row toolbar">
            <div className="col-md-12">
                <p className="pull-right">
                    <span className="badge badge">{unreadMsgCount}</span>
                    unread messages
                </p>

                <button className="btn btn-danger" onClick={toggleComposeForm}>
                    <i className="fa fa-plus"></i>
                </button>

                <button className="btn btn-default" onClick={selectOrDeselectAll}>
                    <i className={buttonAppearance}></i>
                </button>

                <button className="btn btn-default markAsRead" disabled={disabledState} onClick={() => changeReadStatus(true)}>
                    Mark As Read
                </button>

                <button className="btn btn-default markAsUnread" disabled={disabledState} onClick={() => changeReadStatus(false)}>
                    Mark As Unread
                </button>

                <select className="form-control label-select apply" disabled={disabledState} onChange={e => labelHandler("addLabel", e.target.value)}>
                    <option>Apply label</option>
                    <option value="dev">dev</option>
                    <option value="personal">personal</option>
                    <option value="gschool">gschool</option>
                </select>

                <select className="form-control label-select remove" disabled={disabledState} onChange={e => labelHandler("removeLabel", e.target.value)}>
                    <option >Remove label</option>
                    <option value="dev">dev</option>
                    <option value="personal">personal</option>
                    <option value="gschool">gschool</option>
                </select>

                <button className="btn btn-default" disabled={disabledState} onClick={deleteMessages}>
                    <i className="fa fa-trash-o"></i>
                </button>
            </div>
        </div>
    )
}



export default Toolbar;