const BLANK = "-";
const X_TOKEN = "X";
const O_TOKEN = "O";

const model = (function() {
  const state = {
    gameBoard: [[BLANK, BLANK, BLANK], [BLANK, BLANK, BLANK], [BLANK, BLANK, BLANK]],
    isWon: false,
    isDraw: false,
    currentPlayer: X_TOKEN,
    dimensions: 3,
    xPlayerScore: 0,
    oPlayerScore: 0
  };

  const isGameWon = function() {
    const b = state.gameBoard;
    function isWin(cell1, cell2, cell3) {
      if (cell1 === BLANK || cell2 === BLANK || cell3 === BLANK) {
        return false;
      }
      return cell1 === cell2 && cell2 === cell3;
    }

    return (
      isWin(b[0][0], b[0][1], b[0][2]) ||
      isWin(b[0][0], b[1][0], b[2][0]) ||
      isWin(b[0][0], b[1][1], b[2][2]) ||
      isWin(b[1][0], b[1][1], b[1][2]) ||
      isWin(b[0][2], b[1][1], b[2][0]) ||
      isWin(b[2][0], b[2][1], b[2][2]) ||
      isWin(b[0][1], b[1][1], b[2][1]) ||
      isWin(b[0][2], b[1][2], b[2][2])
    );
  };

  const clearBoard = function() {
    state.gameBoard.forEach(row => {
      row.forEach((cell, index) => {
        row[index] = BLANK;
      });
    });
  };

  const noBlanksLeft = function() {
    function flatten(grid) {
      return grid.reduce((acc, row) => acc.concat(row), []);
    }
    return flatten(state.gameBoard).filter(cell => cell === BLANK).length === 0;
  };

  const tick = function(x, y) {
    const addScore = function(player) {
      if (player === X_TOKEN) {
        state.xPlayerScore += 1;
      } else if (player === O_TOKEN) {
        state.oPlayerScore += 1;
      } else {
        throw new Error(`${player} is not a valid player`);
      }
    };

    const changePlayer = function() {
      if (state.currentPlayer === X_TOKEN) {
        state.currentPlayer = O_TOKEN;
      } else if (state.currentPlayer === O_TOKEN) {
        state.currentPlayer = X_TOKEN;
      } else {
        throw new Error("Invalid player");
      }
    };

    if (state.currentPlayer === X_TOKEN) {
      state.gameBoard[y][x] = "x";
    } else if (state.currentPlayer === O_TOKEN) {
      state.gameBoard[y][x] = "o";
    } else {
      throw new Error("Invalid player move");
    }

    if (isGameWon()) {
      state.isWon = true;
      addScore(state.currentPlayer);
    } else if (noBlanksLeft()) {
      state.isDraw = true;
    }
    changePlayer();
  };

  const resetBoard = function() {
    clearBoard();
    state.isWon = false;
    state.isDraw = false;
  };

  return {
    state,
    tick,
    resetBoard
  };
})();

const view = (function() {
  const drawScores = function() {
    $("#xscore").html(`X: ${model.state.xPlayerScore}`);
    $("#oscore").html(`O: ${model.state.oPlayerScore}`);
  };

  const drawBoard = function() {
    let x;
    let y;
    const $board = $("#xo-board");
    let cell;
    const dims = model.state.dimensions;
    const cellLength = $board.width() / dims;
    const $cells = $(document.createDocumentFragment());

    const removeBorderOutline = function() {
      $("#0_0").css({ "border-top": "0", "border-left": "0" });
      $("#1_0").css({ "border-top": "0" });
      $("#2_0").css({ "border-top": "0", "border-right": "0" });
      $("#0_1").css({ "border-left": "0" });
      $("#2_1").css({ "border-right": "0" });
      $("#0_2").css({ "border-left": "0", "border-bottom": "0" });
      $("#1_2").css({ "border-bottom": "0" });
      $("#2_2").css({ "border-bottom": "0", "border-right": "0" });
    };

    const drawNewGameBtn = function() {
      $(".section").append('<button id="btn" class="is-info button xcentered">New Round</button>');
    };

    for (y = 0; y < dims; y += 1) {
      for (x = 0; x < dims; x += 1) {
        cell = $('<div class="cell has-text-centered"></div>');
        cell.width(cellLength);
        cell.height(cellLength);
        cell.attr("id", `${x}_${y}`);
        $cells.append(cell);
      }
    }
    $board.append($cells);
    removeBorderOutline();
    drawNewGameBtn();
    drawScores();
  };

  const drawTitle = function() {
    $(".title").html("X/O");
  };

  const drawGameOver = function(player) {
    let prevPlayer;
    const $title = $(".title");
    if (model.state.isDraw) {
      $title.html("Game was a draw");
    } else if (model.state.isWon) {
      prevPlayer = player === X_TOKEN ? O_TOKEN : X_TOKEN;
      $title.html(`Player ${prevPlayer} has won.`);
    }
  };

  const render = function() {
    let x;
    let y;
    for (y = 0; y < model.state.dimensions; y += 1) {
      for (x = 0; x < model.state.dimensions; x += 1) {
        if (model.state.gameBoard[y][x] === "x") {
          $(`#${x}_${y}`).html(X_TOKEN);
        } else if (model.state.gameBoard[y][x] === "o") {
          $(`#${x}_${y}`).html(O_TOKEN);
        } else {
          $(`#${x}_${y}`).html("");
        }
      }
    }
    drawScores();

    if (model.state.isWon || model.state.isDraw) {
      drawGameOver(model.state.currentPlayer);
    }
  };

  return {
    render,
    drawBoard,
    drawTitle
  };
})();

const handlers = (function() {
  const clickListener = function() {
    const board = document.getElementById("xo-board");
    const manager = new Hammer.Manager(board);
    const tap = new Hammer.Tap({
      event: "tap",
      taps: 1
    });
    manager.add(tap);
    function handleClick(e) {
      let xIndex;
      let yIndex;
      const { isWon } = model.state;
      if ($(e.target).html() !== X_TOKEN && $(e.target).html() !== O_TOKEN && !isWon) {
        xIndex = parseInt(
          $(e.target)
            .attr("id")
            .split("")
            .shift(),
          10
        );
        yIndex = parseInt(
          $(e.target)
            .attr("id")
            .split("")
            .pop(),
          10
        );
        model.tick(xIndex, yIndex);
        view.render();
      }
    }
    $(board).on("click", ".cell", handleClick);
    manager.on("tap", handleClick);
  };

  const newRoundListener = function() {
    const newRound = function() {
      model.resetBoard();
      view.drawTitle();
      view.render();
    };
    $("#btn").on("click", newRound);
  };

  const init = function() {
    model.resetBoard();
    view.drawBoard();
    this.clickListener();
    this.newRoundListener();
  };

  return {
    init,
    newRoundListener,
    clickListener
  };
})();

$(document).ready(handlers.init.bind(handlers));
