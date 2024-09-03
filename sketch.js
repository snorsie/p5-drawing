const X_OFFSET = 28;
const Y_OFFSET = 28;

const CANVAS_COLOR = 80;
const OUTLINE_COLOR = 100;
const SIZE_OPTIONS = [10, 15, 20, 25, 30, 35];

const ROPE_LENGTH = 10;

const COLOR_OPTIONS = [
  '#f4f6f7', '#d98880', '#c39bd3', '#7fb3d5',
  '#76d7c4', '#7dcea0', '#f7dc6f', '#f0b27a'
]

let canvas, pallet, brushes, reset;
let brushColor, brushSize;
let pen, lastPen;

function setup() {
  const COL1 = windowWidth - 135;
  const COL2 = windowWidth - 65;

  const CANVAS_WIDTH = windowWidth - 185;
  const CANVAS_HEIGHT = windowHeight - Y_OFFSET * 2;

  createCanvas(windowWidth, windowHeight);
  canvas = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.background(CANVAS_COLOR);
  canvas.noStroke();

  let colorButtonList = [];
  for (let i = 0; i < COLOR_OPTIONS.length; i++) {
    colorButtonList.push(new SquareButton(COL1, 25 + (i * 60), 50, COLOR_OPTIONS[i]));
  }
  colorButtonList.push(new SquareButton(COL2, 85, 50, CANVAS_COLOR));
  pallet = new ButtonGroup(colorButtonList);


  let sizeButtonList = [];
  for (let i = 0; i < SIZE_OPTIONS.length; i++) {
    sizeButtonList.push(new SquareButton(COL2, 145 + (i * 60), 50, OUTLINE_COLOR));
  }

  brushes = new ButtonGroup(sizeButtonList);
  reset = new SquareButton(COL2, 25, 50, OUTLINE_COLOR);

  brushColor = color('white');
  brushSize = 10;
  pallet.buttons[0].set(true);
  brushes.buttons[0].set(true);


  // noCursor();
  noStroke();
}

function draw() {
  background(51);

  fill(OUTLINE_COLOR);
  rect(X_OFFSET - 3, Y_OFFSET - 3, canvas.width + 6, canvas.height + 6);

  image(canvas, X_OFFSET, Y_OFFSET);

  pallet.draw();
  brushes.draw();

  for (let i = 0; i < brushes.buttons.length; i++) {
    button = brushes.buttons[i];

    push();
    fill(255);
    circle(button.x + button.size / 2, button.y + button.size / 2, SIZE_OPTIONS[i]);
    pop();

  }
  reset.draw();

  push();
  stroke(255);
  strokeWeight(10);
  line(reset.x + 15, reset.y + 15, reset.x + reset.size - 15, reset.y + reset.size - 15);
  line(reset.x + 15, reset.y + reset.size - 15, reset.x + reset.size - 15, reset.y + 15);
  pop();
}

function touchMoved() {
  let cursor = createVector(mouseX, mouseY);

  let distance = pen.dist(cursor);
  if (distance > ROPE_LENGTH) {
    cursor.sub(pen);
    cursor.setMag(distance - ROPE_LENGTH);
    pen.add(cursor);
  }

  canvas.push()
  canvas.stroke(brushColor);
  canvas.strokeWeight(brushSize);
  canvas.line(
    lastPen.x - X_OFFSET - 3,
    lastPen.y - Y_OFFSET - 3,
    pen.x - X_OFFSET - 3,
    pen.y - Y_OFFSET - 3
  );
  canvas.pop()

  lastPen = pen.copy();
}

function touchStarted() {
  pen = createVector(mouseX, mouseY);
  lastPen = createVector(mouseX, mouseY);

  let result;

  result = pallet.check(mouseX, mouseY);
  if (result != null) {
    brushColor = color(pallet.buttons[result].color);
  }

  result = brushes.check(mouseX, mouseY);
  if (result != null) {
    brushSize = SIZE_OPTIONS[result];
  }

  if (reset.check(mouseX, mouseY)) {
    canvas.background(CANVAS_COLOR);
  }
}

function preventBehavior(e) {
  e.preventDefault();
}

/* full screening will change the size of the canvas */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

document.addEventListener("touchmove", preventBehavior, { passive: false });
