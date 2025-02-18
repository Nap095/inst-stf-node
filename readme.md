# How to use Stockfish (javascript) with node.js and express module

This program analyze one position give from the a chessboard

You must have installed node.js

Clone the git package

```shell
git clone https://github.com/Nap095/inst-stf-node.git 
```

Go to the directory inst-stf-node

```shell
cd inst-stf-node
```

Initialize the nodes.js environment and the package.json file with the command 

```shell
npm init -y
```

Install theses packages

```shell
npm install express stockfish helmet open @chrisoakman/chessboardjs jquery chess.js
```

Add this line into the package.json file in the [scripts] section

```shell
"start": "node server.js"
```

execute the program 

```shell
npm start
```
## Notes

run-stockfish.js call Stockfish 16. Be careful, one day the name of the engine can change. Check in `/nodes_modules/stockfish/src`

```const stockfish = new Worker('/stockfish/stockfish-nnue-16.js');```

You can test Stockfish in command line by the command `node .\node_modules\stockfish\src\stockfish-nnue-16.js`
It display the line `Stockfish 16 64 POPCNT WASM Multithreaded SSE SIMD by the Stockfish developers (see AUTHORS file)`
leave by `quit`
Thanks to : 

https://github.com/nmrugg/stockfish.js/tree/master
https://chessboardjs.com/
