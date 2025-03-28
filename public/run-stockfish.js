// script.js
// This file contains the client-side JavaScript code that interacts with the Stockfish engine.
import { Chess, validateFen } from '/chess.js/dist/esm/chess.js'
import { findEnPassantSquares } from './enpassant.js';

// Initialize the Stockfish engine and send the 'uci' command
// to get the engine ready to analyze positions.
const stockfish = new Worker('/stockfish/stockfish-nnue-16.js');
stockfish.postMessage('uci');

// Initialize the chess.js library
const chess = new Chess()

const variationsElement = document.getElementById('variations');
const warningElement = document.getElementById('warning');
const outputElement = document.getElementById('output');
const chronoElement = document.getElementById('chrono');
const movesElement = document.getElementById('moves');
const commentpositionElement = document.getElementById('comment-position');
const fenInput = document.getElementById('fen');
const enPassantSelect = document.getElementById('enpassant');
const variationsval = document.getElementById('variations-val');
const depthval = document.getElementById('depth-val');
const maxtimeval = document.getElementById('maxtime-val');

var startTime = new Date();

const fen = fenInput.value;

$('#startBtn').on('click', btn_start_position)
$('#clearBtn').on('click', btn_clear_board)
$('#checkBtn').on('click', btn_check_position)
$('#pushBBtn').on('click', btn_push_to_board)
$('#flipBBtn').on('click', btn_flip_board)

document.getElementById('start-analysis').addEventListener('click', analyzePosition);
document.getElementById('move-color').addEventListener('change', changeFenColor);
document.getElementById('white-kingside').addEventListener('change', cbo_castling_change);
document.getElementById('white-queenside').addEventListener('change', cbo_castling_change);
document.getElementById('black-kingside').addEventListener('change', cbo_castling_change);
document.getElementById('black-queenside').addEventListener('change', cbo_castling_change);
document.getElementById('enpassant').addEventListener('change', lst_enpassant);

// Initialize the chessboard.js library
var analyzeBoard = Chessboard('myBoard', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: true,
    position: fen,
    onChange: function (oldPos, newPos) {
        console.log('==========>Position changed')
        const newFen = Chessboard.objToFen(newPos);
        console.log('newPos=', newPos, 'newFen=', newFen)
        let r = check_position(newFen)
        if ( r === true) {
            setCheckboxCastling(newPos)
            SetEnPassantListBox(newFen)
            fenInput.value = newFen + ' ' + document.getElementById('move-color').value + ' ' + CastlingPosition() + ' ' + EnPassantPosition() + ' 0 1';
            list_moves()
        }
    }
})

//=========================================================
// If checkbox is check, set the castling position
//=========================================================
function cbo_castling_change() {
    console.log('checkbox_castling')
    let parts = fenInput.value.split(' ')
    parts[2] = CastlingPosition()
    fenInput.value = parts.join(' ')
    list_moves()
}
//=========================================================
// Button Flip the board (w<->b)
//=========================================================
function btn_flip_board() {
    console.log('flip_board')
    analyzeBoard.flip()
}

//=========================================================
// Button Send the fen position to the board
//=========================================================
function btn_push_to_board() {
    console.log('push_to_board')
    let fenposition = fenInput.value
    const validation = validateFen(fenposition) // From chess.js module
       // Check if the position is valid
       if (validation.ok) {
        warningElement.innerHTML = '<span style="color: green;">Position is valid</span>';
    } else {
        warningElement.innerHTML = '<span style="color: red;">Position is invalid: ' + validation.error + '</span>';
        return false
    }
    analyzeBoard.position(fenposition)
    chess.load(fenposition)
}

//=========================================================
// Button to start position
//=========================================================
function btn_start_position() {
    console.log('start_position')
    analyzeBoard.start()
     document.getElementById('move-color').value = 'w'
     enPassantSelect.value = '-' // Clear en passant
    setCheckboxCastling(analyzeBoard.position())
    fenInput.value = analyzeBoard.fen() + ' ' + document.getElementById('move-color').value + ' ' + CastlingPosition() + ' '  + EnPassantPosition() + ' 0 1'
    list_moves()
}

