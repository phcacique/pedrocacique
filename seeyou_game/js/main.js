//GLOBAL VARIABLES
var canvas, ctx, worlds = [],
    game_info,
    contSB = 0,
    isSaying = false,
    textArea,
    images = [{
        img: null,
        src: "img/iPhone_youtuber.png" //0
    }, {
        img: null,
        src: "img/picker.png" //1
    }, {
        img: null,
        src: "img/scenarios/girl_bedroom_light.png" //2
    }, {
        img: null,
        src: "img/scenarios/boy_bedroom_light.png" //3
    }, {
        img: null,
        src: "img/speeches/toast.png" //4
    }, {
        img: null,
        src: "img/speeches/toast2.png" //5
    }, {
        img: null,
        src: "img/scenarios/girl_room.png" //6
    }, {
        img: null,
        src: "img/scenarios/boy_room.png" //7
    }, {
        img: null,
        src: "img/scenarios/girl_house.png" //8
    }, {
        img: null,
        src: "img/scenarios/boy_house.png" //9
    }, {
        img: null,
        src: "img/scenarios/girl_city.png" //10
    }, {
        img: null,
        src: "img/scenarios/boy_city.png" //11
    }, {
        img: null,
        src: "img/scenarios/road.png" //12
    }, {
        img: null,
        src: "img/scenarios/school.png" //13
    }, {
        img: null,
        src: "img/scenarios/girl_bedroom_dark.png" //14
    }, {
        img: null,
        src: "img/scenarios/boy_bedroom_dark.png" //15
    }],
    cont = 0,
    SEPARATOR_SIZE = 10,
    iPhone;

var isMUTE = false;

var scenes = [];
var current_scene = 0;
var hasMiddleSeparator = true;
var startSaying = false,
    contSaying = 0;

var characters = [];

var LAST_DAY = "0_0",
    DAY = "0_0",
    PARAGRAPH = 0,
    PHRASE = 0,
    OP = 0,
    DAYTIME = 120; //day duration in seconds

//CONSTANTS
const WORLD_HEIGHT = 0.6,
    TOPBAR_SIZE = 0.05,
    BGCOLOR = "#f0f0f0",
    NEXT = 'Próximo',
    FPS = 12 / 1000;

const WORLD_COLORS = {
    day: {
        r: 130,
        g: 215,
        b: 247
    },
    noon: {
        r: 82,
        g: 175,
        b: 211
    },
    sunset: {
        r: 247,
        g: 184,
        b: 130
    },
    night: {
        r: 96,
        g: 115,
        b: 219
    },
    disabled: {
        r: 240,
        g: 240,
        b: 240
    }
};

//WINDOW ON LOAD
window.onload = function () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = "low";
    textArea = document.getElementById('console');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.style.backgroundColor = BGCOLOR;
    loadAudio();
    setMute();
    window.onresize = function (event) {
        location.reload();
    };
    loadJSON('js/data.json', function (response) {
        game_info = JSON.parse(response);
        loadImages();
    });

}

var audioFun = new Audio();
var audioFootstep = new Audio();
var audioPeople = new Audio();
var audioStreet = new Audio();
var audioBus = new Audio();
var audioDoor = new Audio();
var audioBusDoor = new Audio();
var audioClick = new Audio();

function loadAudio() {
    audioFun.addEventListener('loadeddata', function () {
        if (!isMUTE) audioFun.play();
    }, false);

    audioFun.loop = true;
    audioFun.src = 'audio/FUN.wav';

    audioFootstep.loop = true;
    audioFootstep.src = 'audio/FOOTSTEP.wav';

    audioPeople.loop = true;
    audioPeople.src = 'audio/peoplesound.wav';

    audioStreet.loop = true;
    audioStreet.src = 'audio/streetsound.wav';

    audioBus.loop = true;
    audioBus.src = 'audio/bussound.wav';

    audioDoor.src = 'audio/CLOSINGTHEDOOR.wav';
    audioBusDoor.src = 'audio/busopeningthedoor.wav';
    audioClick.src = 'audio/click.wav';
}

