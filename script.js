// Let's update how a player works
// there is no computer player
// there is player one and player two
// by default their name will be 

// with this implementation we just have a global variable
const startGame = (function (){
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

        const getMoves = () => moves;

        return {updateBoard, resetBoard, getMoves};
    })();

    // I need to add the event listener to all items and once the item is filled
    // i disable the even listener. Therefore, i need to attach a function with a name

    const itemsNodeList = document.querySelectorAll(".item");
    let itemsNotUsed = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let itemsUsed = [];
    for (let i = 0; i < itemsNodeList.length; ++i) {
        itemsNodeList[i].addEventListener("click", playOcurrence);
    }

    function playOcurrence(e) {
        if (!victory) {
            const item = e.target;
            const imgEl = document.createElement("img");
            imgEl.src = turn ? "./images/circle.svg" : "./images/alpha-x.svg";
            const rowIndex = +item.parentElement.dataset.row;
            const columnIndex = +item.dataset.index;
            index = rowIndex * 3 + columnIndex;
            itemsNotUsed.splice(index, 1);
            itemsUsed.push(index);
            turn = !turn;
            victory = gameBoard.updateBoard(rowIndex, columnIndex, arrPlayers[turn ? 0 : 1]);
            item.appendChild(imgEl);
            if (victory) {
                arrPlayers[turn ? 0 : 1].increaseScore();
                updateScoreDOM();
                for (const itemTemp of itemsNodeList) {
                    itemTemp.removeEventListener("click", playOcurrence);
                }
                // we create a buttton to restart the game
                // we create a button that allows for continuing the game
                createButtons();
            } else if (gameBoard.getMoves() === 9) {
                createButtons();
                console.log("EMPATEEEE");
            }
            console.log(gameBoard.getMoves());
            item.removeEventListener("click", playOcurrence);
        }
    }

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
        const idx = turn ? 0 : 1;
        const scoreSpan = document.querySelector(`#score-${idx}`);
        scoreSpan.textContent = arrPlayers[idx].getScore();
    }

    function  resetGame() {
    // there is no need for "e", we can just delete all buttons in the header
        resetScore(0);
        resetBoard();
        for (const player of arrPlayers) {
            player.resetScore();
        }
    }

    function resetScore(index) {
        const scoreSpan = document.querySelector(`#score-${index}`);
        scoreSpan.textContent = 0;
    }

    function resetBoard() {
        gameBoard.resetBoard();
        resetDisplay();
        for (item of itemsNodeList) {
            item.addEventListener("click", playOcurrence);
        }
        victory = false;
        turn = false;
        const buttonsStates = document.querySelectorAll("button");
        for (const buttn of buttonsStates) {
            buttn.remove();
        }
    }

    function resetDisplay() {
        for (index of itemsNotUsed) {
            itemsNodeList[index].removeEventListener("click", playOcurrence);
        }
        for (index of itemsUsed){
            itemsNodeList[index].removeChild(itemsNodeList[index].querySelector("img"));
        }
        itemsNotUsed = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        itemsUsed = [];

    }

    const p1 = createPlayer("X");
    const p2 = createPlayer("0");
    const arrPlayers = [p1, p2];
    let victory = false;
    let turn = false;
    gameBoard.resetBoard();
})()