//=========================================================
// Button to clear the board
//=========================================================
function btn_clear_board() {
    console.log('clear_board')
    analyzeBoard.clear()
     document.getElementById('move-color').value = 'w'
     enPassantSelect.value = '-' // Clear en passant
    setCheckboxCastling(analyzeBoard.position())
    fenInput.value = analyzeBoard.fen() + ' ' + document.getElementById('move-color').value + ' ' + CastlingPosition() + ' '  + EnPassantPosition() + ' 0 1'
    list_moves()
}

//=========================================================
// Button to check the position
//=========================================================
function btn_check_position() {
    let r = check_position(analyzeBoard.fen())
}

//=========================================================
// Check the position
//=========================================================
function check_position(board_position) {
    console.log('check_position', board_position)
    let fenposition = board_position + ' ' + document.getElementById('move-color').value + ' ' + CastlingPosition() + ' '  + '-' + ' 0 1'
    const validation = validateFen(fenposition) // From chess.js module

    // Check if the position is valid
    if (validation.ok) {
        chess.load(fenposition)
        //console.log('moves:', chess.moves(fenInput.value))
        warningElement.innerHTML = '<span style="color: green;">Position is valid</span>';
        return true
    } else {
        warningElement.innerHTML = '<span style="color: red;">Position is invalid: ' + validation.error + '</span>';
        return false
    }
}

//=========================================================
// Enumerate list of possible moves
//=========================================================
function list_moves() {
    console.log('list_moves')
    let fenposition = fenInput.value

    if (validateFen(fenposition).ok) {
        chess.load(fenposition)
        let moves = chess.moves()
        movesElement.innerHTML = moves.length > 0 
            ? moves.length +  ' possible moves: ' + moves.join(', ') 
            : '<span style="color: red;">No legal moves available</span>';
        let CommentPosition = ''
        CommentPosition += 'In check: ' + chess.inCheck() + '<br>'
        CommentPosition += 'In checkmate: ' + chess.isCheckmate() + '<br>'
        commentpositionElement.innerHTML = CommentPosition
    } else {
        console.log('Invalid FEN');
        movesElement.innerHTML = '<span style="color: red;">Invalid FEN</span>';
        commentpositionElement.innerHTML = ''
    }

}

//=========================================================
// Check if en passant is potentially possible
//=========================================================
function SetEnPassantListBox(board_position) {
    // Check if en passant is potentially possible
    let fenposition = board_position + ' ' + document.getElementById('move-color').value + ' ' + CastlingPosition() + ' '  + '-' + ' 0 1'
    let parts = fenposition.split(' ')
    let listEnPassant = findEnPassantSquares(parts[0], parts[1])
    console.log('listEnPassant=', listEnPassant)
    enPassantSelect.innerHTML = '<option value="">-</option>'; // Clear existing options
    listEnPassant.forEach(square => {
        const option = document.createElement('option');
        option.value = square;
        option.textContent = square;
        enPassantSelect.appendChild(option);
    });
    enPassantSelect.value = "-"
    console.log('enPassantSelect=', enPassantSelect)
}

//=========================================================
// Set the castling checkboxes if possible
//=========================================================
function setCheckboxCastling(board_position) {
    // Check if castling is potentially possible
     try {
        if ((board_position['e1'] === 'wK') && (board_position['h1'] === 'wR')) {
            document.getElementById('white-kingside').checked = true
        } else {
            document.getElementById('white-kingside').checked = false
        }

        if ((board_position['e1'] === 'wK') && (board_position['a1'] === 'wR')) {
            document.getElementById('white-queenside').checked = true
        } else {
            document.getElementById('white-queenside').checked = false
        }

        if ((board_position['e8'] === 'bK') && (board_position['h8'] === 'bR')) {
            document.getElementById('black-kingside').checked = true
        } else {
            document.getElementById('black-kingside').checked = false
        }

        if ((board_position['e8'] === 'bK') && (board_position['a8'] === 'bR')) {
            document.getElementById('black-queenside').checked = true
        } else {
            document.getElementById('black-queenside').checked = false
        }
    } catch (error) {
        console.log('La position est invalide', error)
    }
}

