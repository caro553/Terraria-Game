export default class Controller {
    constructor() {
        this.left  = new ButtonInput();
        this.right = new ButtonInput();
        this.up    = new ButtonInput();
        this.next    = new ButtonInput();
        this.previous    = new ButtonInput();
        this.leftClick    = new ButtonInput();
        this.rightClick    = new ButtonInput();

        // this.handleKeyDownUp = (event) => { this.keyDownUp(event); };

    }

    keyDownUp(type, key_code) {
        var down = (type == "keydown") ? true : false;
        switch(key_code) {
            
            case 81: this.left.getInput(down);  break;
            case 32: this.up.getInput(down);    break;
            case 68: this.right.getInput(down); break;
            case 65: this.previous.getInput(down);    break;
            case 69: this.next.getInput(down);
            
            
        }
    }

    mouseDownUp(type,button) {
        var down = (type == "mousedown") ? true : false;
        if(button == 0) this.leftClick.getInput(down);
        if(button == 2) this.rightClick.getInput(down);
        
    }

}

class ButtonInput {
    constructor() {
        this.active = this.down = false;
    }

    getInput(down) {
        if (this.down != down) {
            this.active = down;
        }
        this.down = down;
    }
}