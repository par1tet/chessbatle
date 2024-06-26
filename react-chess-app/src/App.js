import React, { useEffect,useState } from 'react';
import axios from 'axios';
import Piece from './components/Piece.jsx';
import io from 'socket.io-client'
import './App.css'

const socket = io.connect("http://192.168.0.110:8000")

function App() {
	const [field, setField] = useState([])
	const [coordsOut, setCoordsOut] = useState([])
	const [isSelected, setIsSelected] = useState(false)
	const [isMoving, setIsMoving] = useState((() => {
		if (localStorage.getItem('whoismove') === null){
			localStorage.setItem('whoismove', 'white')
		}
		return localStorage.getItem('whoismove')
	})())
	const [checked, setChecked] = useState({
		"isCheck":false,
		"cell":[0,0]
	})

	useEffect(() => {
		axios.get('http://192.168.0.110:8000/get_field')
		.then(r => {
			setField(r.data.field)
		})
	}, [])

	function updateField(){
		axios.get('http://192.168.0.110:8000/get_field')
		.then(r => {
			setField(r.data.field)
		})
	}

	useEffect(() => {
		let documentBoard = document.querySelector('.board')
		let cells = documentBoard.children

		for (let i = 0;i < cells.length;i++){
			if((i % 8 + Math.trunc(i / 8)) % 2 === 0){
				cells[i].classList.add('white-cell')
			}else{
				cells[i].classList.add('black-cell')
			}
		}
	})

	useEffect(() => {
		socket.on("do_make_move", data => {
			// console.log(data.move)
			updateField()
		})
	}, [socket])

	useEffect(() => {
		// console.log(checked)
		let documentBoard = document.querySelector('.board')
		let cells = documentBoard.children
		if(checked.isCheck){
			// console.log(checked.cell)
			// console.log(cells)
			// console.log(cells[(checked.cell[0]*8+checked.cell[1])])
			cells[(checked.cell[0]*8+checked.cell[1])].classList.add('checked-cell')
		}else{
			for (let i = 0;i < cells.length;i++){
				cells[i].classList.remove('checked-cell')
			}
		}
	}, [checked])

	// function makeMove(coordsIn,coordsOut){
	// 	axios.post('http://localhost:8000/move',{
	// 		"coordsIn": coordsIn,
	// 		"coordsOut": coordsOut,
	// 	})
	// 	updateField()
	// }

	function cellBeenClick(e){
		e.stopPropagation()
		// console.log(e.target.attributes.celldata.value);
		// console.log(coordsOut)
		// console.log(isSelected)
		if (isSelected){
			let numberOfCell = e.target.attributes.number.value
			let documentBoard = document.querySelector('.board')
			let cells = documentBoard.children
			const currentPiece = cells[(coordsOut[0]*8+coordsOut[1])].attributes.celldata.value
			// console.log(23)

			const coordsIn = [
				Math.trunc(numberOfCell / 8),
				numberOfCell % 8
			]

			// console.log(numberOfCell)

			if (coordsOut[0] === coordsIn[0] && coordsOut[1] === coordsIn[1]){
				for (let i = 0;i < cells.length;i++){
					cells[i].classList.remove('selected')
				}
				setIsSelected(false)
				setCoordsOut([])
				return 0
			}

			axios.post('http://192.168.0.110:8000/can_to_move',{
				"coordsOut": coordsOut,
				"coordsIn": coordsIn,
				"isMoving": isMoving,
				"piece": currentPiece[0],
				"context": {
					"checked": checked
				}
			})
			.then(r => {
				// console.log(r.data)

				socket.emit('make_move', {"move":r.data.move})

				if(r.data.toCanMove === true){
					if (isMoving === 'white'){
						setIsMoving('black')
						localStorage.setItem('whoismove', 'black')
					}else{
						setIsMoving('white')
						localStorage.setItem('whoismove', 'white')
					}
					setIsSelected(false)
					setCoordsOut([])
					for (let i = 0;i < cells.length;i++){
						cells[i].classList.remove('selected')
					}
				}
				updateField()
				// let temp = r.data.context.checked
				// console.log(r.data.context.checked)
				// console.log(temp)
				// setChecked(r.data.context.checked)
			})
		}else{
			if(e.target.attributes.celldata.value === '  '){
				// console.log(34)
				return 0;
			}

			let documentBoard = document.querySelector('.board')
			let cells = documentBoard.children
			const currentPiece = e.target.attributes.celldata.value

			// console.log(isMoving[0])
			// console.log(currentPiece[1])
			if (isMoving[0] !== currentPiece[1]){
				for (let i = 0;i < cells.length;i++){
					cells[i].classList.remove('selected')
				}
				setIsSelected(false)
				setCoordsOut([])
				return 0
			}

			e.target.classList.add('selected')
			let numberOfCell = e.target.attributes[1].value
			// console.log(234)

			setIsSelected(true)

			setCoordsOut([
				Math.trunc(numberOfCell / 8),
				numberOfCell % 8
			])
		}
	}

	function refreshField(){
		axios.get('http://192.168.0.110:8000/refresh_field')
		.then(r => {
			updateField()
			setChecked({
				"isCheck":false,
				"cell":[0,0]
			})
			setIsMoving('white')
			localStorage.setItem('whoismove', 'white')
		})
	}

	return (
		<div className="App">
			<div className='board-game'>
				<div className='board'>
					{field.map((row, indexRow) =>
						row.map((cell, indexColumn) =>
							<Piece
								className={'cell-board'}
								number={indexRow*8+indexColumn}
								key={indexRow*8+indexColumn}
								onClick={e => cellBeenClick(e)}
								celldata={cell}
								setcoordsout={setCoordsOut}
								setisselected={setIsSelected}
								coordsout={coordsOut}
								ismoving={isMoving}
								cellbeenclicked={cellBeenClick}
							>
							</Piece>
						)
					)}
				</div>
				<div className='who-is-move' whoismoving={isMoving}></div>
			</div>
			<div className='refresh'>
				<button onClick={e => refreshField(e)}>refresh</button>
			</div>
		</div>
	);
}

export default App;