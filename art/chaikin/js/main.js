var gallery;
var s = 200;

window.onload = function () {
    gallery = new Gallery("main", 4);

    gallery.createPiece(10, 1);

    gallery.update();
    
    document.getElementById(gallery.artPieces[0].frameID).addEventListener("click", addPoint);
    
    addListeners();
}

function addListeners(){
    
    document.getElementById("showPoints").checked = gallery.artPieces[0].showPoints;
    document.getElementById("showRects").checked = gallery.artPieces[0].drawOriginals;
    document.getElementById("iterations").value = gallery.artPieces[0].steps;
    
    document.getElementById("random").addEventListener("click", function (event) {
        event.preventDefault();
        for (var i=0; i< gallery.artPieces.length; i++){
            gallery.artPieces[i].init();
            gallery.artPieces[i].draw();
        }
        document.getElementById(gallery.artPieces[0].frameID).removeEventListener("click", addPoint);
    });
    
    document.getElementById("manual").addEventListener("click", function (event) {
        event.preventDefault();
        for (var i=0; i< gallery.artPieces.length; i++){
            gallery.artPieces[i].reset();
            gallery.artPieces[i].draw();
        }
        
        document.getElementById(gallery.artPieces[0].frameID).addEventListener("click", addPoint);
    });
    
    document.getElementById("clear").addEventListener("click", function (event) {
        event.preventDefault();
        for (var i=0; i< gallery.artPieces.length; i++){
            gallery.artPieces[i].reset();
            gallery.artPieces[i].draw();
        }
    });
    
    document.getElementById("showPoints").addEventListener("click", function (event) {
        for (var i=0; i< gallery.artPieces.length; i++){
            gallery.artPieces[i].showPoints = event.target.checked;
            gallery.artPieces[i].draw();
        }
    });
    
    document.getElementById("showRects").addEventListener("click", function (event) {
        for (var i=0; i< gallery.artPieces.length; i++){
            gallery.artPieces[i].drawOriginals = event.target.checked;
            gallery.artPieces[i].draw();
        }
    });
    
    document.getElementById("iterations").addEventListener("change", function (event) {
        for (var i=0; i< gallery.artPieces.length; i++){
            var value = parseInt(event.target.value);
            if (value <= 1) {
                value = 1
            } else if (value > 10) {
                value = 10
            }
            gallery.artPieces[i].clear();
            gallery.artPieces[i].steps = value;
            gallery.artPieces[i].generateLines();
            gallery.artPieces[i].draw();
        }
    });
}

function addPoint(event){
    let canvas = document.getElementById(gallery.artPieces[0].canvasID);
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    
    if ((x >= 0 && x <= canvas.width) && (y >= 0 && y <= canvas.height)){
        gallery.artPieces[0].points.push(new Point(x,y));
        if(gallery.artPieces[0].points.length >= 2){
            gallery.artPieces[0].clear();   
            gallery.artPieces[0].generateLines();   
        }
        
        gallery.artPieces[0].draw();
    }
}

function toggleDirection(radio){
    var value = document.getElementById("radio1").checked;
    console.log(value);
    for( var i=0; i<gallery.artPieces.length; i++){
        gallery.artPieces[i].isDiagonal = !value
    }
    gallery.update();
}

window.onresize = function (event) {
    gallery.update();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}

class Point {
    /**
     * @param {Number} x - coordinate on x axis
     * @param {Number} y - coordinate on y axis
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Line {
    /**
     * @param {Point} x - origin point
     * @param {Point} y - destination point
     */
    constructor(p1, p2, color = "#000", lineWidth = 2) {
        this.p1 = p1;
        this.p2 = p2;
        this.cp1 = p1;
        this.cp2 = p2;
        this.color = color;
        this.lineWidth = lineWidth
    }
}

class ArtPiece {

    constructor(canvasID, frameID, numPoints = 4, steps = 1, size = null) {
        this.canvasID = canvasID;
        this.frameID = frameID;
        this.frameScale = 0.8;
        this.canvasSize;
        this.lines = [];
        this.tempLines = [];
        this.originalLines = [];
        this.points = [];
        this.controlPoints = [];
        this.steps = steps;
        this.numPoints = numPoints;
        this.setFrameSize(size);
        this.showPoints = true;
        this.drawOriginals = true;
    }

    init() {
        this.reset();
        this.generateRandom();
    }
    
    generateRandom(){
        var size = this.canvasSize / this.numPoints;
        var iterations = 1;
        
        for(var i=0; i<=this.numPoints; i++){
            var p = new Point(i * size, getRandomInt(0,this.canvasSize) );
            this.points.push( p ); 
        }

        for(var i=0; i<this.points.length-1; i++){
            this.lines.push(new Line(this.points[i], this.points[i+1], "#c0c0c0", 2));
        }
        
        this.originalLines = this.lines;
        
        for (var i=0; i<this.steps; i++){
            this.getNewRects("#f57575");
            this.lines = this.tempLines;
        }
    }
    
    generateLines(){
        var size = this.canvasSize / this.numPoints;
        var iterations = 1;

        for(var i=0; i<this.points.length-1; i++){
            this.lines.push(new Line(this.points[i], this.points[i+1], "#c0c0c0", 2));
        }
        
        this.originalLines = this.lines;
        
        for (var i=0; i<this.steps; i++){
            this.getNewRects("#f57575");
            this.lines = this.tempLines;
        }
    }
    
    reset() {
        this.lines = [];
        this.points = [];
        this.controlPoints = [];
        this.originalLines = [];
        this.tempLines = [];
    }
    
