var TOTAL_TIME = 1000

// PERSISTÊNCIA
var persistencia = 99.2;

// DEPENDÊNCIA POR GRATIFICAÇÃO
var sentimentalismo = 2
var apego = 2.1
var dependencia = 62.3

// BUSCA POR NOVIDADE
var excitabilidade = 44.8
var impulsividade = 11
var extravagancia = 7.7
var desordenacao = 5.8

//ESQUIVA AO DANO
var preocupacao = 18
var medoIncerteza = 38.2
var timidez = 88
var fadigabilidade = 94.4

var bg_h = 0
var bg_s = 0
var bg_b = 0
var t;
var t_color = 0
var color_step = 0.5
var color_dir = 1
var offset = 10

function restart(){

  // PERSISTÊNCIA
  persistencia = 99;

  // DEPENDÊNCIA POR GRATIFICAÇÃO
  sentimentalismo = 2
  apego = 2
  dependencia = 62

  // BUSCA POR NOVIDADE
  excitabilidade = 44
  impulsividade = 11
  extravagancia = 7
  desordenacao = 5

  //ESQUIVA AO DANO
  preocupacao = 18
  medoIncerteza = 38
  timidez = 88
  fadigabilidade = 94

  document.getElementById("excitabilidade").value = excitabilidade
  document.getElementById("text_excitabilidade").value = excitabilidade

  document.getElementById("impulsividade").value = impulsividade
  document.getElementById("text_impulsividade").value = impulsividade
  document.getElementById("extravagancia").value = extravagancia
  document.getElementById("text_extravagancia").value = extravagancia
  document.getElementById("desordenacao").value = desordenacao
  document.getElementById("text_desordenacao").value = desordenacao

  document.getElementById("sentimentalismo").value = sentimentalismo
  document.getElementById("text_sentimentalismo").value = sentimentalismo
  document.getElementById("apego").value = apego
  document.getElementById("text_apego").value = apego
  document.getElementById("dependencia").value = dependencia
  document.getElementById("text_dependencia").value = dependencia

  document.getElementById("persistencia").value = persistencia
  document.getElementById("text_persistencia").value = persistencia

  document.getElementById("preocupacao").value = preocupacao
  document.getElementById("text_preocupacao").value = preocupacao
  document.getElementById("medoIncerteza").value = medoIncerteza
  document.getElementById("text_medoIncerteza").value = medoIncerteza
  document.getElementById("timidez").value = timidez
  document.getElementById("text_timidez").value = timidez
  document.getElementById("fadigabilidade").value = fadigabilidade
  document.getElementById("text_fadigabilidade").value = fadigabilidade

  t_color = random(0, 100)

  changeBG()
}

function saveArt(){
  saveCanvas(canvas, 'myCanvas', 'jpg');
}

window.onload = function(){
  restart()
}

function setup() {
  createCanvas(innerWidth - 300, innerHeight);
  colorMode(HSB, 100);
  
  noFill();
  t = 0;
  
  changeBG()
  
  restart()
}

function changeBG(){
  bg_h = dependencia
  bg_s = apego
  bg_b = sentimentalismo

  background(bg_h, bg_s, bg_b)
}

function draw() {
  
  color_step = 0.1 * map(extravagancia, 0, 100, 1, 10)
  
  offset = 10 

  let impulso = map(impulsividade, 0, 100, 1, 2)
  
  var x1 = width * noise(t + offset ) 
  var x2 = width * noise(t + offset * 2)
  var x3 = width * noise(t + offset * 3)
  var x4 = width * noise(t + offset * 4)

  var y1 = height * noise(t + offset * 5)
  var y2 = height * noise(t + offset * 6)
  var y3 = height * noise(t + offset * 7)
  var y4 = height * noise(t + offset * 8)

  t_color += color_dir * color_step
  if(t_color > 100) {
    color_dir = -1
  } if (t_color < 0){
    color_dir = 1
  }
  filter(BLUR, map(excitabilidade, 0, 100, 0, 10), true);
  
  const c = color(t_color, 100, map(medoIncerteza, 0, 100, 30, 100));
  stroke(c)
  strokeWeight(map(timidez, 0, 100, 1, 10))
  drawingContext.setLineDash([map(fadigabilidade, 0, 100, 1, 20), map(preocupacao, 0, 100, 1, 20)]);

  bezier(x1, y1, x2, y2, x3, y3, x4, y4)

  t += 0.005 * impulso

  let frames = map(persistencia, 0, 100, 10, TOTAL_TIME)
  
  if (frameCount % frames <= 1) {
    const c = color(bg_h, bg_s, bg_b);
	  background(c);
    offset = 10
  }

  let frames2 = map(desordenacao, 0, 100, TOTAL_TIME/2, 0)
  if (frameCount % frames2 <= 1) {
    t *= 2
  }

  
  
}

function glow(glowColor, blurriness) {
  drawingContext.shadowColor = glowColor;
  drawingContext.shadowBlur = blurriness;
}

function updateSlider(name, slideAmount) {
  
  document.getElementById("text_"+name).value = slideAmount
  document.getElementById(name).value = slideAmount

  var value = document.getElementById(name).value;
  if (value > 100) { value = 100}
  else if (value < 1) { value = 1}

  document.getElementById("text_"+name).value = value
  document.getElementById(name).value = value
  
  switch(name){
    case "excitabilidade":
      excitabilidade = value
      break;
    case "impulsividade":
      impulsividade = value
      break;
    case "extravagancia":
      extravagancia = value
      break;
    case "desordenacao":
      desordenacao = value
      break;
    case "sentimentalismo":
      sentimentalismo = value
      changeBG()
      break;
    case "apego":
      apego = value
      changeBG()
      break;
    case "dependencia":
      dependencia = value
      changeBG()
      break;
    case "persistencia":
      persistencia = value
      break;
    case "timidez":
      timidez = value
      break;
    case "preocupacao":
      preocupacao = value
      break;
    case "medoIncerteza":
      medoIncerteza = value
      break;
    case "fadigabilidade":
      fadigabilidade = value
      break;
    default:
      console.log(value)
  }
}