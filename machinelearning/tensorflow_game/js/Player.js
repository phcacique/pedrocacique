class Player{
    constructor(position, height, bodyImage, leftHandImage, rightHandImage, leftArmImage, rightArmImage){
        this.score = 0;
        this.position = position;
        this.height = height;
        this.width = height/bodyImage.height * bodyImage.width;
        this.image = bodyImage;

        this.hands = new Map();
        this.hands.set(LEFT, new GameHand(leftHandImage, height * 0.45, {x:0, y:0}));
        this.hands.set(RIGHT, new GameHand(rightHandImage, height * 0.45, {x:0, y:0}));

        this.arms = new Map();
        this.arms.set(LEFT, new GameHand(leftArmImage, height * 0.9, {x:0, y:0}));
        this.arms.set(RIGHT, new GameHand(rightArmImage, height * 0.9, {x:0, y:0}));
    }

    drawBody(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    drawHands(ctx) {
        this.hands.get(LEFT).draw(ctx);
        this.hands.get(RIGHT).draw(ctx);
    }

    drawArms(ctx){
        this.arms.get(LEFT).draw(ctx);
        this.arms.get(RIGHT).draw(ctx);
    }

    reverseHands(){
        let temp = this.hands.get(LEFT).image;
        this.hands.get(LEFT).image = this.hands.get(RIGHT).image;
        this.hands.get(RIGHT).image = temp;
    }
}

