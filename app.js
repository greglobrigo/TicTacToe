const X_CLASS = "x"
const CIRCLE_CLASS = "circle"
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const restartButton = document.getElementById('restartButton')
const playerTurn = document.querySelector('.turn-x-y')
const playerTurnContainer = document.querySelector('.player-turn')
const viewHistory = document.querySelector('.view-history')
const arrows = document.querySelector('.arrows')
const playAgain = document.querySelector('.start-again')
const elementsArray = [...cellElements]
let circleTurn

let move = ['', '', '', '', '', '', '', '', '']
let index = []
let savedIndex = []
let savedMoves = []
let savedMovesCopy = []


playAgain.addEventListener('click', clickPlayAgain)

function clickPlayAgain() {
    arrows.style.display = "none"
    main.style.display = "none"
    selectTurnPlayer()
    resetValues()
    cellElements.forEach(element => {
        element.classList.remove('nohover')
    })
    clickSoundFx()
}

function resetValues() {
    move = ['', '', '', '', '', '', '', '', '']
    index = []
    savedIndex = []
    savedMoves = []
    savedMovesCopy = []
}


viewHistory.addEventListener('click', clickViewHistory)

function clickViewHistory() {
    previousBtn.style.visibility = "visible"
    nextBtn.style.visibility = "hidden"


    cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick)
    })
    elementsArray.forEach(element => {
        if (element.classList.contains('x') || element.classList.contains('circle')) {} else {
            element.classList.add('nohover')
        }
    })
    board.classList.remove('x', 'circle')
    winningMessageElement.classList.remove('show')
    arrows.style.display = "block"
    clickSoundFx()
}

const previousBtn = document.querySelector('.left')
previousBtn.addEventListener('click', handlePreviousButton)

function handlePreviousButton() {
    if (savedMoves.length == 1) {
        previousBtn.style.visibility = "hidden"
    } else if (savedMoves.length == 0) {
        return false;
    }
    let elementToPop = index[index.length - 1]

    for (let i = savedMoves.length - 1; i > -1; i--) {
        for (let j = 9; j >= 0; j--) {
            if (savedMoves[i][j] == "x", "circle") {
                elementsArray[elementToPop].classList.remove('x', 'circle')
            }
        }
    }
    index.pop()
    savedMoves.pop()
    placeSoundFx()
    if (savedMoves.length < savedMovesCopy.length) {
        nextBtn.style.visibility = "visible"
    }
}

const nextBtn = document.querySelector('.right')
nextBtn.addEventListener('click', handleNextButton)

function handleNextButton() {
    if (savedMovesCopy.length == savedMoves.length) {
        return false
    }
    index.push(savedIndex[index.length])
    let elementToAdd = index[index.length - 1]
    savedMoves.push(savedMovesCopy[savedMoves.length])

    if (savedMoves.length >= 1) {
        previousBtn.style.visibility = "visible"
    }
    if (savedMovesCopy.length == savedMoves.length) {
        nextBtn.style.visibility = "hidden"
    }

    if (savedMoves[savedMoves.length - 1].includes("x")) {
        elementsArray[elementToAdd].classList.add('x')
    } else if (savedMoves[savedMoves.length - 1].includes("circle")) {
        elementsArray[elementToAdd].classList.add('circle')
    }
    placeSoundFx()
}

function trackMove(e) {
    const idx = elementsArray.indexOf(e.target)
    const elementClass = e.target.classList[1]
    move[idx] = elementClass
    index.push(idx)
    savedIndex.push(idx)
    savedMoves.push(move)
    savedMovesCopy.push(move)
    move = ['', '', '', '', '', '', '', '', '', ]
}

restartButton.addEventListener('click', () => {
    clickSoundFx()
    main.style.display = "none"
    selectTurnPlayer()
    resetValues()
})

function startGame(firstTurn) {
    circleTurn = firstTurn
    if (circleTurn) {
        playerTurn.innerText = "O"
    } else {
        playerTurn.innerText = "X"
    }
    playerTurnContainer.style.display = "block"
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, {
            once: true
        })
    })
    setBoardHoverClass()
    winningMessageElement.classList.remove('show')
}

const xWinCounter = document.querySelector('.x-wins-counter')
const circleWinCounter = document.querySelector('.o-wins-counter')
const drawCounter = document.querySelector('.draw-counter')

function handleClick(e) {
    placeSoundFx()
    const cell = e.target

    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
    placeMark(cell, currentClass)
    trackMove(e)

    if (checkWin(currentClass)) {
        endGame(false)
    } else if (isDraw()) {
        endGame(true)
    } else {
        swapTurns()
        setBoardHoverClass()
    }
}
let drawCount = 0;
let xCount = 0;
let oCount = 0;

