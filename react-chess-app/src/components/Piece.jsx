import React from 'react';
import './Piece.css'

function Piece(props) {
    function getClass(cell){
		if (cell === '  '){
			return 'hidden-piece'
		}
		return ''
	}

	function onDropHandler(e, pieceNumber){
		e.preventDefault()
		// console.log(pieceNumber)
		// console.log(props.isselected)
		// console.log(props.isselected)
		props.cellbeenclicked(e)
	}
	function onDragOverHandler(e){
		e.preventDefault()
	}
	function onDragStartHandler(e, pieceNumber){
		// console.log(props.ismoving[0])
		// console.log(e.target.attributes.celldata.value[1])
		if (props.ismoving[0] !== e.target.attributes.celldata.value[1]){
			return 0
		}
		props.setcoordsout([
			Math.trunc(pieceNumber / 8),
			pieceNumber % 8
		])
		props.setisselected(true)

		// e.target.classList.add("background-none")
	}

    return (<div
				className={'cell-board piece' + getClass(props.cellName)}
				onClick={e => {props.onClick(e)}}
				number={props.number}
				celldata={props.celldata}
				draggable={true}

				onDragStart={e => {onDragStartHandler(e, props.number)}}
				onDragOver={e => {onDragOverHandler(e)}}
				onDrop={e => {onDropHandler(e, props.number)}}
			></div> );
}

export default Piece;