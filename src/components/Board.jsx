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
			{ x: null,y: null},
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
		
		let board;

		let knights = [];
		let selectedKnight = null;
		let possibleMoves = [];
		let possibleMovesHints = [];
		
		p.setup = () => {
			p.createCanvas(canvasSize,canvasSize);
			initBoard();
			board = resetBoard();
			
			console.table(refBoard);
			
		};

		p.draw = () => {
			for (const h of possibleMovesHints) {
				h.move();
				h.show();
			}

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

			knights.push(new Knight('black',spots[1]));
			knights.push(new Knight('black',spots[3]));
			knights.push(new Knight('white',spots[7]));
			knights.push(new Knight('white',spots[9]));
		
			console.log(knights);
			
			return board;
		}

		p.mouseClicked = () => {
			if (p.mouseX < canvasSize && p.mouseY < canvasSize)
				
				if (selectedKnight && containsKnight(p.mouseX,p.mouseY) === null) {
					
					let selectedSpot = getSelectedSpot(p.mouseX,p.mouseY);

					if (possibleMoves.includes(selectedSpot.toString()))
						console.log('Ok can move');
					else 
						console.log('Can\'t go there');
						
					possibleMoves.splice(0);
					possibleMovesHints.splice(0);
					selectedKnight = null;	
					
					console.log(possibleMoves);
					console.log(possibleMovesHints);
					
				}
				else {
					selectedKnight = containsKnight(p.mouseX,p.mouseY);
					if (selectedKnight)
						showMoves();
				}

			console.log('--------------');
		};

		function showMoves() {
			const { spot } = selectedKnight;
			const x = spots[spot].x;
			const y = spots[spot].y;
			const offset = canvasSize / 3;

			possibleMoves.splice(0);
			possibleMovesHints.splice(0);

			// RIGHT AND LEFT MOVES
			if (checkBounds(x + 2 * offset,y - offset))  // > v
				lightSpot(posToSpot(x + 2 * offset,y - offset));
			if (checkBounds(x + 2 * offset,y + offset))  // > ^
				lightSpot(posToSpot(x + 2 * offset,y + offset));
			if (checkBounds(x - 2 * offset,y - offset))  // < v
				lightSpot(posToSpot(x - 2 * offset,y - offset));
			if (checkBounds(x - 2 * offset,y + offset))  // < ^
				lightSpot(posToSpot(x - 2 * offset,y + offset));
			
			// TOP AND DOWN MOVES 
			if (checkBounds(x - offset,y + 2 * offset))  // ^ <
				lightSpot(posToSpot(x - offset,y + 2 * offset));
			if (checkBounds(x + offset,y + 2 * offset))  // ^ >
				lightSpot(posToSpot(x + offset,y + 2 * offset));
			if (checkBounds(x - offset,y - 2 * offset))  // v <
				lightSpot(posToSpot(x - offset,y - 2 * offset));
			if (checkBounds(x + offset,y - 2 * offset))  // v >
				lightSpot(posToSpot(x + offset,y - 2 * offset));
			
			console.log(possibleMoves);
			// console.log('Can move to',possibleMoves[0],'and',possibleMoves[1]);
			
		}

		function checkBounds(x,y) {
			return ((x * (x - canvasSize) <= 0) && (y * (y - canvasSize) <= 0));  
		}

		function lightSpot(spot) {
			possibleMoves.push(spot);
			possibleMovesHints.push(new Hint(spot));

			// console.log(possibleMovesHints);

		}

		function containsKnight(x,y) {
			const spot = getSelectedSpot(x,y);
			const pos = spotToIndex(spot);

			return board[pos.i][pos.j] === 1 ? getKnight(spot) : null;
		}

		function getKnight(spot) {
			for (const k of knights) 
				if (k.spot === spot) 
					return k;
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

		function posToSpot(x,y) {
			for (const i in spots) {
				if (spots[i].x === x && spots[i].y === y) {
					return i;
				}
			}
		}

		function spotToIndex(spot) {
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
				this.spot = spots.indexOf(spot);
				if(color === 'black')
					p.fill(50);
				else // color === 'white'
					p.fill(200);
				
				p.ellipse(spot.x,spot.y,100);
			}
		}	

		class Hint {
			constructor(spot) {

				this.x = spots[spot].x;
				this.y = spots[spot].y;

			}

			show() {
				p.fill(50,150,50);
				p.ellipse(this.x,this.y,40,40);
			}
			move() {
				this.x += p.random(-1,1);
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
 