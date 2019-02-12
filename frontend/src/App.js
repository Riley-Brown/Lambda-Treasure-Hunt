import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
require('dotenv').config();

const auth = {
  headers: {
    Authorization: `Token ${process.env.REACT_APP_API_KEY}`
  }
};

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
    const api = 'https://lambda-treasure-hunt.herokuapp.com/api/adv';
    console.log(auth);
    axios.get(`${api}/init`, auth).then(res => {
      console.log(res.data);
    });
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
