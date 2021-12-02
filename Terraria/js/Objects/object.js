export default class Object{
    constructor(x, y, tileSize, ratio){
        this.height = tileSize * ratio;
        this.width  = tileSize * ratio;
        this.ratio  = ratio;
        this.x      = x;
        this.x_old  = x;
        this.y      = y;
        this.y_old  = y;

        this.collideLeft = 0;
        this.collideRight = 0;
        this.collideTop = 0;
        this.collideBottom = 0;

        this.attack  = 0;
        this.shield  = 0;
        this.mine  = 0;

        this.invulnerability = 0;
        this.health = 5;

        this.death  = 100;
    }
    takeDamage(direction){
        if(this.invulnerability == 0 || this.health <= 0){
            this.velocity_x += 100 * direction;
            if(this.shield != 1){
                this.health -= 1; 
                this.invulnerability = 10 ;
            }
        }
    }

    getBottom   ()  { return this.y     + this.height  - this.collideBottom  * this.ratio;  }
    getLeft     ()  { return this.x                    + this.collideLeft    * this.ratio;  }
    getRight    ()  { return this.x     + this.width   - this.collideRight   * this.ratio;  }
    getTop      ()  { return this.y                    + this.collideTop     * this.ratio;  }
    getOldBottom()  { return this.y_old + this.height  - this.collideBottom  * this.ratio;  }
    getOldLeft  ()  { return this.x_old                + this.collideLeft    * this.ratio;  }
    getOldRight ()  { return this.x_old + this.width   - this.collideRight   * this.ratio;  }
    getOldTop   ()  { return this.y_old                + this.collideTop     * this.ratio;  }
    setBottom   (y) { this.y     = y    - this.height  + this.collideBottom  * this.ratio;  }
    setLeft     (x) { this.x     = x                   - this.collideLeft    * this.ratio;  }
    setRight    (x) { this.x     = x    - this.width   + this.collideRight   * this.ratio;  }
    setTop      (y) { this.y     = y                   - this.collideTop     * this.ratio;  }
    setOldBottom(y) { this.y_old = y    - this.height  + this.collideBottom  * this.ratio;  }
    setOldLeft  (x) { this.x_old = x                   - this.collideLeft    * this.ratio;  }
    setOldRight (x) { this.x_old = x    - this.width   + this.collideRight   * this.ratio;  }
    setOldTop   (y) { this.y_old = y                   - this.collideTop     * this.ratio;  }
}





