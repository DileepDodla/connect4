// 255, 20, 147    221, 160, 221

var bgMusic;
var allChipCells, topChipCells;
var currentPlayer;
var player1Status, player2Status;
var defaultChipCellColor, currentPlayerChipColor, player1ChipColor, player2ChipColor;
var winnerModal;
var nrows = 6, ncols = 7;

// Check for win combos - (row, column, forward diagonal & backward diagonal) and display winner
function checkForWin() {
    var isGameFinished = false;

    // Row check
    var rc1, rc2, rc3, rc4;
    for (i = 0; i < nrows; i++) {
        for (j = 0; j <= ncols - 4; j++) {
            rc1 = (getComputedStyle(allChipCells[i * ncols + j].children[0]).backgroundColor === currentPlayerChipColor);
            rc2 = (getComputedStyle(allChipCells[i * ncols + j + 1].children[0]).backgroundColor === currentPlayerChipColor);
            rc3 = (getComputedStyle(allChipCells[i * ncols + j + 2].children[0]).backgroundColor === currentPlayerChipColor);
            rc4 = (getComputedStyle(allChipCells[i * ncols + j + 3].children[0]).backgroundColor === currentPlayerChipColor);

            if (rc1 && rc2 && rc3 && rc4) {
                isGameFinished = true;
                break;
            }
        }
    }

    // Column check
    var cc1, cc2, cc3, cc4;
    for (i = 0; i < ncols; i++) {
        for (j = 0; j <= nrows - 4; j++) {
            cc1 = (getComputedStyle(allChipCells[i + j * ncols].children[0]).backgroundColor === currentPlayerChipColor);
            cc2 = (getComputedStyle(allChipCells[i + (j + 1) * ncols].children[0]).backgroundColor === currentPlayerChipColor);
            cc3 = (getComputedStyle(allChipCells[i + (j + 2) * ncols].children[0]).backgroundColor === currentPlayerChipColor);
            cc4 = (getComputedStyle(allChipCells[i + (j + 3) * ncols].children[0]).backgroundColor === currentPlayerChipColor);

            if (cc1 && cc2 && cc3 && cc4) {
                isGameFinished = true;
                break;
            }
        }
    }

    var z1, z2; // Control variables for diagonal matrix traversing

    // Forward Diagonal Check
    var fdc1, fdc2, fdc3, fdc4;
    for (i = 3; i < nrows + ncols - 4; i++) {
        z1 = i < ncols ? 0 : i - ncols + 1;
        z2 = i < nrows ? 0 : i - nrows + 1;
        for (j = i - z2; j >= z1 + 3; j--) {
            fdc1 = (getComputedStyle(allChipCells[j * ncols + (i - j)].children[0]).backgroundColor === currentPlayerChipColor);
            fdc2 = (getComputedStyle(allChipCells[(j - 1) * ncols + (i - (j - 1))].children[0]).backgroundColor === currentPlayerChipColor);
            fdc3 = (getComputedStyle(allChipCells[(j - 2) * ncols + (i - (j - 2))].children[0]).backgroundColor === currentPlayerChipColor);
            fdc4 = (getComputedStyle(allChipCells[(j - 3) * ncols + (i - (j - 3))].children[0]).backgroundColor === currentPlayerChipColor);

            if (fdc1 && fdc2 && fdc3 && fdc4) {
                isGameFinished = true;
                break;
            }

            // console.log(allChipCells[j * ncols + (i - j)], allChipCells[(j - 1) * ncols + (i - (j - 1))], allChipCells[(j - 2) * ncols + (i - (j - 2))], allChipCells[(j - 3) * ncols + (i - (j - 3))]);
            // Uncomment the above line and click on any top cell in the page and check in the console how the cells are being traversed diagonally forward
        }

    }

    // Backward Diagonal Check
    var bdc1, bdc2, bdc3, bdc4;
    for (i = 3; i < nrows + ncols - 4; i++) {
        z1 = i < ncols ? 0 : i - ncols + 1;
        z2 = i < nrows ? 0 : i - nrows + 1;
        for (j = i - z2; j >= z1 + 3; j--) {
            bdc1 = (getComputedStyle(allChipCells[(nrows - j - 1) * ncols + (i - j)].children[0]).backgroundColor === currentPlayerChipColor);
            bdc2 = (getComputedStyle(allChipCells[(nrows - (j - 1) - 1) * ncols + (i - (j - 1))].children[0]).backgroundColor === currentPlayerChipColor);
            bdc3 = (getComputedStyle(allChipCells[(nrows - (j - 2) - 1) * ncols + (i - (j - 2))].children[0]).backgroundColor === currentPlayerChipColor);
            bdc4 = (getComputedStyle(allChipCells[(nrows - (j - 3) - 1) * ncols + (i - (j - 3))].children[0]).backgroundColor === currentPlayerChipColor);

            // console.log(allChipCells[(nrows - j - 1) * ncols + (i - j)], allChipCells[(nrows - (j - 1) - 1) * ncols + (i - (j - 1))], allChipCells[(nrows - (j - 2) - 1) * ncols + (i - (j - 2))], allChipCells[(nrows - (j - 3) - 1) * ncols + (i - (j - 3))]);
            // Uncomment the above line and click on any top cell in the page and check in the console how the cells are being traversed diagonally backward
            if (bdc1 && bdc2 && bdc3 && bdc4) {
                isGameFinished = true;
                break;
            }
        }
    }

    // When game is finished
    if (isGameFinished === true) {

        // Disable all buttons in cell grid
        for (i = 0; i < allChipCells.length; i++) {
            allChipCells[i].children[0].setAttribute("disabled", true);
        }

        // Make player1 and player2 UI status idle (remove green dot)
        player1Status.classList.remove("current-player");
        player2Status.classList.remove("current-player");

        // Set winner text (player1/player2)
        document.querySelector(".modal-body p").innerHTML = (currentPlayer === 1 ? "Player 1" : "Player 2");

        // Show winner
        winnerModal.show();

        return true;
    }
    
    return false;
}

