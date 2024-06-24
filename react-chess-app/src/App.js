import React, { useEffect,useState } from 'react';
import axios from 'axios';
import Piece from './components/Piece.jsx';
import io, { Socket } from 'socket.io-client'
import './App.css'

const socket = io.connect("http://192.168.0.110:8000")

function App() {
	const [field, setField] = useState([])
	const [coordsOut, setCoordsOut] = useState([])
	const [isSelected, setIsSelected] = useState(false)

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

	// function makeMove(coordsIn,coordsOut){
	// 	axios.post('http://localhost:8000/move',{
	// 		"coordsIn": coordsIn,
	// 		"coordsOut": coordsOut,
	// 	})
	// 	updateField()
	// }

	function cellBeenClick(e){
		e.stopPropagation()
		console.log(e.target.attributes.celldata.value);
		if (isSelected){
			let numberOfCell = e.target.attributes[1].value
			let documentBoard = document.querySelector('.board')
			let cells = documentBoard.children
			// console.log(23)

			const coordsIn = [
				Math.trunc(numberOfCell / 8),
				numberOfCell % 8
			]


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
				"piece": cells[(coordsOut[0]*8+coordsOut[1])].attributes.celldata.value[0]
			})
			.then(r => {
				// console.log(r.data)

				socket.emit('make_move', {"move":r.data.move})

				if(r.data.toCanMove === true){
					setIsSelected(false)
					setCoordsOut([])
					for (let i = 0;i < cells.length;i++){
						cells[i].classList.remove('selected')
					}
				}
				updateField()
			})
		}else{
			if(e.target.attributes.celldata.value === '  '){
				console.log(34)
				return 0;
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



	return (
		<div className="App">
			<div className='board'>
				{field.map((row, indexRow) =>
					row.map((cell, indexColumn) =>
						<Piece
							className={'cell-board'}
							number={indexRow*8+indexColumn}
							key={indexRow*8+indexColumn}
							onClick={e => cellBeenClick(e)}
							celldata={cell}
						>
						</Piece>
					)
				)}
			</div>
		</div>
	);
}

export default App;