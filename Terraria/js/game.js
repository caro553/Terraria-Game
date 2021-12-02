import Player from "./Objects/player.js"
import Zombie from "./Objects/zombie.js"
import TileSet from "./TileSet/tileset.js"
import Inventory from "./Inventory/inventory.js"

// import Player from "./object.js"

export default class Game {
    constructor() {
        this.world = new World();
    }

    update() {
        this.world.update();
    }
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

class World {
    constructor(){

        // this.collider = new Collider();
        this.pointerX = 0;
        this.pointerY = 0;

        this.friction = 0.8;
        this.gravity = 16;


        this.columns   = 100;
        this.rows      = 100;

        this.tile_size = 128;
        this.offset = 2;

        this.player = new Player(70,5);
        
        this.inventory = new Inventory();

        // this.zombie = new Zombie(300,300);

        let tabx = [ 28,69,76,91,16,99,42,43,51,78,82,91,61,11,51,24,13,37,44,48,43,74,48,38,45,20,96,11 ];
        let taby = [ 20,38,89,56,27,64,26,7, 21,15,67,35,12,36,34,10,57,91,19,58,44,60,62,69,47,66,49,35  ];


        this.ennemies = [];

        for (let i = 0; i < tabx.length; i++) {
            let x = tabx[i];
            let y = taby[i];
            this.ennemies.push( new Zombie(70,5, (x+10) * 128, (y+10) * 128) );
            
        }
        // this.ennemies.push( new Zombie(70,5) );
        // this.ennemies.push( new Zombie(70,10) );
        // this.ennemies.push( new Zombie(70,7) );

        // this.ennemies.push( b );
        

        // this.zombie = new Zombie(100,100);


        // this.tile_set = new TileSet(8, 16);
        this.tile_set = new TileSet(6, 128);
        

        this.collider = new Collider();


        this.map = generateMap(this.columns, this.rows, tabx, taby);
        this.collision_map = generateMapCollisions(this.map);

        
        this.height   = this.tile_size * this.rows;
        this.width    = this.tile_size * this.columns;

        // 
        
    }

    collideObject(object) {

        if      (object.getLeft()   < 0          ) { object.setLeft(0);             object.velocity_x = 0;  }
        else if (object.getRight()  > this.width ) { object.setRight(this.width);   object.velocity_x = 0; }
        if      (object.getTop()    < 0          ) { object.setTop(0);              object.velocity_y = 0; }
        else if (object.getBottom() > this.height) { object.setBottom(this.height); object.velocity_y = 0; object.jumping = false; }

        
        var bottom, left, right, top, value;

        

        //Bottom
        left = Math.floor(object.getOldLeft()       / this.tile_set.tile_size);
        right = Math.floor(object.getOldRight()    / this.tile_set.tile_size);
        bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
        value = 0;
        for(let i = left; i <= right; i++ ){
            value  += this.collision_map[bottom * this.columns + i];
        }
        if(value != 0){
            this.collider.collidePlatformTop(object, bottom * this.tile_size)
        }

        //Top
        left = Math.floor(object.getOldLeft()    / this.tile_set.tile_size);
        right = Math.floor(object.getOldRight()    / this.tile_set.tile_size);
        top = Math.floor(object.getTop() / this.tile_set.tile_size);
        value = 0;
        for(let i = left; i <= right; i++ ){
            value  += this.collision_map[top * this.columns + i];
            // console.log(value);
        }
        if(value != 0){
            this.collider.collidePlatformBottom(object, (top +1) * this.tile_size)
        }

        //Left
        top = Math.floor(object.getOldTop() / this.tile_set.tile_size);
        bottom = Math.floor(object.getOldBottom() / this.tile_set.tile_size);
        left = Math.floor(object.getLeft()    / this.tile_set.tile_size);
        
        value = 0;
        for(let i = top; i <= bottom; i++ ){
            
            value  += this.collision_map[i * this.columns + left];
            // console.log(value);
            // console.log(value);
        }
        if(value != 0){
            this.collider.collidePlatformRight(object, (left+1)  * this.tile_size)
        }

        //Right
        top = Math.floor(object.getOldTop() / this.tile_set.tile_size);
        bottom = Math.floor((object.getOldBottom()-0.02) / this.tile_set.tile_size);
        right = Math.floor(object.getRight()    / this.tile_set.tile_size);
        
        value = 0;
        for(let i = top; i <= bottom; i++ ){
            value  += this.collision_map[i * this.columns + right];
            
        }
        
        if(value != 0){
            this.collider.collidePlatformLeft(object, right  * this.tile_size)
        }


        


        

        return;

    }

