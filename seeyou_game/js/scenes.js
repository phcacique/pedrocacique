function searchCharacter(name){
    for(var i=0; i<characters.length; i++){
        if(characters[i].name == name) return characters[i];
    }
    return null;
}

var ST = 5, car, bus, gabriel, julia, milton, lu, cleide, alex, isabela, leonardo, monica, pedro;
function createScenes() {
    car = searchCharacter('car');
    car.status = "5_"+car.status;
    bus = searchCharacter('bus');
    gabriel = searchCharacter('gabriel');
    julia = searchCharacter('julia');
    milton = searchCharacter('milton');
    lu = searchCharacter('lu');
    cleide = searchCharacter('cleide');
    alex = searchCharacter('alex');
    isabela = searchCharacter('isabela');
    leonardo = searchCharacter('leonardo');
    monica = searchCharacter('monica');
    pedro = searchCharacter('pedro');
    
    scenes = [];
    var scene1 = new Scene(1, ST);
    scene1.isShowingSpeech = false;
    scene1.speech = images[5];
    scene1.speech2 = images[4];
    scene1.chars.push(gabriel);
    scene1.chars.push(julia);
    scene1.draw = function () {
        var frame1 = {
            x: worlds[0].x + SEPARATOR_SIZE,
            y: worlds[0].y + SEPARATOR_SIZE,
            width: worlds[0].width - SEPARATOR_SIZE,
            height: worlds[0].height - SEPARATOR_SIZE
        }
        var frame2 = {
            x: worlds[1].x,
            y: worlds[1].y + SEPARATOR_SIZE,
            width: worlds[1].width - SEPARATOR_SIZE,
            height: worlds[1].height - SEPARATOR_SIZE
        }

        var h = frame1.height - SEPARATOR_SIZE;
        var w = images[3].img.width * h / images[3].img.height;
        var x = frame1.width - w + SEPARATOR_SIZE / 2;

        this.rect1 = {
            x: x,
            y: frame1.y,
            w,
            h
        };

        ctx.drawImage(images[3].img, 0, 0,
            images[3].img.width, images[3].img.height,
            this.rect1.x,
            this.rect1.y,
            this.rect1.w, this.rect1.h);

        gabriel.draw();
        gabriel.animate();

        if (this.currentTime == 0) gabriel.x = x + 4 * SEPARATOR_SIZE;
        gabriel.y = frame1.y + frame1.height - gabriel.height - SEPARATOR_SIZE;

        w = images[2].img.width * h / images[2].img.height;

        this.rect2 = {
            x: frame2.x + SEPARATOR_SIZE / 2,
            y: frame2.y,
            w,
            h
        };

        ctx.drawImage(images[2].img, 0, 0,
            images[2].img.width, images[2].img.height,
            this.rect2.x,
            this.rect2.y,
            this.rect2.w,
            this.rect2.h);

        var ssize = gabriel.height * 0.3
        if (this.isShowingSpeech) {
            ctx.drawImage(this.speech.img, 0, 0, this.speech.img.width, this.speech.img.height, x + w - ssize, frame1.y + frame1.height / 2 - ssize, ssize, ssize);
        }

        julia.draw();
        julia.animate();

        if (this.currentTime == 0) julia.x = frame2.x + w - 10 * SEPARATOR_SIZE;
        julia.y = frame2.y + frame2.height - julia.height - SEPARATOR_SIZE;

        if (this.isShowingSpeech) {
            ctx.drawImage(this.speech2.img, 0, 0, this.speech2.img.width, this.speech2.img.height, x + this.rect1.w + ssize / 2, frame2.y + frame2.height / 2 - ssize, ssize, ssize);
        }

        if (this.isAnimating == false || this.isFading == true) {
            ctx.beginPath()
            ctx.fillStyle = 'rgba(0,0,0,' + this.alpha + ')'
            ctx.fillRect(this.rect1.x, this.rect1.y, this.rect1.w, this.rect1.h);
            ctx.fillRect(this.rect2.x, this.rect2.y, this.rect2.w, this.rect2.h);
            ctx.closePath()
        }

    }
    scene1.startScene = function () {
        gabriel.scale(1, worlds[0].height * 0.5);
        julia.scale(1, worlds[0].height * 0.5);
        gabriel.startAnimation(gabriel.hp + '_idle_right');
        gabriel.offTime = 10;
        julia.offTime = 10;
        julia.startAnimation(julia.hp + '_idle_left');
    }
    scene1.animate = function () {

        if (this.isAnimating == true) {
            if (this.currentTime >= 2) {
                this.isShowingSpeech = true;
                this.isWalking = true;
            }

            if (this.currentTime == 2) {
                gabriel.offTime = 2;
                gabriel.direction = 1;

                gabriel.startAnimation(gabriel.hp + '_walk_right');
                gabriel.anim0 = 4;

                julia.offTime = 2;
                julia.direction = -1;
                julia.startAnimation(julia.hp + '_walk_left');
                julia.anim0 = 4;
                
                car.startAnimation('car');
            }

            //STOP
            if (this.currentTime == this.time || (gabriel.x - gabriel.width >= worlds[0].x + worlds[0].width || julia.x <= worlds[1].x + SEPARATOR_SIZE / 2)) {
                this.isAnimating = false;
                if(!isMUTE) audioDoor.play();
            }
        }
    }
    scenes.push(scene1);

    var scene2 = new Scene(2, ST);
    scene2.isShowingSpeech = false;
    scene2.chars.push(gabriel); //Gabriel
    scene2.chars.push(julia); //Julia
    scene2.chars.push(milton); //Sr Milton
    scene2.chars.push(lu); //Dona Lu
    scene2.chars.push(cleide); //Dona Cleide
    scene2.draw = function () {
        var frame1 = {
            x: worlds[0].x + SEPARATOR_SIZE,
            y: worlds[0].y + SEPARATOR_SIZE,
            width: worlds[0].width - SEPARATOR_SIZE,
            height: worlds[0].height - SEPARATOR_SIZE
        }
        var frame2 = {
            x: worlds[1].x,
            y: worlds[1].y + SEPARATOR_SIZE,
            width: worlds[1].width - SEPARATOR_SIZE,
            height: worlds[1].height - SEPARATOR_SIZE
        }

        var h = frame1.height - SEPARATOR_SIZE;
        var w = images[7].img.width * h / images[7].img.height;
        this.rect1 = {
            x: frame1.width - w + SEPARATOR_SIZE / 2,
            y: frame1.y,
            w: images[7].img.width * h / images[7].img.height,
            h: h
        };

        this.rect2 = {
            x: frame2.x + SEPARATOR_SIZE / 2,
            y: frame2.y,
            w: images[6].img.width * h / images[6].img.height,
            h: this.rect1.h
        };

        ctx.drawImage(images[7].img, 0, 0,
            images[7].img.width, images[7].img.height,
            this.rect1.x,
            this.rect1.y,
            this.rect1.w, this.rect1.h);

        gabriel.draw();
        gabriel.animate();

        if (this.currentTime == 0) {
            gabriel.x = this.rect1.x + this.rect1.w / 4 + gabriel.width / 2;
        }
        gabriel.y = frame1.y + frame1.height - gabriel.height - SEPARATOR_SIZE;

        ctx.drawImage(images[6].img, 0, 0,
            images[6].img.width, images[6].img.height,
            this.rect2.x,
            this.rect2.y,
            this.rect2.w,
            this.rect2.h);

        julia.draw();
        julia.animate();

        if (this.currentTime == 0) {
            julia.x = frame2.x + frame2.width / 4;
        }
        julia.y = frame2.y + frame2.height - julia.height - SEPARATOR_SIZE;

        if (this.currentTime == 0) {

            milton.startAnimation(milton.hp + '_sitting_right');
            milton.anim0 = 3;
            milton.offTime = 1;
            milton.x = this.rect1.x + this.rect1.w / 4;
            milton.y = this.rect1.y + this.rect1.h - milton.height - SEPARATOR_SIZE;

            lu.startAnimation(lu.hp + '_idle_left');
            lu.offTime = 8;
            lu.x = this.rect1.x + 3 * this.rect1.w / 4;
            lu.y = this.rect1.y + this.rect1.h - lu.height - SEPARATOR_SIZE;

            cleide.startAnimation(cleide.hp + '_idle_left');
            cleide.offTime = 10;
            cleide.x = this.rect2.x + 3 * this.rect1.w / 4;
            cleide.y = this.rect2.y + this.rect2.h - cleide.height - SEPARATOR_SIZE;

        }

        milton.draw();
        milton.animate();
        lu.draw();
        lu.animate();
        cleide.draw();
        cleide.animate();



        if (this.isAnimating == false || this.isFading == true) {
            ctx.beginPath()
            ctx.fillStyle = 'rgba(0,0,0,' + this.alpha + ')'
            ctx.fillRect(this.rect1.x, this.rect1.y, this.rect1.w, this.rect1.h);
            ctx.fillRect(this.rect2.x, this.rect2.y, this.rect2.w, this.rect2.h);
            ctx.closePath()
        }

    }
    scene2.animate = function () {
        if (this.currentTime == this.time) {
            this.isAnimating = false;
        }

    }
    scene2.startScene = function () {
        gabriel.scale(1, worlds[0].height * 0.5);
        julia.scale(1, worlds[0].height * 0.5);
        gabriel.startAnimation(gabriel.hp + '_idle_right');
        gabriel.offTime = 10;
        julia.offTime = 10;
        julia.startAnimation(julia.hp + '_idle_left');
    }
    scenes.push(scene2);

    var scene3 = new Scene(3, ST);
    scene3.isShowingSpeech = false;
    scene3.chars.push(gabriel); //Gabriel
    scene3.chars.push(julia); //Julia
    scene3.draw = function () {
        var frame1 = {
            x: worlds[0].x + SEPARATOR_SIZE,
            y: worlds[0].y + SEPARATOR_SIZE,
            width: worlds[0].width - SEPARATOR_SIZE,
            height: worlds[0].height - SEPARATOR_SIZE
        }
        var frame2 = {
            x: worlds[1].x,
            y: worlds[1].y + SEPARATOR_SIZE,
            width: worlds[1].width - SEPARATOR_SIZE,
            height: worlds[1].height - SEPARATOR_SIZE
        }

        var h = frame1.height - SEPARATOR_SIZE;
        var w = images[9].img.width * h / images[9].img.height;
        this.rect1 = {
            x: frame1.width - w + SEPARATOR_SIZE / 2,
            y: frame1.y,
            w: images[9].img.width * h / images[9].img.height,
            h: frame1.height - SEPARATOR_SIZE
        };

        this.rect2 = {
            x: frame2.x + SEPARATOR_SIZE / 2,
            y: frame2.y,
            w: images[8].img.width * h / images[8].img.height,
            h: this.rect1.h
        };

        if (this.currentTime == 0) {
            gabriel.x = this.rect1.x;
            julia.x = this.rect2.x + this.rect2.w - julia.width;

            //CAR
            car.scale(1, worlds[0].height * 1.5);
            car.x = this.rect1.x + this.rect1.w / 1.5;
            car.y = this.rect1.y + this.rect1.h - car.height / 1.2;
            car.startAnimation('car');
            
            //BUS
            bus.scale(1, worlds[0].height * 0.8);
            bus.x = this.rect2.x;
            bus.y = this.rect2.y + this.rect2.h - bus.height;
            bus.startAnimation('busback');
        }

        //BOY SCENARIO
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + WORLD_COLORS.day.r + ',' + WORLD_COLORS.day.g + ',' + WORLD_COLORS.day.b + ',1)'
        ctx.fillRect(this.rect1.x, this.rect1.y, this.rect1.w, this.rect1.h);
        ctx.closePath();
        ctx.drawImage(images[9].img, 0, 0,
            images[9].img.width, images[9].img.height,
            this.rect1.x,
            this.rect1.y,
            this.rect1.w,
            this.rect1.h);
        gabriel.draw();
        gabriel.animate();
        car.draw(); //CAR
        

        //GIRL SCENARIO
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + WORLD_COLORS.day.r + ',' + WORLD_COLORS.day.g + ',' + WORLD_COLORS.day.b + ',1)'
        ctx.fillRect(this.rect2.x, this.rect2.y, this.rect2.w, this.rect2.h);
        ctx.closePath();
        ctx.drawImage(images[8].img, 0, 0,
            images[8].img.width, images[8].img.height,
            this.rect2.x,
            this.rect2.y,
            this.rect2.w,
            this.rect2.h);
        julia.draw();
        julia.animate();
        bus.draw(); //BUS
        
        gabriel.y = frame1.y + frame1.height - gabriel.height - SEPARATOR_SIZE;

        julia.y = frame2.y + frame2.height - julia.height - SEPARATOR_SIZE;

        this.isWalking = true;


        if (this.isAnimating == false || this.isFading == true) {
            ctx.beginPath()
            ctx.fillStyle = 'rgba(0,0,0,' + this.alpha + ')'
            ctx.fillRect(this.rect1.x, this.rect1.y, this.rect1.w, this.rect1.h);
            ctx.fillRect(this.rect2.x, this.rect2.y, this.rect2.w, this.rect2.h);
            ctx.closePath()
        }

    }
    scene3.animate = function () {
        if ((gabriel.x >= this.rect1.x + this.rect1.w - gabriel.width * 1.5) || this.currentTime == this.time) {
            this.isAnimating = false;
            if(!isMUTE) audioDoor.play();
        }
        if (this.currentTime == 1) {
            gabriel.speed = 0.6
            gabriel.offTime = 1;
            gabriel.direction = 1;

            gabriel.startAnimation(gabriel.hp + '_walk_right');
            gabriel.anim0 = 4;

            julia.speed = 0.6
            julia.offTime = 1;
            julia.direction = -1;
            julia.startAnimation(julia.hp + '_walk_left');
            julia.anim0 = 4;
        }
    }
    scenes.push(scene3);

    var scene4 = new Scene(4, ST);
    scene4.isShowingSpeech = false;
    scene4.draw = function () {
        var frame1 = {
            x: worlds[0].x + SEPARATOR_SIZE,
            y: worlds[0].y + SEPARATOR_SIZE,
            width: worlds[0].width - SEPARATOR_SIZE,
            height: worlds[0].height - SEPARATOR_SIZE
        }
        var frame2 = {
            x: worlds[1].x,
            y: worlds[1].y + SEPARATOR_SIZE,
            width: worlds[1].width - SEPARATOR_SIZE,
            height: worlds[1].height - SEPARATOR_SIZE
        }

        var h = frame1.height - SEPARATOR_SIZE;
        var w = images[11].img.width * h / images[11].img.height;
        this.rect1 = {
            x: frame1.width - w + SEPARATOR_SIZE / 2,
            y: frame1.y,
            w: images[11].img.width * h / images[11].img.height,
            h: frame1.height - SEPARATOR_SIZE
        };

        this.rect2 = {
            x: frame2.x + SEPARATOR_SIZE / 2,
            y: frame2.y,
            w: images[10].img.width * h / images[10].img.height,
            h: this.rect1.h
        };

        if (this.currentTime == 0) {

            //CAR
            car.offTime = 1;
            car.scale(1, worlds[0].height);
            car.x = this.rect1.x + this.rect1.w / 4;
            car.y = this.rect1.y + this.rect1.h - car.height / 1.2;
            car.startAnimation('car');

            //BUS
            bus.offTime = 1;
            bus.scale(1, worlds[0].height * 1.2);
            bus.x = this.rect2.x + this.rect2.w / 8;
            bus.y = this.rect2.y + this.rect2.h - bus.height / 1.5;
            bus.startAnimation('bus');

        }


        //BOY SCENARIO
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + WORLD_COLORS.day.r + ',' + WORLD_COLORS.day.g + ',' + WORLD_COLORS.day.b + ',1)'
        ctx.fillRect(this.rect1.x, this.rect1.y, this.rect1.w, this.rect1.h);
        ctx.closePath();
        ctx.drawImage(images[11].img, 0, 0,
            images[11].img.width, images[11].img.height,
            this.rect1.x,
            this.rect1.y,
            this.rect1.w,
            this.rect1.h);
        car.draw(); //CAR
        car.animate();

        //GIRL SCENARIO
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + WORLD_COLORS.day.r + ',' + WORLD_COLORS.day.g + ',' + WORLD_COLORS.day.b + ',1)'
        ctx.fillRect(this.rect2.x, this.rect2.y, this.rect2.w, this.rect2.h);
        ctx.closePath();
        ctx.drawImage(images[10].img, 0, 0,
            images[10].img.width, images[10].img.height,
            this.rect2.x,
            this.rect2.y,
            this.rect2.w,
            this.rect2.h);
        bus.draw(); //BUS
        bus.animate();


        if (this.isAnimating == false || this.isFading == true) {
            ctx.beginPath()
            ctx.fillStyle = 'rgba(0,0,0,' + this.alpha + ')'
            ctx.fillRect(this.rect1.x, this.rect1.y, this.rect1.w, this.rect1.h);
            ctx.fillRect(this.rect2.x, this.rect2.y, this.rect2.w, this.rect2.h);
            ctx.closePath()
        }

    }
    scene4.animate = function () {
        if (this.currentTime == this.time) {
            this.isAnimating = false;
        }
    }
    scene4.startScene = function(){
        //if(!isMUTE) audioBusDoor.play();
    }
    scenes.push(scene4);

    var scene5 = new Scene(5, ST);
    scene5.isShowingSpeech = false;
    scene5.chars.push(gabriel); //Gabriel
    scene5.chars.push(julia); //Julia
    scene5.draw = function () {
        var frame1 = {
            x: worlds[0].x,
            y: worlds[0].y + SEPARATOR_SIZE,
            width: worlds[0].width,
            height: worlds[0].height - SEPARATOR_SIZE
        }
        var frame2 = {
            x: worlds[1].x,
            y: worlds[1].y + SEPARATOR_SIZE,
            width: worlds[1].width,
            height: worlds[1].height - SEPARATOR_SIZE
        }

        var h = frame1.height - SEPARATOR_SIZE;
        var w = images[12].img.width * h / images[12].img.height;
        this.rect1 = {
            x: frame1.width - w + SEPARATOR_SIZE / 2,
            y: frame1.y,
            w: images[12].img.width * h / images[12].img.height,
            h: frame1.height - SEPARATOR_SIZE
        };

        this.rect2 = {
            x: frame2.x + SEPARATOR_SIZE / 2,
            y: frame2.y,
            w: images[12].img.width * h / images[12].img.height,
            h: this.rect1.h
        };

        hasMiddleSeparator = false;
        //BOY SCENARIO
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + WORLD_COLORS.noon.r + ',' + WORLD_COLORS.noon.g + ',' + WORLD_COLORS.noon.b + ',1)'
        ctx.fillRect(this.rect1.x, this.rect1.y, 2 * this.rect1.w, this.rect1.h);
        ctx.closePath();
        ctx.drawImage(images[12].img, 0, 0,
            images[12].img.width, images[12].img.height,
            this.rect1.x,
            this.rect1.y,
            this.rect1.w,
            this.rect1.h);

        //GIRL SCENARIO
        ctx.drawImage(images[12].img, 0, 0,
            images[12].img.width, images[12].img.height,
            this.rect2.x,
            this.rect2.y,
            this.rect2.w,
            this.rect2.h);

        //SCHOOL
        ctx.drawImage(images[13].img, 0, 0,
            images[13].img.width, images[13].img.height,
            this.rect1.x + this.rect1.w / 2,
            this.rect1.y - this.rect1.h * 0.05,
            this.rect1.w,
            this.rect1.h);


        gabriel.draw();
        gabriel.animate();

        if (this.currentTime == 0) {
            gabriel.scale(1, worlds[0].height / 3);
            gabriel.x = this.rect1.x;
            gabriel.startAnimation(gabriel.hp + '_walk_right');
            gabriel.offTime = 4;
            gabriel.anim0 = 4;
            gabriel.speed = 0.2;

            julia.scale(1, worlds[0].height / 3);
            julia.x = this.rect2.x + this.rect2.w - julia.width;
            julia.startAnimation(julia.hp + '_walk_left');
            julia.offTime = 4;
            julia.anim0 = 4;
            julia.speed = 0.2;
            julia.direction = -1;

            this.isWalking = true;
        }
        gabriel.y = frame1.y + frame1.height - gabriel.height - SEPARATOR_SIZE;

        julia.draw();
        julia.animate();

        julia.y = frame2.y + frame2.height - julia.height - SEPARATOR_SIZE;

        if (this.isAnimating == false || this.isFading == true) {
            ctx.beginPath()
            ctx.fillStyle = 'rgba(0,0,0,' + this.alpha + ')'
            ctx.fillRect(this.rect1.x, this.rect1.y, this.rect1.w, this.rect1.h);
            ctx.fillRect(this.rect2.x, this.rect2.y, this.rect2.w, this.rect2.h);
            ctx.closePath()
        }

    }
    scene5.animate = function () {
        if (this.currentTime == this.time) {
            this.isAnimating = false;
        }
    }
    scenes.push(scene5);

    var scene6 = new Scene(6, ST);
    scene6.isShowingSpeech = false;
    scene6.chars.push(gabriel); //Gabriel
    scene6.chars.push(julia); //Julia
    scene6.draw = function () {
        var frame1 = {
            x: worlds[0].x,
            y: worlds[0].y + SEPARATOR_SIZE,
            width: worlds[0].width,
            height: worlds[0].height - SEPARATOR_SIZE
        }
        var frame2 = {
            x: worlds[1].x,
            y: worlds[1].y + SEPARATOR_SIZE,
            width: worlds[1].width,
            height: worlds[1].height - SEPARATOR_SIZE
        }

        var h = frame1.height - SEPARATOR_SIZE;
        var w = images[12].img.width * h / images[12].img.height;
        this.rect1 = {
            x: frame1.width - w + SEPARATOR_SIZE / 2,
            y: frame1.y,
            w: images[12].img.width * h / images[12].img.height,
            h: frame1.height - SEPARATOR_SIZE
        };

        this.rect2 = {
            x: frame2.x + SEPARATOR_SIZE / 2,
            y: frame2.y,
            w: images[12].img.width * h / images[12].img.height,
            h: this.rect1.h
        };

        hasMiddleSeparator = false;
        //BOY SCENARIO
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + WORLD_COLORS.noon.r + ',' + WORLD_COLORS.noon.g + ',' + WORLD_COLORS.noon.b + ',1)'
        ctx.fillRect(this.rect1.x, this.rect1.y, 2 * this.rect1.w, this.rect1.h);
        ctx.closePath();
        ctx.drawImage(images[12].img, 0, 0,
            images[12].img.width, images[12].img.height,
            this.rect1.x,
            this.rect1.y,
            this.rect1.w,
            this.rect1.h);

        //GIRL SCENARIO
        ctx.drawImage(images[12].img, 0, 0,
            images[12].img.width, images[12].img.height,
            this.rect2.x,
            this.rect2.y,
            this.rect2.w,
            this.rect2.h);

        //SCHOOL
        ctx.drawImage(images[13].img, 0, 0,
            images[13].img.width, images[13].img.height,
            this.rect1.x + this.rect1.w / 2,
            this.rect1.y - this.rect1.h * 0.05,
            this.rect1.w,
            this.rect1.h);




        if (this.currentTime == 0) {
            gabriel.scale(1, worlds[0].height / 3);
            gabriel.x = this.rect1.x + this.rect1.w / 2;
            gabriel.y = frame1.y + frame1.height - gabriel.height - SEPARATOR_SIZE;
            gabriel.startAnimation(gabriel.hp + '_idle_right');
            gabriel.offTime = 8;

            julia.scale(1, worlds[0].height / 3);
            julia.x = this.rect2.x + this.rect2.w / 2 - julia.width;
            julia.y = frame2.y + frame2.height - julia.height - SEPARATOR_SIZE;
            julia.startAnimation(julia.hp + '_idle_left');
            julia.offTime = 8;

            alex.scale(1, worlds[0].height / 3.5);
            alex.x = julia.x - alex.width / 2;
            alex.y = frame2.y + frame2.height - alex.height - SEPARATOR_SIZE;
            alex.startAnimation(alex.hp + '_idle_right');
            alex.offTime = 8;

            isabela.scale(1, worlds[0].height / 3);
            isabela.x = alex.x - isabela.width;
            isabela.y = frame2.y + frame2.height - isabela.height - SEPARATOR_SIZE;
            isabela.startAnimation(isabela.hp + '_idle_left');
            isabela.offTime = 8;

            leonardo.scale(1, worlds[0].height / 3);
            leonardo.x = isabela.x - leonardo.width;
            leonardo.y = frame2.y + frame2.height - leonardo.height - SEPARATOR_SIZE;
            leonardo.startAnimation(leonardo.hp + '_idle_right');
            leonardo.offTime = 8;


            monica.scale(1, worlds[0].height / 3);
            monica.x = leonardo.x - monica.width;
            monica.y = frame2.y + frame2.height - monica.height - SEPARATOR_SIZE;
            monica.startAnimation(monica.hp + '_idle_left');
            monica.offTime = 8;

            pedro.scale(1, worlds[0].height / 3);
            pedro.x = monica.x - pedro.width;
            pedro.y = frame2.y + frame2.height - pedro.height - SEPARATOR_SIZE;
            pedro.startAnimation(pedro.hp + '_idle_left');
            pedro.offTime = 8;

            gabriel.x = pedro.x - gabriel.width;

            this.isWalking = false;
        }


        gabriel.draw();
        gabriel.animate();
        julia.draw();
        julia.animate();
        alex.draw();
        alex.animate();
        isabela.draw();
        isabela.animate();
        leonardo.draw();
        leonardo.animate();
        monica.draw();
        monica.animate();
        pedro.draw();
        pedro.animate();




        if (this.isAnimating == false || this.isFading == true) {
            ctx.beginPath()
            ctx.fillStyle = 'rgba(0,0,0,' + this.alpha + ')'
            ctx.fillRect(this.rect1.x, this.rect1.y, this.rect1.w, this.rect1.h);
            ctx.fillRect(this.rect2.x, this.rect2.y, this.rect2.w, this.rect2.h);
            ctx.closePath()
        }

    }
    scene6.animate = function () {
        if (this.currentTime == this.time) {
            this.isAnimating = false;
        }
    }
    scenes.push(scene6);

    var scene7 = new Scene(7, 5000);
    scene7.isShowingSpeech = false;
    scene7.chars.push(gabriel);
    scene7.chars.push(julia);
    scene7.draw = function () {
        var frame1 = {
            x: worlds[0].x + SEPARATOR_SIZE,
            y: worlds[0].y + SEPARATOR_SIZE,
            width: worlds[0].width - SEPARATOR_SIZE,
            height: worlds[0].height - SEPARATOR_SIZE
        }
        var frame2 = {
            x: worlds[1].x,
            y: worlds[1].y + SEPARATOR_SIZE,
            width: worlds[1].width - SEPARATOR_SIZE,
            height: worlds[1].height - SEPARATOR_SIZE
        }

        var h = frame1.height - SEPARATOR_SIZE;
        var w = images[15].img.width * h / images[15].img.height;
        var x = frame1.width - w + SEPARATOR_SIZE / 2;

        this.rect1 = {
            x: x,
            y: frame1.y,
            w,
            h
        };

        ctx.drawImage(images[15].img, 0, 0,
            images[15].img.width, images[15].img.height,
            this.rect1.x,
            this.rect1.y,
            this.rect1.w, this.rect1.h);

        w = images[14].img.width * h / images[14].img.height;

        this.rect2 = {
            x: frame2.x + SEPARATOR_SIZE / 2,
            y: frame2.y,
            w,
            h
        };

        ctx.drawImage(images[14].img, 0, 0,
            images[14].img.width, images[14].img.height,
            this.rect2.x,
            this.rect2.y,
            this.rect2.w,
            this.rect2.h);
        
        gabriel.x = this.rect1.x + this.rect1.w/4;
        gabriel.y = this.rect1.y + this.rect1.h - gabriel.height - 2*SEPARATOR_SIZE;
        julia.x = this.rect2.x + this.rect2.w/2;
        julia.y = this.rect2.y + this.rect2.h - julia.height - 3* SEPARATOR_SIZE;

        gabriel.draw();
        gabriel.animate();
        julia.draw();
        julia.animate();

        if (this.isAnimating == false || this.isFading == true) {
            ctx.beginPath()
            ctx.fillStyle = 'rgba(0,0,0,' + this.alpha + ')'
            ctx.fillRect(this.rect1.x, this.rect1.y, this.rect1.w, this.rect1.h);
            ctx.fillRect(this.rect2.x, this.rect2.y, this.rect2.w, this.rect2.h);
            ctx.closePath()
        }

    }
    scene7.animate = function () {
        if (this.isAnimating == true) {
            if (this.currentTime == 1) {
                gabriel.startAnimation(gabriel.hp + '_video_right');
                gabriel.anim0 = 4;
            }
            if (this.currentTime == 2) {
                julia.startAnimation(julia.hp + '_video_left');
                julia.anim0 = 4;
            }
        }
    }
    scene7.startScene = function () {
        gabriel.scale(1, worlds[0].height * 0.5);
        julia.scale(1, worlds[0].height * 0.5);
        gabriel.startAnimation(gabriel.hp + '_video_right');
        gabriel.anim0 = 4;
        julia.startAnimation(julia.hp + '_video_left');
        julia.anim0 = 4;
        gabriel.x = this.rect1.x + this.rect1.w/4;
        gabriel.y = this.rect1.y + this.rect1.h - gabriel.height - 2*SEPARATOR_SIZE;
        julia.x = this.rect2.x + this.rect2.w/2;
        julia.y = this.rect2.y + this.rect2.h - julia.height - 3* SEPARATOR_SIZE;
        this.isAnimating == true;
        startDialog();
    }
    scenes.push(scene7);
}

function setScene(number) {
    current_scene = number;
    if (current_scene < scenes.length) {
        scenes[current_scene].startAnimation();
    }
}

class Scene {
    constructor(number, time) {
        this.number = number || -1;
        this.time = time || 30;
        this.tick = 0;
        this.currentTime = 0;
        this.isWalking = false;
        this.chars = [];
        this.isAnimating = false;
        this.rect1 = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        this.rect2 = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        this.alpha = 1;
        this.isFading = true;
    }
    draw() {

    }
    startAnimation() {
        hasMiddleSeparator = true;
        
        var self = this;
        this.currentTime = 0;
        this.startScene();
        this.isAnimating = true;
        this.isFading = true;
        this.isWalking = false;
        this.alpha = 1;
        this.interval = setInterval(function () {
            self.animateFull()
        }, 1000);
    }
    startScene() {

    }
    animateFull() {
        this.currentTime++;
        this.animate();

        if (this.currentTime == this.time) {
            this.clear();
        }
    }
    animate() {
        console.log(this.currentTime, this.time);
    }
    clear() {
        clearInterval(this.interval);
        this.isAnimating = false;
        this.isWalking = false;
    }
    start() {
        this.isFading = false;
    }
}
