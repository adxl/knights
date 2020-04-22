import React,{ Component } from 'react';
import p5 from 'p5';

export default class Board extends Component {

	constructor(props) {
		super(props);
		this.pRef = React.createRef();
		this.pCanvas = new p5(this.sketch,this.pRef.current);
	}

	state = { 
	}
	
	sketch = (p) => {

		const canvasSize = 600;
		
		p.setup = () => {
			p.createCanvas(canvasSize,canvasSize);
			initBoard();
		};

		p.draw = () => {
			console.log('-');

			p.noLoop();
		};

		function initBoard() {
			const size = canvasSize / 3;
			const boardIndexes = [
				[1,2,3],
				[4,5,6],
				[7,8,9]
			];

			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (boardIndexes[i][j] % 2 !== 0) 
						p.fill(50);
					else 
						p.fill(245);
						
					p.stroke(50);
					p.strokeWeight(2);
					p.rect(size * i + 5,size * j + 5,size - 5,size - 5);
				}
			}

		}
		
		function resetBoard() {
			let board = [];
				
			board[0] = [1,0,1];		
			board[1] = [0,0,0];		
			board[2] = [1,0,1];	
			
		}

		function renderBoard() {
			
		}
	}

	render() {
		return (
			<div>
				<div ref={this.pRef} className="board"></div>
			</div>);
	}
}
 