function setMute() {
    console.log('SET MUTE');
    isMUTE = !isMUTE;
    if (isMUTE) {
        audioFun.pause();
        document.getElementById('music').src = "img/music_not.png";
    } else {
        audioFun.play();
        document.getElementById('music').src = "img/music.png";
    }
}

function searchAnimation(obj, name) {
    var anim = null;
    for (var i = 0; i < obj.animations.length; i++) {
        if (obj.animations[i].name == name) return obj.animations[i];
    }
    return anim;
}

var imgNum = 0;
var testNum = 0;

function createChar(name, states, phases, isChar = true) {
    var c = new Character(name, 2);
    characters.push(c);
    if(isChar){
        imgNum += phases.length * 2 * states.length;
    } else {
        imgNum += phases.length * states.length;
    }
    loadCharNew(c, name, states, phases, isChar);
}

function loadCharNew(target, name, states, phases, isChar = true) {
    for (var j = 0; j < phases.length; j++) {
        for (var i = 0; i < states.length; i++) {
            if(isChar){
                loadImage(target, name, "left", phases[j], states[i]);
                loadImage(target, name, "right", phases[j], states[i]);   
            } else {
                loadImage(target, name, null, phases[j], states[i]); 
            }
        }
    }
}

function addImageProcess(src) {
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

async function loadImage(target, name, direction, phase, state) {
    var url = "img/characters/" + name + "/" + phase + "/";
    var object = {};
    let response = await fetch(url + state +( (direction!=null)?("_" + direction):"" )+ ".json");
    object.info = await response.json();
    object.img = await addImageProcess(url + state + ( (direction!=null)?("_" + direction):"" ) + ".png");
    object.name = (direction!=null)?(phase + "_" + state + "_" + direction):state;
    target.animations.push(object);
    testNum++;
    endTest();
}

async function loadImage2(target, name, json, img) {
    imgNum++;
    var object = {};
    let response = await fetch(json);
    object.info = await response.json();
    object.img = await addImageProcess(img);
    object.name = name;
    target.status = name;
    target.animations.push(object);
    testNum++;
    endTest();
}

function endTest() {
    if (testNum == imgNum) {
        setup();
    }
}

function loadChars() {
    createChar("gabriel", ['idle', 'sitting', 'video', 'walk'], [1, 2, 3, 4, 5]);
    createChar("julia", ['idle', 'sitting', 'video', 'walk'], [1, 2, 3, 4, 5]);
    createChar("milton", ['idle', 'sitting'], [5]);
    createChar("lu", ['idle'], [5]);
    createChar("cleide", ['idle'], [5]);
    createChar("alex", ['idle'], [1, 2, 3, 4, 5]);
    createChar("isabela", ['idle'], [1, 2, 3, 4, 5]);
    createChar("leonardo", ['idle'], [1, 2, 3, 4, 5]);
    createChar("monica", ['idle'], [1, 2, 3, 4, 5]);
    createChar("pedro", ['idle'], [1, 2, 3, 4, 5]);
    
    iPhone = new Phone();
    loadImage2(iPhone, 'launchscreen', 'img/iPhone_launchscreen/iPhone_launchscreen.json', 'img/iPhone_launchscreen/iPhone_launchscreen.png');
    
    iPhone.youtuber = new Character("youtuber");
    loadImage2(iPhone.youtuber, 'idle', 'img/characters/youtuber/youtuber_idle.json', 'img/characters/youtuber/youtuber_idle.png');
    loadImage2(iPhone.youtuber, 'talk', 'img/characters/youtuber/youtuber_talk.json', 'img/characters/youtuber/youtuber_talk.png');
    
    createChar("car", ['car'], [5], false);    
    createChar("bus", ['bus', 'busback'], [5], false);
}

//LOAD IMAGES
function loadImages() {
    if (cont < images.length) {
        images[cont].img = new Image();
        images[cont].img.src = images[cont].src;
        images[cont].img.onload = loadImages;
        cont++;
    } else {
        loadChars();
    }
}

//INITIAL SETUP
function setup() {
    console.log("--- SETUP ---");

    document.getElementById('loader').style.display = 'none';

    var w = new World();
    var w2 = new World(innerWidth / 2);
    w.y = innerHeight * TOPBAR_SIZE
    w2.y = innerHeight * TOPBAR_SIZE
    worlds.push(w);
    worlds.push(w2);
    iPhone.scale(1, innerHeight * 0.35);
    var space = (innerHeight - worlds[0].height - TOPBAR_SIZE - iPhone.height) / 2;
    SEPARATOR_SIZE = space;
    iPhone.setPos(space,
        ((innerHeight * (1 - WORLD_HEIGHT)) - innerHeight * TOPBAR_SIZE - iPhone.height) / 2 + worlds[0].y + worlds[0].height - 5);

    iPhone.youtuber.offTime = 1;
    iPhone.youtuber.startAnimation('idle');

    iPhone.youtuber.scale(1, iPhone.height * 0.8);
    iPhone.youtuber.x = iPhone.x + iPhone.width / 2 - iPhone.youtuber.width / 2;
    iPhone.youtuber.y = iPhone.y + (iPhone.height - iPhone.youtuber.height) - iPhone.height * 0.1;

    textArea.style.width = (innerWidth - iPhone.width - 3 * space) + "px";
    textArea.style.bottom = space + "px";
    textArea.style.right = space + "px";
    textArea.style.height = (iPhone.height - 1.5 * space) + "px";


    for (var i = 0; i < characters.length; i++) {
        characters[i].scale(1, worlds[0].height * 0.5);
    }

    characters[0].x = worlds[0].x;
    characters[0].y = worlds[0].y;

    characters[0].startAnimation(characters[0].hp + '_idle_right');

    characters[1].x = worlds[1].x;
    characters[1].y = worlds[1].y;

    characters[1].startAnimation(characters[1].hp + '_idle_left');

    createScenes();
    setScene(current_scene);

    setInterval(gameloop, FPS);
}

function startDialog() {
    console.log('startDialog', DAY, LAST_DAY);
    iPhone.openApp();
    goOption(DAY + "_" + OP);
    for (var i = 0; i < characters.length; i++) {
        console.log(characters[i].name, characters[i].hp);
    }
}

function sayNext() {
    console.log('say_next', DAY, PHRASE, PARAGRAPH);
    var el = document.getElementById('nextBut');
    if (el) remove(el);
    if (DAY <= game_info.days.length && PARAGRAPH <= game_info.days[DAY].paragraphs.length && PHRASE <= game_info.days[DAY].paragraphs[PARAGRAPH].phrases.length) {
        if (PHRASE < game_info.days[DAY].paragraphs[PARAGRAPH].phrases.length) {
            say(game_info.days[DAY].paragraphs[PARAGRAPH].phrases[PHRASE], addNextButton);
        }
    }
    PHRASE++;
}

function remove(element) {
    element.parentNode.removeChild(element);
}

//GAMELOOP
function gameloop() {
    iPhone.youtuber.animate();
    iPhone.animate();
    if (current_scene < scenes.length) {
        if (scenes[current_scene].isFading == true) {
            scenes[current_scene].alpha -= 0.01;
            if (scenes[current_scene].alpha <= 0) {
                scenes[current_scene].start();
            }
        } else if (scenes[current_scene].isAnimating && scenes[current_scene].isWalking) {
            for (var i = 0; i < scenes[current_scene].chars.length; i++) {
                scenes[current_scene].chars[i].x += scenes[current_scene].chars[i].direction * scenes[current_scene].chars[i].speed;
            }
        } else if (!scenes[current_scene].isAnimating) {
            scenes[current_scene].alpha += 0.01;
            if (scenes[current_scene].alpha >= 1) {
                scenes[current_scene].clear();
                if (current_scene < scenes.length - 1) {
                    current_scene++;
                    setScene(current_scene);
                }
            }
        }
    }
    draw();
    if (!isMUTE && scenes[current_scene].isWalking) {
        audioFootstep.play();
    } else {
        audioFootstep.pause();
    }

    if (!isMUTE && current_scene == 5) {
        audioPeople.play();
    } else {
        audioPeople.pause();
    }

    if (!isMUTE && current_scene == 3) {
        audioStreet.play();
        //        audioBus.play();
    } else {
        audioStreet.pause();
        //        audioBus.pause();
    }
}

function say(text, handler) {
    var str = "<article><img alt='main character' src='img/avatar.png'/><div class='cbbl -right' id='sb" + contSB + "'>" + text + "</div></article>";
    textArea.innerHTML = str;
    textArea.scrollTop = textArea.scrollHeight + textArea.children.length * 50;

    if (!isMUTE) audioClick.play();

    new Typewriter({
        selector: document.getElementById('sb' + contSB),
        toRotate: [
    text
  ],
        pause: 2000,
        speed: 50,
        handler: handler
    });
    contSB++;
}

function addNextButton() {
    var str = "";
    if (PHRASE < game_info.days[DAY].paragraphs[PARAGRAPH].phrases.length) {
        str = "<article><div class='but' id='nextBut' onclick='sayNext()'>" + NEXT + "</div></article>";
    } else {
        str = "<article>";
        for (var i = 0; i < game_info.days[DAY].paragraphs[PARAGRAPH].options.length; i++) {
            str += "<div class='" + "but2" + "' id='nextBut' onclick='goOption(\"" + game_info.days[DAY].paragraphs[PARAGRAPH].options[i].day + "_" + i + "\")'>" + game_info.days[DAY].paragraphs[PARAGRAPH].options[i].label + "</div>";
        }
        str += "</article>";
    }
    textArea.innerHTML += str;
    textArea.scrollTop = textArea.scrollHeight + textArea.children.length * 50;
}

function goOption(day) {

    if (!isMUTE) audioClick.play();

    var d = day.split('_');
    console.log('MOSTRANDO DIA ', d[0]);
    if (d[0] >= 0) {
        DAY = parseInt(d[0]);
        PHRASE = 0;
        PARAGRAPH = 0;
        if (iPhone.status != "video") iPhone.openApp();
        OP = parseInt(d[1]);
        sayNext();
    } else if (d[0] == -2) {
        location.reload();
    } else {
        current_scene = 0;
        setScene(current_scene);
        textArea.innerHTML = "";
        iPhone.status = "lock";
        textArea.innerHTML = "";
        applyEffects();
        LAST_DAY = game_info.days[DAY].nextDay + "_" + OP;
        DAY = game_info.days[DAY].nextDay + "_" + OP;
    }
}

function applyEffects() {
    var ld = parseInt(LAST_DAY.split('_')[0]);
    var add = game_info.days[ld].paragraphs[PARAGRAPH].options[OP].adds;
    var sub = game_info.days[ld].paragraphs[PARAGRAPH].options[OP].sub;

    for (var i = 0; i < add.length; i++) {
        var c = searchCharacter(add[i].char);
        c.hp += add[i].amount;

        if (c.hp > 5) c.hp = 5;
    }

    for (var i = 0; i < sub.length; i++) {
        var c = searchCharacter(sub[i].char);
        c.hp -= sub[i].amount;
        if (c.hp < 0) c.hp = 0;
    }
}

//DRAW
function draw() {
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw worlds
    for (var i = 0; i < worlds.length; i++) {
        worlds[i].draw();
    }

    if (current_scene < scenes.length) scenes[current_scene].draw();

    //draw separators
    ctx.beginPath();
    ctx.fillStyle = BGCOLOR;
    ctx.fillRect(0, worlds[0].y - 1, innerWidth, SEPARATOR_SIZE); //top
    ctx.fillRect(0, worlds[0].y + innerHeight * WORLD_HEIGHT - SEPARATOR_SIZE + 1, innerWidth, SEPARATOR_SIZE); //bottom
    ctx.fillRect(0, worlds[0].y, SEPARATOR_SIZE, worlds[0].y + innerHeight * WORLD_HEIGHT); //left
    ctx.fillRect(innerWidth - SEPARATOR_SIZE, worlds[0].y, SEPARATOR_SIZE, worlds[0].y + innerHeight * WORLD_HEIGHT); //right
    if (hasMiddleSeparator) ctx.fillRect(innerWidth / 2 - SEPARATOR_SIZE / 2, worlds[0].y, SEPARATOR_SIZE, innerHeight * WORLD_HEIGHT); //middle

    //draw iPhone
    iPhone.draw();  
}

//WORLD
class World {
    constructor(x, y, w, h) {
        this.width = w || innerWidth / 2;
        this.height = h || innerHeight * WORLD_HEIGHT;
        this.x = x || 0;
        this.y = y || 0;

        this.status1 = "disabled"
        this.status2 = "day"
        this.alpha = 1;
        this.alpha2 = 0;
        this.isTransitioning = false;
    }

    draw() {
        var c = WORLD_COLORS[this.status1];
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + c.r + ", " + c.g + ", " + c.b + ", " + this.alpha + ")";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.closePath();

        if (this.isTransitioning) {
            var c = WORLD_COLORS[this.status2];
            ctx.beginPath();
            ctx.fillStyle = "rgba(" + c.r + ", " + c.g + ", " + c.b + ", " + this.alpha2 + ")";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.closePath();
        }
    }

    startTransition(to, time) {
        this.status2 = to || "day";
        this.alpha2 = 0;
        this.time = time || 0;
        this.isTransitioning = true;
        this.cont = 0;
        var self = this;
        this.interval = setInterval(function () {
            self.alpha2 += 1 / self.time;
            if (self.alpha2 >= 1) {
                self.isTransitioning = false;
                self.status1 = self.status2;
                self.alpha2 = 0;
                clearInterval(self.interval);
            }
        }, 1000);
    }


}

//PHONE
class Phone {
    constructor(x, y, width, aspect) {
        this.aspect = aspect || "landscape";
        this.width = width || images[0].img.width;
        this.height = images[0].img.height;
        this.x = x || 0;
        this.y = y || 0;
        this.status = "launch";
        this.slider = new Slider();
        this.setPos(this.x, this.y);
        this.youtuber = new Character('youtuber', this.x + this.width / 2, this.y);
        this.youtuber.scale(1, this.height * 0.8);
        this.animations = [];
        this.isAnimating = false;
        this.frame = 0;
    }
    setPos(x, y) {
        this.x = x;
        this.y = y;
        this.slider.width = this.width * 0.8;
        this.slider.height = this.height * 0.02;
        this.slider.setPos(this.x + this.width * 0.1,
            this.y + this.height - this.slider.height * 2 - (this.height * 0.15));
    }
    draw() {
        if (this.status == "video") {
            ctx.drawImage(images[0].img, 0, 0, images[0].img.width, images[0].img.height, this.x, this.y, this.width, this.height);
            this.youtuber.draw();
            this.slider.draw();
        } else {
            var frame = this.animations[0].info.frames['iPhone_launchscreen' + this.frame + '.png'].frame;
            ctx.drawImage(this.animations[0].img, frame.x, frame.y, frame.w, frame.h, this.x, this.y, this.width, this.height);
        }
    }
    scale(wid, hei) {
        var w = wid || 1;
        var h = hei || 1;
        var width = this.width;
        var height = this.height;
        if (w != 1 && h == 1) {
            width = w;
            height = width * this.height / this.width;
        } else if (w == 1 && h != 1) {
            height = h;
            width = height * this.width / this.height;
        } else if (w != 1 && h != 1) {
            width = w;
            height = h;
        }
        this.width = width;
        this.height = height;
    }
    startVideo() {
        this.youtuber.startAnimation('talk');
        var self = this;
        this.slider.startAnimation(0, 10, DAYTIME, function () {
            self.youtuber.startAnimation('idle');
        });
    }
    openApp(callback) {
        //iPhone.status = "video";
        this.isAnimating = true;
        this.anim = searchAnimation(this, "launchscreen");
        this.totalFrames = Object.keys(this.anim.info.frames).length;
        this.tick = 0;
        this.frame = 0;
    }
    animate() {
        if (this.isAnimating) {
            this.tick++;
            if (this.tick == FPS * 1000) {
                this.tick = 0;
                if (this.frame >= this.totalFrames - 1) {
                    this.frame = 0;
                    this.isAnimating = false;
                    this.status = 'video';
                    this.startVideo();
                } else this.frame++;
            }
        }

    }
}

//SLIDER
class Slider {
    constructor(value, x, y, width, height, color, bgcolor) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 100;
        this.height = height || 5;
        this.color = color || "#af0707";
        this.bgcolor = bgcolor || "rgba(23, 23, 23, 0.34)";
        this.maxvalue = 10;
        this.tick = 0.1;
        this.isAnimating = false;
        this.targetValue = 0;

        this.picker = new Picker(this.x, this.y, this.height * 3, this.height * 3);
        this.setValue(value || 0);
    }
    setPos(x, y) {
        this.x = x;
        this.y = y;
        this.picker.x = x - this.picker.width / 3;
        this.picker.y = y - this.picker.height / 3;
        this.setValue(this.value);
    }
    setValue(value) {
        if (value < 0) this.value = 0;
        else if (this.value > this.maxvalue) this.value = this.maxvalue;
        else this.value = value;

        this.picker.x = this.x + (this.width * this.value / this.maxvalue) - this.picker.width / 2;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.bgcolor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width * this.value / this.maxvalue, this.height);
        ctx.closePath();

        this.picker.draw();
    }
    startAnimation(from, to, time, callback) {
        this.tick = (to - from) / (time * 10);
        this.setValue(from);
        this.targetValue = to;
        this.isAnimating = true;
        var self = this;
        this.callback = callback;
        this.interval = setInterval(function () {
            self.animate();
        }, 100);
    }
    animate() {
        if (this.isAnimating) {
            this.setValue(this.value + this.tick);
            if (this.value >= this.targetValue) {
                this.setValue(this.targetValue);
                this.isAnimating = false;
                clearInterval(this.interval);
                if (this.callback != null) this.callback();
            }
        }
    }
    scale(wid, hei) {
        var w = wid || 1;
        var h = hei || 1;
        var width = this.width;
        var height = this.height;
        if (w != 1 && h == 1) {
            width = w;
            height = width * this.height / this.width;
        } else if (w == 1 && h != 1) {
            height = h;
            width = height * this.width / this.height;
        } else if (w != 1 && h != 1) {
            width = w;
            height = h;
        }
        this.width = width;
        this.height = height;

        this.picker.width = this.height * 3;
        this.picker.height = this.height * 3;
        this.setValue(this.value);
    }
}

