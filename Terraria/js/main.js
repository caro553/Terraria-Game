
import Game from "./game.js"
import Engine from "./engine.js"
import Display from "./display.js"
import Controller from "./controller.js"
import AHAH from "./record/arg.js"

class AssetsManager{
    constructor(){
        this.tile_set_image = [];
        this.tile_set_url = [];
    }

    loadTileSetImage( callback){
        let nbImages = this.tile_set_url.length;
        
        for (let i = 0; i < nbImages; i++ ) {
            
            this.tile_set_image.push(new Image());
            
            this.tile_set_image[i].addEventListener("load", () =>  {
                if (i + 1 == nbImages) { callback();}
            });

            this.tile_set_image[i].src = this.tile_set_url[i];
        }
    }

    addTileSetImage(url){
        this.tile_set_url.push(url);
    }
}

window.oncontextmenu = function () {
    return false;
 }
 

var keyDownUp = function(event) {
    controller.keyDownUp(event.type, event.keyCode);

};

var mouseDownUp = function(event) {
    // console.log(event);
    controller.mouseDownUp(event.type, event.button);

};


var resize = function(event) {

    display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
    display.render();

  };

var render = function() {

    

    display.camera.setCenterCamera(game.world.player);

    display.camera.update(
        game.world.map, 
        game.world.columns,  
        game.world.tile_set.tile_size
    );

    display.drawMap   (
        assets_manager.tile_set_image,
        game.world.tile_set.columns, 
        game.world.map, 
        game.world.columns,  
        game.world.tile_set.tile_size
    );
    
    //draw Player
    let frame = game.world.player.tile_set.frames[game.world.player.animator.frame_value];

    display.drawObject(
        assets_manager.tile_set_image[0],
        frame.x, 
        frame.y,
        game.world.player.x ,
        game.world.player.y /*+ game.world.player.tile_set.collideBottom * game.world.player.ratio*/, 
        frame.width, 
        frame.height,
        game.world.player.width,
        game.world.player.height
    );
    
    // draw Ennemies

    for(let i = 0; i < game.world.ennemies.length; i++){
        frame = game.world.ennemies[i].tile_set.frames[game.world.ennemies[i].animator.frame_value];

        display.drawObject(
            assets_manager.tile_set_image[3],
            frame.x, 
            frame.y,
            game.world.ennemies[i].x + frame.offset_x,
            game.world.ennemies[i].y + frame.offset_y, 
            frame.width, 
            frame.height,
            game.world.ennemies[i].width,
            game.world.ennemies[i].height
        );
    }

    if(game.world.inventory.active == 1){
        display.drawPointeur(
            Math.floor((- display.camera.differenceX + game.world.pointerX)/128) * 128 ,
            Math.floor((- display.camera.differenceY + game.world.pointerY)/128) * 128 
        );
    }

    // console.log(game.world.inventory);
    // display.drawInventory(
    //     assets_manager.tile_set_image[2],
    //     game.world.inventory.items[game.world.inventory.active].logo,
    //     game.world.inventory.tile_set.tile_size,
    //     game.world.inventory.tile_set.columns
    // );

    display.drawInterface(
        assets_manager.tile_set_image[4],
        assets_manager.tile_set_image[5],
        assets_manager.tile_set_image[2],
        game.world
    );

    display.render();

};

