const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector(".start-game");
const Gameovermodal = document.querySelector(".game-over");
const restartButton = document.querySelector('.btn-restart');
const HighScoreelements = document.querySelector('#highscore');
const scoreElements = document.querySelector("#score");
const timeElements = document.querySelector("#Time");

const blockwidth = 50;
const blockheight = 50;


let highscore = localStorage.getItem("highscore") || 0
let score = 0
let time = `00-00`


scoreElements.innerText = score
timeElements.innerText = time
HighScoreelements.innerText = highscore

// Calculate columns and rows based on board dimensions
const cols = Math.floor(board.clientWidth / blockwidth);
const rows = Math.floor(board.clientHeight / blockheight);

const blocks = [];
let snakes = [{ x: 1, y: 3 }];
let direction = "right";
let intervalId = null;
let timerintervalId = null;
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }



for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);

        blocks[`${row}${col}`] = block;
    }
}

function render() {

    blocks[`${food.x}${food.y}`].classList.add("food");


    let head = null;
    if (direction === "left") {
        head = { x: snakes[0].x, y: snakes[0].y - 1 }
    }
    else if (direction === "right") {
        head = { x: snakes[0].x, y: snakes[0].y + 1 }
    }

    else if (direction === "down") {
        head = { x: snakes[0].x + 1, y: snakes[0].y }
    }

    else if (direction === "up") {
        head = { x: snakes[0].x - 1, y: snakes[0].y }
    }


    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        modal.style.display = "flex";
        startGameModal.style.display = 'none';

        Gameovermodal.style.display = "flex";


        return;
    }
    for (let i = 0; i < snakes.length; i++) {
        if (snakes[i].x === head.x && snakes[i].y === head.y) {
            clearInterval(intervalId);
            clearInterval(timerintervalId);
            modal.style.display = "flex";
            startGameModal.style.display = 'none';
            Gameovermodal.style.display = "flex";
            return; // Stop the function here
        }
    }
    //food consume logic
    if (food.x == head.x && food.y == head.y) {
        blocks[`${food.x}${food.y}`].classList.remove("food");
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        blocks[`${food.x}${food.y}`].classList.add("food");

        snakes.unshift(head);

        score += 10
        scoreElements.innerText = score;

        if (score > highscore) {
            highscore = score
            localStorage.setItem("high score", highscore.toString())
        }


    }




    snakes.forEach(snakeBlock => {
        blocks[`${snakeBlock.x}${snakeBlock.y}`].classList.remove('fill');
    })

    snakes.unshift(head);
    snakes.pop();


    snakes.forEach(snakeBlock => {
        blocks[`${snakeBlock.x}${snakeBlock.y}`].classList.add('fill');
    })
}

startButton.addEventListener("click", () => {
    modal.style.display = 'none';
    intervalId = setInterval(() => {
        render();
    }
        , 300);



    timerintervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number)

        if (sec == 59) {
            min += 1
            sec = 0
        }
        else {
            sec += 1
        }
        time = `${min}-${sec}`
        timeElements.innerText = time
    }, 1000);



})

restartButton.addEventListener("click", restartGame)

function restartGame() {

    blocks[`${food.x}${food.y}`].classList.remove("food");
    snakes.forEach(snakeBlock => {
        blocks[`${snakeBlock.x}${snakeBlock.y}`].classList.remove('fill');
    })

    score = 0
    time = `00-00`
    modal.style.display = "none"
    snakes = [{ x: 1, y: 3 }]
    direction = "down"
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
    intervalId = setInterval(() => {
        render();
    }
        , 400);

}



addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        direction = "up";
    }
    else if (event.key === "ArrowDown") {
        direction = "down";
    }
    else if (event.key === "ArrowRight") {
        direction = "right";
    }
    else if (event.key === "ArrowLeft") {
        direction = "left";
    }
})
