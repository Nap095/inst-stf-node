import { Chess, validateFen } from '/chess.js/dist/esm/chess.js'

export function findEnPassantSquares(fen, color) {
    let row = 0;
    let delta1 = 0;
    let delta2 = 0;
    let opcolor = '';
    let right = 0;
    let left = 0;
    let targetrow = 0;

    const epchess = new Chess(fen + ' ' + color + ' - - 0 1');
    const enPassantSquares = [];
    const epboard = epchess.board();

    // Adjust row and deltas based on color
    if (color === 'w') {
        row = 3;
        opcolor = 'b';
        delta1 = row - 1;
        delta2 = row - 2;
        targetrow = 6;
    } else {
        row = 4;
        opcolor = 'w';
        delta1 = row + 1;
        delta2 = row + 2;
        targetrow = 3;
    }

    // check if there is a white pawn in row
   for (let col = 0; col < 8; col++) {
        const EPSquare = epboard[row][col];

        // List squares to check in row
        if (EPSquare && EPSquare.type === 'p' && EPSquare.color === color) {
            left = -1; right = -1;
            if (col > 0 && col < 7) { left = col - 1; right = col + 1; }
            else if (col === 0) { left = -1; right = col + 1; }
            else if (col === 7) { left = col - 1; right = -1; }

            // Check if there's a pawn of opposite color in the left square
            if (left != -1) {
                if (epboard[row][left] && epboard[row][left].type === 'p' && epboard[row][left].color === opcolor) {
                    if (epboard[delta1][left] === null && epboard[delta2][left] === null) {
                        let sqleft = 'abcdefgh'[col-1] + targetrow;
                        if (!enPassantSquares.includes(sqleft)) {
                           enPassantSquares.push(sqleft);
                        }
                        //enPassantSquares.push(EPSquare.square);
                    }
                }
            }

            // Check if there's a pawn of opposite color in the right square
            if (right != -1) {
                if (epboard[row][right] && epboard[row][right].type === 'p' && epboard[row][right].color === opcolor) {
                     if (epboard[delta1][right] === null && epboard[delta2][right] === null) {
                        let sqright = 'abcdefgh'[col+1] + targetrow ;
                        if (!enPassantSquares.includes(sqright)) {
                            enPassantSquares.push(sqright);
                        }
                        //enPassantSquares.push(EPSquare.square);
                    }
                }
            }
        }
    }

    return enPassantSquares;
}