var update = function() {
    

    //write

    // csvContent += controller.leftClick.active + ",";//click left
    // csvContent += controller.rightClick.active + ",";//click right
    // csvContent += controller.left.active + ",";//left
    // csvContent += controller.right.active + "," ;//right
    // csvContent += controller.up.active + ",";//up
    // csvContent += controller.next.active + ",";//next
    // csvContent += controller.previous.active + ",";//previous
    // csvContent += game.world.pointerX + ",";//X
    // csvContent += game.world.pointerY + ",";//Y
    
    // if(compteur == 5000){
    //     var encodedUri = encodeURI(csvContent);
    //     window.open(encodedUri);
    // }

    
    //read

    controller.leftClick.active =       (superListe[0 + compteur*9] == "false") ? false : true;
    controller.rightClick.active  =     (superListe[1 + compteur*9] == "false") ? false : true;
    controller.left.active =            (superListe[2 + compteur*9] == "false") ? false : true;
    controller.right.active =           (superListe[3 + compteur*9] == "false") ? false : true;
    controller.up.active =              (superListe[4 + compteur*9] == "false") ? false : true;
    controller.next.active =            (superListe[5 + compteur*9] == "false") ? false : true;
    controller.previous.active =        (superListe[6 + compteur*9] == "false") ? false : true;
    game.world.pointerX =               parseInt(superListe[7 + compteur*9]);
    game.world.pointerY =               parseInt(superListe[8 + compteur*9]);

    // console.log(game.world.pointerY)
    

    



    compteur+=1;



    //read

    game.world.player.shield = 0;
    game.world.player.mine   = 0;


    game.world.inventory.update();

    if (controller.leftClick.active) {
        
        let y = display.camera.round_y_origin + Math.floor((- display.camera.differenceY + game.world.pointerY )/128) - display.camera.offSetY ;
        let x = display.camera.round_x_origin + Math.floor((- display.camera.differenceX + game.world.pointerX)/128)  - display.camera.offSetX;
        // game.world.destroy(game.world.columns * y + x);  
        game.world.inventory.items[game.world.inventory.active].action(x,y,game.world.columns,game.world);

    }
    
    if (controller.rightClick.active) { game.world.player.shield = 1; }


    let act = game.world.player.activity();
    if (controller.left.active     & !act)      { game.world.player.moveLeft();  }
    if (controller.right.active    & !act)      { game.world.player.moveRight(); }
    if (controller.up.active       & !act)      { game.world.player.jump(); controller.up.active = false; }
    if (controller.next.active     )            { game.world.inventory.nextItem(); controller.next.active = false;  }
    if (controller.previous.active )            { game.world.inventory.previousItem(); controller.previous.active = false;  }



    

    game.update();

};
let ctx = document.getElementById('myCanvas')


// let file = new ActiveXObject("Scripting.FileSystemObject");
// let a = file.CreateTextFile("record/testfile.txt", true);

var txtFile = "/home/thomas/Documents/p8/projet/Terraria/js/record/help.txt";
var file = new File([""],txtFile);
let csvContent = "data:text/txt;charset=utf-8," 
let compteur = 0;

let ahah = new AHAH();
let superListe = ahah.masupervariable.split(',');
// file.open("w"); // open file with write access


let assets_manager = new AssetsManager();
let controller     = new Controller();
let display        = new Display(ctx);
let game           = new Game();
let engine         = new Engine(1000/30, render, update);

display.buffer.canvas.height = 5000;
display.buffer.canvas.width = 5000;
display.buffer.imageSmoothingEnabled = false;

assets_manager.addTileSetImage("assets/seullinkpeutvaincreganon.png");
assets_manager.addTileSetImage("assets/spritesheets/spritesheet_tiles.png");
assets_manager.addTileSetImage("assets/spritesheets/spritesheet_items.png");
assets_manager.addTileSetImage("assets/kakakalennon.png");
assets_manager.addTileSetImage("assets/Inventory.png");
assets_manager.addTileSetImage("assets/inventory2.png");


let test = function(){
    resize();
    engine.start();
}

assets_manager.loadTileSetImage(test);


// display.tile_sheet.image.src = "rabbit-trap.png";




window.addEventListener("resize",  resize);
window.addEventListener("keydown", keyDownUp);
window.addEventListener("keyup",   keyDownUp);
window.addEventListener("mousedown",  mouseDownUp ); 
window.addEventListener("mouseup",  mouseDownUp ); 
document.onmousemove = function(event) {
    
	game.world.pointerX = (event.pageX / 1000 ) * display.camera.cameraWidth;
	game.world.pointerY = (event.pageY / 1000 ) * display.camera.cameraHeight;
    // game.world.pointerX += 128;
	// game.world.pointerY -= 128 ;
    // console.log("evenyt2 x " + event.pageX + " evenyt y " + event.pageY);
    // console.log("evenyt x " + game.world.pointerX + " evenyt y " + game.world.pointerY);
}

