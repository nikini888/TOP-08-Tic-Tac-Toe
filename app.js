import GameBoardFactory from './modules/gameBoard.js';
import PlayerFactory from './modules/players.js';
import getBestMove from './modules/minimax.js';
import setTimeoutFunction from './modules/promise.js';
(function () {
    const prepareGame = document.querySelector('.prepareGame')
    const boardDisplay = document.querySelector('.boardDisplay')
    const mainGame = document.querySelector('.mainGame')
    const announceEndRound = document.querySelector('.endRound')
    const announceWhoTurnFirst = document.querySelector('.whoTurn')
    const announceRestart = document.querySelector('.restart')
    const inputPlayer2Name = document.getElementById('player2_name')
    const btnVsCPU = document.querySelector(".vsCPU")
    const btnVsPlayer2 = document.querySelector(".vsPlayer2")
    const btnRestart = document.querySelector('.btnRestart')
    const logo = document.querySelector('.logo')
    let showUserInfos, showPlayer2Infos;
    const symbol = ['x', 'o']
    let userData, player2Data, tieData;
    let gameLevel;
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
    function reSetWhoTurn() {
        [...arguments].forEach(el => {
            if (el.classList.contains('onTurn')) {
                el.classList.remove('onTurn')
            }
        })
    }
    function showWhoTurn(UserInfos, Player2Infos) {
        if (userData.getMark() === 'x') {
            UserInfos.classList.add('onTurn')
        } else {
            Player2Infos.classList.add('onTurn')
        }
    }
    document.getElementById('form').addEventListener('submit', (e) => {
        e.preventDefault()
        getPlayersInf()
        toggleDisplay('hidden', prepareGame, boardDisplay, mainGame, announceWhoTurnFirst)
        renderStartGame()
    })

    function getPlayersInf() {
        userData = PlayerFactory(getUserInf())
        player2Data = PlayerFactory(getPlayer2Inf())
        tieData = PlayerFactory({ name: 'tie' })

        gameLevel = isPlayVsCPU === true ? getGameLevelInput() : -1
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

    btnVsPlayer2.onclick = (e) => {
        choiceGameType(e.target)
    }
    console.dir(btnVsPlayer2)
    function switchGameTypeButton(el) {
        el.onclick = ''
    }
    function choiceGameType(el) {
        const divGetPlayer2Inf = document.querySelector(".player2Infor-Name")
        const divGetGameLevel = document.querySelector('.gameLevel')

        isPlayVsCPU = !isPlayVsCPU
        inputPlayer2Name.disabled = !inputPlayer2Name.disabled;
        toggleDisplay('hidden', divGetPlayer2Inf)
        toggleDisplay('hidden', divGetGameLevel)
        toggleDisplay('nonactive', btnVsCPU, btnVsPlayer2)
        const switchCase = el === btnVsPlayer2 ? btnVsCPU : btnVsPlayer2
        switchCase.onclick = (el) => {
            choiceGameType(el.target)
        }
        switchGameTypeButton(el)
    }
    function getGameLevelInput() {
        let level = 0;
        document.querySelectorAll("[id^='level']").forEach(input => {
            const { value, checked } = input;
            if (checked) {
                level = value
            }
        })
        return level
    }

    function renderStartGame() {
        changeSizeLogo()
        addActionResetOnLogo()
        renderDisplayDashBoard()
        gameBoard.renderDisplayBoardGame()
        cells = document.querySelectorAll('.cell')
        renderDisplayScore()
        renderDisplayWhoTurnFirst()
        startGame()
    }
    function renderDisplayDashBoard() {
        const template = document.getElementById('templatePlayers').innerHTML
        const html = ejs.render(template, { players: [userData, player2Data] })
        document.getElementById('dashBoard').innerHTML = html
        showUserInfos = document.getElementById('userInfos')
        showPlayer2Infos = document.getElementById('player2Infos')
        showWhoTurn(showUserInfos, showPlayer2Infos)
    }
    function changeSizeLogo() {
        logo.classList.add('small-logo')
    }
    function addActionResetOnLogo() {
        logo.onclick = () => {
            showResetGame()
        }
    }
    function startGame() {
        if (isPlayVsCPU) {
            if (userData.getMark() === 'x') {
                addUserMove()
            } else {
                setTimeoutFunction(getRandomMoveCUPGoFirst, 1000)
                addUserMove()
            }
        } else {
            addUserMove()
        }
    }
    function getRandomMoveCUPGoFirst() {
        const index = [0, 2, 4, 6, 8]
        //chose random index to CPU play
        const randomMove = Math.floor(Math.random() * index.length)
        gameBoard.addMove('x', randomMove)
        const cell = document.getElementById(randomMove).firstElementChild
        actionAfterMove(cell, randomMove)
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
        toggleDisplay('onTurn', showUserInfos, showPlayer2Infos)
    }
    function getCPUmove() {
        let CPUmove = getBestMove(gameLevel)
        console.log(gameLevel)
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
    function renderDisplayWhoTurnFirst() {
        const template = document.getElementById('showWhoTurnFirst').innerHTML
        const playerFirst = { mark: 'x' }
        playerFirst.name = userData.getMark() === 'x' ? userData.getName() : player2Data.getName()
        const html = ejs.render(template, { player: playerFirst })
        document.querySelector('.whoTurn').innerHTML = html
        setTimeoutFunction(() => { toggleDisplay('hidden', announceWhoTurnFirst) }, 2000)
    }
    function showWhoTurnFirst() {
        toggleDisplay('hidden', announceWhoTurnFirst)
        setTimeoutFunction(() => { toggleDisplay('hidden', announceWhoTurnFirst) }, 2000)
    }
    function showResetGame() {
        const announceReset = document.querySelector('.reset')
        toggleDisplay('hidden', announceReset)
        announceReset.querySelector('.btnResetQuit').onclick = () => {
            toggleDisplay('hidden', announceReset)
        }
        announceReset.querySelector('.btnReset').onclick = () => {
            location.reload()
            toggleDisplay('hidden', announceReset)
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
            isEndGame = false
            resetGameBoardAndMainGame()
            return
        }
        toggleDisplay('hidden', announceRestart)

        announceRestart.querySelector('.btnRestartQuit').onclick = () => {
            toggleDisplay('hidden', announceRestart)
        }
        announceRestart.querySelector('.btnRestartRound').onclick = () => {
            toggleDisplay('hidden', announceRestart)
            isEndGame = false
            resetGameBoardAndMainGame()
        }

    }
    function clearCellsAndGameBoard() {
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
    }
    function resetGameBoardAndMainGame() {
        clearCellsAndGameBoard()
        if (btnRestart.textContent === 'New Game') {
            btnRestart.innerHTML = '<span class="material-symbols-outlined">restart_alt</span></button>'
        }
        currentPlayer = 'x'
        reSetWhoTurn(showUserInfos, showPlayer2Infos)
        showWhoTurn(showUserInfos, showPlayer2Infos)
        showWhoTurnFirst()
        startGame()
    }

})()
