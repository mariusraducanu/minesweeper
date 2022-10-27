const c = document.getElementById("game-board");
let ctx = c.getContext("2d");
const gameUnit = 40;
let matrix = [];
const bombImage = document.createElement("img");
bombImage.src = "https://banner2.cleanpng.com/20180423/lxe/kisspng-minesweeper-pro-classic-mines-puzzle-free-game-div-crystal-clear-5adddb13780780.6936924515244889794917.jpg";
const flagImage = document.createElement("img");
flagImage.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Minesweeper_flag.svg/1200px-Minesweeper_flag.svg.png";
let mouseX = 0;
let mouseY = 0;
let nrBombs = 0;
let nrFlags = 0;
let checkedSquares = 0;
let win = true;

c.addEventListener('click', checkCoordinates);
c.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    mouseCoordinates(event);
    for(let i = 0; i < matrix.length; ++i) {
        if (matrix[i].x === mouseX && matrix[i].y === mouseY && matrix[i].flag == false) {
            matrix[i].flag = true;
            ++nrFlags;
            ++checkedSquares;
            document.getElementById("flags").innerHTML = nrFlags;
            if(checkedSquares === 225) {
                checkWin();
            }
            ctx.drawImage(flagImage, mouseX, mouseY, gameUnit, gameUnit);
        } else if (matrix[i].x === mouseX && matrix[i].y === mouseY && matrix[i].flag == true) {
            matrix[i].flag = false;
            --nrFlags;
            --checkedSquares;
            document.getElementById("flags").innerHTML = nrFlags;
            ctx.clearRect(mouseX, mouseY, gameUnit, gameUnit);
            ctx.fillStyle = "rgb(91, 98, 97)";
            ctx.fillRect(matrix[i].x, matrix[i].y, gameUnit, gameUnit);
            ctx.strokeStyle = "black";
            ctx.strokeRect(matrix[i].x, matrix[i].y, gameUnit, gameUnit);
        }
    }
});

startGame();

function startGame() {
    drawGameBoard();
    generateSquares();
    generateBombs();
    generateNumbers();

}
function drawGameBoard() {
    for(let i = 0; i < 600; i += gameUnit) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();
        ctx.moveTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
}

function generateSquares() {
    for(let i = 0; i < 600; i += 40) {
        for(let j = 0; j < 600; j += 40) {
            let square = {x : j, y : i, bomb : false, number : 0, flag : false, isChecked : false};
            matrix.push(square);
            ctx.fillStyle = "blue";
            ctx.fillRect(i, j, gameUnit, gameUnit);
            ctx.strokeStyle = "black";
            ctx.strokeRect(i, j, gameUnit, gameUnit);
        }
    }
}

function generateBombs() {
    while(nrBombs < 15) {
        let bombX = Math.floor(Math.random() * 15) * 40;
        let bombY = Math.floor(Math.random() * 15) * 40;
        for(let j = 0; j < matrix.length; ++j) {
            if(matrix[j].x === bombX && matrix[j].y === bombY && matrix[j].bomb == false) {
                matrix[j].bomb = true;
                generateNumbers(j);
                ++nrBombs;
            }
        }
    }
}

function generateNumbers(squarePosition) {
    if(squarePosition - 15 >= 0 && matrix[squarePosition - 15].bomb != true) {
        matrix[squarePosition - 15].number += 1;
    }
    if(squarePosition - 14 >= 0 && matrix[squarePosition - 14].bomb != true && (squarePosition - 14) % 15 != 0) {
        matrix[squarePosition - 14].number += 1;
    }
    if(squarePosition + 1 < matrix.length && matrix[squarePosition + 1].bomb != true && (squarePosition + 1) % 15 != 0) {
        matrix[squarePosition + 1].number += 1;
    }
    if(squarePosition + 15 < matrix.length && matrix[squarePosition + 15].bomb != true) {
        matrix[squarePosition + 15].number += 1;
    }
    if(squarePosition + 16 < matrix.length && matrix[squarePosition + 16].bomb != true && (squarePosition + 16) % 15 != 0) {
        matrix[squarePosition + 16].number += 1;
    }
    if(squarePosition % 15 !== 0) {
        if(squarePosition - 16 >= 0 && matrix[squarePosition - 16].bomb != true) {
            matrix[squarePosition - 16].number += 1;
        }
        if(squarePosition - 1 >= 0 && matrix[squarePosition - 1].bomb != true) {
            matrix[squarePosition - 1].number += 1;
        }
        if(squarePosition + 14 < matrix.length && matrix[squarePosition + 14].bomb != true) {
            matrix[squarePosition + 14].number += 1;
        }
    }
}

function mouseCoordinates(event) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
    while(mouseX % gameUnit !== 0) {
        --mouseX;
    }
    while(mouseY % gameUnit !== 0) {
        --mouseY;
    }
}

