# How to use Stockfish (javascript) with node.js and express module

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
npm install express stockfish helmet open
```

Check that you have into the package.json file in the [scripts] section, the line

```shell
"start": "node server.js"
```

execute the program 

```shell
npm start
```
## Note

run-stockfish.js call Stockfish 16. Be careful, the name of the engine can change. Check in `/nodes_modules/stockfish/src`

```const stockfish = new Worker('/stockfish/stockfish-nnue-16.js');```

Thanks to : 

https://github.com/nmrugg/stockfish.js/tree/master
