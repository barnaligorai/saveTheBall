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

      if (x > (maxX - this.#size) || x < 0) {
        this.#speed.dx = - this.#speed.dx;
      }

      if (y > (maxY - this.#size) || y < 0) {
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

  const addClickEvent = (element, ball, scoreBoard) => {
    element.addEventListener('click', () => {
      ball.bounceUp();
      scoreBoard.increase();
    });
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

  const createScoreElement = (scoreBoard) => {
    const { id, score } = scoreBoard.getInfo();
    const scoreElement = document.createElement('div');
    scoreElement.id = id;
    scoreElement.innerText = score;
    const scoreBoardElement = document.getElementById('score-board');
    scoreBoardElement.appendChild(scoreElement);
  };

  const updateBallElement = (ball) => {
    const ballElement = document.getElementById('ball');
    const { position } = ball.getInfo();
    ballElement.style.top = px(position.y);
    ballElement.style.left = px(position.x);
  };
  const updateScoreBoardElement = (score) => {
    const scoreElement = document.getElementById('score');
    scoreElement.innerText = score.getScore();
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

  class ScoreBoard {
    #score;
    #id;
    constructor(id) {
      this.#id = id;
      this.#score = 0;
    }

    increase() {
      this.#score++;
    }

    getInfo() {
      console.log({ id: this.#id, score: this.#score });
      return { id: this.#id, score: this.#score };
    }

    getScore() {
      return this.#score;
    }
  }

  const startGame = (event) => {
    const view = createView();
    const ball = new Ball('ball', 100, '#AE2012', { x: 0, y: 0 }, { dx: 2, dy: 4 });
    const scoreBoard = new ScoreBoard('score');
    createBallElement(ball);
    createScoreElement(scoreBoard);

    addClickEvent(document.getElementById('ball'), ball, scoreBoard);

    const intervalId = setInterval(() => {
      if (ball.hasHitFloor(view)) {
        clearInterval(intervalId);
        alert('Game over.');
        return;
      }
      ball.move(view);
      updateBallElement(ball);
      updateScoreBoardElement(scoreBoard);
    }, 30);
  };

  window.onload = (event) => startGame(event);
})();
