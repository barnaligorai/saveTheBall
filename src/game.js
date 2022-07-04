(function () {
  class Ball {
    #id;
    #position;
    #size;
    #color;
    #speed;

    constructor(id, size, color, position, speed) {
      this.#id = id;
      this.#position = position;
      this.#size = size;
      this.#speed = speed;
      this.#color = color;
    }

    move({ maxX, maxY, minY, minX }) {
      const { x, y } = this.#position;

      if (x > (maxX - this.#size) || x < minX) {
        this.#speed.dx = - this.#speed.dx;
      }

      if (y > (maxY - this.#size) || y < minY) {
        this.#speed.dy = - this.#speed.dy;
      }

      this.#position.y += this.#speed.dy;
      this.#position.x += this.#speed.dx;
    }

    hasHitFloor(view) {
      return this.#position.y + this.#size >= view.maxY;
    }

    bounceUp() {
      this.#position.y -= 100;
      if (this.#position.y < 0) {
        this.#speed.dy = -this.#speed.dy;
        this.#position.y = 0;
      }
    }

    getInfo() {
      return {
        id: this.#id,
        position: this.#position,
        size: this.#size,
        color: this.#color,
        speed: this.#speed
      }
    }
  }

  const addClickEvent = (element, ball) => {
    element.addEventListener('click', () => ball.bounceUp());
  };

  const px = (value) => value + 'px';

  const createBallElement = (ball) => {
    const viewElement = document.getElementById('view');
    const { id, position, size, speed, color } = ball.getInfo();
    const ballElement = document.createElement('div');
    ballElement.id = id;
    ballElement.style.top = px(position.y);
    ballElement.style.left = px(position.x);
    ballElement.style.width = px(size);
    ballElement.style['background-color'] = color;
    viewElement.appendChild(ballElement);
  };

  const updateBallElement = (ball) => {
    const ballElement = document.getElementById('ball');
    const { position } = ball.getInfo();
    ballElement.style.top = px(position.y);
    ballElement.style.left = px(position.x);
  };

  const createView = () => {
    const view = {};
    const viewElement = document.getElementById('view');
    view.maxY = viewElement.clientHeight;
    view.maxX = viewElement.clientWidth;
    view.minY = viewElement.clientTop;
    view.minX = viewElement.clientLeft;
    return view;
  };

  const startGame = (event) => {
    const view = createView();
    const ball = new Ball('ball', 100, 'red', { x: 100, y: 100 }, { dx: 2, dy: 4 });
    createBallElement(ball);
    addClickEvent(document.getElementById('ball'), ball);

    const intervalId = setInterval(() => {
      if (ball.hasHitFloor(view)) {
        clearInterval(intervalId);
        alert('Game over.');
        return;
      }
      updateBallElement(ball);
      ball.move(view);
    }, 30);
  };

  window.onload = (event) => startGame(event);
})();
