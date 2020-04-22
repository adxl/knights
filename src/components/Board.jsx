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

		const canvasSize = 500;

		p.setup = () => {
			p.createCanvas(canvasSize,canvasSize);
			renderBoard();
		};

		p.draw = () => {
			console.log('-');

			p.noLoop();
		};

		function renderBoard() {
			
			let board = [];
				
			board[0] = [1,0,1];		
			board[1] = [0,0,0];		
			board[2] = [1,0,1];		
		
			const size = canvasSize / 3;

			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (board[i][j] === 1) 
						p.fill(50);
					else 
						p.fill(245);
					p.stroke(20);
					p.strokeWeight(2);
					p.rect(size * i + 5,size * j + 5,size - 5,size - 5);

				}
			}
		}
	}

	render() {
		return (
			<div>
				<div ref={this.pRef} className="board"></div>
			</div>);
	}
}
 