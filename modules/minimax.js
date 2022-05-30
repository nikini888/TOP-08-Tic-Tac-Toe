import GameBoardFactory from './gameBoard.js';
//maxDepth = -1 count to the end node
const getBestMove = function (num = -1) {
    const maxDepth = num
    const nodeMove = []

    const minimax = function (board, depth, isMax, callback = () => { }) {
        if (depth === 0) nodeMove.length = 0;

        if (board.isWin() || depth === maxDepth) {
            if (board.isWin().winner === 'x') return 100 - depth;
            if (board.isWin().winner === 'o') return -100 + depth;
            return 0;
        }
        if (isMax === 'x') {
            let bestValue = -1000
            board.getAvailableMoves().forEach(index => {
                board.addMove('x', index)
                const nodeValue = minimax(board, depth + 1, 'o', callback)
                bestValue = Math.max(bestValue, nodeValue)
                board.clearMove(index)
                if (depth === 0) {
                    nodeMove.push({
                        index: index,
                        value: nodeValue
                    })
                }
            })
            if (depth === 0) {
                let bestMove;
                let bestMoves = nodeMove.filter(item => item.value === bestValue)
                if (bestMoves.length < 2) {
                    bestMove = bestMoves[0].index
                } else {
                    let random = Math.floor(Math.random() * bestMoves.length)
                    bestMove = bestMoves[random].index
                }
                callback(bestMove)
                return bestMove
            }

            return bestValue
        }
        if (isMax === 'o') {
            let bestValue = +1000
            board.getAvailableMoves().forEach(index => {
                board.addMove('o', index)
                const nodeValue = minimax(board, depth + 1, 'x', callback)
                bestValue = Math.min(bestValue, nodeValue)
                board.clearMove(index)
                if (depth === 0) {
                    nodeMove.push({
                        index: index,
                        value: nodeValue
                    })
                }
            })
            if (depth === 0) {
                let bestMove;
                let bestMoves = nodeMove.filter(item => item.value === bestValue)

                if (bestMoves.length < 2) {
                    bestMove = bestMoves[0].index
                } else {
                    let random = Math.floor(Math.random() * bestMoves.length)
                    bestMove = bestMoves[random].index
                }
                callback(bestMove)
                return bestMove
            }

            return bestValue
        }
    }
    return {
        minimax,
    }

}
export default getBestMove

/*
1.Thoat khoi vong lap: depth === maxdepth(chon do kho cua game) 
2.Neu co win or draw return score
3.Pseudocode
        function minimax(board, depthh, isMaximizingPlayer):

            if current board state is a terminal state :
                return value of the board
            
            if isMaximizingPlayer :
                bestVal = -INFINITY 
                for each move in board :
                    value = minimax(board, depthh+1, false)
                    bestVal = max( bestVal, value) 
                return bestVal

            else :
                bestVal = +INFINITY 
                for each move in board :
                    value = minimax(board, depthh+1, true)
                    bestVal = min( bestVal, value) 
                return bestVal  
*/