    clear() {
        this.lines = [];
        this.controlPoints = [];
        this.originalLines = [];
        this.tempLines = [];
    }
    
    getNewRects(color){
        for(var i=0; i<this.lines.length; i++){
            var x = lerp(this.lines[i].p1.x, this.lines[i].p2.x, 0.25);
            var y = lerp(this.lines[i].p1.y, this.lines[i].p2.y, 0.25);
            this.lines[i].cp1 = new Point(x,y);

            x = lerp(this.lines[i].p1.x, this.lines[i].p2.x, 0.75);
            y = lerp(this.lines[i].p1.y, this.lines[i].p2.y, 0.75);
            this.lines[i].cp2 = new Point(x,y);
        }
        
        var temp = []
        this.lines[0].cp1 = this.lines[0].p1
        this.lines[this.lines.length-1].cp2 = this.lines[this.lines.length-1].p2
        for(var i=0; i<this.lines.length-1; i++){
            temp.push( new Line(this.lines[i].cp1, this.lines[i].cp2, color, 1) );
            temp.push( new Line(this.lines[i].cp2, this.lines[i+1].cp1, color, 1) );
        }
        temp.push( new Line(this.lines[this.lines.length-1].cp1, this.lines[this.lines.length-1].cp2, color, 1) );
        
        for(var i=0; i<temp.length; i++){
            this.lines.push(temp[i]);
        }
        this.tempLines = temp;
    }

    resize(size) {
        this.setFrameSize(size);
        this.draw();
    }

    setFrameSize(artSize) {
        var canvas = document.getElementById(this.canvasID);
        var frame = document.getElementById(this.frameID);
        var context = canvas.getContext('2d');

        var size = artSize

        size *= this.frameScale;
        size = Math.floor(size);
        frame.style.width = size + "px";
        frame.style.height = size + "px";

        var canvasScale = 0.6;
        this.canvasSize = Math.floor(size * canvasScale);
        canvas.style.width = this.canvasSize + "px";
        canvas.style.height = this.canvasSize + "px";

        var scale = window.devicePixelRatio;
        canvas.width = Math.floor(this.canvasSize * scale);
        canvas.height = Math.floor(this.canvasSize * scale);
        context.scale(scale, scale);

        var padding = (size - this.canvasSize) / 2;
        canvas.style.marginLeft = padding + "px";
        canvas.style.marginTop = padding + "px";

        var article = document.getElementById(this.frameID).parentElement;
        article.style.width = size + "px";
        article.style.height = size + "px";
    }

    draw() {
        var canvas = document.getElementById(this.canvasID);
        var context = canvas.getContext('2d');

        context.fillRect(0, 0, canvas.width, canvas.height);

        context.clearRect(0, 0, this.canvasSize, this.canvasSize);
        context.fillStyle = "#fafafa";
        context.fillRect(0, 0, this.canvasSize, this.canvasSize);
        for (var i = 0; i < this.lines.length; i++) {
            context.beginPath();
            context.strokeStyle = this.lines[i].color;
            context.lineWidth = this.lines[i].lineWidth;
            context.moveTo(this.lines[i].p1.x, this.lines[i].p1.y);
            context.lineTo(this.lines[i].p2.x, this.lines[i].p2.y);
            context.stroke();    
            
            if(this.showPoints){
                context.beginPath();
                context.fillStyle = "#f57575";
                context.arc(this.lines[i].cp1.x, this.lines[i].cp1.y, 4, 0, 2 * Math.PI);
                context.fill()

                context.beginPath();
                context.fillStyle = "#f57575";
                context.arc(this.lines[i].cp2.x, this.lines[i].cp2.y, 4, 0, 2 * Math.PI);
                context.fill()   
            }
        }
        
        if(this.drawOriginals){
            for (var i = 0; i < this.originalLines.length; i++) {
                context.beginPath();
                context.strokeStyle = "#c0c0c0";
                context.lineWidth = 1;
                context.moveTo(this.originalLines[i].p1.x, this.originalLines[i].p1.y);
                context.lineTo(this.originalLines[i].p2.x, this.originalLines[i].p2.y);
                context.stroke();    

            }
              
        }
        for (var i = 0; i < this.points.length; i++) {
            context.beginPath();
            context.fillStyle = "#c0c0c0";
            context.arc(this.points[i].x, this.points[i].y, 4, 0, 2 * Math.PI);
            context.fill();
        }  
        
    }
}

class Gallery {
    constructor(galleryID, columns = 3, pieceSize = null) {
        this.galleryID = galleryID;
        this.artPieces = [];
        this.columns = columns;
        this.pieceSize = pieceSize;
    }
    createPiece(numPoints, steps) {
        var num = this.artPieces.length
        this.createCanvas(num);
        var artPiece = new ArtPiece("canvas" + num, "frame" + num, numPoints, steps);
        this.artPieces.push(artPiece);
    }

    createCanvas(num) {
        document.getElementById(this.galleryID).innerHTML += "<article><canvas id='canvas" + num + "'></canvas><img class='frame' id='frame" + num + "' src='img/frame.png' alt='frame' /></article>";
    }

    update() {

        var size = Math.min(window.innerWidth,window.innerHeight);
        if (this.pieceSize == null) {
            if (this.artPieces.length < this.columns) {
                size /= this.artPieces.length;
            } else {
                size /= this.columns;
            }
        } else {
            size = this.pieceSize;
        }


        for (var i = 0; i < this.artPieces.length; i++) {
            this.artPieces[i].resize(size);
        }

        for (var i = 0; i < this.artPieces.length; i++) {
//            this.artPieces[i].init();
            this.artPieces[i].draw();
        }
    }
}