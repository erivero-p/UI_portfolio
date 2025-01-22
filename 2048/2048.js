let actualScore = 0;
let matrix = Array(16).fill(null); // this will represent the grid
const colorMap = {
    2: 'var(--cell2)',
    4: 'var(--cell4)',
    8: 'var(--cell8)',
    16: 'var(--cell16)',
    32: 'var(--cell32)',
    64: 'var(--cell64)',
    128: 'var(--cell128)',
    256: 'var(--cell256)',
    512: 'var(--cell512)',
    1024: 'var(--cell1024)',
    2048: 'var(--cell2048)',   
};

function saveMatrix() {
    localStorage.setItem('matrix', JSON.stringify(matrix));
    localStorage.setItem('actualScore', actualScore);
}

function loadMatrix() {
    const savedMatrix = localStorage.getItem('matrix');
    const savedScore = localStorage.getItem('actualScore');
    if (savedMatrix) {
        matrix = JSON.parse(savedMatrix);
    }
    if (savedScore) {
        actualScore = parseInt(savedScore, 10);
    }
}

function renderGrid() {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = i + 1;
        if (matrix[i] !== null) {
            cell.textContent = matrix[i];
            cell.style.backgroundColor = colorMap[matrix[i]];
            if (matrix[i] > 4)
                cell.style.color = 'white';
            cell.classList.add('new');
            setTimeout(() => cell.classList.remove('new'), 300); // Remove the 'new' class after the transition
        }
        gridContainer.appendChild(cell);
    }
}

function addNewNumber(total) {
    let count = 0;
    while (count < total) {
        const randomIndex = Math.floor(Math.random() * 16);
        if (matrix[randomIndex] === null) {
            matrix[randomIndex] = 2;
            count++;
        }
    }
    saveMatrix();
    renderGrid();
}

function initGame() {
    loadMatrix();
    if (matrix.filter(value => value !== null).length < 3) {
        setGame();
    }
    renderGrid();
    updateScore(); // Update the score display on game initialization

    const restartBtn = document.getElementById('restart-btn');
    restartBtn.addEventListener('click', () => {
        matrix.fill(null);
        actualScore = 0; // Reset the score
        addNewNumber(2);
        renderGrid();
        updateScore(); // Update the score display
    });
}

function setGame() {
    matrix.fill(null);
    const clickToPlay = document.getElementById('click');
    const score = document.getElementById('score');
    const restart = document.getElementById('restart-btn');

    clickToPlay.style.display = 'block';
    score.style.display = 'none';
    restart.style.display = 'none';

    clickToPlay.addEventListener('click', () => {
        clickToPlay.style.display = 'none';
        score.style.display = 'block';
        restart.style.display = 'block';
        addNewNumber(2);
    });
}

function handleMovement(moved) {
    if (moved) {
        addNewNumber(1);
        renderGrid();
        updateScore();
        handleGameOver();
    }
}

function handleKeys() {
    document.addEventListener('keydown', (event) => {
        let moved = false;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault(); // Prevent default behavior for arrow keys
        }
        if (event.key === 'ArrowUp') {   
            moved = moveY('up');
        } else if (event.key === 'ArrowDown') {
            moved = moveY('down');
        } else if (event.key === 'ArrowLeft') {
            moved = moveX('left');
        } else if (event.key === 'ArrowRight') {
            moved = moveX('right');
        }
        handleMovement(moved);
    });
}

function handleSwipe() {
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;

    const threshold = 50; // Minimum distance for a swipe to be registered
    const gameContainer = document.getElementById('grid-container');

    if (!gameContainer) {
        console.error('Error: grid-container element not found.');
        return;
    }

    gameContainer.addEventListener('touchstart', (event) => {
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
    });

    gameContainer.addEventListener('touchmove', (event) => {
        const touchmoveX = event.changedTouches[0].screenX;
        const touchmoveY = event.changedTouches[0].screenY;
        const diffX = touchmoveX - touchstartX;
        const diffY = touchmoveY - touchstartY;

        if (Math.abs(diffY) > Math.abs(diffX)) {
            event.preventDefault(); // Prevent vertical scrolling
        }
    }, { passive: false });

    gameContainer.addEventListener('touchend', (event) => {
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        handleGesture();
    });

    function handleGesture() {
        const diffX = touchendX - touchstartX;
        const diffY = touchendY - touchstartY;
        let moved = false;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    moved = moveX('right');
                } else {
                    moved = moveX('left');
                }
            }
        } else {
            if (Math.abs(diffY) > threshold) {
                if (diffY > 0) {
                    moved = moveY('down');
                } else {
                    moved = moveY('up');
                }
            }
        }
        handleMovement(moved);
    }
}

function moveX(direction) {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = matrix.slice(i * 4, i * 4 + 4);
        if (direction === 'right') {
            row = row.reverse();
        }
        const newRow = slide(row);
        if (direction === 'right') {
            newRow.reverse();
        }
        for (let j = 0; j < 4; j++) {
            if (matrix[i * 4 + j] !== newRow[j]) {
                moved = true;
                matrix[i * 4 + j] = newRow[j];
            }
        }
    }
    return moved;
}

function moveY(direction) {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let column = [matrix[i], matrix[i + 4], matrix[i + 8], matrix[i + 12]];
        if (direction === 'down') {
            column = column.reverse();
        }
        const newColumn = slide(column);
        if (direction === 'down') {
            newColumn.reverse();
        }
        for (let j = 0; j < 4; j++) {
            if (matrix[i + j * 4] !== newColumn[j]) {
                moved = true;
                matrix[i + j * 4] = newColumn[j];
            }
        }
    }
    return moved;
}

function slide(row) {
    row = row.filter(val => val !== null); // Remove all null values
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            actualScore += row[i];
            row[i + 1] = null;
        }
    }
    row = row.filter(val => val !== null); // Remove all null values again
    while (row.length < 4) {
        row.push(null);
    }
    return row;
}

function handleGameOver() {
    if (matrix.includes(2048)) {
        alert('You win!');
        initGame();
    } else if (!matrix.includes(null)) {
        if (checkGameOver()) {
            console.log(JSON.stringify(matrix));
            alert('Game Over!');
            initGame();
        }
    }
}

function checkGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (j < 3 && matrix[i * 4 + j] === matrix[i * 4 + j + 1]) {
                return false; // Check horizontally
            }
            if (i < 3 && matrix[i * 4 + j] === matrix[(i + 1) * 4 + j]) {
                return false; // Check vertically
            }
        }
    }
    return true;
}

function updateScore() {
    const score = document.getElementById('score-value');
    score.textContent = actualScore;
}

export function init2048events() {
    initGame();
    handleKeys();
    handleSwipe();
}