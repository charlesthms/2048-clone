const GRID_SIZE = 4;
const CELL_SIZE = 13;
const CELL_GAP = 1.8;

export default class Grid {
    #cells;
    #score;

    constructor(grid){
        grid.style.setProperty("--grid-size", GRID_SIZE);
        grid.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
        grid.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);

        this.#cells = createCells(grid).map((cell, i) => {
            return new Cell(
                cell, 
                i % GRID_SIZE, 
                Math.floor(i / GRID_SIZE)
            );
        });

        this.#score = 0;
    }

    get cells(){
        return this.#cells;
    }

    get score(){
        return this.#score;
    }

    set score(val){
        this.#score = val;
    }

    get cellsByColumn(){
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || [];
            cellGrid[cell.x][cell.y] = cell;
            return cellGrid;
        }, []);
    }

    get cellsByRow(){
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || [];
            cellGrid[cell.y][cell.x] = cell;
            return cellGrid;
        }, []);
    }

    get #emptyCells(){
        return this.#cells.filter(cell => cell.tile == null);
    }

    randomEmptyCell(){
        const index = Math.floor(Math.random() * this.#emptyCells.length);
        return this.#emptyCells[index];
    }
}

class Cell{
    #x;
    #y;
    #tile;
    #mergeTile;

    constructor(cell, x, y){
        this.cell = cell;
        this.#x = x;
        this.#y = y;
    }

    get x(){
        return this.#x;
    }

    get y(){
        return this.#y;
    }

    get tile(){
        return this.#tile;
    }

    set tile(tile){
        this.#tile = tile;

        if(tile == null) return;

        this.#tile.x = this.#x;
        this.#tile.y = this.#y;
    }

    get mergeTile(){
        return this.#mergeTile;
    }

    set mergeTile(value){
        this.#mergeTile = value;
        if(value == null) return;
        this.#mergeTile.x = this.#x;
        this.#mergeTile.y = this.#y;
    }

    canAccept(tile){
        return (
            this.tile == null || 
            (this.mergeTile == null && this.tile.value === tile.value)
        );
    }

    mergeTiles(grid){
        if(this.tile == null || this.mergeTile == null) return;

        this.tile.value += this.mergeTile.value;
        grid.score += 2*this.mergeTile.value;

        this.mergeTile.remove();
        this.mergeTile = null;
    }
}


function createCells(grid) {
    const cells = [];

    for (let i = 0; i < GRID_SIZE ** 2; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cells.push(cell); 
        grid.append(cell);
    }

    return cells;
}