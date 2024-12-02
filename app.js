    // Load the 2048 game
    fetch('2048/2048.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('2048-game').innerHTML = html;
            initGame();
            handleGame();
        })
        .catch(error => {
            console.error('Error loading 2048 game:', error);
        });