// Drops player chip to the target chip cell in the current chip column
function dropChip() {

    // Set the current player chip color
    currentPlayerChipColor = (currentPlayer === 1 ? player1ChipColor : player2ChipColor);

    // Get the current chip column (clicked chip column)
    var chipColumn = [];
    for (i = 0; i < nrows; i++) {
        chipColumn.push(allChipCells[topChipCells.indexOf(this) + ncols * i]);
    }

    // Initializing target chip as the last chip in the clicked column
    var targetChipCellIndex = nrows - 1; // (player's chip Go TO position)

    // Self-Explanatory
    var currentChipCell, nextChipCell;
    var currentChipCellColor, nextChipCellColor;

    // Compare all the chip cells in the clicked column 
    // and finding the target chip cell index to be colored
    for (i = 0; i < nrows - 1; i++) {

        // Self-Explanatory
        currentChipCell = chipColumn[i];
        nextChipCell = chipColumn[i + 1];

        // Self-Explanatory
        currentChipCellColor = getComputedStyle(currentChipCell.children[0]).backgroundColor;
        nextChipCellColor = getComputedStyle(nextChipCell.children[0]).backgroundColor;

        // If the current chip column is full break with no modification
        if (currentChipCellColor !== defaultChipCellColor) {
            targetChipCellIndex = -1;
            break;
        }

        // Find the target chip cell index
        if (nextChipCellColor !== defaultChipCellColor) {
            targetChipCellIndex = i;
            break;
        }

    }

    // Change the target chip cell color only if the current chip column is not full
    if (targetChipCellIndex !== -1) {

        // Change chip color at the target while playing sound effect
        new Audio("music/drop-checker.mp3").play();
        chipColumn[targetChipCellIndex].children[0].style.backgroundColor = currentPlayerChipColor;

        // Check for win combination after entry
        var gameDone = checkForWin();

        // If game is not finished yet toggle player's turn
        if (!gameDone) {
            // Toggle player's turn
            currentPlayer = (currentPlayer === 1 ? 2 : 1);

            // Toggle player's turn UI (green dot)
            player1Status.classList.toggle("current-player");
            player2Status.classList.toggle("current-player");
        }
    }
}

// Toggle background music (play/pause)
function togglePlayPause() {
    return bgMusic.paused ? bgMusic.play() : bgMusic.pause();
}

// Starting the game
function playGame() {

    // Get all chip cells
    allChipCells = Array.from(document.querySelectorAll("td"));

    // Get default chip cell color
    defaultChipCellColor = getComputedStyle(document.querySelector(".board button")).backgroundColor;

    // Set player1 and player2 chip colors
    player1ChipColor = "rgb(255, 192, 203)";
    player2ChipColor = "rgb(95, 15, 64)";

    // Get player status elements
    player1Status = document.querySelector("#player1-status");
    player2Status = document.querySelector("#player2-status");

    // Initializing current player to player1
    currentPlayer = 1;

    // Update player1 UI status
    player1Status.classList.toggle("current-player");

    // Adding click event listener to the top cells
    topChipCells = allChipCells.slice(0, ncols);
    topChipCells.forEach(chipCell => chipCell.addEventListener("click", dropChip));

    // Creating audio element for background music
    bgMusic = new Audio('music/bg-music.mp3');
    bgMusic.setAttribute("loop", true);

    // Adding click event listener and attaching togglePlayPause func to the music icon button to play/pause music
    document.querySelector("#musicIconButton").addEventListener('click', togglePlayPause);

    // Adding space-bar key press event listener to the entire page (document) to play/pause audio
    document.addEventListener('keyup', event => {
        if (event.code === "Space") {
            event.preventDefault();
            togglePlayPause();
        }
    });

    // Adding click event listener to restart button for page reload (restart game)
    document.getElementById("restartBtn").addEventListener('click', () => window.location.reload());

    // Get the winner modal box
    winnerModal = new bootstrap.Modal(document.getElementById('winnerModal'));

}

// Function that makes sure the page is loaded
function ready(callbackFunc) {
    if (document.readyState !== 'loading') {
        // Document is already ready, call the callback directly
        callbackFunc();
    }
    else if (document.addEventListener) {
        // All modern browsers to register DOMContentLoaded
        document.addEventListener('DOMContentLoaded', callbackFunc);
    }
    else {
        // Old IE browsers
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState === 'complete') {
                callbackFunc();
            }
        });
    }
}

// Trigger play game once the page is fully loaded
ready(playGame);