//PICKER
class Picker {
    constructor(x, y, width, height) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 20;
        this.height = height || 20;
    }
    draw() {
        ctx.drawImage(images[1].img, 0, 0, images[1].img.width, images[1].img.height, this.x, this.y, this.width, this.height);
    }
    scale(wid, hei) {
        var w = wid || 1;
        var h = hei || 1;
        var width = this.width;
        var height = this.height;
        if (w != 1 && h == 1) {
            width = w;
            height = width * this.height / this.width;
        } else if (w == 1 && h != 1) {
            height = h;
            width = height * this.width / this.height;
        } else if (w != 1 && h != 1) {
            width = w;
            height = h;
        }
        this.width = width;
        this.height = height;
    }
}

//TYPEWRITER
class Typewriter {
    constructor({
        selector,
        toRotate,
        pause,
        speed,
        handler
    }) {
        this.toRotate = toRotate;
        this.el = selector;
        this.speed = speed || 100;
        this.loopNum = 1;
        this.pause = pause || 2000;
        this.txt = '';
        this.isDeleting = false;
        isSaying = true;
        this.tick();
        this.handler = handler || function () {
            console.log("OK")
        };
    }

    tick() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];
        const operator = this.isDeleting ? -1 : +1;
        let delta = this.speed - (Math.random() * 100);

        this.txt = fullTxt.substring(0, this.txt.length + operator);
        this.el.innerHTML = this.txt;

        if (this.isDeleting) delta /= 2;

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.pause;
            isSaying = false;
            this.handler();
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        if (isSaying) setTimeout(() => this.tick(), delta);
    }
}

