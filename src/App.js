
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

  fetchDataFromServer = async() => {
    const responseMessages = await fetch(URL);
    const messagesJson = await responseMessages.json();
    this.setState({messages: messagesJson.map( msg => Object.assign(msg, {selected: false}))});
  }

  updateMessageOnServer = async( msg ) => {
    const resp = await fetch(URL,
      {
        method: "PATCH",
        body: JSON.stringify(msg),
        headers: {
          "Content-type": "application/json"
        }
      }
    )
    const messages = await resp.json();
    this.setState({messages: messages.map( msg => Object.assign(msg, {selected: false}))});
  }

  uploadMessageToServer = async( msg ) => {
    const resp = await fetch(URL,
      {
        method: 'POST',
        body: JSON.stringify( msg ),
        headers: {
          'Content-type': 'application/json'
        }
      }
    )
    const respMsg = await resp.json();
    this.setState({messages: this.state.messages.concat(respMsg)});
  }

  toggleComposeForm = () => {
    this.setState({compFormVisible: !this.state.compFormVisible});
  }

  sendMessage = ( compStateObj ) => {
    this.toggleComposeForm();
    this.uploadMessageToServer(compStateObj);
  }

  selectAll = () => {
    let copyMessages = this.state.messages.slice();
    if (this.state.selectState !== "checked") {
      copyMessages.forEach( msg => msg.selected = true );
    } else {
      copyMessages.forEach( msg => msg.selected = false );
    }
    this.setState({messages: copyMessages});
  }

  getSelectedMessageIds = () => {return this.state.messages.filter(msg => msg.selected).map(msg => msg.id)};
  
  changeReadStatus = (read) => this.updateMessageOnServer(
    {messageIds: this.getSelectedMessageIds(), command: "read", read})

  labelHandler = (command, label) => {
    if (label.endsWith("label")) return;
    this.updateMessageOnServer({messageIds: this.getSelectedMessageIds(), command, label});
  }

  deleteMessages = () => this.updateMessageOnServer({messageIds: this.getSelectedMessageIds(), command: "delete"});

  onStarClicked = (id) => this.updateMessageOnServer({messageIds: [id], command: "star"})

  onChangeCheckBox = (id) => {
    let messages = this.state.messages.map( msg => {
      if (msg.id === id) msg.selected = !msg.selected;
      return msg;
    })
    this.setState({messages});
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
    this.fetchDataFromServer();
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
