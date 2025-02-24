import { Chess, validateFen } from '/chess.js/dist/esm/chess.js'

function findEnPassantSquares(fen, color) {
    let row = 0;
    let delta1 = 0;
    let delta2 = 0;
    let opcolor = '';
    let right = 0;
    let left = 0;
    const chess = new Chess(fen + ' ' + color + ' - - 0 1');
    const enPassantSquares = [];
    const board = chess.board();

    // Adjust row and deltas based on color
    if (color === 'w') {
        row = 3;
        opcolor = 'b';
        delta1 = row - 1;
        delta2 = row - 2;
    } else {
        row = 4;
        opcolor = 'w';
        delta1 = row + 1;
        delta2 = row + 2;
    }

    // check if there is a white pawn in row
    console.log('****************************************************************');
    for (let col = 0; col < 8; col++) {
        const EPSquare = board[row][col];

        // List squares to check in row
        if (EPSquare && EPSquare.type === 'p' && EPSquare.color === color) {
            left = -1; right = -1;
            if (col > 0 && col < 7) { left = col - 1; right = col + 1; }
            else if (col === 0) { left = -1; right = col + 1; }
            else if (col === 7) { left = col - 1; right = -1; }

            // Check if there's a pawn of opposite color in the left square
            if (left != -1) {
                if (board[row][left] && board[row][left].type === 'p' && board[row][left].color === opcolor) {
                    //console.log(EPSquare.square, 'LEFT');
                    //console.log(EPSquare.square, 'left-row - 1: ', board[row - 1][left]);
                    //console.log(EPSquare.square, 'left-row - 2: ', board[row - 2][left]);
                    if (board[delta1][left] === null && board[delta2][left] === null) {
                        console.log(col, EPSquare.square, 'LEFT', row, left);
                        enPassantSquares.push(EPSquare.square);
                    }
                }
            }

            // Check if there's a pawn of opposite color in the right square
            if (right != -1) {
                if (board[row][right] && board[row][right].type === 'p' && board[row][right].color === opcolor) {
                    //console.log(EPSquare.square, 'RIGHT');
                    //console.log(EPSquare.square, 'right-row - 1: ', board[row - 1][right]);
                    //console.log(EPSquare.square, 'right-row - 2: ', board[row - 2][right]);
                    if (board[delta1][right] === null && board[delta2][right] === null) {
                        console.log(col, EPSquare.square, 'RIGHT', row, right);
                        enPassantSquares.push(EPSquare.square);
                    }
                }
            }
        }
    }

    return enPassantSquares;
}

document.addEventListener('DOMContentLoaded', function () {
    const positionsSelect = document.getElementById('positions');
    const outputDiv = document.getElementById('output');
    const boardDiv = document.getElementById('myBoard');

    // Initialize the chessboard
    const board = Chessboard('myBoard', {
        position: 'start'
    });

    positionsSelect.addEventListener('change', function () {
        const selectedValue = positionsSelect.value;
        outputDiv.textContent = `Selected position: ${selectedValue}`;
        board.position(selectedValue); // Update the chessboard position
        const parts = selectedValue.split(' ');
        let EP = findEnPassantSquares(parts[0], parts[1]);
        //console.log(EP);
        outputDiv.textContent = `EnPassant: ${JSON.stringify(EP)}`;
    });
});