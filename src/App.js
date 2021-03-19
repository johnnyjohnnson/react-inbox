
import './App.css';
import React from 'react';
import Toolbar from './Toolbar';
import ComposeForm from './ComposeForm';
import MessageList from './MessageList';


const URL = "http://localhost:8082/api/messages";


class App extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      compFormVisible: false
    };
  }

  updateMessageOnServer = async( msg ) => {
    await fetch(URL,
      {
        method: "PATCH",
        body: JSON.stringify({ ...msg, messageIds: [msg.id] }),
        headers: {
          "Content-type": "application/json"
        }
      }
    )
  }

  uploadMessageToServer = async( msg ) => {
    await fetch(URL,
      {
        method: 'POST',
        body: JSON.stringify( msg ),
        headers: {
          'Content-type': 'application/json'
        }
      }
    )
  }

  modifyAttrInMessageObject = (msg, key, value, erase) => {
    if (key === "labels") {
      let labelSet = new Set();
      for (let lbl of msg.labels) labelSet.add(lbl);
      if (erase) {
        labelSet.delete(value);
      } else {
        labelSet.add(value);
      }
      value = [];
      for (let lbl of labelSet.keys()) value.push(lbl);
    }
    msg[key] = value;
    return msg;
  }

  replaceObjectInMessageArray = (index, msg) => {
    if(msg.command !== "select") this.updateMessageOnServer(msg);
    let copyOfMessageArray = [...this.state.messages];
    copyOfMessageArray[index] = msg;
    this.setState({messages: copyOfMessageArray});
  }

  toggleComposeForm = () => {
    this.setState({compFormVisible: !this.state.compFormVisible});
  }

  addNewMessageToState = ( msg ) => {
    this.setState({
      messages: this.state.messages.concat({
        subject: msg.subject,
        read: true,
        starred: false,
        labels: [],
        body: msg.message,
        id: this.state.messages.length + 1
      })
    })
  }

  sendMessage = ( compStateObj ) => {
    this.toggleComposeForm();
    this.addNewMessageToState(compStateObj);
    this.uploadMessageToServer(compStateObj);
  }

  selectAll = () => {
    if (this.state.selectState !== "checked") {
      this.state.messages.forEach( (msg, index) => {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "selected", true, false);
        moddedMsg = this.modifyAttrInMessageObject(msg, "command", "select", false);
        this.replaceObjectInMessageArray(index, moddedMsg);
      })
     } else {
      this.state.messages.forEach( (msg, index) => {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "selected", false, false);
        moddedMsg = this.modifyAttrInMessageObject(msg, "command", "select", false);
        this.replaceObjectInMessageArray(index, moddedMsg);
      })
    }
  }

  changeReadStatus = (e) => {
    let marker;
    if (e.target.className.endsWith("markAsRead")) {
      marker = true;
    } else if (e.target.className.endsWith("markAsUnread")) {
      marker = false;
    }
    this.state.messages.forEach( (msg, index) => {
      if(msg.selected) {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "read", marker, false);
        moddedMsg = this.modifyAttrInMessageObject(msg, "command", "read", false);
        this.replaceObjectInMessageArray(index, moddedMsg);
      }
    })
  }

  labelHandler = (e) => {

    if (e.target.value.endsWith("label")) {
      return;
    }

    this.state.messages.forEach( (msg, index) => {
      if (msg.selected) {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "label", e.target.value, false);
        if (e.target.className.endsWith("apply")) {
          moddedMsg = this.modifyAttrInMessageObject(msg, "labels", e.target.value, false);
          moddedMsg = this.modifyAttrInMessageObject(msg, "command", "addLabel", false);
        } else if (e.target.className.endsWith("remove")) {
          moddedMsg = this.modifyAttrInMessageObject(msg, "labels", e.target.value, true);
          moddedMsg = this.modifyAttrInMessageObject(msg, "command", "removeLabel", false);
        }
        this.replaceObjectInMessageArray(index, moddedMsg);
      }
    })
  }

  deleteMessages = () => {
    this.state.messages.forEach(msg => {
      if (msg.selected) {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "command", "delete", false);
        this.updateMessageOnServer(moddedMsg);
      }
    })
    this.setState({messages: this.state.messages.filter(item => !item.selected)});
  }

  onChangeCheckBox = (e) => {
    this.state.messages.forEach( (msg, index) => {
      if(msg.id == e.target.id) {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "selected", !msg.selected, false);
        moddedMsg = this.modifyAttrInMessageObject(msg, "command", "select", false);
        this.replaceObjectInMessageArray(index, moddedMsg);
      }
    })
  }

  onStarClicked = (e) => {
    this.state.messages.forEach( (msg, index) => {
      if(msg.id == e.target.id) {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "starred", !msg.starred, false);
        moddedMsg = this.modifyAttrInMessageObject(msg, "command", "star", false);
        this.replaceObjectInMessageArray(index, moddedMsg);
      }
    })
  }

  static getDerivedStateFromProps(props, state) {

    let selectedCount = state.messages.filter( msg => msg.selected ).length;
    
    if (selectedCount === 0) {
      return { selectState: "unchecked" }
    } else if (selectedCount === state.messages.length) {
      return { selectState: "checked" }
    } else {
      return { selectState: "half-checked" }
    }
  }

  async componentDidMount() {
    const responseMessages = await fetch(URL);
    const messagesJson = await responseMessages.json();
    this.setState({messages: messagesJson.map( msg => Object.assign(msg, {selected: false} ) )})
  }

  render() {

    const unreadMsgCount = this.state.messages.filter( msg => !msg.read ).length;

    return (
      <div className="App">
        <Toolbar toggleComposeForm={this.toggleComposeForm} selectAllState={this.state.selectState} unreadMsgCount={unreadMsgCount} selectOrDeselectAll={this.selectAll} changeReadStatus={this.changeReadStatus} deleteMessages={this.deleteMessages} labelHandler={this.labelHandler}/>
        <ComposeForm onSubmitHandler={this.sendMessage} compFormVisible={this.state.compFormVisible} />
        <MessageList arrayOfMessages={this.state.messages} checkBoxMethod={this.onChangeCheckBox} starMethod={this.onStarClicked}/>
      </div>
    );
  }
  
}

export default App;
