
import './App.css';
import React from 'react';
import Toolbar from './Toolbar';
import MessageList from './MessageList';
import { messages } from './seedData';


class App extends React.Component {

  constructor() {
    super();
    this.state = { messages };
    this.checkForSelectKey();
  }

  checkForSelectKey = () => {
    this.state.messages.forEach( (msg, index) => {
      if( typeof msg.selected === "undefined") {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "selected", false);
        this.replaceObjectInMessageArray(index, moddedMsg);
      }
    })
  }

  modifyAttrInMessageObject = (msg, key, value) => {
    msg[key] = value;
    console.log(msg);
    return msg;
  }

  replaceObjectInMessageArray = (index, msg) => {
    let copyOfMessageArray = this.state.messages.slice();
    copyOfMessageArray[index] = msg;
    this.setState({messages: copyOfMessageArray});
  }

  selectAll = () => {
    if (this.state.selectState !== "checked") {
      // select all checkBoxes
      this.state.messages.forEach( (msg, index) => {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "selected", true);
        // nicht optimal, weil jetzt für jede Message der "state" aktualisiert wird
        // ändern dass es im batch abläuft
        this.replaceObjectInMessageArray(index, moddedMsg);
      })
     } else {
       // deselect all checkBoxes
      this.state.messages.forEach( (msg, index) => {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "selected", false);
        // auch hier wieder nicht optimal...
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
        let moddedMsg = this.modifyAttrInMessageObject(msg, "read", marker);
        // auch hier wieder nicht optimal...
        this.replaceObjectInMessageArray(index, moddedMsg);
      }
    })
  }

  deleteMessages = () => {
    let remainingMessages = [];
    this.state.messages.forEach( (msg, index) => {
      if(!msg.selected) {
        remainingMessages.push(msg);
      }
    })
    this.setState({messages: remainingMessages});
  }

  onChangeCheckBox = (e) => {
    this.state.messages.forEach( (msg, index) => {
      if(msg.id == e.target.id) {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "selected", !msg.selected);
        this.replaceObjectInMessageArray(index, moddedMsg);
      }
    })
  }

  onStarClicked = (e) => {
    this.state.messages.forEach( (msg, index) => {
      if(msg.id == e.target.id) {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "starred", !msg.starred);
        this.replaceObjectInMessageArray(index, moddedMsg);
      }
    })
  }

  static getDerivedStateFromProps(props, state) {

    let selectedCount = state.messages.filter( msg => msg.selected === true ).length;
    
    if (selectedCount === 0) {
      return { selectState: "unchecked" }
    } else if (selectedCount === state.messages.length) {
      return { selectState: "checked" }
    } else {
      return { selectState: "half-checked" }
    }
  }

  render() {

    const unreadMsgCount = this.state.messages.filter( msg => msg.read === false ).length;

    return (
      <div className="App">
        <Toolbar selectAllState={this.state.selectState} unreadMsgCount={unreadMsgCount} selectOrDeselectAll={this.selectAll} changeReadStatus={this.changeReadStatus} deleteMessages={this.deleteMessages}/>
        <MessageList arrayOfMessages={this.state.messages} checkBoxMethod={this.onChangeCheckBox} starMethod={this.onStarClicked}/>
      </div>
    );
  }
  
}

export default App;
