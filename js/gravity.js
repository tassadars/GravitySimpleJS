document.addEventListener("DOMContentLoaded", startGame);


var myGamePiece;

var pieces = [];

// debug variables
var da = 0;
var net = 0;

function startGame() {
    pieces.push(new component(5, 5, "green", 180, 120, "static"));
    //pieces.push(new component(5, 5, "green", 170, 85, "static"));

    pieces.push(new component(5, 5, "brown", 150, 75, "", 5, 1));
    //pieces.push(new component(5, 5, "grey", 290, 215, "", 2, -2));

    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 100);
    },
    stop: function () {
        clearInterval(this.interval);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type, speedX = 0, speedY = 0) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.shiftX = 0;
    this.shiftY = 0;
    this.speedX = speedX;
    this.speedY = speedY;
    this.gravity = 1;
    this.gravitySpeed = 2;
    this.bounce = 0.6;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
                let k = pB.gravitySpeed / lengthAB;

                pC.x = pA.x + (pB.x - pA.x)*k;
                pC.y = pA.y + (pB.y - pA.y)*k;                         

                this.shiftX -= pA.x - pC.x;
                this.shiftY -= pA.y - pC.y;


                // console.log("GravitySpeed: " + pieces[i].gravitySpeed);

                // console.log("this.x "+ this.x + "; x " + x );
                // console.log("this.y "+ this.y + "; y " + y );

                //  console.log("Piece "+ i + "; ShiftX " + this.shiftX );
                //  console.log("Piece "+ i + "; ShiftY " + this.shiftY );


                //console.log("Piece "+ i + "; this.x " + this.x + "; x " + x);
                //console.log("Piece "+ i + "; this.y " + this.y + "; y " + y);

                //console.log("da: "+ da++);
            }
            else {
                //console.log("net: " + net++);
            }
        }

        console.log("-----------------------")

        this.speedX += this.shiftX;
        this.speedY += this.shiftY;

        console.log("SpeedX: " + this.speedX);
        console.log("SpeedY: " + this.speedY);
        

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



// <p>The bouncing property indicates how strong a component will bounce back, after hitting the ground.</p>

// <p>Set the bouncing property to a decimal number between 0 and 1.</p>

// <p>0 = no bouncing.</p>
// <p>1 = will bounce all the way back.</p>