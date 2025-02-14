# How to install Stockfish (javascript) with node.js and express module

You must have installed node.js

Clone the git package

```shell
git clone https://github.com/Nap095/inst-stf-node.git 
```

go to the directory inst-stf-node : 

```shell
cd inst-stf-node
```

Initialize the nodes.js environment and the package.json file with the command : 

```shell
npm init -y
```

install theses packages :

```shell
npm install express stockfish helmet open
```

add into the package.json file in the [script] section this line

```shell
"start": "node server.js"
```

execute the program 

```shell
npm start
```