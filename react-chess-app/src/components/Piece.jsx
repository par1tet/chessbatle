import React from 'react';

function Piece(props) {
    function getClass(cell){
		let currentClass = ''

		if (cell === '  '){
			currentClass = 'hidden-piece'
		}else if(cell === 'Rw'){
			currentClass = ''
		}

		return currentClass
	}

    return (<div
				className={'cell-board piece' + getClass(props.cellName)}
				onClick={e => {props.onClick(e)}}
				number={props.number}
				celldata={props.celldata}
			></div> );
}

export default Piece;