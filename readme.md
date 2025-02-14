How to install Stockfish (javascript) with node.js and express module

You must have installed node.js

Clone the git package

git clone https://github.com/Nap095/inst-stf-node.git

go to the directory inst-stf-node : cd inst-stf-node

Initialize the package.json file with the command : npm init -y

install theses packages :

npm install express
npm install stockfish
npm install helmet
npm install open

add into the package.json, in the [script] section file this line :
    "start": "node server.js"

execute npm start