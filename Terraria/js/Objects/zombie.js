import Object from "./object.js"
import Animator from "../Animations/animator.js"
import TileSet_Zombie from "../TileSet/tileset_zombie.js"

export default class Zombie extends Object {
    constructor(sizeX, sizeY, x , y){
        super( x, y, sizeX, sizeY);


        this.tile_set = new TileSet_Zombie(9, 70);
        
        this.frame_sets = {

            "idle" :        [ 0],
            "move-right" :  [ 1, 2, 3, 4, 5, 6, 7, 8],
            "jump-right" :  [ 9],
            "sword-right":  [10,11,12,13,14,15,16,17,18],
            "move-left":    [19,20,21,22,23,24,25,26],
            "jump-left":    [27],
            "sword-left" :  [28,29,30,31,32,33,34,35,36],
            "death":        [37,38,39,40,41,42,43]
        }

        this.animator = new Animator( this.frame_sets["idle"], 10);
        
        this.jumping     = true;
        this.direction_x = -1;
        this.velocity_x  = 0;
        this.velocity_y  = 0;

        this.collideLeft = 20;
        this.collideRight = 25;
        this.collideTop = 13;
        this.collideBottom = 0;

        this.attack  = 0;
        this.shield  = 0;
        this.mine  = 0;



    }



    ia(player, collider){
        if(this.attack == 0 && this.health > 0){
            if(collider.collideObjects(this,player)){
                this.attack = 9*2;
            }
            else{
                if(player.x > this.x) this.moveRight();
                else this.moveLeft();

                if(player.y < this.y ) this.jump();
            }
        }
    }

    jump() {

        if (!this.jumping) {

            this.jumping     = true;
            this.velocity_y -= 20*8;
    
        }
    
    }
    
    moveLeft() {
        
        this.direction_x = -1;// Make sure to set the player's direction.
        this.velocity_x -= 0.55*4;
    
    }
    
    moveRight(frame_set) {
    
        this.direction_x = 1;
        this.velocity_x += 0.55*4;
    
    }
    
    update() {
    
        this.x += this.velocity_x;
        this.y += this.velocity_y;
    
    }

    updateAnimation(a) {
        if (this.health <= 0) {
            // console.log("AAAAAAAAAAAAAAAA")
            this.death -= 1;
            this.animator.changeFrameSet(this.frame_sets["death"], "loop");
        } 

        else if (this.velocity_y < 0) {
    
            if (this.direction_x < 0) this.animator.changeFrameSet(this.frame_sets["jump-left"], "pause");
            else this.animator.changeFrameSet(this.frame_sets["jump-right"], "pause");
    
        } 
        else if (this.attack != 0) {
            this.attack -= 1;
            if (this.direction_x < 0) this.animator.changeFrameSet(this.frame_sets["sword-left"], "loop",2);
            else this.animator.changeFrameSet(this.frame_sets["sword-right"], "loop",2);
    
        }
        else if (this.direction_x < 0) {

            if (this.velocity_x < -0.1) this.animator.changeFrameSet(this.frame_sets["move-left"], "loop", 5);
            else this.animator.changeFrameSet(this.frame_sets["idle"], "pause");
    
        } 
        else if (this.direction_x > 0) {
    
            if (this.velocity_x > 0.1) this.animator.changeFrameSet(this.frame_sets["move-right"], "loop", 5);
            else this.animator.changeFrameSet(this.frame_sets["idle"], "pause");
    
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