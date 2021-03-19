import React from 'react';


class ComposeForm extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
            subject: "",
            message: ""
        }
    }

    onChangeSubject = (e) => {
        this.setState({subject: e.target.value})
    }

    onChangeMessage = (e) => {
        this.setState({message: e.target.value})
    }

    onSubmitHandler = (e) => {
        e.preventDefault();
        this.props.onSubmitHandler(this.state);
    }

    render() {
        let dispStyle = this.props.compFormVisible ? {visibility: "visible"} : {display: "none"}
        
        return (
            <form className="form-horizontal well" onSubmit={this.onSubmitHandler} style={dispStyle}>
                <div className="form-group">
                    <div className="col-sm-8 col-sm-offset-2">
                        <h4>Compose Message</h4>
                    </div>
                </div>
                <div className="form-group">
                    <label for="subject" className="col-sm-2 control-label">Subject</label>
                    <div className="col-sm-8">
                        <input type="text" className="form-control" id="subject" placeholder="Enter a subject" name="subject" onChange={this.onChangeSubject}/>
                    </div>
                </div>
                <div className="form-group">
                    <label for="body" className="col-sm-2 control-label">Body</label>
                    <div className="col-sm-8">
                        <textarea name="body" id="body" className="form-control" onChange={this.onChangeMessage}></textarea>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-8 col-sm-offset-2">
                        <input type="submit" value="Send" className="btn btn-primary" />
                    </div>
                </div>
            </form>
        )
    }

}


export default ComposeForm;