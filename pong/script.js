/*
 * MIT License
 *
 * Copyright (c) 2017 Romoli Riccardo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var canvas = document.getElementById("game"); //assegno il canvas a una variabile
var ctx = canvas.getContext("2d"); //assegno il context del canvas a una variabile
//Aggiungo il metodo clear all'oggetto context
ctx.clear = function () {
    this.clearRect(0, 0, canvas.width, canvas.height);
}
/*
Mette in "pausa" il lancio della pallina per due secondi, funziona
bene se lo scambio dura almeno 2 secondi!
*/
function drawAfter2Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            drawBall();
            wait = true;
        }, 2000);
    });
}
//la funzione funge da classe e ci permettere di poter aggiungere un oggetto di tipo audio al DOM ne ho fatte 2 diverse per via dei parametri
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.pause = function () {
        this.sound.pause();
    }
}
var win = new sound("win.mp3"); //crea l'audio con la musica di vittoria
var standard = new sound("standard.mp3"); //crea l'audio con la musica di background
standard.sound.setAttribute("loop","true");
standard.play(); //fa partire la musica di background
var retryVisible = false; //variabile di controllo per mostrare il div di RETRY
var dirspeed = [-3, 3]; //vettore contenente la velocita per le cordinate e le ascisse, vengono scelti random per randomizzare la partenza iniziale della pallina
var ballRadius = 8; //definisce il raggio della pallina
var x = canvas.width / 2;
var y = canvas.height / 2;
var dx = dirspeed[Math.floor(Math.random() * 2)]; //viene scelta randomicamente la velocità
var dy = dirspeed[Math.floor(Math.random() * 2)];
var paddleHeight = 75;
var paddleWidth = 10;
var paddleYD = (canvas.height - paddleHeight) / 2;
var paddleYS = (canvas.height - paddleHeight) / 2;
var upPressedS = false;
var downPressedS = false;
var upPressedD = false;
var downPressedD = false;
var player1 = 0;
var player2 = 0;
var wait = true;
//Eventi per i tasti
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    if (e.keyCode == 38) {
        upPressedD = true;
    }
    else if (e.keyCode == 40) {
        downPressedD = true;
    }
    else if (e.keyCode == 87) {
        upPressedS = true;
    }
    else if (e.keyCode == 83) {
        downPressedS = true;
    }
}
function keyUpHandler(e) {
    if (e.keyCode == 38) {
        upPressedD = false;
    }
    else if (e.keyCode == 40) {
        downPressedD = false;
    }
    else if (e.keyCode == 87) {
        upPressedS = false;
    }
    else if (e.keyCode == 83) {
        downPressedS = false;
    }
}
/*
document.addEventListener("mousemove", mouseMoveHandler, false);
function mouseMoveHandler(e) {
    var relativeY = e.clientY - canvas.offsetHeight;
    if(relativeY > paddleHeight/2 && relativeY < canvas.height - paddleHeight/2) {
        paddleYS = relativeY - paddleHeight/2;
        console.log(paddleYS);
    }
}*/
//funzione per inserire lo score
function drawScore() {
    ctx.font = "32px Arcade";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(player1.toString(), (canvas.width / 2 - 4) / 2, 30);
    ctx.fillText(player2.toString(), (canvas.width / 2 + canvas.width / 4), 30);
}
//disegna la linea di mezzo nel canvas
function middleLine() {
    var width = 8;
    var height = 75 / 2 - 10;
    var tmp = false;
    ctx.beginPath();
    for (var i = 0; i < canvas.height;) {
        if (!tmp) {
            tmp = true;
            ctx.rect(canvas.width / 2 - width / 2, i, width, height);
            ctx.fill();
            i += 75 / 2 + 5;
        } else {
            tmp = false;
        }
    }
    ctx.closePath();
}
//disegna il paddle destro
function drawPaddleD() {
    ctx.beginPath();
    ctx.rect(canvas.width - paddleWidth, paddleYD, paddleWidth, paddleHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}
//disegna il paddle sinistro
function drawPaddleS() {
    ctx.beginPath();
    ctx.rect(paddleWidth / 2, paddleYS, paddleWidth, paddleHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}
//disegna la palla
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();
}
//identifica le collisioni del paddle sinistro
function collisionS() {
    return x + dx < canvas.width / 2 && y + dy >= paddleYS + ballRadius && y + dy <= paddleYS + paddleHeight;

}
//identifica le collisioni del paddle destro
function collisionD() {
    return x + dx > canvas.width / 2 && y + dy >= paddleYD + ballRadius && y + dy <= paddleYD + paddleHeight;
}
//Funzione essenzile del codice serve a genereare ogni frame all'interno del canvasa
function draw() {
    ctx.clear();
    if (wait) {
        drawBall();
    } else {
        drawAfter2Seconds();
    }
    middleLine();
    drawPaddleS();
    drawPaddleD();
    if (downPressedS && paddleYS < canvas.height - paddleHeight) {
        paddleYS += 7;
    }
    else if (upPressedS && paddleYS > 0) {
        paddleYS -= 7;
    }
    if (downPressedD && paddleYD < canvas.height - paddleHeight) {
        paddleYD += 7;
    }
    else if (upPressedD && paddleYD > 0) {
        paddleYD -= 7;
    }
    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) { //COLLISIONE MURI SOPRA E SOTTO
        dy = -dy;
    }
    else if (x + dx < paddleWidth + ballRadius || x + dx > canvas.width - ballRadius - paddleWidth) {
        if (collisionS()) {
            dx = -dx + 0.1;
        }
        else if (collisionD()) {
            dx = -dx - 0.1;
        }
        if (x + dx < -ballRadius) {
            x = canvas.width / 2;
            y = canvas.height / 2;
            dx = dirspeed[Math.floor(Math.random() * 2)];
            dy = dirspeed[Math.floor(Math.random() * 2)];
            wait = false;
            player2++;
            if (player2 > player1 && player2 == 10) {
                standard.pause();
                win.play();
                $("#game").remove();
                $("#winner").text("Player 2 wins!");
                $(".win").css("display", "block");
                document.addEventListener("keydown", spaceHandler, false);
                showRetry();
            }
        }
        else if (x + dx + ballRadius >= canvas.width) {
            x = canvas.width / 2;
            y = canvas.height / 2;
            dx = dirspeed[Math.floor(Math.random() * 2)];
            dy = dirspeed[Math.floor(Math.random() * 2)];
            wait = false;
            player1++;
            if (player1 > player2 && player1 == 10) {
                standard.pause();
                win.play();
                $("#game").remove();
                $("#winner").text("Player 1 wins!");
                $(".win").css("display", "block");
                document.addEventListener("keydown", spaceHandler, false);
                showRetry();

            }
        }
    }
    drawScore();
    if (wait) {
        x += dx;
        y += dy;
    }
};


function update() {
    setInterval(draw, 1000 / 120);
}

update();
function spaceHandler(e) {
    if (e.keyCode == 32) {
        location.reload(true);
    }
}
function hideRetry() {
    document.getElementById("retry").style.display = "none";
    setTimeout(showRetry, 1000);
}

function showRetry() {
    document.getElementById("retry").style.display = "block";
    setTimeout(hideRetry, 1000);
}