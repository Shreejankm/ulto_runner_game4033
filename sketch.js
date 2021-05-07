var PLAY = 1;
var END = 0;
var gameState = PLAY;

var robo, robo_running,robo_collided;
var floor,floorImage,invisibleFloor;
var stars,starsImage,starsGroup;
var charge,chargeGroup;
var ultro_chargeImage;
var obstaclesGroup,obstacle1,obstacle2,obstacle3,obstacle4;
var score = 0;
var texting;

var gameOver, restart;
var gameOverImage,restartImage;
var baricade,baricadeImage;

function preload(){
  floorImage = loadImage("floor.png");
  starsImage = loadImage("star.png");
  robo_running = loadAnimation("mario1.png","mario2.png","mario3.png");
  robo_collided = loadImage("robot_collided.png");
  ultro_chargeImage = loadImage("ultro_power.png");
  gameOverImage = loadImage("gameover.png");
  restartImage = loadImage("restart.png");
  obstacle1Image = loadImage("obs1.png");
  obstacle2Image = loadImage("obs3.png");
  obstacle3Image = loadImage("obs4.png");
  baricadeImage = loadImage("bari.png");
  chargeSound = loadSound("charged.wav");
  collisionSound = loadSound("collision.wav");
  jumpSound = loadSound("jump.mp3");
  restartSound = loadSound("restarting.mp3");
  backgroundSound = loadSound("background.mp3");

}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  baricade = createSprite(width,height/1.4,20,20);
  baricade.addImage(baricadeImage)
  baricade.x = baricade.width/2; 
  baricade.velocityX = -(6+3*score/100);
  baricade.scale = 1;
  
  floor = createSprite(width,height-400,width,20);
  floor.addImage(floorImage);
  floor.x = floor.width /2; 
  floor.velocityX = -(6 + 3*score/100);
  floor.scale = 2;
  
  robo = createSprite(windowWidth/4,height-110,20,50);
  robo.addAnimation("running",robo_running); 
  robo.addAnimation("collided",robo_collided) 
  robo.scale = 0.8;
  
  invisibleGround = createSprite(width/2,height-5,width,125);
  invisibleGround.visible = false;
  
  gameOver = createSprite(windowWidth/2,windowHeight/3);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.2;
  
  restart = createSprite(windowWidth/2,windowHeight/2);
  restart.addImage(restartImage);
  restart.scale = 0.15;
  
  starsGroup = new Group();
  obstaclesGroup = new Group();
  chargeGroup = new Group();
  ultro_charge = new Group();
  
  robo.setCollider("circle",0,0,45);
  robo.debug = false;
  
  texting = "Charge:";
  backgroundSound.play();
  score = 0;
}

function draw(){
  background("black");
  
  if (floor.x < 0){ 
  floor.x = floor.width/2;
}
  if (baricade.x < 0){ 
  baricade.x = baricade.width/2;
}

  
    if (gameState===PLAY){
    floor.velocityX = -(6 + 3*score/100);
    baricade.velocityX = -(6+3*score/100);
    if((touches.length>0 || keyDown("space")) && robo.y >= 160) {
      robo.velocityY = -20;
      jumpSound.play();
      touches = [];
    }
      
    if(chargeGroup.isTouching(robo)){
      chargeGroup[0].destroy();
      chargeSound.play();
      score = score + 10;
    }
  
    robo.velocityY = robo.velocityY + 0.8
  
    if (floor.x < 0){
      floor.x = floor.width/2;
    }
    gameOver.visible = false;
    restart.visible = false;
    robo.collide(invisibleGround);
      
    spawnStars();
    spawnObstacles();
    spawnCharge();
    spawnText();
  
    if(obstaclesGroup.isTouching(robo)){
        collisionSound.play();
        gameState = END;
    }
  }
  
    else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    floor.velocityX = 0;
    robo.velocityY = 0;
    baricade.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    starsGroup.setVelocityXEach(0);
    chargeGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    starsGroup.setLifetimeEach(-1);
    robo.changeAnimation("collided",robo_collided) 
    backgroundSound.stop();
    
    if(mousePressedOver(restart) || touches.length>0) {
      reset();
      restartSound.play();
      touches = [];
    }
  }

  
  drawSprites();
}

function spawnStars() {

  if (frameCount % 40 === 0) {
    var stars = createSprite(windowWidth,windowHeight-10,40,10);
    stars.y = Math.round(random(10,180));
    stars.addImage(starsImage);
    stars.scale = 1;
    stars.velocityX = -3;
    stars.lifetime = 500;
    

    stars.depth = stars.depth;
    robo.depth = stars.depth + 1;
    
    stars.depth = stars.depth;
    gameOver.depth = stars.depth+1;
    restart.depth = stars.depth=1;
    
    stars.depth = stars.depth;
    restart.depth = stars.depth+1;
    
    stars.depth = stars.depth;
    baricade.depth = stars.depth+1;
    
    stars.depth = stars.depth;
    texting.depth = stars.depth+1;
    
    starsGroup.add(stars);
  }
  
}

function spawnObstacles() {
  if(frameCount % 240 === 0) {
    var obstacle = createSprite(windowWidth,windowHeight/1.4,10,40);

    obstacle.velocityX = -(6 + 3*score/100);

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1Image);
              break;
      case 2: obstacle.addImage(obstacle2Image);
              break;
      case 3: obstacle.addImage(obstacle3Image);
      default: break;
    }

    obstacle.lifetime = 500;
    obstacle.scale = 0.2;
    obstaclesGroup.add(obstacle);
  }
}

function spawnCharge() {
  if (frameCount % 70 === 0) {
    charge = createSprite(windowWidth,windowHeight/2,40,10);
    charge.y = Math.round(random(windowHeight-400,windowHeight-150));
    charge.addImage(ultro_chargeImage);
    charge.scale = 0.1;
    charge.velocityX = -(6+3*score/100);
    
    charge.lifetime = 500;
    
    charge.depth = robo.depth;
    robo.depth = robo.depth + 1;
    
    chargeGroup.add(charge);
  }
  
}

function spawnText(){
  textSize(windowWidth/20);
  fill("red");
  stroke("green");
  strokeWeight(3);
  text(texting+score,windowWidth/20,windowHeight/10);
}


function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  robo.changeAnimation("running",robo_running);
  robo.scale =0.8;
  
  backgroundSound.play();

  obstaclesGroup.destroyEach();
  starsGroup.destroyEach();
  chargeGroup.destroyEach();
  
  score = 0;
  
}