function endGame(draw) {
    if (draw) {
        drawSoundFx()
        winningMessageTextElement.innerText = "Draw! "
        drawCount++
        if (drawCounter.innerHTML == "0") {
            drawCounter.innerHTML = ` ${drawCount}`
        } else if (drawCounter.innerHTML) {
            drawCounter.innerHTML = ` ${drawCount}`
        }
    } else {
        winSoundFx()
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins! `
        if (circleTurn) {
            oCount++
            if (circleWinCounter.innerHTML == "0") {
                circleWinCounter.innerHTML = ` ${oCount}`
            } else if (circleWinCounter.innerHTML) {
                circleWinCounter.innerHTML = ` ${oCount}`
            }
        }
        if (!circleTurn) {
            xCount++
            if (xWinCounter.innerHTML == "0") {
                xWinCounter.innerHTML = ` ${xCount}`
            } else if (xWinCounter.innerHTML) {
                xWinCounter.innerHTML = ` ${xCount}`
            }
        }
    }
    winningMessageElement.classList.add('show')
    playerTurnContainer.style.display = "none"
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
}

function swapTurns() {
    circleTurn = !circleTurn
    if (circleTurn) {
        playerTurn.innerText = "O"
    } else {
        playerTurn.innerText = "X"
    }
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS)
    } else {
        board.classList.add(X_CLASS)
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

const StartBtn = document.querySelector('.start-game')
const modal = document.querySelector('.modal')
const turnPlayerSelect = document.querySelector('.turnplayer')
const main = document.querySelector('main')

StartBtn.addEventListener('click', () => {
    bgSoundFx()
    if(bgmIcon.classList.contains('fa-volume-mute')){
        gameBg.volume = 0
    }
    clickSoundFx()
    selectTurnPlayer()
})

function selectTurnPlayer() {
    if (modal.style.display = "block") {
        modal.style.display = "none"
    }
    turnPlayerSelect.style.display = "block"
    firstTurnPlayer()
}

function firstTurnPlayer() {
    const xFirst = document.querySelector('.x-option')
    const oFirst = document.querySelector('.o-option')
    xFirst.addEventListener('click', () => {
        clickSoundFx()
        turnPlayerSelect.style.display = "none"
        main.style.display = "block"
        startGame(false)
    })
    oFirst.addEventListener('click', () => {
        clickSoundFx()
        turnPlayerSelect.style.display = "none"
        main.style.display = "block"
        startGame(true)
    })
}

// DOM selectors
const stars = document.getElementById('stars');
const starsCtx = stars.getContext('2d');

// global variables
let screen, starsElements, starsParams = {
    speed: 2,
    number: 300,
    extinction: 4
};

// run stars
setupStars();
updateStars();

// handle slider

// update stars on resize to keep them centered
window.onresize = function () {
    setupStars();
};

// star constructor
function Star() {
    this.x = Math.random() * stars.width;
    this.y = Math.random() * stars.height;
    this.z = Math.random() * stars.width;

    this.move = function () {
        this.z -= starsParams.speed;
        if (this.z <= 0) {
            this.z = stars.width;
        }
    };

    this.show = function () {
        let x, y, rad, opacity;
        x = (this.x - screen.c[0]) * (stars.width / this.z);
        x = x + screen.c[0];
        y = (this.y - screen.c[1]) * (stars.width / this.z);
        y = y + screen.c[1];
        rad = stars.width / this.z;
        opacity = (rad > starsParams.extinction) ? 1.5 * (2 - rad / starsParams.extinction) : 1;

        starsCtx.beginPath();
        starsCtx.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
        starsCtx.arc(x, y, rad, 0, Math.PI * 2);
        starsCtx.fill();
    }
}

// setup <canvas>, create all the starts
function setupStars() {
    screen = {
        w: window.innerWidth,
        h: window.innerHeight,
        c: [window.innerWidth * 0.5, window.innerHeight * 0.5]
    };
    window.cancelAnimationFrame(updateStars);
    stars.width = screen.w;
    stars.height = screen.h;
    starsElements = [];
    for (let i = 0; i < starsParams.number; i++) {
        starsElements[i] = new Star();
    }
}

// redraw the frame
function updateStars() {
    starsCtx.fillStyle = "black";
    starsCtx.fillRect(0, 0, stars.width, stars.height);
    starsElements.forEach(function (s) {
        s.show();
        s.move();
    });
    window.requestAnimationFrame(updateStars);
}

//sound
const clickSound = new Audio("sounds/click.wav")
const gameBg = new Audio("sounds/gamebg.mp3")
const placeSound = new Audio("sounds/place.wav")
const win = new Audio("sounds/win.wav")
const drawSound = new Audio("sounds/draw.wav")
drawSound.volume = 0.5;

function bgSoundFx() {
    gameBg.volume = 0.2;
    gameBg.loop = true;
    gameBg.play()
}

function clickSoundFx() {
    clickSound.play()
    clickSound.currentTime = 0;
}

function placeSoundFx() {
    placeSound.play()
    placeSound.currentTime = 0;
}

function drawSoundFx() {
    drawSound.play()
    drawSound.currentTime = 0;
}

function winSoundFx() {
    win.play()
    win.currentTime = 0;
}

const bgmIcon = document.querySelector('.bgm')
const bgmControl = document.querySelector('.background-music')
bgmControl.addEventListener('click', controlBGM)

function controlBGM() {
    bgmIcon.classList.toggle('fa-volume-up')
    bgmIcon.classList.toggle('fa-volume-mute')
    if (gameBg.volume) {
        gameBg.volume = 0;
    } else {
        gameBg.volume = 0.2
    }
}

const seIcon = document.querySelector('.se')
const seControl = document.querySelector('.sound-effect')
seControl.addEventListener('click', controlSoundEffect)

function controlSoundEffect() {
    seIcon.classList.toggle('fa-volume-up')
    seIcon.classList.toggle('fa-volume-mute')
    if (clickSound.volume, placeSound.volume, win.volume, drawSound.volume) {
        clickSound.volume = 0
        placeSound.volume = 0
        win.volume = 0
        drawSound.volume = 0
    } else {
        clickSound.volume = 1
        placeSound.volume = 1
        win.volume = 1
        drawSound.volume = 0.5
    }
}