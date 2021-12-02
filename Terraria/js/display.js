export default class Display {

    constructor(canvas) {
        this.buffer  = document.createElement("canvas").getContext("2d"),
        this.context = canvas.getContext("2d");

        

        this.camera = new Camera();

        this.test = 0;
    }



    drawMap(images, image_columns, map, map_columns, tile_size) {
        //ciel
        this.buffer.fillStyle = "rgb(255,255,255)";
        this.buffer.fillRect(0, 0, this.camera.cameraWidth * 2, this.camera.cameraHeight * 2);

        this.buffer.fillStyle = "rgb(50,168,255)";
        this.buffer.fillRect(0, 0, this.camera.cameraWidth, this.camera.cameraHeight);

   
        let image = images[1];

        for(let y = this.camera.round_y_origin; y < this.camera.round_y_end; y++){
            for(let x = this.camera.round_x_origin; x < this.camera.round_x_end; x++){
                let index = y * map_columns + x;

                let value         = map[index];
                let source_x      =           ((value % image_columns) * tile_size) + 2 * (value % image_columns);
                let source_y      =           ((Math.floor(value / image_columns)) * tile_size) + 2 * (Math.floor(value / image_columns)) ;
                let destination_x =           this.camera.differenceX + (x - this.camera.round_x_origin + this.camera.offSetX) * tile_size;
                let destination_y =           this.camera.differenceY + (y - this.camera.round_y_origin + this.camera.offSetY) * tile_size;
                // console.log("value : " + value )
                // console.log("TEST source x :" + source_x + " source y : " + source_y + " destination_x : " + destination_x + " destination y : " + destination_y );
                this.buffer.drawImage(image, source_x, source_y, tile_size, tile_size, destination_x, destination_y, tile_size, tile_size);

            }
        }

    
    }
    
    
    drawObject(image, source_x, source_y, destination_x, destination_y, width_frame, height_frame, width_render, height_render) {
        
        this.buffer.drawImage(image, source_x, source_y, width_frame, height_frame, destination_x - this.camera.cameraCornerX  ,  destination_y - this.camera.cameraCornerY, width_render, height_render);
        // this.buffer.drawImage(image, source_x, source_y, width_frame, height_frame, Math.round(destination_x), Math.round(destination_y), width_render, height_render);

        
    };

    drawPointeur(x,y) {
        // console.log("x " + x + " y " + y);
        this.buffer.fillStyle = "rgb(255,0,0)";
        this.buffer.fillRect(this.camera.differenceX+x, this.camera.differenceY+y, 128,128);

  

        
    };

    drawInventory(image, value, tile_size, columns ) {
        // console.log("x " );
        this.buffer.fillStyle = "rgb(0,0,0)";
        this.buffer.fillRect(this.camera.cameraWidth/2 - tile_size/2  ,  this.camera.cameraHeight/6, tile_size, tile_size);
      
        let source_x = ((value % columns) * tile_size) + 2 * (value % columns);
        let source_y = ((Math.floor(value / columns)) * tile_size) + 2 * (Math.floor(value / columns)) ;
       

        // let source_x = value%columns;
        // let source_y = 0;

        this.buffer.drawImage(image, source_x, source_y, tile_size, tile_size, this.camera.cameraWidth/2 - tile_size/2  ,  this.camera.cameraHeight/6, tile_size, tile_size);

    };

    drawInterface(img1, img2, itemImg, world){

        //life
        this.buffer.font = "100px serif";
        let txt = "";
        for(let i = 0; i < world.player.health; i++){
            txt += "❤️";
        }
        this.buffer.fillText(txt, 10, 100);

        let width = 990;
        let height = 110;

   
        //barre inventory
        let cornerX = this.camera.cameraWidth/2 - width;
        let cornerY = this.camera.cameraHeight - this.camera.cameraHeight/6 ;
        this.buffer.drawImage(img1, 0, 0, width, height,  cornerX , cornerY , width*2,  height*2);

        // fill inventory
        let columns = world.inventory.tile_set.columns;
        let tile_size = world.inventory.tile_set.tile_size;
        for(let i = 0; i < world.inventory.items.length; i++){
            let value = world.inventory.items[i].logo;
            let source_x = ((value % columns) * tile_size) + 2 * (value % columns);
            let source_y = ((Math.floor(value / columns)) * tile_size) + 2 * (Math.floor(value / columns)) ;
            let paste_x = cornerX + 11 + i * 110*2;
            let paste_y = cornerY + 11;
            this.buffer.drawImage(itemImg, source_x, source_y, tile_size, tile_size,  paste_x  , paste_y , 96*2,  96*2);
        }


        let active = world.inventory.active;
        let paste_x = cornerX  + active * 110*2 - 10*2 ;
        let paste_y = cornerY - 11*2;

        this.buffer.drawImage(img2, 0, 0, 133, 133,  paste_x  , paste_y , 133*2,  133*2);


        //inventory
    }


    resize (width, height, height_width_ratio) {

        if (height / width > height_width_ratio) {
    
          this.context.canvas.height = width * height_width_ratio;
          this.context.canvas.width = width;
    
        } else {
    
          this.context.canvas.height = height;
          this.context.canvas.width = height / height_width_ratio;
    
        }
    
        this.context.imageSmoothingEnabled = false;
    
    }

    render(x,y) { 
        this.context.fillStyle = "rgb(0,0,0)";
        this.context.fillRect(0, 0, 1000, 1000);

        this.context.fillStyle = "rgb(255,255,255)";
        this.context.fillRect(100, 100, 500, 500);

        

        // this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height); 
        // this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 500, 0, 100, 100); 

        // this.buffer.fillStyle = "rgb(255,0,0)";
        // this.buffer.fillRect(this.camera.cameraWidth/2 - 5, this.camera.cameraHeight/2 - 5, 10,10);

        this.context.drawImage(this.buffer.canvas, 0, 0, this.camera.cameraWidth, this.camera.cameraHeight, 0, 0, 1000, 1000); 

    }
    


}

 
class Camera {
    constructor(){
        this.cameraWidth = 2000;
        this.cameraHeight = 2000;

        this.cameraCenterX = 0;
        this.cameraCenterY = 0;

        this.cameraCornerX = 0;
        this.cameraCornerY = 0;

        this.round_x_origin = 0;
        this.round_y_origin = 0;

        this.differenceX = 0;
        this.differenceY = 0;

    }

