export default class Tile {
    #tileElement;
    #x;
    #y;
    #value;

    constructor(container, value = Math.random() > .5 ? 2 : 4){
        this.#tileElement = document.createElement("div");
        this.#tileElement.classList.add("tile");
        container.append(this.#tileElement);
        this.value = value;
    }

    get value(){
        return this.#value;
    }

    set value(val){
        this.#value = val;
        this.#tileElement.textContent = val;
        this.#tileElement.style.setProperty('background', this.pickColor(val));

        if(val >= 8) {
            this.#tileElement.style.setProperty('color', '#f9f6f2');
        }
    }

    set x(val){
        this.#x = val;
        this.#tileElement.style.setProperty("--x", val);
    }

    set y(val){
        this.#y = val;
        this.#tileElement.style.setProperty("--y", val);
    }

    remove(){
        this.#tileElement.remove();
    }

    waitForTransition(animatinon = false){
        return new Promise(resolve => {
            this.#tileElement.addEventListener(animatinon ? "animationend" : "transitionend", resolve, {once: true});
        })
    }

    pickColor(value) { 
        let color;        
        switch (value) {
            case 2:
                color = '#eee4da';
                break;
            case 4:
                color = '#ede0c8';
                break;
            case 8:
                color = '#f2b179';
                break;
            case 16:
                color = '#f59563';
                break;
            case 32:
                color = '#f67c5f';
                break;
            case 64:
                color = '#f67c5f';
                break;
            case 128:
                color = '#edcf72';
            case 256:
                color = '#edcc61';
                break;
            case 512:
                color = '#edc850';
                break;
            case 1024:
                color = '#edc53f';
                break;
            case 2048:
                color = '#edc22e';
                break;
            default:
                color = '#ff4800'
            }
        return color;
    }
}