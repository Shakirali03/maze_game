var canvas = document.getElementById("mazecanvas");
var context = canvas.getContext("2d");
var currRectX = 425;
var currRectY = 3;
var mazeWidth = 556;
var mazeHeight = 556;
var intervalVar;
function drawMazeAndRectangle(rectX, rectY) {
    makeWhite(0, 0, canvas.width, canvas.height);
    var mazeImg = new Image();
    mazeImg.onload = function () { // when the image is loaded, draw the image,  
                                   //the rectangle and the circle
        context.drawImage(mazeImg, 0, 0);
        drawRectangle(rectX, rectY, "#0000FF", false, true);
        context.beginPath();
        context.arc(542, 122, 7, 0, 2 * Math.PI, false);
        context.closePath();
        context.fillStyle = '#00FF00';
        context.fill();
    };
    mazeImg.src = "./image/maze.gif";
}
function drawRectangle(x, y, style) {
    makeWhite(currRectX, currRectY, 15, 15);
    currRectX = x;
    currRectY = y;
    context.beginPath();
    context.rect(x, y, 15, 15);
    context.closePath();
    context.fillStyle = style;
    context.fill();
}
drawMazeAndRectangle(425, 3); // { 425, 3 } is the position
                              // of the blue rectangle on the canvas
                              function makeWhite(x, y, w, h) {
    context.beginPath();
    context.rect(x, y, w, h);
    context.closePath();
    context.fillStyle = "white";
    context.fill();
}
function moveRect(e) {
    var newX;
    var newY;
    var canMove;
    e = e || window.event;
    switch (e.keyCode) {
        case 38:   // arrow up key
        case 87:   // W key
            newX = currRectX;
            newY = currRectY - 3;
            break;
        case 37:   // arrow left key
        case 65:   // A key
            newX = currRectX - 3;
            newY = currRectY;
            break;
        case 40:   // arrow down key
        case 83:   // S key
            newX = currRectX;
            newY = currRectY + 3;
            break;
        case 39:   // arrow right key
        case 68:   // D key
            newX = currRectX + 3;
            newY = currRectY;
            break;
        default: return;
    }
    movingAllowed = canMoveTo(newX, newY);
    if (movingAllowed === 1) {      // 1 means 'the rectangle can move'
        drawRectangle(newX, newY, "#0000FF");
        currRectX = newX;
        currRectY = newY;
    }
    else if (movingAllowed === 2) { // 2 means 'the rectangle reached the end point'
        clearInterval(intervalVar); // we'll set the timer later in this article
        makeWhite(0, 0, canvas.width, canvas.height);
        context.font = "40px Arial";
        context.fillStyle = "blue";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("Congratulations!", canvas.width / 2, canvas.height / 2);
        window.removeEventListener("keydown", moveRect, true);
    }
}
drawMazeAndRectangle(425, 3);                       // this line is already added
window.addEventListener("keydown", moveRect, true); // add this at the bottom of your script
function canMoveTo(destX, destY) {
    var imgData = context.getImageData(destX, destY, 15, 15);
    var data = imgData.data;
    var canMove = 1;                               // 1 means: the rectangle can move
    if (destX >= 0 && destX <= mazeWidth - 15 && destY >= 0 && 
        destY <= mazeHeight - 15) {                // check whether the rectangle would move 
                                                   // inside the bounds of the canvas
        for (var i = 0; i < 4 * 15 * 15; i += 4) { // look at all pixels
            if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) { // black
                canMove = 0;                       // 0 means: the rectangle can't move
                break;
            }
            else if (data[i] === 0 && data[i + 1] === 255 && 
                                      data[i + 2] === 0) { // lime: #00FF00
                canMove = 2;                       // 2 means: the end point is reached
                break;
            }
        }
    }
    else {
        canMove = 0;
    }
    return canMove;
}
function createTimer(seconds) {
    intervalVar = setInterval(function () {
        makeWhite(mazeWidth, 0, canvas.width - mazeWidth, canvas.height);
        if (seconds === 0) {
            clearInterval(intervalVar);
            window.removeEventListener("keydown", moveRect, true);
            makeWhite(0, 0, canvas.width, canvas.height);
            context.font = "40px Arial";
            context.fillStyle = "red";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText("Time's up!", canvas.width / 2, canvas.height / 2);
            return;
        }
        context.font = "20px Arial";
        if (seconds <= 10 && seconds > 5) {
            context.fillStyle = "orangered";
        }
        else if (seconds <= 5) {
            context.fillStyle = "red";
        }
        else {
            context.fillStyle = "green";
        }
        context.textAlign = "center";
        context.textBaseline = "middle";
        var minutes = Math.floor(seconds / 60);
        var secondsToShow = (seconds - minutes * 60).toString();
        if (secondsToShow.length === 1) {
            secondsToShow = "0" + secondsToShow; // if the number of seconds is 
                                                 // '5' for example, make sure that 
                                                 // it is shown as '05'
        }
        context.fillText(minutes.toString() + ":" + secondsToShow, 
                                                    mazeWidth + 30, canvas.height / 2);
        seconds--;
    }, 1000);
}
drawMazeAndRectangle(425, 3);                       // added already
window.addEventListener("keydown", moveRect, true); // added already
createTimer(120);                                   // add this line
                                                    // 120 seconds -> 2 minutes