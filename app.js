import GameBoardFactory from './modules/gameBoard.js';
import PlayerFactory from './modules/players.js';
import getBestMove from './modules/minimax.js';
import setTimeoutFunction from './modules/promise.js';
(function () {
    const prepareGame = document.querySelector('.prepareGame')
    const boardDisplay = document.querySelector('.boardDisplay')
    const mainGame = document.querySelector('.mainGame')
    const announceEndRound = document.querySelector('.endRound')
    const announceRestart = document.querySelector('.restart')
    const inputPlayer2Name = document.getElementById('player2_name')
    const btnRestart = document.querySelector('.btnRestart')
    const symbol = ['x', 'o']
    let userData, player2Data, tieData;
    let currentPlayer = 'x';
    let isPlayVsCPU = true;
    let cells;
    let isEndGame = false;
    const gameBoard = GameBoardFactory()
    const getPlayersToDisplay = []
    //['x', 'x', 'o', '', 'o', '', 'x', '', '']

    function toggleDisplay(action, ...els) {
        els.forEach(el => el.classList.toggle(action))
    }

    document.getElementById('form').addEventListener('submit', (e) => {
        e.preventDefault()
        getPlayersInf()
        toggleDisplay('hidden', prepareGame, boardDisplay, mainGame)
        renderStartGame()
    })

    function getPlayersInf() {
        userData = PlayerFactory(getUserInf())
        player2Data = PlayerFactory(getPlayer2Inf())
        tieData = PlayerFactory({ name: 'tie' })
        getPlayersToDisplay.push(userData)
        getPlayersToDisplay.push(tieData)
        getPlayersToDisplay.push(player2Data)
    }

    function getPlayer2Inf() {
        const player2Data = {}
        player2Data.mark = userData.getMark() === symbol[0] ? symbol[1] : symbol[0]
        player2Data.name = isPlayVsCPU ? 'CPU' : inputPlayer2Name.value;
        player2Data.image = isPlayVsCPU ? './img/ai.png' : './img/user.png';
        return player2Data
    }
    function getUserInf() {
        const userData = {}
        document.querySelectorAll("[id^='user']").forEach(input => {
            const { name, type, value, checked } = input;
            if ((type !== 'radio') || (type === 'radio' && checked)) {
                userData[name] = value
            }
        })
        userData.image = './img/user.png'
        return userData
    }

    document.querySelector('.vsPlayer2').addEventListener('click', choiceGameType)
    document.querySelector('.vsCPU').addEventListener('click', choiceGameType)

    function choiceGameType() {
        const divGetPlayer2Inf = document.querySelector(".player2Infor-Name")
        const btnVsCPU = document.querySelector(".vsCPU")
        const btnVsPlayer2 = document.querySelector(".vsPlayer2")

        isPlayVsCPU = !isPlayVsCPU
        inputPlayer2Name.disabled = !inputPlayer2Name.disabled;
        toggleDisplay('hidden', divGetPlayer2Inf)
        toggleDisplay('nonactive', btnVsCPU, btnVsPlayer2)
    }
    function renderStartGame() {
        changeSizeLogo()
        renderDisplayDashBoard()
        gameBoard.renderDisplayBoardGame()
        cells = document.querySelectorAll('.cell')
        renderDisplayScore()
        startGame()
    }
    function renderDisplayDashBoard() {
        const template = document.getElementById('templatePlayers').innerHTML
        const html = ejs.render(template, { players: [userData, player2Data] })
        document.getElementById('dashBoard').innerHTML = html
    }
    function changeSizeLogo() {
        document.querySelector('.logo').classList.add('small-logo')
    }
    function startGame() {
        if (isPlayVsCPU) {
            if (userData.getMark() === 'x') {
                addUserMove()
            } else {
                const index = [0, 2, 4, 6, 8]
                //chose random index to CPU play
                const randomMove = Math.floor(Math.random() * index.length)
                gameBoard.addMove('x', randomMove)
                const cell = document.getElementById(randomMove).firstElementChild
                actionAfterMove(cell, randomMove)
                addUserMove()
            }
        } else {
            addUserMove()
        }
    }
    function addUserMove() {
        if (isEndGame === true) return
        const availableMove = gameBoard.getAvailableMoves()
        cells.forEach((cell, index) => {
            if (availableMove.includes(index)) {
                cell.onclick = () => cellOnclickAction(cell, index)
            }
        })
    }
    function cellOnclickAction(cell, index) {
        cells.forEach(cell => cell.onclick = '')
        actionAfterMove(cell.firstElementChild, index)
        if (isPlayVsCPU) {
            setTimeoutFunction(getCPUmove, 1000)
            return
        }
        addUserMove()
    }

    function actionAfterMove(cell, index) {
        const cellText = cell
        cellText.textContent = currentPlayer
        cellText.classList.add(currentPlayer)
        gameBoard.addMove(currentPlayer, index)
        if (gameBoard.isWin()) {
            isEndGame = true
            const win = gameBoard.isWin()
            if (win.winner !== 'draw') {
                showWinnerLine(win.winLine)
            }
            setTimeoutFunction(() => showAnnounceEndRound(win.winner), 1000)
            return
        }
        currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    }
    function getCPUmove() {
        let CPUmove = getBestMove()
        CPUmove.minimax(gameBoard, 0, currentPlayer, bestMove => {
            const cell = document.getElementById(bestMove).firstElementChild
            actionAfterMove(cell, bestMove)
        })
        addUserMove()
    }

    function renderDisplayScore() {
        const template = document.getElementById('displayScore').innerHTML
        const html = ejs.render(template, { players: getPlayersToDisplay })
        document.querySelector('.displayScore').innerHTML = html
    }
    function showWinnerLine(winnerLine) {
        winnerLine.forEach(index => {
            cells[index].classList.add('win')
        })
    }
    function showAnnounceEndRound(winner) {
        toggleDisplay('hidden', announceEndRound)
        if (winner === 'draw') {
            announceEndRound.querySelector('.userResult').innerHTML =
                `<h4 class="announce-userResult">tie</h4>`;
            tieData.addScore()
            updateScoreBoard()
        } else if (winner === userData.getMark()) {
            creatTextContentWinnerResult(userData, 'won')
            userData.addScore()
        } else {
            creatTextContentWinnerResult(player2Data, 'lose')
            player2Data.addScore()
        }
        updateScoreBoard()
        announceEndRound.querySelector('.actionQuit').onclick = () => {
            toggleDisplay('hidden', announceEndRound)
            btnRestart.textContent = 'New Game'
        }
        announceEndRound.querySelector('.actionNextRound').onclick = () => {
            toggleDisplay('hidden', announceEndRound)
            isEndGame = false
            resetGameBoardAndMainGame()
        }
    }
    function updateScoreBoard() {
        document.querySelectorAll('.score').forEach((item, index) => {
            item.textContent = getPlayersToDisplay[index].getScore()
        })
    }
    function creatTextContentWinnerResult(player, result) {
        announceEndRound.querySelector('.userResult').innerHTML =
            `<h4 class="announce-userResult">you ${result}!</h4>
        <div class="announce-winner">
            <span class="winSymbol ${player.getMark()}">${player.getMark()}</span>
            <p class="announce-text">take the round</p>
        </div>`;
    }
    document.querySelector('.buttonRestart').firstElementChild.addEventListener('click', displayAnnounceRestart)

    function displayAnnounceRestart() {
        if (btnRestart.textContent === 'New Game') {
            announceRestart.querySelector('.announce-restart-text').textContent = 'New game?'
            announceRestart.querySelector('.btnRestartRound').textContent = 'new game'
        }
        toggleDisplay('hidden', announceRestart)

        announceRestart.querySelector('.btnRestartQuit').onclick = () => {
            toggleDisplay('hidden', announceRestart)
        }
        announceRestart.querySelector('.btnRestartRound').onclick = () => {
            if (btnRestart.textContent === 'New Game') {
                btnRestart.innerHTML = '<span class="material-symbols-outlined">restart_alt</span></button>'
                announceRestart.querySelector('.announce-restart-text').textContent = 'restart game?'
                announceRestart.querySelector('.btnRestartRound').textContent = 'restart'
            }
            toggleDisplay('hidden', announceRestart)
            isEndGame = false
            resetGameBoardAndMainGame()
        }

    }
    function resetGameBoardAndMainGame() {
        cells.forEach((cell, index) => {
            gameBoard.clearMove(index)
            if (cell.classList.contains('win')) {
                cell.classList.remove('win')
            }
            const cellText = cell.firstElementChild
            cellText.textContent = ''
            symbol.forEach(item => {
                if (cellText.classList.contains(item)) {
                    cellText.classList.remove(item)
                }
            })
        })
        currentPlayer = 'x'
        startGame()
    }

})()