//=========================================================
// Set Castling position string for the FEN
//=========================================================
function CastlingPosition() {
    console.log('CastlingPosition')
    let cp = ''
    if (document.getElementById('white-kingside').checked) { cp += 'K' }
    if (document.getElementById('white-queenside').checked) { cp += 'Q' }
    if (document.getElementById('black-kingside').checked) { cp += 'k' }
    if (document.getElementById('black-queenside').checked) { cp += 'q' }
    if (cp === '') { cp = '-' }
    return cp
}

//=========================================================
// List possible en passant squares 
//=========================================================
function lst_enpassant() {
    console.log('lst_enpassant')
    let parts = fenInput.value.split(' ')
    parts[3] = EnPassantPosition()
    fenInput.value = parts.join(' ')
    list_moves()
}

//=========================================================
// Set En Passant position string for the FEN
//=========================================================
function EnPassantPosition() {
    console.log('EnPassantPosition')
    let ep = ''
    if (enPassantSelect.value === '-' || !enPassantSelect.value)
        { ep = '-' }
    else {
        ep = enPassantSelect.value
    }
    return ep
}

//=========================================================
// Change the move color of the position
//=========================================================
function changeFenColor() {
    console.log('changeFenColor')
    let fenposition = fenInput.value
    let parts = fenposition.split(' ')
    let color = document.getElementById('move-color').value
    parts[1] = color
    fenInput.value = parts.join(' ')
    let r = check_position(analyzeBoard.fen())
    list_moves()
}

//=========================================================
// Analyze the position using Stockfish
//=========================================================
function analyzePosition() {

    if (!validateFen(fenInput.value).ok) {
        variationsElement.innerHTML = '<span style="color: red;">Position is invalid</span>';
        return;
    }

    const fen = fenInput.value;
    let depth = depthval.value
    let multiPV = variationsval.value
    let maxtime = maxtimeval.value
    const listmultiPV = {}

    stockfish.postMessage('uci');
    stockfish.postMessage('setoption name MultiPV value ' + multiPV);
    //stockfish.postMessage('setoption name movetime value' + 1000);

    stockfish.onmessage = function (event) {
        const currentTime = new Date().toLocaleTimeString();

        if (event.data === 'uciok') {
            stockfish.postMessage('position fen ' + (fen));
            stockfish.postMessage('go depth ' + depth + ' movetime ' + maxtime);
            startTime = new Date(); // Record the start time
            outputElement.innerHTML = ""
            variationsElement.innerHTML = ""
            chronoElement.innerHTML = `[${currentTime}] analysis started` + '<br>';
        }

        /* // For debugging, very chatty output
        if (event.data.startsWith('info')) {
            outputElement.innerHTML += JSON.stringify(event.data) + '<br>';
        }
        */

        if (event.data.includes('multipv')) {
            //variationsElement.innerHTML += JSON.stringify(event.data) + '<br>';
            const multipvMatch = event.data.match(/multipv (\d+)/);
            listmultiPV[multipvMatch[1]] = multipvMatch['input']
            variationsElement.innerHTML = listmultiPV

            // Convert the hashtable to a string with each element separated by <br>
            const variationsString = Object.entries(listmultiPV)
                .map(([key, value]) => `${key}: ${value}`)
                .join('<br>');

            variationsElement.innerHTML = variationsString;
        }


        if (event.data.startsWith('bestmove')) {
            const endTime = new Date(); // Record the end time
            const timeDiff = (endTime - startTime) / 1000; // Calculate the difference in seconds


            chronoElement.innerHTML += `[${currentTime}] analysis complete` + '<br>';
            chronoElement.innerHTML += `Analysis took ${timeDiff} seconds` + '<br>';
            chronoElement.innerHTML += 'Best move: ' + event.data + '<br>';
        }
    };
}