    destroy(index){
        this.map[index] = 65;
        this.collision_map[index] = 65;
    }
    
    update() {


        //Zombie IA
        for(let i = 0; i < this.ennemies.length; i++){
            this.ennemies[i].ia(this.player, this.collider);
            if(this.ennemies[i].invulnerability != 0){
                this.ennemies[i].invulnerability -= 1;
            }
        }


        //invulnerability
        for(let i = 0; i < this.ennemies.length; i++){
            if(this.ennemies[i].invulnerability != 0){
                this.ennemies[i].invulnerability -= 1;
            }
        }
        if(this.player.invulnerability != 0){
            this.player.invulnerability -= 1;
        }




        //ennemies's attacks
        // if(this.player.attack != 0){
            for(let i = this.ennemies.length - 1 ; i >= 0; i--){
                if(this.collider.collideObjects( this.player, this.ennemies[i] ) && this.ennemies[i].attack == 1 ){
                
                    this.player.takeDamage(this.ennemies[i].direction_x);
                    // console.log(this.player.velocity_x);
                }
            }
        // }

        //player's attacks
        if(this.player.attack != 0){
            for(let i = this.ennemies.length - 1 ; i >= 0; i--){
                
                if(this.collider.collideObjects3( this.player, this.ennemies[i] )  ){
                    this.ennemies[i].takeDamage(this.player.direction_x);

                    // console.log("health :" + this.ennemies[i].health);
                    // console.log("death :" +this.ennemies[i].death );
                    // console.log("skip");
                   
                    if(this.ennemies[i].health <= 0 && this.ennemies[i].death == 100){
                        this.ennemies[i].death = 70;
                    }
                }
            }
        }
        //check death countdonw
        for(let i = this.ennemies.length - 1 ; i >= 0; i--){
            if(this.ennemies[i].death < 1){
                this.ennemies.splice(i,1);
            }
        }
        

        //positions
        this.player.updatePosition(this.gravity, this.friction);
        for(let i = 0; i < this.ennemies.length; i++){
            this.ennemies[i].updatePosition(this.gravity, this.friction);
        }


        //collisions
        this.collideObject(this.player);
        for(let i = 0; i < this.ennemies.length; i++){
            this.collideObject(this.ennemies[i]);
        }
        
        
        //animations
        this.player.updateAnimation();
        for(let i = 0; i < this.ennemies.length; i++){
            this.ennemies[i].updateAnimation();
        }
    }

}


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////



class Collider{
    constructor(){}



    collidePlatformBottom(object, tile_bottom) {

        if (object.getTop() < tile_bottom && object.getOldTop() >= tile_bottom) {

            object.setTop(tile_bottom + 0.01);
            object.setOldTop(tile_bottom + 0.01);
            object.velocity_y = 0;
            return true;
    
        } return false;
    
    }
    
    collidePlatformLeft(object, tile_left) {
    
        if (object.getRight() > tile_left && object.getOldRight() <= tile_left) {
    
            object.setRight(tile_left - 0.01);
            object.setOldRight(tile_left - 0.01);
            object.velocity_x = 0;
            return true;
    
        } return false;
    
    }
    
