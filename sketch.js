let img, pg, pg2, pg3

function preload() {
  img = loadImage('./assets/cacique.png');
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  pg = createGraphics(width, height)
  pg2 = createGraphics(width, height)
  pg3 = createGraphics(width, height)
  p5grain.setup()
  frameRate(1)
  noLoop()
}

function draw(){
  background(255);
  setBG()

  let size = min(width, height)

  img.resize(size/2, size/2)

  pg.image(img, 0, 0);

  pg.push();
  pg.scale(-1, 1);
  pg.image(img, -size, 0);
  pg.pop();

  pg.push();
  pg.scale(1, -1);
  pg.image(img, 0, -size);
  pg.pop();

  pg.push();
  pg.scale(-1, -1);
  pg.image(img, -size, -size);
  pg.pop();
  
  // blendMode(BURN)

  var sliceSize = 15
  let amount = size / sliceSize

  for(var i=0; i<amount; i++){
    var slice
    if (i%2==0){
      slice = pg.get(i * sliceSize, 0, sliceSize, size)
    } else {
      slice = pg.get(size-(i * sliceSize), 0, sliceSize, size)
    }
    
    pg2.image(slice, i*sliceSize, 0, sliceSize, size)
  }

  for(var i=0; i<amount; i++){
    var slice
    if (i%2==0){
      slice = pg2.get(0,i * sliceSize, size, sliceSize)
    } else {
      slice = pg2.get(0, size-(i * sliceSize), size, sliceSize)
    }
    
    pg3.image(slice,0, i*sliceSize, size, sliceSize)
  }
  
  let final = slice = pg3.get(0, 0, size/2, size/2)
  image(final,width - size/2,height - size/2)

  textSize(32);
  textAlign(CENTER, CENTER);
  text('Hello, world!', width/2, height/2);

  applyMonochromaticGrain(20)
}