/**
 * Tensorflow game
 * Author: Pedro Cacique
 * Version: 1.0.0
 * 2022
 */

const FPS = 1000 / 30;
let speed = 0.1;
let canvas, ctx, npc, player;
let images = new Map();
let minPos = {x:0, y:0}, maxPos = {x:0, y:0};
let musicTime = 0;
let songData, currentSong = 0, audio, interval, regressiveInterval;
let isDrawingMessage = false;
let drawingNumber = -1;
let timerColors = ["#f39c12","#d35400","#c0392b"];
let video, snapTimes;
let isPlaying = false;
let particles = [];
let rightCount = 0, playerRightCount = 0;
let isShowingFinalScore = false;

window.onload = function () {
    loadData();
    document.getElementById("buttonPlay").onclick = function(){
        if(!isPlaying) play();
        else {
            stop();
        }
    }
}

window.onresize = function(){
    setupCanvas();
    setupPlayers();
}

// load images before start
async function loadData(){
    const response = await fetch("./src/songData.json");
    songData = await response.json();
    loadImages();
}

/**
 * Load all images and call start method
 */
function loadImages() {
    const imageNames = ["character0", "hand_left", "hand_right", "arm_left", "arm_right", "player_hand_left", "player_hand_right", "star_full", "star_empty"];
    imageNames.forEach(name => {
        var image = new Image();
        image.src = "./img/"+name+".png";
        image.onload = function(){
            images.set(name, image);
            if(images.size == imageNames.length){
                start();
            }
        }
    });
}

/**
 * Start game
 */
function start(){
    setupCanvas();
    setupPlayers();
    startCamera();
    setInterval(gameloop, FPS);
}
/**
 * Pre define all times when the game will take a snapshot
 */
function setSnapTimes(){
    snapTimes = new Set();
    for(let i=0; i<3; i++){
        let t = 0;
        do{
            t = parseFloat((Math.random() * songData[currentSong].duration - 0.1).toFixed(1));
            snapTimes.add(t);
        } while(!snapTimes.has(t));
    }
}

/**
 * Game loop called FPS times per second
 */
function gameloop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    npc.drawBody(ctx);
    npc.drawArms(ctx);
    npc.drawHands(ctx);
    player.drawHands(ctx);

    let posLeft = { x: player.hands.get(LEFT).position.x + player.hands.get(LEFT).width/2,
                y: player.hands.get(LEFT).position.y + player.hands.get(LEFT).height/2};

    let posRight = { x: player.hands.get(RIGHT).position.x + player.hands.get(RIGHT).width/2,
                y: player.hands.get(RIGHT).position.y + player.hands.get(RIGHT).height/2};

    if(posLeft.y > 2 * canvas.height/3){
        player.hands.get(LEFT).isEnable = true;
    }

    if(posRight.y > 2 * canvas.height/3){
        player.hands.get(RIGHT).isEnable = true;
    }

    moveHand(LEFT);
    moveHand(RIGHT);

    if(isDrawingMessage){
        drawNumber(drawingNumber);
    } else{
        document.getElementById('timer').innerHTML = "";
    }

    for(particle of particles){
        particle.alpha -= 0.1
        particle.position.x += particle.speedX;
        particle.position.y += particle.speedY;
        drawParticle(particle);
        if(particle.alpha <= 0) {
            particles = particles.filter(function(p) { return p.name != particle.name; });
        }
    }
    
    if(isShowingFinalScore){
        showFinalScore();
    }
}

/**
 * Draw a single particle
 * @param {Particle} particle 
 */
function drawParticle(particle){
    ctx.beginPath()
    ctx.fillStyle = "rgba("+particle.r+", "+particle.g+", "+particle.b+", "+particle.alpha+")";
    ctx.fillRect(particle.position.x, particle.position.y, particle.radius, particle.radius)
    
}

/**
 * Move a hand based on a linear movement
 * @param {String} hand 
 */
function moveHand(hand){
    let handObject = npc.hands.get(hand);
    if(handObject.isMoving){
        handObject.t += handObject.speed;
        let playerHand = hand == LEFT ? RIGHT : LEFT;

        if(handObject.t >= 1){
            handObject.speed *= -1;

            let accuracyX = (Math.abs(npc.hands.get(hand).position.x - player.hands.get(playerHand).position.x) / canvas.height).toFixed(2);
            let accuracyY = (Math.abs(npc.hands.get(hand).position.y - player.hands.get(playerHand).position.y) / canvas.height).toFixed(2);
            if(accuracyX <= 0.2 && accuracyY <= 0.2 && player.hands.get(playerHand).isEnable) {
                player.score++;
                document.getElementById('score').innerHTML = player.score;
                addParticles(playerHand);
                playerRightCount++;
            }

            rightCount++;

        } else if(handObject.t <= 0){
            handObject.isMoving = false
            handObject.speed = speed;
        } else if(handObject.t < 0.6 && handObject.speed<0){
            player.hands.get(playerHand).isEnable = false;
        }


        handObject.position.y = map(handObject.t, 0, 1, minPos.y, maxPos.y);
        let offX = (hand == LEFT) ? npc.hands.get(hand).width * 0.05 : npc.hands.get(hand).width*0.25;
        npc.arms.get(hand).position = {
            x: npc.hands.get(hand).position.x + offX,
            y: npc.hands.get(hand).position.y + 3*npc.hands.get(hand).height/4
        }
    }
}

