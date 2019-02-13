import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
require('dotenv').config();

axios.defaults.headers.common['Authorization'] = process.env.REACT_APP_API_KEY;
axios.defaults.headers.post['Content-Type'] = 'application/json';

console.log(process.env.REACT_APP_API_KEY);

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
      errors: [],
      graph: {}
    };
  }
  componentDidMount() {
    if (localStorage.hasOwnProperty('graph')) {
      const graph = JSON.parse(localStorage.getItem('graph'));
      this.setState({ graph });
    }
    const api = 'https://lambda-treasure-hunt.herokuapp.com/api/adv';
    console.log(auth);
    axios.get(`${api}/init`).then(res => {
      const { room_id, coordinates, exits, cooldown } = res.data;
      this.setState({ room_id, cooldown });
      const prev_room_id = this.state.room_id;
      console.log(this.state.room_id);
      const graph = this.updateGraph(
        room_id,
        this.getCoords(coordinates),
        exits,
        prev_room_id
      );
      this.setState({ graph });
    });
  }

  updateGraph = (cords, exits, prevRoomId = null, move = null) => {
    let graph = Object.assign({}, this.state.graph);
    if (!this.state.graph[this.state.room_id]) {
      const newGraph = {};
      newGraph['cords'] = cords;

      const moves = {};
      for (let exit of exits) {
        moves[exit] = '?';
      }
      newGraph['exits'] = moves;
      graph = { ...graph, [this.state.room_id]: newGraph };
    }
    if (prevRoomId && move) {
      console.log(graph[prevRoomId]['exits'][move]);
      const inverseDirection = this.get_inverseDirection(move);
      graph[prevRoomId]['exits'][move] = this.state.room_id;
      graph[this.state.room_id]['exits'][inverseDirection] = prevRoomId;
    }
    localStorage.setItem('graph', JSON.stringify(graph));
    return graph;
  };

  get_inverseDirection = move => {
    const inverseDir = { n: 's', s: 'n', w: 'e', e: 'w' };
    return inverseDir[move];
  };

  getCoords = coordinates => {
    const x = coordinates.replace(/[%^()]/g, '').split(',')[0];
    const y = coordinates.replace(/[%^()]/g, '').split(',')[1];
    const coordsObject = { x, y };
    return coordsObject;
  };

  handleMovement = move => {
    axios
      .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/move/', {
        direction: move
      })
      .then(res => {
        const { room_id, coordinates, exits, cooldown } = res.data;
        const prev_room_id = this.state.room_id;
        const graph = this.updateGraph(
          room_id,
          this.getCoords(coordinates),
          exits,
          prev_room_id,
          move
        );
        this.setState({
          room_id,
          coordinates: this.getCoords(coordinates),
          cooldown,
          graph
        });
        console.log(this.state.graph);
        console.log(res.data);
      })
      .catch(err => console.error(err));
  };

  render() {
    return (
      <div>
        <h1 onClick={() => this.handleMovement('n')}>hello</h1>
      </div>
    );
  }
}

export default App;
