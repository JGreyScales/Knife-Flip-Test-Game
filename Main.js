// var definement
// ctx definement
let playSpace = document.getElementById("playSpace");
const ctx = playSpace.getContext("2d");

// knife properties
let knifeSprite = new Image();
knifeSprite.src = "cs__go_counter_terrorist_knife_sprite_by_marksman_hq_dbziszl-200h-781793151.png";
let blocks = [10];
// first block is always on 10, after that random gen the next 4 blocks
generateBlocks(4);
let knifeRotation = 0;
let knifePower = 0;
let knifeRelease = false;
let knifeFalling = 1;
let knifey = 0

// Input variables
let inputStart = 0;
let currentTime = new Date();
let keyPressed = false;

// Score variable
let score = 0;
let scoreText = "0";


// takes a random floored value between 114-266 and makes block located there
function generateBlocks(x){
    for (let i = 0; i < x; i++){
        blocks.push(blocks.slice(-1)[0] + (Math.random() * (266 - 114) ) + 114 | 0)
    }
}
// conversion
function degToRad(x){
    return x * Math.PI / 180;
}


// Render the knife from a sprite
function renderKnife(){
    ctx.save();
    ctx.translate(30, 290 - knifey);
    ctx.rotate(degToRad(knifeRotation + 180));
    ctx.drawImage(knifeSprite, -20, -35, 40, 70);
    ctx.restore()

}

// Render landing blocks
function renderBlocks(){
    ctx.fillStyle = "rgb(61,43,31)";
    blocks.forEach(block => {
        ctx.fillRect(block,310,40,40);
    });
}

// gets current score and renders to the screen
function renderScoreboard(){
    scoreText = score.toString();
    ctx.font = "150px serif"
    ctx.fillText(scoreText, (playSpace.width/2) - (ctx.measureText(scoreText).width / 2), (playSpace.height/2) + 30)
    ctx.font = "25px arial"
    ctx.fillText("Hold Space", 40, 45)
}

// render power bar
// Renders outline first
// Renders bar second
function renderPowerBar(){
    ctx.moveTo(0,21);
    ctx.lineTo(201,21);
    ctx.lineTo(201,0)
    ctx.stroke();

    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, knifePower * 20, 20);
}

// Checks to see if player scored a point
function goodFlipCheck(){
    return false
}

// Controls rotation speed, velocity of knife flip
function flipKnife(){

    // controls the up and down of the knife as it flips
    if (knifeFalling){
        knifey -= 0.999999
        if (knifey < 1){
            knifeFalling = false;
            knifey = 0
        }
    } else {
        knifey += 0.999999
        if (knifey > 149){
            knifeFalling = true;
        }
    }


    knifeRotation += 1.2;
    if(goodFlipCheck() && knifePower === 0){
        score++;
    }
}

// Main gameloop
function gameLoop() {
    ctx.clearRect(0, 0, playSpace.width, playSpace.height);


    // Each frame get current time in seconds.
    // Use Bitwise-OR to floor value
    currentTime = Date.now() / 1000 | 0;

    // Gather knifePower each frame input is held
    if(keyPressed){
        knifePower = currentTime - inputStart
        if (knifePower > 10){
            knifePower = 10;
        }
    } else {
        knifePower = 0
    }

    // Gather user input
    // When key down, update variables
    window.onkeydown = function(press){
        if(press.keyCode === 32 && !keyPressed){
            inputStart = currentTime;
        }
        keyPressed = true;
    }


    // When key up, update variables
    window.onkeyup = function(release){
        if(release.keyCode === 32){
            knifePower = currentTime - inputStart;
            knifeRelease = true;
            keyPressed = false;
        }
    }


    // If knife is flipping, animate each frame
    if (knifeRelease){
        flipKnife();
    }

    // Render frame
    renderScoreboard();
    renderPowerBar();
    renderKnife();
    renderBlocks();
    // Prepare next frame
    window.requestAnimationFrame(gameLoop);
}
// The proper game loop
window.requestAnimationFrame(gameLoop);