//CHARACTER
class Character {
    constructor(name, t, x, y, w, h, status) {
        this.x = x || innerWidth / 2;
        this.y = y || innerHeight / 2;
        this.t = t || 1;
        this.width = w || 100;
        this.height = h || 200;
        this.tick = 0;
        this.status = status || "idle";
        this.name = name || "youtuber";
        this.frame = 0;
        this.totalFrames = 0;
        this.animations = [];
        this.hp = 5;
        this.offTime = 8;
        this.anim0 = 0;
        this.anim1 = 0;
        this.direction = 1;
        this.speed = 0.2;
    }

    startAnimation(type) {
        this.status = type;
        var n = parseInt(this.status.split('_')[0]);
        var str = type;
        if (this.status.split('_').length > 1 && n == 0) {
            str = "1" + this.status.substr(1, this.status.length);
        }
        this.anim = searchAnimation(this, str);
        this.totalFrames = Object.keys(this.anim.info.frames).length;
        this.tick = 0;
        this.frame = 0;
        this.anim0 = 0;
        this.anim1 = this.totalFrames - 1;
    }
    animate() {
        this.tick++;
        if (this.tick == this.offTime * FPS * 1000) {
            this.tick = 0;
            if (this.frame >= this.anim1) this.frame = this.anim0;
            else this.frame++;
        }
    }
    draw() {
        if((this.name == "car" || this.name == "bus") && this.status.split('_').length == 1) this.status = this.hp+"_"+this.status;
        var n = parseInt(this.status.split('_')[0]);
        
        if (n > 0 || this.t == 1) {
            var frame;
            if (this.t == 1) frame = this.anim.info.frames[this.name + "_" + this.status + this.frame + ".png"].frame;
            else {
                var n = this.status.substr(2, this.status.length);
                frame = this.anim.info.frames[n + this.frame + ".png"].frame;
            }   
            ctx.drawImage(this.anim.img,
                frame.x,
                frame.y,
                frame.w,
                frame.h,
                this.x,
                this.y,
                this.width,
                this.height);
        }

    }
    scale(wid, hei) {
        var w = wid || 1;
        var h = hei || 1;
        var width = this.width;
        var height = this.height;
        if (w != 1 && h == 1) {
            width = w;
            height = width * this.height / this.width;
        } else if (w == 1 && h != 1) {
            height = h;
            width = height * this.width / this.height;
        } else if (w != 1 && h != 1) {
            width = w;
            height = h;
        }
        this.width = width;
        this.height = height;
    }

}

//------- JSON --------
function loadJSON(file, callback) {
    //    console.log('loading: ' + file)
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
            // Required use of an anonymous callback 
            // as .open() will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

//------- UTIL --------
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
