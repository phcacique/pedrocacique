const LEFT = 'left';
const RIGHT = 'right';

class GameHand{
    constructor(image, height, position){
        this.height = height;
        this.width = height/image.height * image.width;
        this.image = image;
        this.position = position;
        this.isEnable = false;
        this.t = 0;
        this.isMoving = 0;
        this.speed = 0.1;
        this.resetPosition = position;
        this.rotation = 0;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    setPosition(pos){
        this.position = pos;
        this.resetPosition = pos;
    }
}