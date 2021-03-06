import './index.css'
import { CANVAS_BACKGROUND_COLOR, CANVAS_BORDER_COLOUR, SNAKE_BODY_COLOR, SNAKE_BODY_LINE_COLOR, FOOD_COLOR, FOOD_BORDER_COLOR, LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY,GAME_SPEED } from './constants'

const gameCavans = document.getElementById('gameCanvas')
const controlBtns = document.querySelector('.game-control-container')

const W = gameCavans.width
const H = gameCavans.height

const ctx = gameCavans.getContext('2d')
let dx = 10
let dy = 0
let changingDirection = false
let foodX = 0
let foodY = 0
let score = 0

let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 }
]

const randomTen = function (min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10
}

const createFood = function () {
  foodX = randomTen(0, W - 10)
  foodY = randomTen(0, H - 10)

  snake.forEach((part) => {
    const foodIsOnSnake = part.x === foodX && part.y === foodY
    if (foodIsOnSnake) createFood()
  })
}

const didGameEnd = function () {
  for (let i = 4; i < snake.length; i++) {
    const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y
    if (didCollide) return true
  }

  const hitLeftWall = snake[0].x < 0
  const hitRightWall = snake[0].x > W - 10
  const hitTopWall = snake[0].y < 0
  const hitBottomWall = snake[0].y > H - 10

  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}

const drawFood = function () {
  ctx.fillStyle = FOOD_COLOR
  ctx.strokeStyle = FOOD_BORDER_COLOR
  ctx.fillRect(foodX, foodY, 10, 10)
  ctx.strokeRect(foodX, foodY, 10, 10)
}

const changeDirection = function (event) {
  const keyPressed = event.keyCode
  const goingUp = dy === -10
  const goingDown = dy === 10
  const goingRight = dx === 10
  const goingLeft = dx === -10
  if (changingDirection) return
  changingDirection = true

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10
    dy = 0
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0
    dy = -10
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10
    dy = 0
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0
    dy = 10
  }
}

const initCanvas = function () {
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = CANVAS_BACKGROUND_COLOR
  ctx.strokeStyle = CANVAS_BORDER_COLOUR
  ctx.fillRect(0, 0, W, H)
  ctx.strokeRect(0, 0, W, H)
}

const advanceSnake = function (snake) {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy }
  snake.unshift(head)

  const didEatFood = snake[0].x === foodX && snake[0].y === foodY
  if (didEatFood) {
    score += 10
    document.getElementById('score').innerHTML = score
    createFood()
  } else {
    snake.pop()
  }
}

const drawSnakePart = function (snakePark) {
  const { x, y } = snakePark
  ctx.fillStyle = SNAKE_BODY_COLOR
  ctx.strokeStyle = SNAKE_BODY_LINE_COLOR
  ctx.fillRect(x, y, 10, 10)
  ctx.strokeRect(x, y, 10, 10)
}
const drawSnake = function () {
  snake.forEach(drawSnakePart)
}

let timer = null
const start = function () {
  if (didGameEnd()) {
    document.querySelector('.welcome').innerHTML = 'Game Over'
    return
  }
  timer = setTimeout(() => {
    changingDirection = false
    initCanvas()
    drawFood()
    advanceSnake(snake)
    drawSnake()
    start()
  }, GAME_SPEED)

}

controlBtns.addEventListener('click', (e) => {
  if (e.target.dataset.keyCode) {
    const event = {
      keyCode: parseInt(e.target.dataset.keyCode, 10)
    }
    changeDirection(event)
  }
  e.preventDefault()
})

document.body.addEventListener('touchstart', function () { });
document.addEventListener('keydown', changeDirection)
document.getElementById('restart').addEventListener('click', () => {
  console.log('restart')
  window.location.reload()
}, false)
createFood()
start()