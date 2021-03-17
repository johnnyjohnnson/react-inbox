
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
        let moddedMsg = this.modifyAttrInMessageObject(msg, "selected", false, false);
        this.replaceObjectInMessageArray(index, moddedMsg);
      }
    })
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
    let copyOfMessageArray = this.state.messages.slice();
    copyOfMessageArray[index] = msg;
    this.setState({messages: copyOfMessageArray});
  }

  selectAll = () => {
    if (this.state.selectState !== "checked") {
      // select all checkBoxes
      this.state.messages.forEach( (msg, index) => {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "selected", true, false);
        this.replaceObjectInMessageArray(index, moddedMsg);
      })
     } else {
       // deselect all checkBoxes
      this.state.messages.forEach( (msg, index) => {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "selected", false, false);
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
        let moddedMsg;
        if (e.target.className.endsWith("apply")) {
          moddedMsg = this.modifyAttrInMessageObject(msg, "labels", e.target.value, false);
        } else if (e.target.className.endsWith("remove")) {
          moddedMsg = this.modifyAttrInMessageObject(msg, "labels", e.target.value, true);
        }
        this.replaceObjectInMessageArray(index, moddedMsg);
      }
    })
    
  }

  deleteMessages = () => {
    let remainingMessages = this.state.messages.slice();
    this.setState({messages: remainingMessages.filter(item => !item.selected)});
  }

  onChangeCheckBox = (e) => {
    this.state.messages.forEach( (msg, index) => {
      if(msg.id == e.target.id) {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "selected", !msg.selected, false);
        this.replaceObjectInMessageArray(index, moddedMsg);
      }
    })
  }

  onStarClicked = (e) => {
    this.state.messages.forEach( (msg, index) => {
      if(msg.id == e.target.id) {
        let moddedMsg = this.modifyAttrInMessageObject(msg, "starred", !msg.starred, false);
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

  render() {

    const unreadMsgCount = this.state.messages.filter( msg => !msg.read ).length;

    return (
      <div className="App">
        <Toolbar selectAllState={this.state.selectState} unreadMsgCount={unreadMsgCount} selectOrDeselectAll={this.selectAll} changeReadStatus={this.changeReadStatus} deleteMessages={this.deleteMessages} labelHandler={this.labelHandler}/>
        <MessageList arrayOfMessages={this.state.messages} checkBoxMethod={this.onChangeCheckBox} starMethod={this.onStarClicked}/>
      </div>
    );
  }
  
}

export default App;
