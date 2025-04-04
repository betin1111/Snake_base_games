const canvas = document.getElementById('meuCanvas');
const ctx = canvas.getContext('2d');

const audio = new Audio('./assets/audio.mp3');

const h1 = document.querySelector('h1');
const size = 30;

let dx = Math.floor(canvas.width - size) / 2;
let dy = Math.floor(canvas.height - size) / 2;

let direction, loopId;

//array de objetos que representa a cobra
const snake = [
    { x: dx, y: dy },
]

const randomNumber = (min, max) => {
    return Math.round((Math.random() * (max - min) + min));
}
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size) / 2;
    const number2 = randomNumber(0, canvas.height - size) / 2;
    return Math.round(number / 30) * 30, Math.round(number2 / 30) * 30;
}
const randomColor = () => {
    const red = randomNumber(0, 256);
    const green = randomNumber(0, 256);
    const blue = randomNumber(0, 256);

    return `rgb(${red}, ${green}, ${blue})`;
}
const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
};

h1.innerText = randomColor();

const drawFood = ({ x, y, color }) => {

    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
}

function draw() {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'orange';
    snake.slice(0, -1)
    snake.forEach(({ x, y }) => {
        ctx.fillRect(x, y, size, size);

    });
    // Desenha a cabeça
    const head = snake.at(-1);
    ctx.fillStyle = '#d3d3d3';
    ctx.fillRect(head.x, head.y, size, size);
    ctx.strokeRect(head.x, head.y, size, size);

}

const moveSnake = () => {
    if (!direction) return;

    const head = snake.at(-1);

    //remove primeiro elemento do array uqe é o ultimo da cobra
    snake.shift();

    if (direction === "right") {
        snake.push({ x: head.x + size, y: head.y });
    }

    if (direction === "left") {
        snake.push({ x: head.x - size, y: head.y });
    }

    if (direction === "down") {
        snake.push({ x: head.x, y: head.y + size });
    }

    if (direction === "up") {
        snake.push({ x: head.x, y: head.y - size })
    }
}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);// Move o "lápis" para (100,100) sem desenhar
        ctx.lineTo(i, canvas.height);// Desenha uma linha até (200,200)
        ctx.stroke();// Renderiza a linha

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

const checkEat = () => {
    const head = snake.at(-1);

    if (head.x === food.x && head.y === food.y) {
        snake.push(head);
        audio.play();

        let x = randomPosition();
        let y = randomPosition();

        while (snake.find((position) => position.x === x && position.y === y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();
        h1.innerText = food.color;
    }
}

const gameLoop = () => {
    clearInterval(loopId); //limpar o intervalo anterior antes de criar um novo
    ctx.clearRect(0, 0, canvas.width, canvas.height) //limpar o canva

    moveSnake()
    drawGrid()
    drawFood(food)
    draw()
    checkEat()
    loopId = setTimeout(() => {
        gameLoop() //chama a função novamente para criar animação suave
    }, 200)
}
gameLoop();

//usando destruturação para pegar apenas a propriedade key do objeto event.
document.addEventListener("keydown", ({ key }) => {
    setTimeout(() => {
        if (key === "ArrowRight" && direction !== "left") {
            direction = "right"
        }

        if (key === "ArrowLeft" && direction !== "right") {
            direction = "left";
        }

        if (key === "ArrowDown" && direction !== "up") {
            direction = "down";
        }

        if (key === "ArrowUp" && direction !== "down") {
            direction = "up";
        }
    }, 50);
})
