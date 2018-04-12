const startStopBtn = document.querySelector('#startStop');

document.addEventListener("DOMContentLoaded", startGame);
document.getElementById("canvasHolder").addEventListener("click", test);

startStopBtn.addEventListener("click", startStopGame);

var pieces = [];

// debug variables
var da = 0;
var net = 0;

function startGame() {
  pieces.push(new component(250, 3, "green", 180, 120, "static"));
  //pieces.push(new component(1, 5, "green", 170, 85, "static"));

  pieces.push(new component(350, 3, "brown", 150, 75, "", 6, 1));
  pieces.push(new component(100, 3, "grey", 190, 215, "", 4, -2));
  pieces.push(new component(100, 3, "grey", 192, 215, "", 4, -2));
  pieces.push(new component(100, 3, "grey", 194, 215, "", 4, -2));
  pieces.push(new component(100, 3, "grey", 196, 215, "", 4, -2));


  myGameArea.start();
}

function startStopGame() {

  if (startStopBtn.className === "stop") {
    myGameArea.stop();
    startStopBtn.className = "run"
    startStopBtn.innerHTML = "Run again";
  } else {
    myGameArea.start();
    startStopBtn.className = "stop"
    startStopBtn.innerHTML = "Stop process";
  }
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 540;
    this.canvas.height = 480;
    this.context = this.canvas.getContext("2d");
    document.getElementById("canvasHolder").appendChild(this.canvas);
    this.interval = setInterval(updateGameArea, 100);
  },
  stop: function () {
    clearInterval(this.interval);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function component(mass, radius, color, x, y, type, speedX = 0, speedY = 0) {
  this.type = type;
  this.radius = radius;
  this.x = x;
  this.y = y;
  this.prevX;
  this.prevY;
  this.shiftX = 0;
  this.shiftY = 0;
  this.speedX = speedX;
  this.speedY = speedY;
  this.gravity = 1;
  this.gravitySpeed = 2;
  this.mass = mass;
  this.bounce = 0.6;
  this.update = function () {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, true); // Outer circle
    ctx.stroke();
    ctx.fill();
  }
  // this.newPos = function () {
  //     //this.gravitySpeed += this.gravity;
  //     this.x += this.speedX + this.gravitySpeed;
  //     this.y += this.speedY + this.gravitySpeed;
  //     this.hitBottom();
  // }
  // this.hitBottom = function () {
  //     var rockbottom = myGameArea.canvas.height - this.height - 30;
  //     if (this.y > rockbottom) {
  //         this.y = rockbottom;
  //         this.gravitySpeed = -(this.gravitySpeed * this.bounce);
  //     }
  // }

  this.newPosInterferance = function () {
    //this.gravitySpeed += this.gravity;

    for (let i in pieces) {

      if (this.type === "static") {
        this.x += 0.1;
        continue;
      }

      if (this !== pieces[i]) {

        let pA = this; // point A of gravity line between pieces
        let pB = pieces[i]; // point B of line
        let pC = {} // point on AB line due to gravity influence

        // Имеется отрезок AB с координатами A(Xa, Ya) и B(Xb, Yb).
        // Требуется найти координаты точки C(Xc, Xc), лежащей на отрезке AB на расстоянии Rac от точки A.

        // Rab = sqrt((Xb-Xa)^2 + (Yb-Ya)^2)
        // k = Rac / Rab
        // Xc = Xa + (Xb-Xa)*k
        // Yc = Ya + (Yb-Ya)*k

        let lengthAB = Math.sqrt(Math.pow(pB.x - pA.x, 2) + (Math.pow(pB.y - pA.y, 2)));
        //let k = pB.gravitySpeed / lengthAB;
        let k = calcGravityAcceleration(pB.mass, lengthAB) / lengthAB;

        pC.x = pA.x + (pB.x - pA.x) * k;
        pC.y = pA.y + (pB.y - pA.y) * k;

        // check on bump
        if (lengthAB <= (pA.radius + pB.radius)) {


          // keep/restore distance between pieces

          if (pA.prevX == undefined || pA.prevY == undefined) {
            if (pA.x < pB.x)
              pA.x -= pA.radius * (1 + Math.random()/10);
            else
              pA.x += pA.radius * (1 + Math.random()/10);

            if (pA.y < pB.y)
              pA.y -= pA.radius * (1 + Math.random()/10);
            else
              pA.y += pA.radius * (1 + Math.random()/10);

          } else { // have previous values
            pA.x = pA.prevX;
            pA.y = pA.prevY;
            continue; // do not process movement
          }

          // pA == this current point
          pA.speedX = (pA.mass * pA.speedX + pB.mass * pB.speedX) / (pA.mass + pB.mass);
          pA.speedY = (pA.mass * pA.speedY + pB.mass * pB.speedY) / (pA.mass + pB.mass);

          // Energy lost during bump, heat generation Koef = 0,7

          pA.speedX *= 0, 7;
          pA.speedY *= 0, 7;

          console.log("BUMP!!!!!!!!!!!!!!!!!!!!!!");
        } else {

          this.shiftX -= pA.x - pC.x;
          this.shiftY -= pA.y - pC.y;
        }
        //console.log("da: "+ da++);
      }
      else {
        //console.log("net: " + net++);
      }
    }

    //console.log("-----------------------")

    this.speedX += this.shiftX;
    this.speedY += this.shiftY;

    // save previous position
    this.prevX = this.x;
    this.prevY = this.y;

    this.x += this.speedX;
    this.y += this.speedY;

    this.shiftX = 0;
    this.shiftY = 0;

    //this.hitBottom();
  }
}

function updateGameArea() {
  myGameArea.clear();

  for (let i in pieces) {
    pieces[i].newPosInterferance();
    pieces[i].update();
  }

}

function calcGravityAcceleration(mass, lengthAB) {
  return mass / Math.pow(lengthAB, 2);
}



// <p>The bouncing property indicates how strong a component will bounce back, after hitting the ground.</p>

// <p>Set the bouncing property to a decimal number between 0 and 1.</p>

// <p>0 = no bouncing.</p>
// <p>1 = will bounce all the way back.</p>

function test(e){

  pieces.push(new component(100, 3, "blue", e.offsetX, e.offsetY, "click", 0,0));
  console.log(e.offsetX + " | " + e.offsetY);
}