//VARIABILI CANVAS
var isEnd = false;
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
//PAUSA
var paused = false;
//POSIZIONE PALLA
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 3.5;
var dy = -3.5;
//DIMENSIONI PALLA
var ballRadius = 8;
//DIMENSIONI PADDLE
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
//PESSIONE TASTI
var rightPressed = false;
var leftPressed = false;
//MAGLIA MATTONI
var brickRowCount = 5;
var brickColumnCount = 11;
var brickWidth = 60;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
//COLORI
const colors = ["#C2272D", "#F8931F", "#FFFF01", "#009245", "#0193D9", "#0C04ED", "#612F90"];
//OGGETTO PER SUONI
function sound(src) {
    console.log(this.sound);
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.pause = function(){
        this.sound.pause();
    }
    this.erase = function(){
        document.body.removeChild(this.sound);
    }
}
var brickscollision = new sound("breakout/bricksdestroyed.mp3");
var paddlecollision = new sound("breakout/paddlecollision.wav");
var standard = new sound("standard.mp3");
var win = new sound("win.mp3");
var lose = new sound("lose.mp3");
standard.sound.setAttribute("loop","true");
standard.play();
var retryVisible = false;
//Color bricks
var tmp = [];
tmp[0] = Math.floor((Math.random() * 6) + 0);
for (let i = 0; i < 4;i++){
	
}
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0 , status: 1, color: colors[tmp[r]]};
    }
}
//Punteggio
var score = 0;
//Sprite pallina
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();
}
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();
}
//Eventi per muovere paddle
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e){
	if(e.keyCode == 39){
		rightPressed = true;
	}
	if (e.keyCode == 37){
		leftPressed = true;
	}
}
function keyUpHandler(e){
	if(e.keyCode == 39){
		rightPressed = false;
	}
	if(e.keyCode == 37){
		leftPressed = false;
	}
}
var d = false;
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
			if(b.status == 1){
				if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
				    brickscollision.play();
					dy = -dy;
					b.status = 0;
					score++;
                    //RICORDARSI DI GESTIRE ANCHE LA VITTORIA SE PUR RARA
                    if(score == brickRowCount*brickColumnCount) {
                        isEnd = true;
                        if(!d){
                            standard.erase();
                            brickscollision = null;
                            paddlecollision = null;
                            win.play();
                            d = true;
                        }
                        $("#game").remove();
                        $("#text").text("YOU WIN!");
                        $(".gameover").css("display", "block");
                        
                        if (!retryVisible) {
                            showRetry();	
                            retryVisible = true;
                        }
                        
                        $("#retry").click(function () {
                            location.reload(true);
                        });
                    }
				}
			}
        }
    }
}
function drawScore(){
	ctx.font = "16px Arcade";
	ctx.fillStyle = "#ffffff";
    ctx.textAlign = "start";
	ctx.fillText("score: "+score, 8, 20);
    ctx.font = "16px Arcade";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("Press space to pause the game", canvas.width/2, 20);
}
function drawPause(){
    ctx.font = "32px Arcade";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("PAUSE",canvas.width/2,canvas.height/2);

}
function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
			if(bricks[c][r].status == 1){
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = bricks[c][r].color;
				ctx.fill();
				ctx.closePath();
			}
        }
    }
}
document.addEventListener("keydown", retryHandler, false);
function retryHandler(e){
	if(retryVisible){
		if(e.keyCode == 32){
			location.reload(true);
		}
	}
}
var b = false;
function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height); //pulisce il canvas svuotandolo ad ogni update
	drawBricks();
	if(!paused) {
        drawBall();
        drawPaddle();
        if(!isEnd)collisionDetection();
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        else if (y + dy > canvas.height - ballRadius && !isEnd) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                paddlecollision.play();
                dy = -dy - 1;
            }
            else {
                if(!b){
                standard.pause();
                lose.play();
                b = true;
                brickscollision = null;
                paddlecollision = null;
                win.erase();
                }
                $("#game").remove();
                $("#text").text("GAME OVER");
                $(".gameover").css("display", "block");
				
				if (!retryVisible) {
					showRetry();	
					retryVisible = true;
				}
				
                $("#retry").click(function () {
                    location.reload(true);
                });
            }
        }
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }
        x += dx;
        y += dy;
    } else
    {
        drawPause();
    }
    drawScore()
}
function togglePause(){
    if(!paused){
        paused = true;
    }
    else if (paused){
        paused = false;
    }
}
$(document).keydown(function (e) {
    if(e.keyCode == 32){
        togglePause();
    }
});
function update(){
    setInterval(draw, 1000 / 30); //ogni 10 millisecondi esegue draw()
}
update();


function hideRetry () {
	document.getElementById("retry").style.display = "none";
	setTimeout(showRetry, 1000);
}

function showRetry () {
	document.getElementById("retry").style.display = "block";
	setTimeout(hideRetry, 1000);
}