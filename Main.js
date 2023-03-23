// var definement
// ctx definement
const playSpace = document.getElementById("playSpace");
const ctx = playSpace.getContext("2d");
const colours = ["white", "pink"]

let hardstop = false;

// knife properties
let knifeSprite = new Image();
knifeSprite.src = "cs__go_counter_terrorist_knife_sprite_by_marksman_hq_dbziszl-200h-781793151.png";
let blocks = [10.0];
let nextBlock = 0;
// first block is always on 10, after that random gen the next 4 blocks
generateBlocks(4, false);


// knife parameters definement
let knifeRotation = 0;
let knifePower = 0;
let knifeRelease = false;
let knifeFalling = 1;
let knifey = 0;
let distance = 0;

// Input variables
let inputStart = 0;
let currentTime = new Date();
let lastFrameTime = new Date();
let keyPressed = false;

// Score variable
let score = 0;
let scoreText = "0";


// takes a random floored value between 114-266 and makes block located there
function generateBlocks(x, valueReturn){
    for (let i = 0; i < x; i++){
        nextBlock = blocks.slice(-1)[0] + (Math.random() * (266 - 114) ) + 114
        if (valueReturn){
            return nextBlock
        } else {
            blocks.push(nextBlock)
        }
        
    }
    
}
// conversion
function degToRad(x){
    return x * Math.PI / 180;
}

// Render background
function renderBackground(){

    for (i = 0; i < playSpace.width; i = i + 50){
        ctx.fillStyle = colours[(i/50) % 2]
        ctx.fillRect(i, 0, 50, playSpace.height)
    }
    ctx.fillStyle = "rgb(61,43,31)"
   
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

    if (knifeRotation > 359 ){
        knifeRelease = false;
        knifeRotation = 0;
        if (blocks[0] > -10 && blocks[0] < 20){
            return true
        } else {
            return false
        }
    } else {
        return 42
    }
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



    // controls the horizontal velocity
    for (i = 0; blocks.length != i; i++){
        // applies velocity to blocks to give view of knife moving
        blocks[i] = blocks[i] - velocity;
        // if block goes off left side of screen, generate a new random distance for it and place it on the right side
        if (blocks[i] < -39){
            blocks[i] = generateBlocks(1, true)
            // take all values from the array and compare them to their neighbor, if smaller. Move to the left 
            // * refreshes the array
            blocks.sort((a,b) => (a-b));
        }
    }


    // rotation of the knife (will land in 4.97 seconds at 60fps back onto the blade
    knifeRotation += 1.2;
    flipGood = goodFlipCheck()
    console.log(flipGood)
    if(flipGood === true){
        score++;
    } else if (flipGood === false)  {
        hardstop = true
    }
    flipGood = 42
}

// Main gameloop
function gameLoop() {
    if (!hardstop){
        ctx.clearRect(0, 0, playSpace.width, playSpace.height);


        // Each frame get current time in seconds.
        // Use Bitwise-OR to floor value whenever referenced
        currentTime = Date.now();

        // Gather knifePower each frame input is held
        if(keyPressed){
            knifePower = (currentTime / 1000 | 0) - inputStart
            if (knifePower > 10){
                knifePower = 10;
            }
            /*
            time = 4.97
            final velocity = 0
            acceleration = 0
            displacement = 95 + 19x = 190(.5 + (1/10)x)
            Initial velocity = (displacement / time) / 60
            */
           distance = 95 + (19 * knifePower)
           velocity = (distance/4.97) / 60
        } else {
            knifePower = 0
        }

        // Gather user input
        // When key down, update variables
        window.onkeydown = function(press){
            if(press.keyCode === 32 && !keyPressed){
                inputStart = currentTime  / 1000 | 0;
            }
            keyPressed = true;
        }


        // When key up, update variables
        window.onkeyup = function(release){
            if(release.keyCode === 32){
                knifePower = (currentTime / 1000 | 0) - inputStart;
                knifeRelease = true;
                keyPressed = false;
            }
        }


        // If knife is flipping, animate each frame
        if (knifeRelease){ 
            flipKnife();
        }

        // Render frame
        renderBackground();
        renderScoreboard();
        renderPowerBar();
        renderKnife();
        renderBlocks();
        // Prepare next frame
        currentTime = Date.now()

        while ((currentTime - lastFrameTime)  < 0.016){
            currentTime = Date.now()
        }
        lastFrameTime = Date.now();
        window.requestAnimationFrame(gameLoop);
    }
}
// The proper game loop
window.requestAnimationFrame(gameLoop);
