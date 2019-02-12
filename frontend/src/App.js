import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
require('dotenv').config();

class App extends Component {
  constructor() {
    super();
    this.state = {
      room_id: 0,
      coords: '',
      exits: [],
      cooldown: '',
      errors: []
    };
  }
  componentDidMount() {
    const api = process.env.API_KEY;
    console.log(api);
  }
  render() {
    return (
      <div>
        <h1>hello</h1>
      </div>
    );
  }
}

export default App;