    setCenterCamera(player){

        this.cameraCenterX = player.x  + player.width / 2;
        this.cameraCenterY = player.y  + player.height / 2;

        this.cameraCornerX = this.cameraCenterX - this.cameraWidth/2;
        this.cameraCornerY = this.cameraCenterY - this.cameraHeight/2;
        
    }

    update(map, map_columns, tile_size){
        this.x_center = this.cameraCenterX;
        this.y_center = this.cameraCenterY;
       
        //
        
        //
        this.x_origin = this.x_center - this.cameraWidth/2;
        this.y_origin = this.y_center - this.cameraHeight/2;

        
        
        this.round_x_origin = Math.floor(this.x_origin / tile_size);
        this.round_y_origin = Math.floor(this.y_origin / tile_size);

        this.differenceX = (this.round_x_origin * tile_size) - this.x_origin; 
        this.differenceY = (this.round_y_origin * tile_size) - this.y_origin; 

        this.round_x_end = Math.ceil((this.x_center + this.cameraWidth/2) / tile_size );
        this.round_y_end = Math.ceil((this.y_center + this.cameraHeight/2) / tile_size );

        this.offSetX = 0;
        this.offSetY = 0;

        if(this.round_x_origin < 0 ) { this.offSetX = -this.round_x_origin; this.round_x_origin = 0;}
        if(this.round_y_origin < 0 ) { this.offSetY = -this.round_y_origin; this.round_y_origin = 0;}
        if(this.round_x_end > map_columns ) this.round_x_end = map_columns;
        if(this.round_y_end > map.len/ map_columns ) this.round_y_end = map.len/ map_columns;

    }
}