import React from 'react';

function Piece(props) {
	function getPhoto(cell){
		let src = ''

		if (cell === '  '){
			src = ''
		}else if(cell === 'Rw'){
			src = 'https://images.vexels.com/media/users/3/254572/isolated/preview/1a4650d1e776db1b0f5c0eef84642db4-simple-rook-chess-piece-cut-out.png?width=1130'
		}

		return src
	}

    function getClass(cell){
		let currentClass = ''

		if (cell === '  '){
			currentClass = 'hidden-piece'
		}else if(cell === 'Rw'){
			currentClass = ''
		}

		return currentClass
	}

    return ( <img className={getClass(props.cellName)} number={props.number} celldata={props.celldata} src={getPhoto(props.cellName)}></img> );
}

export default Piece;