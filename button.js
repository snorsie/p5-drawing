class ButtonGroup {
  constructor(buttons) {
    this.buttons = buttons;
  }

  check(x, y) {
    let result = null;
    for (let i = 0; i < this.buttons.length; i++) {
      if (this.buttons[i].check(x, y)) {
        result = i;
        break;
      }
    }

    if (result != null) {
      for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i].set(false);
      }
      this.buttons[result].set(true);
    }

    return result;
  }

  draw() {
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].draw()
    }
  }
}

class SquareButton {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.selected = false;
  }

  check(x, y) {
    return (
      x > this.x && x < this.x + this.size &&
      y > this.y && y < this.y + this.size
    );
  }

  set(state) {
    this.selected = state;
  }

  push() {
    this.selected = !this.selected;
  }

  draw() {
    push();
    if (this.selected) {
      fill(220);
    } else {
      fill(100);
    }
    square(this.x, this.y, this.size);
    fill(this.color);
    square(this.x + 3, this.y + 3, this.size - 6);
    pop();
  }
}