function checkCoordinates(event) {
    mouseCoordinates(event);
    for(let i = 0; i < matrix.length; ++i) {
        if(matrix[i].x === mouseX && matrix[i].y === mouseY) {
            verifySquare(i);
            if(!matrix[i].isChecked) {
                matrix[i].isChecked = true;
                ++checkedSquares;
                 if(checkedSquares === 225) {
                    checkWin();
                }
            }
        }
    }
}

function drawNumbers(i) {
    ctx.fillStyle = "white";
    ctx.fillRect(matrix[i].x, matrix[i].y, gameUnit, gameUnit);
    if(matrix[i].number == 1) {
        ctx.fillStyle = "red";
    } else if(matrix[i].number == 2) {
        ctx.fillStyle = "blue";
    } else if(matrix[i].number == 3) {
        ctx.fillStyle = "green";
    } else if(matrix[i].number == 4) {
        ctx.fillStyle = "yellow";
    } else if(matrix[i].number == 5) {
        ctx.fillStyle = "purple";
    } else if(matrix[i].number == 6) {
        ctx.fillStyle = "pink";
    } else if(matrix[i].number == 7) {
        ctx.fillStyle = "brown";
    } else if(matrix[i].number == 8) {
        ctx.fillStyle = "black";
    }
    if(matrix[i].number != 0) {
        ctx.font = "bold 20px Arial";
        ctx.fillText(matrix[i].number, matrix[i].x + 14 , matrix[i].y + 25);
    }
}

function verifySquare(i) {
    if(!matrix[i].bomb && matrix[i].number === 0) {
        ctx.fillStyle = "white";
        ctx.fillRect(mouseX, mouseY, gameUnit, gameUnit);
        neighbors(i);
    }
    if(!matrix[i].bomb && matrix[i].number > 0) {
        drawNumbers(i);
    }
    if(matrix[i].bomb) {
        ctx.drawImage(bombImage, mouseX, mouseY, gameUnit, gameUnit);
        gameOver();
    }
}

function gameOver() {
    for(let i = 0; i < matrix.length; ++i) {
        if(matrix[i].bomb) {
            ctx.drawImage(bombImage, matrix[i].x, matrix[i].y, gameUnit, gameUnit);
        }
    }
    c.removeEventListener('click', checkCoordinates);
    document.getElementById("lose").innerHTML = "You lose!😔 Try again";
    clearInterval(myInterval);
}

function checkWin() {
    for(let i = 0; i < matrix.length; ++i) {
        if((matrix[i].bomb == true && matrix[i].flag != true) || (matrix[i].bomb == false && matrix[i].flag == true)) {
            win = false;
        }
    }
    if(win) {
        document.getElementById("winner").innerHTML = "You win! 😀";
        clearInterval(myInterval);
    } else {
        document.getElementById("lose").innerHTML = "You lose!😔 Try again";
        clearInterval(myInterval);
    }
}

function neighbors(i) {
    if(matrix[i].x === 0) {
        checkTiles(i - 14);
        checkTiles(i - 15);
        checkTiles(i + 1);
        checkTiles(i + 15);
        checkTiles(i + 16);
    } else if(matrix[i].x === 560) {
        checkTiles(i - 15);
        checkTiles(i - 16);
        checkTiles(i - 1);
        checkTiles(i + 14);
        checkTiles(i + 15);    
    } else if(matrix[i].y === 0) {
        checkTiles(i - 1);
        checkTiles(i + 1);
        checkTiles(i + 14);
        checkTiles(i + 15);
        checkTiles(i + 16);
    } else if(matrix[i].y === 560) {
        checkTiles(i + 1);
        checkTiles(i - 1);
        checkTiles(i - 14);
        checkTiles(i - 15);
        checkTiles(i - 16);
    } else {
        checkTiles(i - 1);
        checkTiles(i - 14);
        checkTiles(i - 15);
        checkTiles(i - 16);
        checkTiles(i + 1);
        checkTiles(i + 14);
        checkTiles(i + 15);
        checkTiles(i + 16);
    }
}

function checkTiles(index) {
    if(index < 0 || index > 224) {
        return;
    }
    if (matrix[index].isChecked == true) {
        return;
    }
    matrix[index].isChecked = true;
    ++checkedSquares;
    if(checkedSquares === 225) {
        checkWin();
    }
    if(matrix[index].number != 0) {
        drawNumbers(index);
    } else {
        ctx.fillStyle = "white";
        ctx.fillRect(matrix[index].x, matrix[index].y, gameUnit, gameUnit);
        neighbors(index);
    }
}

let sec = 0;
function pad ( val ) { return val > 9 ? val : "0" + val; }
const myInterval = setInterval( function(){
    document.getElementById("seconds").innerHTML=pad(++sec%60);
    document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10) + ":");
}, 1000);