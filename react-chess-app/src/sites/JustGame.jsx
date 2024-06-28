import React, { useEffect,useState } from 'react';
import axios from 'axios';
import Piece from '../components/Piece.jsx';
import Board from '../components/Board.jsx';

import './JustGame.css'

function JustGame() {
	return (
		<div className="App">
            <Board></Board>
		</div>
	);
}

export default JustGame;