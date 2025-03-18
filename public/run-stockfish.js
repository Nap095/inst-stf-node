// script.js
// This file contains the client-side JavaScript code that interacts with the Stockfish engine.
import { Chess, validateFen } from '/chess.js/dist/esm/chess.js'
import { findEnPassantSquares } from './enpassant.js';

const stockfish = new Worker('/stockfish/stockfish-nnue-16.js');

const chess = new Chess()

const variationsElement = document.getElementById('variations');
const warningElement = document.getElementById('warning');
const outputElement = document.getElementById('output');
const chronoElement = document.getElementById('chrono');
const fenInput = document.getElementById('fen');
const enPassantSelect = document.getElementById('enpassant');
const variationsval = document.getElementById('variations-val');
const depthval = document.getElementById('depth-val');
const maxtimeval = document.getElementById('maxtime-val');


var startTime = new Date();

const fen = fenInput.value;

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
            fenInput.value = newFen + ' ' + document.getElementById('move-color').value + ' ' + CastlingPosition() + ' ' + EnPassantPosition() + ' 0 1';
        }
    }
})

$('#startBtn').on('click', btn_start_position)
$('#clearBtn').on('click', btn_clear_board)
$('#checkBtn').on('click', btn_check_position)
$('#pushBBtn').on('click', btn_push_to_board)

document.getElementById('start-analysis').addEventListener('click', analyzePosition);
document.getElementById('move-color').addEventListener('change', changeFenColor);
document.getElementById('white-kingside').addEventListener('change', btn_check_position);
document.getElementById('white-queenside').addEventListener('change', btn_check_position);
document.getElementById('black-kingside').addEventListener('change', btn_check_position);
document.getElementById('black-queenside').addEventListener('change', btn_check_position);
document.getElementById('enpassant').addEventListener('change', lst_enpassant);

function lst_enpassant() {
    console.log('lst_enpassant')
    let parts = fenInput.value.split(' ')
    parts[3] = EnPassantPosition()
    fenInput.value = parts.join(' ')
}


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

function btn_check_position() {
    let r = check_position(analyzeBoard.fen())
}

function btn_start_position() {
    console.log('start_position')
    analyzeBoard.start()
     document.getElementById('move-color').value = 'w'
     enPassantSelect.value = '-' // Clear en passant
    setCheckboxCastling(analyzeBoard.position())
    fenInput.value = analyzeBoard.fen() + ' ' + document.getElementById('move-color').value + ' ' + CastlingPosition() + ' '  + '-' + ' 0 1'
}

function btn_clear_board() {
    console.log('clear_board')
    analyzeBoard.clear()
     document.getElementById('move-color').value = 'w'
     enPassantSelect.value = '-' // Clear en passant
    setCheckboxCastling(analyzeBoard.position())
    fenInput.value = analyzeBoard.fen() + ' ' + document.getElementById('move-color').value + ' ' + CastlingPosition() + ' '  + '-' + ' 0 1'
}

function check_position(board_position) {
    console.log('check_position', board_position)
    let fenposition = board_position + ' ' + document.getElementById('move-color').value + ' ' + CastlingPosition() + ' '  + '-' + ' 0 1'
    const validation = validateFen(fenposition) // From chess.js module

    // Check if the position is valid
    if (validation.ok) {
        warningElement.innerHTML = '<span style="color: green;">Position is valid</span>';
    } else {
        warningElement.innerHTML = '<span style="color: red;">Position is invalid: ' + validation.error + '</span>';
        return false
    }

    // Check if en passant is potentially possible
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

    return true
}

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

function EnPassantPosition() {
    console.log('EnPassantPosition', typeof enPassantSelect.value)
    let ep = ''
    if (enPassantSelect.value === '-' || !enPassantSelect.value)
        { ep = '-' }
    else {
        ep = enPassantSelect.value
    }
    console.log('ep=', ep, typeof ep)
    return ep
}

function changeFenColor() {
    console.log('changeFenColor')
    let fenposition = fenInput.value
    let parts = fenposition.split(' ')
    let color = document.getElementById('move-color').value
    parts[1] = color
    fenInput.value = parts.join(' ')
    let r = check_position(analyzeBoard.fen())
}

stockfish.postMessage('uci');
//stockfish.postMessage('setoption name MultiPV value ' + multiPV);

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
