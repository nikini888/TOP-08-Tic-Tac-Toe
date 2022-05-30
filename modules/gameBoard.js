const GameBoardFactory = function (state = ['', '', '', '', '', '', '', '', '']) {
    const board = state;
    const getBoard = () => board
    function renderDisplayBoardGame() {
        const template = document.getElementById('templateBoardGame').innerHTML
        const html = ejs.render(template, { gameBoard: board })
        document.getElementById('boardGame').innerHTML = html
    }
    const isEmpty = () => {
        return board.every(cell => !cell)
    }
    const isFull = () => {
        return board.every(cell => cell)
    }
    const isWin = () => {
        if (isEmpty()) return false
        //check row win
        if (board[0] && board[0] === board[1] && board[0] === board[2]) {
            return { winner: board[0], winLine: [0, 1, 2] }
        }
        if (board[3] && board[3] === board[4] && board[3] === board[5]) {
            return { winner: board[3], winLine: [3, 4, 5] }
        }
        if (board[6] && board[6] === board[7] && board[6] === board[8]) {
            return { winner: board[6], winLine: [6, 7, 8] }
        }
        //check column win
        if (board[0] && board[0] === board[3] && board[0] === board[6]) {
            return { winner: board[0], winLine: [0, 3, 6] }
        }
        if (board[1] && board[1] === board[4] && board[1] === board[7]) {
            return { winner: board[1], winLine: [1, 4, 7] }
        }
        if (board[2] && board[2] === board[5] && board[2] === board[8]) {
            return { winner: board[2], winLine: [2, 5, 8] }
        }
        //check Diagonal win 
        if (board[0] && board[0] === board[4] && board[0] === board[8]) {
            return { winner: board[0], winLine: [0, 4, 8] }
        }
        if (board[2] && board[2] === board[4] && board[2] === board[6]) {
            return { winner: board[2], winLine: [2, 4, 6] }
        }

        //no win but full is draw
        if (isFull()) {
            return { winner: 'draw' }
        }

        //another case
        return false
    }
    const addMove = (symbol, position) => {
        if (/[^0-8]/.test(position)) {
            throw new Error('Cell index does not exist!')
        }
        if (/[^x,o]/.test(symbol)) {
            throw new Error('Symbol is not alow! The symbol can only be x or o!')
        }
        if (board[position]) {
            return false
        }
        board[position] = symbol;
        return true;
    }
    const clearMove = (position) => {
        if (/[^0-8]/.test(position)) {
            throw new Error('Cell index does not exist!')
        }
        if (!board[position]) {
            return false
        }
        board[position] = '';
        return true;
    }
    const getAvailableMoves = () => {
        const availableMoves = []
        board.forEach((item, index) => {
            if (!item) { availableMoves.push(index) }
        })
        return availableMoves
    }
    return {
        getBoard,
        renderDisplayBoardGame,
        isEmpty,
        isFull,
        isWin,
        addMove,
        clearMove,
        getAvailableMoves
    }
};
export default GameBoardFactory