    collidePlatformRight(object, tile_right) {
    
        if (object.getLeft() < tile_right && object.getOldLeft() >= tile_right) {

            object.setLeft(tile_right + 0.01);
            object.setOldLeft(tile_right + 0.01);
            object.velocity_x = 0;
            return true;
    
        } return false;
    
    }
    
    collidePlatformTop(object, tile_top) {
    
        if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {
            
            object.setBottom(tile_top - 0.01);
            object.setOldBottom(tile_top - 0.01);
            object.velocity_y = 0;
            object.jumping    = false;
            return true;
    
        } return false;
    
    }

    collideObjects(objectA, objectB) {
    
            
        if (objectA.getLeft() >= objectB.getRight() || objectB.getLeft() >= objectA.getRight()){
            // console.log("OUI1");
            return false;
            }

            
        if (objectA.getTop() >= objectB.getBottom() || objectB.getTop() >= objectA.getBottom()){
            // console.log("OUI");
            return false;
            }



        return true;


    }

    // prend en compte le sprite et pas la collide box de l'objet A
    collideObjects2(objectA, objectB) {
        
            
        if (objectA.getLeft() - objectA.collideLeft >= objectB.getRight() + objectB.collideRight || objectB.getLeft() - objectB.collideLeft>= objectA.getRight() + objectA.collideRight)
            return false;

        // If one rectangle is above other
        if (objectA.getTop() - objectA.collideTop >= objectB.getBottom() + objectB.collideBottom || objectB.getTop() - objectB.collideTop>= objectA.getBottom() + objectA.collideBottom)
            return false;



        return true;

    }


