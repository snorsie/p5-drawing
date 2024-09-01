const X_OFFSET = 28;
const Y_OFFSET = 28;
const CANVAS_COLOR = 80;
const OUTLINE_COLOR = 100;
const SIZE_OPTIONS = [10, 15, 20, 25, 30];
const COLOR_OPTIONS = [
  '#f4f6f7', '#d98880', '#c39bd3', '#7fb3d5',
  '#76d7c4', '#7dcea0', '#f7dc6f', '#f0b27a',
]

let canvas, pallet, brushes, reset, undo;
let brushColor, brushSize;
let previousX, previousY;
let undo_history = [];


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
  pallet = new ButtonGroup(colorButtonList);


  let sizeButtonList = [];
  for (let i = 0; i < SIZE_OPTIONS.length; i++) {
    sizeButtonList.push(new SquareButton(COL2, 205 + (i * 60), 50, OUTLINE_COLOR));
  }
  brushes = new ButtonGroup(sizeButtonList);
  reset = new SquareButton(COL2, 25, 50, OUTLINE_COLOR);
  undo = new SquareButton(COL2, 85, 50, OUTLINE_COLOR);

  brushColor = color('white');
  brushSize = 10;
  pallet.buttons[0].set(true);
  brushes.buttons[0].set(true);

  // noCursor();
  noStroke();
}

function draw() {

  // put drawing code here
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
  undo.draw();

  push();
  stroke(255);
  strokeWeight(10);
  line(reset.x + 15, reset.y + 15, reset.x + reset.size - 15, reset.y + reset.size - 15);
  line(reset.x + 15, reset.y + reset.size - 15, reset.x + reset.size - 15, reset.y + 15);
  pop();
}

function touchMoved() {
  canvas.push()
  canvas.stroke(brushColor);
  canvas.strokeWeight(brushSize);
  canvas.line(
    previousX - X_OFFSET - 3,
    previousY - Y_OFFSET - 3,
    mouseX - X_OFFSET - 3,
    mouseY - Y_OFFSET - 3
  );
  canvas.pop()
  previousX = mouseX; previousY = mouseY;
}

function touchStarted() {
  previousX = mouseX; previousY = mouseY;
  if (
    mouseX > X_OFFSET && mouseY > Y_OFFSET &&
    mouseX < X_OFFSET + canvas.width &&
    mouseY < Y_OFFSET + canvas.height) {

    undo_history.push(canvas);

    if (undo_history.length > 10) {
      undo_history.shift();
    }
  }

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

  if (undo.check(mouseX, mouseY)) {
    canvas = undo_history.shift();
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
