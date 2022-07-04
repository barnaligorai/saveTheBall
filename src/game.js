(function () {
  class Balloon {
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

    move({ maxX, maxY, minX, minY }) {
      const { x, y } = this.#position;

      const rightBound = maxX - this.#size;
      const bottomBound = maxY - this.#size;

      if (x < minX || x > rightBound) {
        this.#speed.dx = - this.#speed.dx;
      }

      if (y > bottomBound || y < minY) {
        this.#speed.dy = - this.#speed.dy;
      }

      this.#position.y += this.#speed.dy;
      this.#position.x += this.#speed.dx;
    }

    hasHitFloor(bounds) {
      return this.#position.y + this.#size >= bounds.maxY;
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
      return { id: this.#id, score: this.#score };
    }

    getScore() {
      return this.#score;
    }
  }

  const addClickEvent = (element, balloon, scoreBoard) => {
    element.addEventListener('click', () => {
      balloon.bounceUp();
      scoreBoard.increase();
    });
  };

  const px = (value) => value + 'px';

  const createBalloonElement = (balloon) => {
    const { id, position, size, color } = balloon.getInfo();

    const viewElement = document.getElementById('view');
    const balloonElement = document.createElement('div');

    balloonElement.id = id;
    balloonElement.style.top = px(position.y);
    balloonElement.style.left = px(position.x);
    balloonElement.style.width = px(size);
    balloonElement.style['background-color'] = color;

    viewElement.appendChild(balloonElement);
    return balloonElement;
  };

  const createScoreElement = (scoreBoard) => {
    const { id, score } = scoreBoard.getInfo();

    const scoreBoardElement = document.getElementById('score-board');

    const scoreElement = document.createElement('div');
    scoreElement.id = id;
    scoreElement.innerText = score;
    scoreBoardElement.appendChild(scoreElement);
    return scoreElement;
  };

  const updateBalloonElement = (balloon) => {
    const balloonElement = document.getElementById('balloon');
    const { position } = balloon.getInfo();
    balloonElement.style.top = px(position.y);
    balloonElement.style.left = px(position.x);
  };

  const updateScoreBoardElement = (score) => {
    const scoreElement = document.getElementById('score');
    scoreElement.innerText = score.getScore();
  };

  const createBounds = () => {
    const view = {};
    const viewElement = document.getElementById('view');
    view.maxY = viewElement.clientHeight;
    view.maxX = viewElement.clientWidth;
    view.minY = viewElement.clientTop;
    view.minX = viewElement.clientLeft;
    return view;
  };

  const startGame = () => {
    const bounds = createBounds();
    const balloon = new Balloon('balloon', 100, '#AE2012', { x: 0, y: 0 }, { dx: 2, dy: 4 });
    const scoreBoard = new ScoreBoard('score');
    const balloonElement = createBalloonElement(balloon);
    createScoreElement(scoreBoard);

    addClickEvent(balloonElement, balloon, scoreBoard);

    const intervalId = setInterval(() => {
      if (balloon.hasHitFloor(bounds)) {
        clearInterval(intervalId);
        alert('Game over.');
        return;
      }
      balloon.move(bounds);
      updateBalloonElement(balloon);
      updateScoreBoardElement(scoreBoard);
    }, 30);
  };

  window.onload = () => startGame();
})();
