import TileSet from "../TileSet/tileset.js"

export default class Inventory{
    constructor(){
        this.items = [];
        this.items.push(new Sword());
        this.items.push(new PickAxe());
        this.active = 0;
        this.tile_set = new TileSet(5, 128);
    }

    nextItem(){
        if(this.active < this.items.length - 1){
            this.active += 1;}
    }

    previousItem(){
        if(this.active > 0){
            this.active -= 1;}
    }

    addItem(logo, tile){
        for(let i = 0; i < this.items.length; i++){
            
            // console.log(this.items[i].id);
            if(this.items[i].logo == logo){
                this.items[i].num += 1;
                return;
            }
        }
        this.items.push(new Block(logo, tile));
    }

    update(){
        // console.log(this.items);
        for(let i = 0; i < this.items.length; i++){
            if(this.items[i].num == 0){
                this.items.splice(i,1);
                this.active = 0;
                return;
            }
        }
        // console.log(this.items);
    }
}

class Items{
    constructor(logo){
        this.logo = logo;
        this.num = 1;
    }
}


class PickAxe extends Items{
    constructor(){
        super(25);
    }

    action(x,y,columns, world){
        let index = columns * y + x;
        let tile = world.map[index];
        let logo = 0;

        world.map[index] = 65;
        world.collision_map[index] = 0;
        
        if(tile == 5 ) // herbe  
            logo = 60;
        if(tile == 32 ) // roche
            logo = 50;
            
        if( logo != 0)
            world.inventory.addItem( logo, tile );
    }
}

class Sword extends Items{
    constructor(){
        super(23);
    }

    action(x,y,columns, world){
        if(world.player.attack == 0){
            world.player.attack = 9;
        }
    }
}

class Block extends Items{
    constructor(logo, tile){
        super(logo);
        this.tile = tile;
    }

    action(x,y,columns, world){
        let index = columns * y + x;
        let tile = world.map[index];
        
        if(tile ==  65 || tile == 16){//air ou plante 
            world.map[index] = this.tile;
            world.collision_map[index] = 15;

            this.num -= 1;
        }
            
    }
}