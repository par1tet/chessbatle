import React from 'react';

function Piece(props) {
    function getClass(cell){
		if (cell === '  '){
			return 'hidden-piece'
		}
		return ''
	}

    return (<div
				className={'cell-board piece' + getClass(props.cellName)}
				onClick={e => {props.onClick(e)}}
				number={props.number}
				celldata={props.celldata}
			></div> );
}

export default Piece;