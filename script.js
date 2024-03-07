// Let's update how a player works
// there is no computer player
// there is player one and player two
// by default their name will be 
    
// with this implementation we just have a global variable
const startGame = (function (){
    const createPlayer = function(symbol) {
        const getSymbol = () => symbol;
        return {getSymbol};
    }

    const gameBoard = (function() {
        const emptyMarker = '-';
        const sizeBoard = 3;
        const arr = [];

        const resetBoard = function() {
            while (arr.length > 0) arr.pop();
            for (let i = 0; i < sizeBoard; ++i) {
                let tempArr = [];
                for (let j = 0; j < sizeBoard; ++j) {
                    tempArr.push(emptyMarker);
                }
                arr.push(tempArr);
            }
        }

        const updateBoard = function (positionX, positionY, symbol) {
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

        return {updateBoard, resetBoard};
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
            console.log(itemsUsed);
            console.log(itemsNotUsed);
            console.log("///////////////")
            victory = gameBoard.updateBoard(rowIndex, columnIndex, arrPlayers[turn ? 0 : 1]);
            turn = !turn;
            item.appendChild(imgEl);
            if (victory) {
                for (const itemTemp of itemsNodeList) {
                    itemTemp.removeEventListener("click", playOcurrence);
                }
                // we create a buttton to restart the game
                const buttReset = document.createElement("button");
                buttReset.innerHTML = "RESET";
                const header = document.querySelector(".header");
                buttReset.addEventListener("click", resetBoard);
                header.appendChild(buttReset);
            }
            item.removeEventListener("click", playOcurrence);
        }
    }

    function resetBoard(e) {
        gameBoard.resetBoard();
        resetDisplay();
        for (item of itemsNodeList) {
            item.addEventListener("click", playOcurrence);
        }
        victory = false;
        turn = false;
        e.target.remove();
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


