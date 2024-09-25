class GameArm{
    constructor(image, height, position){
        this.height = height;
        this.width = height/image.height * image.width;
        this.image = image;
        this.position = position;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}