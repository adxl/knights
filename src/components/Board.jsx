import React,{ Component,Fragment } from 'react';
import p5 from 'p5';

export default class Board extends Component {

	constructor(props) {
		super(props);
		this.pRef = React.createRef();
	}

	state = {
		status : 'playing',
		moves: 0
	};

	componentDidMount() {
		
		this.p5Canvas = new p5(this.sketch,this.pRef.current);
	}
	
	sketch = (p) => {

		const canvasSize = 564;
		const cellCenter = canvasSize / 6;

		// reference board 
		const refBoard = [
			[1,2,3],
			[4,5,6],
			[7,8,9]
		];

		// center pos of cells
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
		
		let board = [];

		let knights = [];
		let selectedKnight = null;

		let moves = [];
		let hints = [];
		
		p.setup = () => {
			p.createCanvas(canvasSize,canvasSize);
			resetBoard();
			paintBoard();
			
			// console.table(refBoard);
		};

		p.draw = () => {
			paintBoard();
			
			for (const k of knights) {
				k.show();
			}
			
			for (const h of hints) {
				h.show();
			}

		};

		function paintBoard() {

			const size = canvasSize / 3;

			const blackCells = [1,3,5,7,9];
			const whiteCells = [2,4,6,8];

			// paint black cells
			for (const c of blackCells) {
				p.rectMode(p.CENTER);
				p.fill(60,100,100);
				p.stroke(50);
				p.strokeWeight(2);

				const x = cells[c].x;
				const y = cells[c].y;

				p.rect(x,y,size - 8,size - 8);
			}

			// paint white cells
			for (const c of whiteCells) {
				p.rectMode(p.CENTER);
				p.fill(250);
				p.stroke(50);
				p.strokeWeight(2);

				const x = cells[c].x;
				const y = cells[c].y;

				p.rect(x,y,size - 8,size - 8);
			}
		}
		
		// resets knights to initial positions
		// 1 black - 2 white - 0 empty cell
		function resetBoard() {
			board[0] = [1,0,1];		
			board[1] = [0,0,0];		
			board[2] = [2,0,2];	

			knights.push(new Knight('black',cells[1]));
			knights.push(new Knight('black',cells[3]));
			knights.push(new Knight('white',cells[7]));
			knights.push(new Knight('white',cells[9]));
		}

		const checkGameStatus = () => {
			console.table(board);
			if (board[0][0] === 2 && board[2][2] === 1 && (board[0][0] === board[0][2] && board[2][0] === board[2][2])) {
				this.setState({status: 'win'});
			}
		};

		p.mouseClicked = () => {
			if (this.state.status === 'playing') {
				if (p.mouseX < canvasSize && p.mouseY < canvasSize)
					if (selectedKnight && containsKnight(p.mouseX,p.mouseY) === null) {
						let selectedCell = getSelectedCell(p.mouseX,p.mouseY);

						if (moves.includes(selectedCell.toString())) {
							move(selectedKnight,selectedCell);
							checkGameStatus();
						}
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
			}
		};

		// shows possible moves
		function showMoves() {
			const { cell } = selectedKnight;
			const x = cells[cell].x;
			const y = cells[cell].y;
			const offset = canvasSize / 3;

			moves.splice(0);
			hints.splice(0);

			// RIGHT AND LEFT MOVES
			if (isCellValid(x + 2 * offset,y - offset))  // > v
				lightCell(posToCell(x + 2 * offset,y - offset));
			if (isCellValid(x + 2 * offset,y + offset))  // > ^
				lightCell(posToCell(x + 2 * offset,y + offset));
			if (isCellValid(x - 2 * offset,y - offset))  // < v
				lightCell(posToCell(x - 2 * offset,y - offset));
			if (isCellValid(x - 2 * offset,y + offset))  // < ^
				lightCell(posToCell(x - 2 * offset,y + offset));
			
			// TOP AND DOWN MOVES 
			if (isCellValid(x - offset,y + 2 * offset))  // ^ <
				lightCell(posToCell(x - offset,y + 2 * offset));
			if (isCellValid(x + offset,y + 2 * offset))  // ^ >
				lightCell(posToCell(x + offset,y + 2 * offset));
			if (isCellValid(x - offset,y - 2 * offset))  // v <
				lightCell(posToCell(x - offset,y - 2 * offset));
			if (isCellValid(x + offset,y - 2 * offset))  // v >
				lightCell(posToCell(x + offset,y - 2 * offset));
			
			// console.log(moves);
			// console.log('Can move to',possibleMoves[0],'and',possibleMoves[1]);
			
		}

		const move = (knight,cell) => {
			const currentIndex = cellToIndex(knight.cell);
			const nextIndex = cellToIndex(cell);
			
			board[currentIndex.i][currentIndex.j] = 0;
			board[nextIndex.i][nextIndex.j] = knight.color === 'black' ? 1 : 2; 

			knight.moveTo(cell);

			this.setState({moves : this.state.moves + 1});
		};

		// checks if click was whithin the canvas
		function isCellValid(x,y) {
			const empty = containsKnight(x,y) === null ? true : false;
			const inbound = ((x * (x - canvasSize) <= 0) && (y * (y - canvasSize) <= 0));  
			return empty && inbound;  
		}

		// lights cell to show hints
		function lightCell(cell) {
			moves.push(cell);
			hints.push(new Hint(cell));
		}

		// checks if a position contains a knight
		function containsKnight(x,y) {
			const cell = getSelectedCell(x,y);
			const index = cellToIndex(cell);

			return board[index.i][index.j] > 0 ? getKnight(cell) : null;
		}

		// gets the cell's knight
		function getKnight(cell) {
			for (const k of knights) 
				if (k.cell === cell) 
					return k;
		}

		// gets a cell from pos
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
				this.x = cell.x;
				this.y = cell.y;
			}

			moveTo(cell) {
				this.cell = cell;
				this.x = cells[cell].x;
				this.y = cells[cell].y;
			}

			show() {
				if(this.color === 'black')
					p.fill(50);
				else // color === 'white'
					p.fill(200);
				
				p.ellipse(this.x,this.y,100,100);
			
			}
		}	

		class Hint {
			constructor(cell) {
				this.x = cells[cell].x;
				this.y = cells[cell].y;
			}

			show() {
				p.rectMode(p.CENTER);
				p.fill('rgba(50,150,50,0.9)');
				p.rect(this.x,this.y,canvasSize / 3 - 20,canvasSize / 3 - 20);
			}
		}
	}
	//pEnd

	render() {
		return (
			<Fragment>
				{this.state.status === 'win' &&
					<div className="win-message" >
						<h4>Congratulations you win!</h4>
						<h6>Moves: {this.state.moves}</h6>
					</div>}
				
				{this.state.status === 'playing' &&
					<div className="moves-counter">
						<h5>Moves: {this.state.moves}</h5>
					</div>}
				
				<div className="rules">
					<h6>How to play:</h6>
					<p>Each piece moves as the knight in a regular chess game, i.e : two squares in one direction,
					then one at left or right, just like the shape of an “L”.</p>
					<p>The goal is to invert between the upper row and the bottom one in a minimum moves possible. </p>
					<p>What will be your best score? can you do better than your friends?</p>
					<p>Try it now!  -&gt;</p>
				</div>

				<div className="board-container">
					<div ref={this.pRef} className="board"></div>
				</div>
			</Fragment>
		);
	}
}
 