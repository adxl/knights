import React,{ Component,Fragment } from 'react';
import p5 from 'p5';

import  bkIcon from '../img/black_knight.png';
import  wkIcon  from '../img/white_knight.png';

import FlagIcon from './FlagIcon.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndoAlt,faChessKnight,faQuestionCircle} from '@fortawesome/free-solid-svg-icons';

export default class Board extends Component {

	constructor(props) {
		super(props);
		this.pRef = React.createRef();
	}

	state = {
		// rules: true, ::unused
		lang: 'en',
		status: 'playing',
		score: 0,
		moves: 0,
		hints: true,
		hintsButtonClass : 'btn on'
	};

	componentDidMount() {
		
		this.p5Canvas = new p5(this.sketch,this.pRef.current);
	}
	
	reset = () => {
		if(this.p5Canvas !== undefined)
			this.p5Canvas.remove();
		this.p5Canvas = new p5(this.sketch,this.pRef.current);
		this.setState({
			status: 'playing',
			moves: 0});
	}

	toggleHints = e => {
		
		const hints = !this.state.hints;
		let hintsButtonClass;
		
		if (hints) 
			hintsButtonClass = 'btn on';
		else 
			hintsButtonClass = 'btn off';
		
		this.setState({ hints,hintsButtonClass });
	
	}

	// toggleRules = e => {   ::unused

	// 	const rules = !this.state.rules;
	// 	this.setState({rules});

	// }

	switchLang = e => {
		if (e.target.tagName === 'BUTTON') {
			this.setState({lang: e.target.id});
		}
		else {
			const lang = e.target.parentElement.id;
			this.setState({lang});
		}
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
		
		let blackKnightIcon;
		let whiteKnightIcon;

		p.preload = () => {
			blackKnightIcon = p.loadImage(bkIcon);
			whiteKnightIcon = p.loadImage(wkIcon);
		};

		p.setup = () => {
			p.createCanvas(canvasSize,canvasSize);
			resetBoard();
			paintBoard();
			console.log(wkIcon);
			
			// console.table(refBoard);
		};

		p.draw = () => {
			paintBoard();
			
			for (const k of knights) {
				k.show();
			}
			
			if (this.state.hints) {
				for (const h of hints) {
					h.show();
				}
			}
		};

		function paintBoard() {

			const size = canvasSize / 3;

			const blackCells = [1,3,5,7,9];
			const whiteCells = [2,4,6,8];

			// paint black cells
			for (const c of blackCells) {
				p.rectMode(p.CENTER);
				p.fill(60,60,60);
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
			if (board[0][0] === 2 && board[2][2] === 1 && (board[0][0] === board[0][2] && board[2][0] === board[2][2])) {
				this.setState({ status: 'win' });

				const { moves } = this.state;
				let score;

				if (moves >= 34)
					score = 'F';
				
				else if(moves >= 28)
					score = 'D';

				else if(moves >= 22)
					score = 'C';

				else if(moves > 16)
					score = 'B';

				else 
					score = 'A';
				
				this.setState({score});

			}
		};

		p.mouseClicked = () => {
			if (this.state.status === 'playing') {
				if (p.mouseX > 0 && p.mouseY > 0  && p.mouseX < canvasSize && p.mouseY < canvasSize) 
					if (selectedKnight && containsKnight(p.mouseX,p.mouseY) === null) {
						let selectedCell = getSelectedCell(p.mouseX,p.mouseY);

						if (moves.includes(selectedCell.toString())) {
							move(selectedKnight,selectedCell);
							checkGameStatus();
						}
						
						moves.splice(0);
						hints.splice(0);
						selectedKnight = null;	
					}
					else {
						selectedKnight = containsKnight(p.mouseX,p.mouseY);
						if (selectedKnight)
							showMoves();
					}

				console.log('------------------------');
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

		// checks if click was whithin the canvas and cell empty
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
				p.imageMode(p.CENTER);

				if(this.color === 'black')
					p.image(blackKnightIcon,this.x,this.y,150,150);
				else // color === 'white'
					p.image(whiteKnightIcon,this.x,this.y,150,150);
				
			}
		}	

		class Hint {
			constructor(cell) {
				this.x = cells[cell].x;
				this.y = cells[cell].y;
			}

			show() {
				p.rectMode(p.CENTER);
				p.fill('rgba(5,255,5,0.7)');
				p.rect(this.x,this.y,canvasSize / 3 - 20,canvasSize / 3 - 20);
			}
		}
	}
	//pEnd

	render() {
		return (
			<Fragment>
				<a  className="title" href="https://github.com/adxl/knights" >
					<h3>Knights <FontAwesomeIcon icon={ faChessKnight } /> </h3>
				</a>
				
				<div className="rules">
					<div className="lang-switch" >
						<button onClick={this.switchLang} id="en" className="btn p-1" >
							<FlagIcon code={'gb'} />
						</button>
						<button onClick={this.switchLang} id="fr" className="btn p-1" >
							<FlagIcon code={'fr'} />
						</button>
					</div>
					{this.state.lang === 'en' && <div id="english-rules">
						<h6 className="pl-2 pt-2">How to play:</h6>
						<hr />
						<p>Each piece moves as the knight in a regular chess game (like the shape of an “L”).</p>
						<p>The goal is to invert between the upper row and the bottom one in a minimum moves possible. <br />
						</p>
							
					</div>}

					{this.state.lang === 'fr' && <div id="french-rules">
						<h6 className="pl-2 pt-2">Règles du jeu:</h6>
						<hr />
						<p>Chaque pièce se déplace comme le cavalier dans une partie d&apos;échecs.</p>
						<p>Le but est d&apos;inverser les deux lignes en un minimum de coups possible. <br />
						</p>
					</div>}

				</div>

				{this.state.status === 'win' &&
					<div className="win-message" >
						{this.state.lang === 'en' && <div className="win-message-en">
							<h4>Congratulations, you win!</h4>
							<h6>Moves: {this.state.moves} - Score: {this.state.score}</h6>
						</div>}
					
						{this.state.lang === 'fr' && <div className="win-message-fr">
							<h4>Félicitations, vous avez gagné!</h4>
							<h6>Coups: {this.state.moves} - Score: {this.state.score}</h6>
						</div>}
					</div>
				}
				
				{this.state.status === 'playing' &&
					<div className="moves-counter">
						{this.state.lang === 'en' && <h5>Moves: {this.state.moves}</h5>}
						{this.state.lang === 'fr' && <h5>Coups: {this.state.moves}</h5>}
					</div>}

				<div className="board-container">
					<div ref={this.pRef} className="board">
						<div className="reset-container">
							<button onClick={this.toggleHints} className={this.state.hintsButtonClass}>
								<FontAwesomeIcon icon={faQuestionCircle} />
							</button>
							<button onClick={this.reset} className="btn reset-button">
								<FontAwesomeIcon icon={faUndoAlt} />
							</button>	
						</div>
					</div>
					
				</div>
			</Fragment>
		);
	}
}
 