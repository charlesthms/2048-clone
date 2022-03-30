import Grid from "./utils/Grid.js";
import Tile from "./utils/Tile.js";

let board;
let grid;
const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("bestScore");

function startNewGame(){
    board = document.getElementById("board");
    board.innerHTML = "";
    grid = new Grid(board);
    scoreEl.innerText = 0;
    bestScoreEl.innerText = localStorage.getItem("bestScore") || 0;

    grid.randomEmptyCell().tile = new Tile(board);
    grid.randomEmptyCell().tile = new Tile(board);
    listenInput();
}

startNewGame();

function listenInput(){
    window.addEventListener("keydown", handleInput, {once: true});
}

async function handleInput(e){
    switch (e.key) {
        case "ArrowUp":
            if(!canMoveUp()){
                console.log("can't move");
                listenInput();
                return;
            }
            await moveUp();
            break;
        case "ArrowDown":
            if(!canMoveDown()){
                listenInput();
                return;
            }
            await moveDown();
            break;
        case "ArrowRight":
            if(!canMoveRight()){
                listenInput();
                return;
            }
            await moveRight();
            break;
        case "ArrowLeft":
            if(!canMoveLeft()){
                listenInput();
                return;
            }
            await moveLeft();
            break;
        default:
            listenInput();
            return;
    }

    grid.cells.forEach(cell => {
        cell.mergeTiles(grid);
        scoreEl.innerHTML = grid.score;
    });

    const newTile = new Tile(board);
    grid.randomEmptyCell().tile = newTile;

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()){

        newTile.waitForTransition(true).then(() => {
            alert("perdu");
            if (localStorage.getItem("bestScore") <= grid.score) localStorage.setItem("bestScore", grid.score);
            startNewGame();
        })
    }

    listenInput();
}

function moveUp(){
    return slide(grid.cellsByColumn);
}

function moveDown(){
    return slide(grid.cellsByColumn.map( col => [...col].reverse()));
}

function moveLeft(){
    return slide(grid.cellsByRow);
}

function moveRight(){
    return slide(grid.cellsByRow.map(row => [...row].reverse()));
}

function slide(cells){
    Promise.all(
        cells.flatMap(line => {

            const promises = [];

            for (let i = 1; i < line.length; i++) {
    
                const cell = line[i];
                if (cell.tile == null) continue;
                let lastValideCell;
    
                for (let j = i - 1; j >= 0; j--) {
                    const targetCell = line[j];
    
                    if (!targetCell.canAccept(cell.tile)) break;
    
                    lastValideCell = targetCell;
                }
    
                if (lastValideCell != null) {
                    promises.push(cell.tile.waitForTransition())
                    if (lastValideCell.tile != null) {
                        lastValideCell.mergeTile = cell.tile;
                    } else {
                        lastValideCell.tile = cell.tile;
                    }
                    cell.tile = null;
                }
            }
            return promises;
        })
    );
}


function canMoveUp(){
    return canMove(grid.cellsByColumn);
}

function canMoveDown(){
    return canMove(grid.cellsByColumn.map( col => [...col].reverse()));
}

function canMoveLeft(){
    return canMove(grid.cellsByRow);
}

function canMoveRight(){
    return canMove(grid.cellsByRow.map(row => [...row].reverse()));
}

function canMove(cells) {
    return cells.some(line => {
        return line.some((cell, index) => {
            if(index === 0) return false;
            if(cell.tile == null) return false;

            const moveToCell = line[index - 1];
            return moveToCell.canAccept(cell.tile);
        });
    });
}