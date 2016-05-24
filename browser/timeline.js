function drawTimeline () {
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  // ctx.beginPath();
  // ctx.moveTo(100,50);
  // ctx.lineTo(900,50);
  // ctx.stroke();

  var numBars = 4;
  var numQuarters = 4;
  var numSixteenths = 4;

  var startingX = 100;
  var startingY = 50;
  drawTicks(ctx, startingX, startingY, numBars, numQuarters, numSixteenths);

}

function drawTicks (ctx, startingX, startingY, numBars, numQuarters, numSixteenths) {
  for (var i = 0; i < numBars; i++) {
    endingX = startingX + 200;
    ctx.beginPath();
    ctx.moveTo(endingX, startingY - 10);
    ctx.lineTo(endingX, startingY + 10);
    ctx.stroke();
    drawQuarters(ctx, startingX, startingY, numQuarters, numSixteenths);
    startingX = endingX;
  }
}

function drawQuarters (ctx, startingX, startingY, numQuarters, numSixteenths) {
  for (var i = 0; i < numQuarters; i++) {
    endingX = startingX + 50;
    ctx.beginPath();
    ctx.moveTo(endingX, startingY - 5);
    ctx.lineTo(endingX, startingY + 5);
    ctx.stroke();
    drawSixteenths(ctx, startingX, startingY, numSixteenths);
    startingX = endingX;
  }
}

function drawSixteenths (ctx, startingX, startingY, numSixteenths) {
  for (var i = 0; i < numSixteenths; i++) {
    ctx.beginPath();
    ctx.moveTo(startingX, startingY);
    endingX = startingX + 12.5;
    ctx.lineTo(endingX, startingY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(endingX, startingY - 2.5);
    ctx.lineTo(endingX, startingY + 2.5);
    ctx.stroke();
    startingX = endingX;
  }
}




var canvas = document.getElementById('myCanvas');
var boundingRect = canvas.getBoundingClientRect();
drawTimeline();
