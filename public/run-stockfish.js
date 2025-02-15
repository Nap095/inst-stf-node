// script.js
// This file contains the client-side JavaScript code that interacts with the Stockfish engine.
const stockfish = new Worker('/stockfish/stockfish-nnue-16.js');

const depth = 20;
const multiPV = 5;

const outputElement = document.getElementById('output');
const fenInput = document.getElementById('fen');
const startButton = document.getElementById('start-analysis');

var board = Chessboard('myBoard')

stockfish.postMessage('uci');
stockfish.postMessage('setoption name MultiPV value ' + multiPV);

startButton.addEventListener('click', () => {
    const fen = fenInput.value;
    var board = Chessboard('myBoard', fen)

    stockfish.postMessage('uci');
    stockfish.postMessage('setoption name MultiPV value ' + multiPV);

    stockfish.onmessage = function (event) {
        const currentTime = new Date().toLocaleTimeString();

        if (event.data === 'uciok') {
            stockfish.postMessage('position fen ' + fen);
            stockfish.postMessage('go depth ' + depth);
            startTime = new Date(); // Record the start time
            outputElement.innerHTML = `[${currentTime}] analysis started` + '<br>';
        }

        /* // For debugging very chatty output
        if (event.data.startsWith('info')) {
            outputElement.innerHTML += JSON.stringify(event.data) + '<br>';
        }
        */

        if (event.data.includes('multipv')) {
            outputElement.innerHTML += JSON.stringify(event.data) + '<br>';
        }


        if (event.data.startsWith('bestmove')) {
            const endTime = new Date(); // Record the end time
            const timeDiff = (endTime - startTime) / 1000; // Calculate the difference in seconds

            outputElement.innerHTML += 'Best move: ' + event.data + '<br>';
            outputElement.innerHTML += `[${currentTime}] analysis complete` + '<br>';
            outputElement.innerHTML += `Analysis took ${timeDiff} seconds` + '<br>';
        }
    };
})
