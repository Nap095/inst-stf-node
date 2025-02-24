const Chess = require('chess.js').Chess;

function findEnPassantSquares(fen) {
    const chess = new Chess(fen);
    const enPassantSquares = [];
    const board = chess.board();

    // Loop through each column in row 5 (index 4)
    for (let col = 0; col < 8; col++) {
        const EPSquare = board[4][col];

        // Check if there's a white pawn at EPSquare
        if (EPSquare && EPSquare.type === 'p' && EPSquare.color === 'w') {
            // Check for black pawn on column-1
            if (col > 0 && board[4][col - 1] && board[4][col - 1].type === 'p' && board[4][col - 1].color === 'b') {
                // Check if squares (column-1,6) and (column-1,7) are empty
                if (!board[5][col - 1] && !board[6][col - 1]) {
                    enPassantSquares.push({ row: 5, column: col });
                }
            }

            // Check for black pawn on column+1
            if (col < 7 && board[4][col + 1] && board[4][col + 1].type === 'p' && board[4][col + 1].color === 'b') {
                // Check if squares (column+1,6) and (column+1,7) are empty
                if (!board[5][col + 1] && !board[6][col + 1]) {
                    enPassantSquares.push({ row: 5, column: col });
                }
            }
        }
    }

    return enPassantSquares;
}

// Example usage
const fen = 'rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPP2PPP/RNBQKBNR w KQkq d6 0 1';
console.log(findEnPassantSquares(fen));