/**
 * Add visual feedback when user raise a correct hand
 * @param {String} hand 
 */
function addParticles(hand){
    let posX = player.hands.get(hand).position.x + player.hands.get(hand).width/2
    let posY = player.hands.get(hand).position.y + player.hands.get(hand).height/2
    for(let i=0; i<20; i++){
        particles.push(
            { 
                position: {x: posX, y: posY},
                speedX: getRandomInt(-30,30),
                speedY: getRandomInt(-30,30),
                radius: getRandomInt(10,30),
                r: getRandomInt(50,100),
                g: getRandomInt(150,200),
                b: getRandomInt(200,255),
                alpha: 1,
                name: i
            }
        )
    }
}

/**
 * Initialize player and NPC
 */
function setupPlayers(){
    // initialize NPC and set it's properties
    npc = new Player(
        {x:0, y:0, z:0}, 
        canvas.height * 0.8, 
        images.get('character0'),
        images.get('hand_left'),
        images.get('hand_right'),
        images.get('arm_left'),
        images.get('arm_right')
    );

    npc.position = { x: canvas.width/2 - npc.width/2, y: canvas.height - npc.height };
    const lHand = npc.hands.get(LEFT);
    const rHand = npc.hands.get(RIGHT);

    minPos.y = npc.position.y + npc.height/2 + lHand.height/2;
    maxPos.y = npc.hands.get(LEFT).position.y + npc.hands.get(LEFT).height/2;
    
    lHand.position = {
        x:npc.position.x + npc.width - lHand.width/2, 
        y:minPos.y
    }
    rHand.position = {
        x:npc.position.x - npc.width + rHand.width * 1.1, 
        y:minPos.y
    }

    npc.arms.get(LEFT).position = {
        x: npc.hands.get(LEFT).position.x,
        y: npc.hands.get(LEFT).position.y + npc.hands.get(LEFT).height
    }

    npc.arms.get(RIGHT).position = {
        x: npc.hands.get(LEFT).position.x,
        y: npc.hands.get(LEFT).position.y + npc.hands.get(RIGHT).height
    }

    // initialize Player and set it's properties
    player = new Player(
        {x:0, y:0, z:0}, 
        canvas.height * 0.8, 
        images.get('character0'),
        images.get('player_hand_left'),
        images.get('player_hand_right'),
        images.get('arm_left'),
        images.get('arm_right')
    );

    player.position = npc.position;
    player.hands.get(LEFT).setPosition({
        x:npc.hands.get(RIGHT).position.x, 
        y: map(0,0,1,minPos.y, maxPos.y)
    });
    player.hands.get(RIGHT).setPosition({
        x:npc.hands.get(LEFT).position.x, 
        y: map(0,0,1,minPos.y, maxPos.y)
    });
   
}

/**
 * Set canvas default settings
 */
function setupCanvas() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    w = canvas.offsetWidth;
    h = canvas.offsetHeight;

    canvas.style.backgroundColor = "rgb(239, 241, 242)";
}

/**
 * Start showing camera on <video>
 */
async function startCamera() {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        video = document.getElementById("video");

        const config = {
            video: {
                width: {
                    min: 1280,
                    max: 1920,
                },
                height: {
                    min: 720,
                    max: 1080
                }
            }
        }
        const videoStream = await navigator.mediaDevices.getUserMedia(config);
        video.srcObject = videoStream
        video.style.transform = "scaleX(-1)";
        startDetection(video);
    }

}

/**
 * Start hand detection based on <video>
 * @param {HTMLElement} video 
 */
async function startDetection(video) {

    const hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });
    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    hands.onResults(onResults);

    var video = document.getElementById("video");
    const camera = new Camera(video, {
        onFrame: async () => {
            await hands.send({ image: video });
        },
        width: 1280,
        height: 720
    });
    camera.start();
}

/**
 * Handler for hand(s) recognition
 * @param {Array<Object>} results 
 */
function onResults(results) {
    if (results.multiHandLandmarks) {

        player.hands.get(LEFT).position = player.hands.get(LEFT).resetPosition;
        player.hands.get(RIGHT).position = player.hands.get(RIGHT).resetPosition;

        for (const landmarks of results.multiHandLandmarks) {
            let handWidth = player.hands.get(LEFT).width;
            let handHeight = player.hands.get(LEFT).height;
            let pos = {
                x: (1-landmarks[0].x) * canvas.width - handWidth/2, 
                y:landmarks[0].y * canvas.height - canvas.height/2 + handHeight/2, 
                z:landmarks[0].z}
            let playerHand = (landmarks[1].x < landmarks[0].x) ? LEFT : RIGHT;
                
            let angle = Math.atan2(landmarks[1].y - landmarks[0].y,  landmarks[1].x - landmarks[0].x);
            player.hands.get(playerHand).position = pos;
            player.hands.get(playerHand).rotation = angle;
        }
    }
}


