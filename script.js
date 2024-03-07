// with this implementation we just have a global variable
const startGame = (function (){
    const createPlayer = function(name, symbol) {
        const getName = () => name;
        const getSymbol = () => symbol;
        return {getName, getSymbol};
    }

    const gameBoard = (function() {
        const emptyMarker = '-';
        const sizeBoard = 3;
        const arr = [];

        for (let i = 0; i < sizeBoard; ++i) {
            let tempArr = [];
            for (let j = 0; j < sizeBoard; ++j) {
                tempArr.push(emptyMarker);
            }
            arr.push(tempArr);
        }

        const getLength = () => sizeBoard;

        const updateBoard = function (positionX, positionY, symbol) {
            // for the console approach we check that the position are within 
            // the actual limits of the gameboard
            // second we check if it is possible to update
            // this logic only has a purpose for the console based game
            if (positionX >= getLength() || positionY > getLength()){
                return {val: false, str_log:"The given position surpass the physical of the board."}
            } else if (arr[positionX][positionY] !== emptyMarker) {
                return {val: false, str_log:"The given positon already has a player marker."}
            } else {
                arr[positionX][positionY] = symbol;
                return {val: true, victoryStatus: checkVictory(positionX, positionY), str_log:"The board has been updated correctly."}
            }
        }

        const displayBoard = function() {
            for (let i = 0; i < sizeBoard; ++i)
                console.log(`${i}|${arr[i][0]} ${arr[i][1]} ${arr[i][2]}|`)
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

            // a victory occurs if a straight line has the same characters, being these different from `emptyMarker`
            // if the symbols had associated a number, a first difference could be  computed in all axis...
                // alternatively i can get the indexes corresponding to the users and return it as an array of objects, or array of arrays...
                // furthermore, given the location of where the symbol is going to be placed I can just check those  conditions
            // just check the column and the row and if needed the diagonal(s)
            // no need to check the whole board
        }

        return {getLength, updateBoard, displayBoard};
    })();

    const p1 = createPlayer("juanito", "X");
    const p2 = createPlayer("alberto", "0");
    const arrPlayers = [p1, p2];
    let indexPlayer = 0;
    gameBoard.displayBoard();
    let turn = false;

    loopMain: while(true) {
        indexPlayer = Math.abs(indexPlayer - 1);
        while (true) {
            // for the console based game we expect that the input are numbers between 0 and 2
            let x = +prompt(`${arrPlayers[indexPlayer].getName()}, please type the row`);
            let y = +prompt(`${arrPlayers[indexPlayer].getName()}, please type the column`);
            ({val, victoryStatus, str_log} = gameBoard.updateBoard(x, y, arrPlayers[indexPlayer].getSymbol()));
            if (val) {
                gameBoard.displayBoard();
                if (victoryStatus)
                    break loopMain;
                turn = !turn;
                break;
            }
            console.log(str_log);
        }
    }
})()


