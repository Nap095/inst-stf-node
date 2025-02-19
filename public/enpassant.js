document.addEventListener('DOMContentLoaded', function() {
    const positionsSelect = document.getElementById('positions');
    const outputDiv = document.getElementById('output');
    const boardDiv = document.getElementById('myBoard');

    // Initialize the chessboard
    const board = Chessboard('myBoard', {
        position: 'start'
    });

    positionsSelect.addEventListener('change', function() {
        const selectedValue = positionsSelect.value;
        outputDiv.textContent = `Selected position: ${selectedValue}`;
        board.position(selectedValue); // Update the chessboard position

    });
});