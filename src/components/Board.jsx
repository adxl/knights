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
		const cellCenter = canvasSize / 6;
		const refBoard = [
			[1,2,3],
			[4,5,6],
			[7,8,9]
		];
		const cells = [
			{ x: null,y: null},
			{ x: 1 * cellCenter,y : 1 * cellCenter },
			{ x: 3 * cellCenter,y : 1 * cellCenter },
			{ x: 5 * cellCenter,y : 1 * cellCenter },
			{ x: 1 * cellCenter,y : 3 * cellCenter },
			{ x: 3 * cellCenter,y : 3 * cellCenter },
			{ x: 5 * cellCenter,y : 3 * cellCenter },
			{ x: 1 * cellCenter,y : 5 * cellCenter },
			{ x: 3 * cellCenter,y : 5 * cellCenter },
			{ x: 5 * cellCenter,y : 5 * cellCenter },
		];
		
		let board;

		let knights = [];
		let selectedKnight = null;

		let moves = [];
		let hints = [];
		
		p.setup = () => {
			p.createCanvas(canvasSize,canvasSize);
			initBoard();
			board = resetBoard();
			
			// console.table(refBoard);
		};

		p.draw = () => {
			for (const h of hints) {
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

			knights.push(new Knight('black',cells[1]));
			knights.push(new Knight('black',cells[3]));
			knights.push(new Knight('white',cells[7]));
			knights.push(new Knight('white',cells[9]));
		
			console.log(knights);
			
			return board;
		}

		p.mouseClicked = () => {
			if (p.mouseX < canvasSize && p.mouseY < canvasSize)
				if (selectedKnight && containsKnight(p.mouseX,p.mouseY) === null) {
					let selectedCell = getSelectedCell(p.mouseX,p.mouseY);

					if (moves.includes(selectedCell.toString()))
						console.log('Ok can move');
					else 
						console.log('Can\'t go there');
						
					moves.splice(0);
					hints.splice(0);
					selectedKnight = null;	
				}
				else {
					selectedKnight = containsKnight(p.mouseX,p.mouseY);
					if (selectedKnight)
						showMoves();
				}

			console.log('----------------------------------------------');
		};

		function showMoves() {
			const { cell } = selectedKnight;
			const x = cells[cell].x;
			const y = cells[cell].y;
			const offset = canvasSize / 3;

			moves.splice(0);
			hints.splice(0);

			// RIGHT AND LEFT MOVES
			if (checkBounds(x + 2 * offset,y - offset))  // > v
				lightCell(posToCell(x + 2 * offset,y - offset));
			if (checkBounds(x + 2 * offset,y + offset))  // > ^
				lightCell(posToCell(x + 2 * offset,y + offset));
			if (checkBounds(x - 2 * offset,y - offset))  // < v
				lightCell(posToCell(x - 2 * offset,y - offset));
			if (checkBounds(x - 2 * offset,y + offset))  // < ^
				lightCell(posToCell(x - 2 * offset,y + offset));
			
			// TOP AND DOWN MOVES 
			if (checkBounds(x - offset,y + 2 * offset))  // ^ <
				lightCell(posToCell(x - offset,y + 2 * offset));
			if (checkBounds(x + offset,y + 2 * offset))  // ^ >
				lightCell(posToCell(x + offset,y + 2 * offset));
			if (checkBounds(x - offset,y - 2 * offset))  // v <
				lightCell(posToCell(x - offset,y - 2 * offset));
			if (checkBounds(x + offset,y - 2 * offset))  // v >
				lightCell(posToCell(x + offset,y - 2 * offset));
			
			console.log(moves);
			// console.log('Can move to',possibleMoves[0],'and',possibleMoves[1]);
			
		}

		function checkBounds(x,y) {
			return ((x * (x - canvasSize) <= 0) && (y * (y - canvasSize) <= 0));  
		}

		function lightCell(cell) {
			moves.push(cell);
			hints.push(new Hint(cell));
		}

		function containsKnight(x,y) {
			const cell = getSelectedCell(x,y);
			const index = cellToIndex(cell);

			return board[index.i][index.j] === 1 ? getKnight(cell) : null;
		}

		function getKnight(cell) {
			for (const k of knights) 
				if (k.cell === cell) 
					return k;
		}

		function getSelectedCell(x,y) {
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

		function posToCell(x,y) {
			for (const i in cells) {
				if (cells[i].x === x && cells[i].y === y) {
					return i;
				}
			}
		}

		function cellToIndex(cell) {
			let pos = {
				i: null,
				j: null
			};
			if (cell < 4) pos.i = 0;
			else if (cell > 6) pos.i = 2;
			else pos.i = 1;

			pos.j = refBoard[pos.i].indexOf(cell);

			return pos;
		}

		class Knight {
			constructor(color,cell) {
				this.color = color;
				this.cell = cells.indexOf(cell);
				if(color === 'black')
					p.fill(50);
				else // color === 'white'
					p.fill(200);
				
				p.ellipse(cell.x,cell.y,100);
			}
		}	

		class Hint {
			constructor(cell) {
				this.x = cells[cell].x;
				this.y = cells[cell].y;
			}

			show() {
				p.fill(50,150,50);
				p.ellipse(this.x,this.y,40,40);
			}
			move() {
				this.x += p.random(-1,1);
				this.y += p.random(-1,1);
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
 