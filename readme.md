How to install Stockfish (javascript) with node.js and express module

You must have installed node.js

Clone the git package

git clone run-stockfish

create a directory (for example) run-stockfish

mkdir run-stockfish

go to the directory

create package.json file

npm init -y

install theses packages

npm install express
npm install stockfish
npm install helmet
npm install open

add into the package.json, in the script section file this line :
    "start": "node server.js"

create the public directory
