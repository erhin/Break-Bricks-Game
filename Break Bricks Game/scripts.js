document.addEventListener('mousemove' , (e)=>move(e));

var playground = document.getElementById('playground');
var ball = document.getElementById('ball');

var scoreNumber = document.getElementById('scoreNumber');
var message = document.createElement('span')
message.setAttribute('id' , 'message');

var restartButton = document.createElement('button');
restartButton.setAttribute('id', 'restartButton');
restartButton.innerText = 'Restart';


var brickBreakAudio = document.createElement('audio');
brickBreakAudio.src = './brick break.mp3';
document.body.appendChild(brickBreakAudio);
brickBreakAudio.muted = true;


var gameOverAudio = document.createElement('audio');
gameOverAudio.src = './game over.mp3';
document.body.appendChild(gameOverAudio);
gameOverAudio.muted = true;

var ballHitAudio = document.createElement('audio');
ballHitAudio.src = './ball hit.mp3';
document.body.appendChild(ballHitAudio);
ballHitAudio.muted = true;



var playgroundData = {
    width:600,
    height:400,
    top:100,left:100,
    border: '1px solid black',
    position:'absolute',

    playgroundDraw: function(){
        playground.style.width = this.width + 'px';
        playground.style.height = this.height + 'px';
        playground.style.top = this.top + 'px';
        playground.style.left = this.left + 'px';
        playground.style.border = this.border;
        playground.style.position = this.position;

    }
};

playgroundData.playgroundDraw();

var player = document.getElementById('player');

var playerData = {
    width: 100,
    height: 20,
    backgroundColor:'black',
    position:'absolute',
    top:playgroundData.height-20,
    left:(playgroundData.width-100)/2,

    playerDraw:function(){
        player.style.width = this.width + 'px';
        player.style.height = this.height + 'px';
        player.style.backgroundColor = this.backgroundColor;
        player.style.position = this.position;
        player.style.top = this.top + 'px';
        player.style.left = this.left + 'px';
    }
};
playerData.playerDraw();


var ballData = {
    speedX:1,
    speedY:1,
    width:30,
    height:30,
    backgroundColor:'red',
    position:'absolute',
    borderRadius:50,
    top:(playgroundData.height)/2,
    left:(playgroundData.width-30)/2 ,

    ballDraw: function(){
        ball.style.width = this.width + 'px';
        ball.style.height = this.height + 'px';
        ball.style.backgroundColor = this.backgroundColor;
        ball.style.top = this.top + 'px';
        ball.style.left = this.left + 'px';
        ball.style.position = this.position;
        ball.style.borderRadius = this.borderRadius + '%';

    }
};


var wallColumns = 5;
var wallRows = 2;
var walls = new Array()

var wallData = {
    width:80,
    height:20,
    backgroundColor:'blue',
    position:'absolute',
    defL:40,
    defT:130,
    borderRadius:12,
    
    wallDraw: function(){
        wall.style.width = this.width + 'px';
        wall.style.height = this.height + 'px';
        wall.style.backgroundColor = this.backgroundColor;
        wall.style.top = this.top + 'px';
        wall.style.left = this.left + 'px';
        wall.style.position = this.position;
        wall.style.borderRadius = this.borderRadius + '%';
    }
};

for(var i = 0; i<wallColumns; i++){
    for(var j = 0; j<wallRows; j++){
        var wall = document.createElement('div');
        wall.setAttribute('class', 'wall');
        wallData.top = wallData.defL*j;
        wallData.left = wallData.defT*i;
        playground.appendChild(wall);
        wallData.wallDraw();
        walls.push(wall);
    }
}

function PlayerBallCollision(playerData,ballData){
    var playerOX = playerData.left+playerData.width/2;
    var playerOY = playerData.top+playerData.height/2;
    var ballOX = ballData.left+ballData.width/2;
    var ballOY = ballData.top+ballData.height/2;
    var player_ball_X = Math.abs(playerOX-ballOX);
    var player_ball_Y = Math.abs(playerOY-ballOY);
    var distancePB_X = playerData.width/2+ballData.width/2;
    var distancePB_Y = playerData.height/2+ballData.height/2;
    return player_ball_X<=distancePB_X && player_ball_Y<=distancePB_Y;
}

function win(){
    return walls.length == 0;
}

function ConvertToNum(aggr){ 
    return parseInt(aggr);
}

function TopCollision(){
    return ballData.top<0; 
}

function BottomCollision(){
    return ballData.top>playgroundData.height-ballData.height; 
}

function LeftRightCollision(){
    return ballData.left<0 || ballData.left>playgroundData.width-ballData.width;
}

function gameOver(){
    message.innerHTML = 'You scored ' + scoreNumber.innerHTML + ' points.' ;
    console.log('Game Over');
    gameOverAudio.muted = false;
    gameOverAudio.play();
    playground.append(message);
    message.append(restartButton);
    restartButton.addEventListener('click',function(){
        location.reload();
    });
}


function move(e){
    if(e.clientX>=playgroundData.left+playerData.width/2 && e.clientX<=playgroundData.left+playgroundData.width-playerData.width/2)
    {   
        playerData.left = e.clientX-playerData.width-(playerData.width/2);
        playerData.playerDraw();

    }else{
        return false;
    }
}


function ballMovement(){
    var gameInterval = setInterval(
                function(){

                    ballData.top+=ballData.speedY;
                    ballData.left+=ballData.speedX;
                    ballData.ballDraw();

                  
                    if(TopCollision() == true){
                        ballData.speedY = -ballData.speedY;
                        ballHitAudio.muted = false;
                        ballHitAudio.play();
                    }

                    if(LeftRightCollision() == true){
                        ballData.speedX = -ballData.speedX;
                        ballHitAudio.muted = false;
                        ballHitAudio.play();
                    }

                    if(BottomCollision() == true){
                        clearInterval(gameInterval);
                        playground.replaceChildren();
                        gameOver();
                    }

                    if(PlayerBallCollision(playerData,ballData)){
                        ballData.speedY = -ballData.speedY;
                        ballHitAudio.muted = false;
                        ballHitAudio.play();
                    }




                    walls.forEach(function(element,id){
                        var ballOX = ballData.left+ballData.width/2;
                        var ballOY = ballData.top+ballData.height/2;
                        var cwOX = (ConvertToNum(element.style.left))+(ConvertToNum(element.style.width)/2);
                        var cwOY = (ConvertToNum(element.style.top))+(ConvertToNum(element.style.height)/2);
                        var ball_cw_X = Math.abs(ballOX-cwOX);
                        var ball_cw_Y = Math.abs(ballOY-cwOY);
                        var distanceBCW_X = (ConvertToNum(element.style.width)/2)+(ballData.width/2);
                        var distanceBCW_Y = (ConvertToNum(element.style.height)/2)+(ballData.height/2);
                     
                     
                       if(ball_cw_X<=distanceBCW_X && ball_cw_Y<=distanceBCW_Y == true){
                         brickBreakAudio.muted = false; 
                         brickBreakAudio.play();
                         element.style.display = 'none';
                         walls.splice(id, 1);
                         ballData.speedY = -ballData.speedY;
                         scoreNumber.innerHTML = parseInt(scoreNumber.innerHTML) + 100;
                       }
                       
                       
                    });

                    if(win() == true){
                        clearInterval(gameInterval);
                        playground.replaceChildren();
                        gameOver();
                    }

                },10);
}

ballMovement();