    collideObjects3(objectA, objectB) {
    
            
        if (objectA.getLeft() >= objectB.getRight() + 150 || objectB.getLeft() - 150 >= objectA.getRight())
            return false;

        // If one rectangle is above other
        if (objectA.getTop() >= objectB.getBottom() || objectB.getTop() >= objectA.getBottom())
            return false;



        return true;


    }
    
    


}



//////////////////////////////////////////////////////////////////////



// let x;



let generateMap = function (columns, rows, tabx, taby) {
    let tab = [];

    for (let c = 0; c < columns; c++) {
        tab.push(65);
    }
    for (let c = 0; c < columns; c++) {
        tab.push(65);
    }
    for (let c = 0; c < columns; c++) {
        tab.push(65);
    }
    for (let c = 0; c < columns; c++) {
        tab.push(65);
    }

    for (let c = 0; c < columns; c++) {
        tab.push(5);
    }

    for (let i = 0; i < rows - 1; i++) {
        for (let c = 0; c < columns; c++) {
            tab.push(32);
        }
    }


    for (let i = 0; i < tabx.length; i++) {
        let x = tabx[i];
        let y = taby[i];
        // let x =  Math.floor(Math.random() * rows);
        // let y =  Math.floor(Math.random() * columns);
       
        // console.log("x : "  + x)
        // console.log("y : " + y)
        // tab[columns * y + x] = 65;

        tab[columns *(9 + y) + 9+ x ] = 65;
        tab[columns * (10 + y) + 8+ x ] = 65;
        tab[columns * (11 + y) + 7+ x ] = 65;
        tab[columns * (12 + y) + 6+ x ] = 65;
        tab[columns * (13 + y) + 5+ x ] = 65;

        tab[columns * (10 + y) + 9+ x ] = 65;
        tab[columns * (11 + y) + 8+ x ] = 65;
        tab[columns * (12 + y) + 7+ x ] = 65;
        tab[columns * (13 + y) + 6+ x ] = 65;

        tab[columns * (14 + y) + 6+ x ] = 65;
        tab[columns * (14 + y) + 7+ x ] = 65;


        tab[columns * (15 + y) + 6+ x ] = 65;
        tab[columns * (15 + y) + 7+ x ] = 65;
        tab[columns * (15 + y) + 8+ x ] = 65;
        tab[columns * (15 + y) + 9+ x ] = 65;
        tab[columns * (15 + y) + 10+ x ] = 65;
        tab[columns * (15 + y) + 11+ x ] = 65;
        tab[columns * (15 + y) + 12+ x ] = 65;
        tab[columns * (15 + y) + 13+ x ] = 65;
        tab[columns * (15 + y) + 14+ x ] = 65;
        tab[columns * (15 + y) + 15+ x ] = 65;
        tab[columns * (15 + y) + 16+ x ] = 65;

        tab[columns * (14 + y) + 16+ x ] = 65;
        tab[columns * (14 + y) + 17+ x ] = 65;

        tab[columns * (13 + y) + 16+ x ] = 65;
        tab[columns * (13 + y) + 17+ x ] = 65;


        tab[columns * (16 + y) + 9+ x ] = 65;
        tab[columns * (17 + y) + 8+ x ] = 65;
        tab[columns * (18 + y) + 7+ x ] = 65;
        tab[columns * (17 + y) + 9+ x ] = 65;
        tab[columns * (18 + y) + 8+ x ] = 65;
        tab[columns * (18 + y) + 9+ x ] = 65;
        tab[columns * (18 + y) + 10+ x ] = 65;
        tab[columns * (19 + y) + 11+ x ] = 65;
        tab[columns * (19 + y) + 10+ x ] = 65;
        tab[columns * (20 + y) + 11+ x ] = 65;
        tab[columns * (20 + y) + 10+ x ] = 65;

        tab[columns * (19 + y) + 12+ x ] = 65;
        tab[columns * (18 + y) + 13+ x ] = 65;
        tab[columns * (18 + y) + 12+ x ] = 65;
        tab[columns * (17 + y) + 13+ x ] = 65;
        tab[columns * (17 + y) + 12+ x ] = 65;

        tab[columns * (16 + y) + 14+ x ] = 65;
        tab[columns * (16 + y) + 13+ x ] = 65;

        tab[columns * (14 + y) + 15+ x ] = 65;
        tab[columns * (14 + y) + 14+ x ] = 65;
        tab[columns * (14 + y) + 13+ x ] = 65;
        tab[columns * (14 + y) + 12+ x ] = 65;
        tab[columns * (14 + y) + 11+ x ] = 65;
        tab[columns * (14 + y) + 10+ x ] = 65;
        tab[columns * (14 + y) + 9+ x ] = 65;
        tab[columns * (14 + y) + 8+ x ] = 65;

        tab[columns * (13 + y) + 15+ x ] = 65;
        tab[columns * (13 + y) + 14+ x ] = 65;
        tab[columns * (13 + y) + 13+ x ] = 65;
        tab[columns * (13 + y) + 12+ x ] = 65;
        tab[columns * (13 + y) + 11+ x ] = 65;
        tab[columns * (13 + y) + 10+ x ] = 65;
     

        tab[columns * (12 + y) + 15+ x ] = 65;
        tab[columns * (12 + y) + 14+ x ] = 65;
        tab[columns * (12 + y) + 13+ x ] = 65;
        tab[columns * (12 + y) + 12+ x ] = 65;
        tab[columns * (12 + y) + 11+ x ] = 65;
        tab[columns * (12 + y) + 10+ x ] = 65;

        tab[columns *(9 + y) + 9+ x ] = 65;
        tab[columns *(9 + y) + 10+ x ] = 65;
        tab[columns *(9 + y) + 11+ x ] = 65;
        tab[columns *(9 + y) + 12+ x ] = 65;
        tab[columns *(9 + y) + 13+ x ] = 65;
        tab[columns *(9 + y) + 14+ x ] = 65;

        tab[columns *(10 + y) + 14+ x ] = 65;
        tab[columns *(11 + y) + 14+ x ] = 65;

    }

   
        
    

return tab;
}

let generateMapCollisions = function (map) {

    let tab = [];

    for(let i =0; i < map.length; i++){
        if(map[i] == 65){
            tab.push(0);
        }
        else{
            tab.push(15);
        }
    }
    


    return tab;
}