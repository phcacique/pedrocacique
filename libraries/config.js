let bgpalette = [
              // '#F6CF4E', 
              // '#4EAFF6',
              // '#F64E4E',
              '#ffffff'
            ]; 

let palette = ['#393737', 
               '#969090', 
               '#D9D9D9']

let palette2 = ['#D9D9D9', 
              '#969090']

function setBG(){
    let selectedBG = floor(random(bgpalette.length))
    background(color(bgpalette[selectedBG]));
    blendMode(MULTIPLY)
}

function mousePressed() {
    saveCanvas(canvas, 'myCanvas', 'jpg');
  }
  
  function keyPressed() {
    if(key == ' ') { start() }
  }