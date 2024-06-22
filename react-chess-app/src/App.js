import React, { useEffect,useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
	const [field, setField] = useState([])

	useEffect(() => {
		axios.get('http://localhost:8000/get_field')
		.then(r => {
			setField(r.data.field)
		})
	}, [])


	return (
		<div className="App">
			<div className='board'>
				{field.map(row =>
					<>
						{row.map(cell =>
							<button className='cell-board'>{cell}</button>
						)}
					</>
				)}
			</div>

		</div>
	);
}

export default App;