var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;
var startSpeed = 8;

var dx = startSpeed;
var dy = startSpeed;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 300;
var paddleX = (canvas.width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var difficulty = 10;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var lives = 3;

var hitContactX = 0;

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
			if (bricks[c][r].status == 1)
			{
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();				
			}
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}


function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight && b.status == 1) {
                dy = -dy;
				b.status = 0;
				score++;
				if (score == brickRowCount * brickColumnCount) {
					alert("YOU WIN, CONGRATULATIONS!");
					document.location.reload();
				}
            }
        }
    }
}


function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}
	if (y + dy < ballRadius) {
		dy = -dy;
	}
	else if ((y + dy > canvas.height - ballRadius - paddleHeight) && (x > paddleX && x < paddleX + paddleWidth))
	{
		hitContactX = x;
		var paddleCenter = (paddleX + paddleWidth) ;
		//console.log(paddleCenter);
		var bounceDist = -(x - paddleCenter);
		//console.log(bounceDist);
		var bounceProportion = bounceDist / paddleWidth;
		if (bounceProportion < 0.2)
		{
			angle_pos = 0;
		}
		else if (bounceProportion < 0.4)
		{
			angle_pos = 1;
		}
		else if (bounceProportion < 0.6)
		{
			angle_pos = 2;
		}
		else if (bounceProportion < 0.8)
		{
			angle_pos = 3;
		}
		else if (bounceProportion < 0.4)
		{
			angle_pos = 4;
		}
		else if (bounceProportion < 1)
		{
			angle_pos = 5;
		}
		//console.log(bounceProportion);
		var looper = false;
		var angles = [0, 5, 10, 15, 20, 25];
		var degree = angles[angle_pos] * Math.PI / 180;
		console.log(degree);
		tmp_dx = dx;
		tmp_dy = dy;
		dx = Math.cos(Math.PI * 2 + degree) * tmp_dx - Math.sin(Math.PI * 2 + degree) * tmp_dy;
		dy = Math.sin(Math.PI + degree) * tmp_dx + Math.cos(Math.PI + degree) * tmp_dy;


		//console.log("Speed:");		
		//console.log(Math.sqrt(dx**2 + dy**2));
	}
	else if (y + dy > canvas.height - ballRadius) {
		
		if (x > paddleX && x < paddleX + paddleWidth) {		
			dy = -dy;
		}
		else {
			lives--;
			if (!lives)
			{
				alert("GAME OVER");
				document.location.reload();		
			}
			else
			{
				x = canvas.width/2;
				y = canvas.height - 30;
				dx = startSpeed;
				dy = startSpeed;
				paddleX = (canvas.width-paddleWidth)/2;				
			}

		}
	}	
	x += dx;
	y += dy;
	if(rightPressed) {
		paddleX += 7;
		if (paddleX + paddleWidth > canvas.width){
			paddleX = canvas.width - paddleWidth;
		}
	}
	else if(leftPressed) {
		paddleX -= 7;
		if (paddleX < 0){
			paddleX = 0;
		}
	}
	collisionDetection();
	drawScore();
	drawLives();
	drawPaddle();
	requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}



draw();

