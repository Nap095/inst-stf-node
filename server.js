const express = require('express');
const path = require('path');
const helmet = require('helmet'); // Import the helmet module
const app = express();
const port = 3000;

// Use helmet to set security-related HTTP headers
app.use(helmet());
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Content-Security-Policy', "script-src 'self' 'unsafe-eval'");
    next();
});

// Serve the static HTML file
app.use(express.static(path.join(__dirname, 'public')));

// Serve the stockfish source files
app.use('/stockfish', express.static(path.join(__dirname, 'node_modules/stockfish/src')));

// Server jQuery source files
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

// Serve the chessboard source files
app.use('/chessboard', express.static(path.join(__dirname, 'node_modules/@chrisoakman/chessboardjs/dist')));

// Serve the chessboard source files
app.use('/chess.js', express.static(path.join(__dirname, 'node_modules/chess.js')));

// Start the server and open the HTML page
app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);

  // Dynamically import the `open` module type ES6
  const { default: open } = await import('open');
  open(`http://localhost:${port}/run-stockfish.html`);
});


    /*
    In the code above, we imported the  helmet  module and used it to set security-related HTTP headers. We also set the  Cross-Origin-Opener-Policy
    and  Cross-Origin-Embedder-Policy  headers to  same-origin  and  require-corp  respectively. 
    The  Cross-Origin-Opener-Policy  header specifies the opener policy for cross-origin windows. The  same-origin  value allows the window to be opened
    by the same origin. The  Cross-Origin-Embedder-Policy  header specifies the embedder policy for cross-origin resources. The  require-corp  value requires
    the resource to be embedded in a cross-origin isolated context. We also set the  Content-Security-Policy  header to allow scripts from the same origin
    and unsafe-eval. This allows the Stockfish worker to be created with the  new Worker  constructor and execute the Stockfish engine code.
    */