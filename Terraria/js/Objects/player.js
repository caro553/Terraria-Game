import Object from "./object.js"
import Animator from "../Animations/animator.js"
import TileSet_Player from "../TileSet/tileset_player.js"

export default class Player extends Object {
    constructor(tileSize, ratio){
        super( 3000, 0, tileSize, ratio );
        
        this.tile_set = new TileSet_Player(9, tileSize);
        
        this.frame_sets = {

            "idle-right" :  [ 0, 1, 2, 3, 4, 5, 6, 7, 8],
            "move-right" :  [ 9,10,11,12,13,14,15,16   ],
            "jump-right" :  [17,18,19,20,21,22,23,24   ],
            "fall-right":   [25,26,27,28],
            "sword-right":  [29,30,31,32,33,34,35,36,37],
            "shield-right": [38],
            "idle-left" :   [39,40,41,42,43,44,45,46,47],
            "move-left" :   [48,49,50,51,52,53,54,55],
            "jump-left" :   [56,57,58,59,60,61,62,63],
            "fall-left":    [64,65,66,67],
            "sword-left":   [68,69,70,71,72,73,74,75,76],
            "shield-left":  [77]
        }

        this.animator = new Animator( this.frame_sets["idle-left"], 10);
        
        this.jumping     = true;
        this.direction_x = -1;
        this.velocity_x  = 0;
        this.velocity_y  = 0;

        this.attack  = 0;
        this.shield  = 0;
        this.mine  = 0;

        this.collideLeft = 20;
        this.collideRight = 20;
        this.collideTop = 15;
        this.collideBottom = 5;
    }

    
    activity(){
        return         this.attack + this.shield ;
    }

    jump() {

        if (!this.jumping) {

            this.jumping     = true;
            this.velocity_y -= 20*8;
    
        }
    
    }
    
    moveLeft() {

        this.direction_x = -1;// Make sure to set the player's direction.
        this.velocity_x -= 0.55*8;
    
    }
    
    moveRight(frame_set) {
    
        this.direction_x = 1;
        this.velocity_x += 0.55*8;
    
    }
    
    update() {
    
        this.x += this.velocity_x;
        this.y += this.velocity_y;
    
    }

    updateAnimation() {
        if (this.velocity_y != 0) {
            if(this.velocity_y < 0) {//jump
                if (this.direction_x < 0) this.animator.changeFrameSet(this.frame_sets["jump-left"], "loop");
                else this.animator.changeFrameSet(this.frame_sets["jump-right"], "loop");
            }
            else{
                if (this.direction_x < 0) this.animator.changeFrameSet(this.frame_sets["fall-left"], "loop");
                else this.animator.changeFrameSet(this.frame_sets["fall-right"], "loop");                
            }
        }
        else if (this.shield != 0) {
            this.attack = 0;
            if (this.direction_x < 0) this.animator.changeFrameSet(this.frame_sets["shield-left"], "loop");
            else this.animator.changeFrameSet(this.frame_sets["shield-right"], "loop");
    
        }
        else if (this.attack != 0) {
            this.attack -= 1;
            if (this.direction_x < 0) this.animator.changeFrameSet(this.frame_sets["sword-left"], "loop",1);
            else this.animator.changeFrameSet(this.frame_sets["sword-right"], "loop",1);
    
        }
        else if (this.direction_x < 0) {
    
            if (this.velocity_x < -0.1) this.animator.changeFrameSet(this.frame_sets["move-left"], "loop", 5);
            else this.animator.changeFrameSet(this.frame_sets["idle-left"], "loop");
    
        } 
        else if (this.direction_x > 0) {
    
            if (this.velocity_x > 0.1) this.animator.changeFrameSet(this.frame_sets["move-right"], "loop", 5);
            else this.animator.changeFrameSet(this.frame_sets["idle-right"], "loop");
    
        }
    
        this.animator.animate();
    
    }

    updatePosition(gravity, friction) {// Changed from the update function

        this.x_old = this.x;
        this.y_old = this.y;
        this.velocity_y += gravity;
        this.x    += this.velocity_x;
        this.y    += this.velocity_y;
    
        this.velocity_x *= friction;
        this.velocity_y *= friction;
    
      }

}