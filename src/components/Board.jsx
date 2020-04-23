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
		const spotCenter = canvasSize / 6;
		const refBoard = [
			[1,2,3],
			[4,5,6],
			[7,8,9]
		];
		const spots = [
			{ x: 1 * spotCenter,y : 1 * spotCenter },
			{ x: 3 * spotCenter,y : 1 * spotCenter },
			{ x: 5 * spotCenter,y : 1 * spotCenter },
			{ x: 1 * spotCenter,y : 3 * spotCenter },
			{ x: 3 * spotCenter,y : 3 * spotCenter },
			{ x: 5 * spotCenter,y : 3 * spotCenter },
			{ x: 1 * spotCenter,y : 5 * spotCenter },
			{ x: 3 * spotCenter,y : 5 * spotCenter },
			{ x: 5 * spotCenter,y : 5 * spotCenter },
		];
		
		let knights = [];

		let board;
		
		p.setup = () => {
			p.createCanvas(canvasSize,canvasSize);
			initBoard();
			board = resetBoard();
			console.table(board);
		};

		p.draw = () => {

			p.noLoop();
		};

		function initBoard() {
			const size = canvasSize / 3;
			
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (refBoard[i][j] % 2 !== 0) 
						p.fill(60,100,100);
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

			knights.push(new Knight('black',spots[0]));
			knights.push(new Knight('black',spots[2]));
			knights.push(new Knight('white',spots[6]));
			knights.push(new Knight('white',spots[8]));
			
			console.log(knights);

			return board;
		}

		p.mouseClicked = () => {
			if (p.mouseX < canvasSize && p.mouseY < canvasSize) 
				console.log(containsKnight(p.mouseX,p.mouseY));
				
		};

		function containsKnight(x,y) {
			const spot = getSelectedSpot(x,y);
			const pos = spotToPos(spot);

			return board[pos.i][pos.j] === 1 ? true : false;
		}

		function getSelectedSpot(x,y) {
			const s = canvasSize / 3;
			let row,col;

			if (x < s) col = 0;
			else if (x > 2 * s) col = 2;
			else col = 1;

			if (y < s) row = 0;
			else if (y > 2 * s) row = 2;
			else row = 1;

			return refBoard[row][col];
		}

		function spotToPos(spot) {
			let pos = {
				i: null,
				j: null
			};
			if (spot < 4) pos.i = 0;
			else if (spot > 6) pos.i = 2;
			else pos.i = 1;

			pos.j = refBoard[pos.i].indexOf(spot);

			return pos;
		}

		class Knight {
			constructor(color,spot) {
				this.color = color;
				this.spot = spots.indexOf(spot) + 1;
				if(color === 'black')
					p.fill(50);
				else // color === 'white'
					p.fill(200);
				
				p.ellipse(spot.x,spot.y,100);
			}
		}	
	}
	//pEnd

	render() {
		return (
			<div>
				<div ref={this.pRef} className="board"></div>
			</div>);
	}
}
 