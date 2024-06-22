import React, { useEffect,useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
	const [field, setField] = useState([])
	const [coordsOut, setCoordsOut] = useState([])

	useEffect(() => {
		axios.get('http://localhost:8000/get_field')
		.then(r => {
			setField(r.data.field)
		})
	}, [])

	function updateField(){
		axios.get('http://localhost:8000/get_field')
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

	// function makeMove(coordsIn,coordsOut){
	// 	axios.post('http://localhost:8000/move',{
	// 		"coordsIn": coordsIn,
	// 		"coordsOut": coordsOut,
	// 	})
	// 	updateField()
	// }

	function cellBeenClick(e){
		if (coordsOut[0] !== undefined){
			e.target.classList.remove('selected')
			let numberOfCell = e.target.attributes[1].value
			let documentBoard = document.querySelector('.board')
			let cells = documentBoard.children
			setCoordsOut([])

			axios.post('http://localhost:8000/can_to_move',{
				"coordsOut": coordsOut,
				"coordsIn": [
					Math.trunc(numberOfCell / 8),
					numberOfCell % 8
				],
				// "piece": cells[(coordsOut[0]*8+coordsOut[1])].innerHTML
			})
			.then(r => {
				updateField()
				console.log(r.data)
			})

			for (let i = 0;i < cells.length;i++){
				cells[i].classList.remove('selected')
			}

		}else{
			if(e.target.innerHTML === '  '){
				return 0;
			}
			e.target.classList.add('selected')
			let numberOfCell = e.target.attributes[1].value
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
						<button className={'cell-board'} number={indexRow*8+indexColumn} key={indexRow*8+indexColumn} onClick={e => cellBeenClick(e)}>{cell}</button>
					)
				)}
			</div>
		</div>
	);
}

export default App;