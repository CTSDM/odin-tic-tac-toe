// With this implementation we just have an IIFE.
// The game starts.
(function (){
    const createPlayer = function(symbol) {
        let score = 0;

        const increaseScore = function () {++score};
        const getScore = () => score;
        const resetScore = function () {score = 0;};
        const getSymbol = () => symbol;

        return {getScore, getSymbol, increaseScore, resetScore};
    }

    const gameBoard = (function() {
        const emptyMarker = '-';
        const sizeBoard = 3;
        const arr = [];
        let moves = 0;
        
        const getMoves = () => moves;
        const resetBoard = function() {
            while (arr.length > 0) arr.pop();
            for (let i = 0; i < sizeBoard; ++i) {
                let tempArr = [];
                for (let j = 0; j < sizeBoard; ++j) {
                    tempArr.push(emptyMarker);
                }
                arr.push(tempArr);
            }
            moves = 0;
        }

        const updateBoard = function (positionX, positionY, symbol) {
            ++moves;
            arr[positionX][positionY] = symbol;
            return checkVictory(positionX, positionY);
        }

        const checkVictory = function(x, y) {
            if ((arr[x][0] === arr[x][1]) && (arr[x][1] === arr[x][2]))
                return true;
            if ((arr[0][y] === arr[1][y]) && (arr[1][y] === arr[2][y]))
                return true;
            if(x === y) {
                // check lef-to-right downward diagonal
                if ((arr[0][0] === arr[1][1]) && (arr[1][1] === arr[2][2]))
                    return true;
                if (y === 1) {
                    if ((arr[0][2] === arr[1][1]) && (arr[1][1] === arr[2][0]))
                        return true;
                }
            } 
            if ((x === 2 && y === 0) || (x === 0 && y === 2)) {
                if ((arr[2][0] === arr[1][1]) && (arr[1][1] === arr[0][2]))
                    return true;
            }
        }

        return {updateBoard, resetBoard, getMoves};
    })();

    const itemsNodeList = document.querySelectorAll(".item");
    const totalNumberItems = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const itemsNotUsed = [];
    const itemsUsed = [];
    totalNumberItems.forEach((item) => itemsNotUsed.push(item));
    itemsNodeList.forEach(item => item.addEventListener("click", playOcurrence));

    function playOcurrence(e) {
        if (!victory) {
            const item = e.target;
            const imgEl = document.createElement("img");
            imgEl.src = (turn_player === 1) ? "./images/circle.svg" : "./images/alpha-x.svg";
            const rowIndex = +item.parentElement.dataset.row;
            const columnIndex = +item.dataset.index;
            const index = rowIndex * 3 + columnIndex;
            itemsNotUsed.splice(index, 1);
            itemsUsed.push(index);
            victory = gameBoard.updateBoard(rowIndex, columnIndex, arrPlayers[turn_player]);
            item.appendChild(imgEl);
            if (victory) {
                arrPlayers[turn_player].increaseScore();
                updateScoreDOM();
                // we remove the event listener from where it hasn't been used
                itemsNotUsed.forEach((idx) => itemsNodeList[idx].removeEventListener("click", playOcurrence));
                
                createButtons();
            } else if (gameBoard.getMoves() === 9) {
                createButtons();
            }
            turn_player = (turn_player === 1 ? 0 : 1);
            item.removeEventListener("click", playOcurrence);
        }
    }

    // create reset and continue buttons
    function createButtons() {
        const buttContinue = document.createElement("button");
        const buttReset = document.createElement("button");
        buttContinue.innerHTML = "CONTINUE";
        buttReset.innerHTML = "RESET";
        const header = document.querySelector(".header");
        buttContinue.addEventListener("click", resetBoard);
        buttReset.addEventListener("click", resetGame);
        header.appendChild(buttReset);
        header.appendChild(buttContinue);
    }

    function updateScoreDOM() {
        const scoreSpan = document.querySelector(`#score-${turn_player}`);
        scoreSpan.textContent = arrPlayers[turn_player].getScore();
    }

    function  resetGame() {
        resetScoreDOM();
        resetBoard();
        arrPlayers.forEach((player) => player.resetScore());
    }

    function resetScoreDOM() {
        for (let i = 0; i < arrPlayers.length; ++ i) {
            const scoreSpan = document.querySelector(`#score-${i}`);
            scoreSpan.textContent = 0;
        }
    }

    function resetBoard() {
        gameBoard.resetBoard();
        resetDisplay();
        itemsNodeList.forEach((item) => item.addEventListener("click", playOcurrence))
        victory = false;
        turn_player = (turn_player === 1) ? 0 : 1;
        const buttonsStates = document.querySelectorAll("button");
        buttonsStates.forEach((button) => button.remove());
    }

    function resetDisplay() {
        itemsNotUsed.forEach((index) => itemsNodeList[index].removeEventListener("click", playOcurrence));
        itemsUsed.forEach((index) => itemsNodeList[index].removeChild(itemsNodeList[index].querySelector("img")));
        while(itemsNotUsed.length > 0) itemsNotUsed.pop();
        totalNumberItems.forEach((item) => itemsNotUsed.push(item));
        while(itemsUsed.length > 0) itemsUsed.pop();
    }

    const p1 = createPlayer("X");
    const p2 = createPlayer("0");
    const arrPlayers = [p1, p2];
    let victory = false;
    let turn_player = 0;
    gameBoard.resetBoard();
})()