function drawNumber(num){
    if(num<=0 || num>3 ){ 
        document.getElementById('timer').innerHTML = "";
    } else {
        drawingNumber = num;
        document.getElementById('timer').innerHTML = num;
        document.getElementById('timer').style.color = timerColors[timerColors.length - num];
    }
    
}

function lerp(value1, value2, amount){
    return value1 + (value2-value1) * amount;
}

function smooth(value1, value2, amount){
    return lerp(value1, value2, Math.pow(amount, 3) * (3 - 2*amount));
}

function raiseHand(hand){
    let handObject = npc.hands.get(hand);
    handObject.isMoving = true;
}

function map(value, start1, end1, start2, end2){
    return ((value - start1)*(end2 - start2))/(end1 - start1) + start2;
}

function play(){

    rightCount = 0;
    playerRightCount = 0;
    isShowingFinalScore = false;
    player.score = 0;
    isPlaying = true;
    setSnapTimes();
    document.getElementById('score').innerHTML = "0 ";
    document.getElementById('photos').innerHTML = "";
    let data = songData[currentSong];
    
    npc.hands.get(LEFT).speed = data.speed;
    npc.hands.get(RIGHT).speed = data.speed;
    speed = data.speed;

    let map = new Map();
    for (let i=0; i<data.poses.length; i++){
        map.set(data.poses[i].time, data.poses[i].pose);
    }

    let musicTime = 0; 
    audio = new Audio("./src/"+data.file);

    let count = 3;
    document.getElementById("buttonPlay").style.display = "none";

    regressiveInterval = setInterval(function(){
        isDrawingMessage = true;
        drawingNumber = count;
        count--;
    
        if(count == -1){
            
            audio.play();
            document.getElementById("buttonPlay").style.display = "flex";
            document.getElementById("imgPlay").src = './img/stop.png';
            document.getElementById('buttonPlay').style.backgroundColor = "#e74c3c";
            isPlaying = true;
            isDrawingMessage = false;
    
            interval = setInterval(function(){
                musicTime += 0.1
                musicTime = Math.round(musicTime * 10) / 10;
                
                if(map.has(musicTime)){
                    instruction = map.get(musicTime);
                    if(instruction == 'both'){
                        raiseHand(LEFT);
                        raiseHand(RIGHT);
                    } else {
                        raiseHand(instruction);
                    }
                }
                if(snapTimes.has(musicTime)){
                    snap();
                }
                if(musicTime >= data.duration){
                    showPhotos();
                    isShowingFinalScore = true
                    clearInterval(interval);
                    isPlaying = false;
                    document.getElementById("imgPlay").src = './img/play.png';
                    document.getElementById('buttonPlay').style.backgroundColor = "#27ae60";
                }
            }, 100);

            clearInterval(regressiveInterval);
        }
    }, 1000);
}

function showPhotos(){
    var element = document.getElementById("photos");
    for(child of element.children){
        child.style.display = "block";
    }
}

function snap() {
    let canvas = document.createElement('canvas');
    var element = document.getElementById("photos");
    let angles = [-15,10,-5];

    let canvasWidth = window.innerWidth / 4;
    let canvasHeight = video.videoHeight * canvasWidth / video.videoWidth;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let context = canvas.getContext('2d');
    
    ratio = video.videoWidth/video.videoHeight;
    
    context.fillRect(0,0,video.videoWidth,video.videoHeight);
    context.drawImage(video,0,0,video.videoWidth,video.videoHeight, 0, 0, canvasWidth, canvasHeight);

    let angle = angles[element.children.length];
    canvas.style.transform = "rotateZ("+angle+"deg)";
    canvas.style.display = "none";

    element.appendChild(canvas);
}

function stop() {
    clearInterval(interval);
    clearInterval(regressiveInterval);
    isDrawingMessage = false;
    drawingNumber = -1;
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    document.getElementById("imgPlay").src = './img/play.png';
    document.getElementById('buttonPlay').style.display = "flex";
    document.getElementById('buttonPlay').style.backgroundColor = "#27ae60";
}


function getRandomInt(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function showFinalScore(){
    let rate = playerRightCount / rightCount;
    let numStars = 0;
    if(rate > 0 ){
        if(rate <= 0.3) {
            numStars = 1;
        }
        else if(rate <= 0.6) {
            numStars = 2;
        } else {
            numStars = 3;
        }
    }

    let size = canvas.height * 0.1;
    let posX = 30;
    let posY = canvas.height / 2 - size/2;
    
    for (i=0; i<3; i++){
        let image = images.get(i<numStars ? "star_full" : "star_empty");
        ctx.drawImage(image,0,0,image.width,image.height, posX, posY, size, size);
        posX += size + 10;
    }
    
}