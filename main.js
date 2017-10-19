var model = {};
var view = {};
var handlers = {};
var BLANK = '-';
var X_TOKEN = 'X';
var O_TOKEN = 'O';

model.state = {
  gameBoard: [
    [BLANK, BLANK, BLANK],
    [BLANK, BLANK, BLANK],
    [BLANK, BLANK, BLANK]
  ],
  isWon: false,
  isDraw: false,
  currentPlayer: X_TOKEN,
  dimensions: 3,
  xPlayerScore: 0,
  oPlayerScore: 0
};

model.clearBoard = function () {
  model.state.gameBoard.forEach(function (row) {
    row.forEach(function (cell, index) {
      row[index] = BLANK;
    });
  });
};

model.resetBoard = function () {
  model.clearBoard();
  model.state.isWon = false;
  model.state.isDraw = false;
};

model.isGameWon = function () {
  var b = this.state.gameBoard;
  function isWin(cell1, cell2, cell3) {
    if (cell1 === BLANK || cell2 === BLANK || cell3 === BLANK) {
      return false;
    }
    return cell1 === cell2 && cell2 === cell3;
  }

  return isWin(b[0][0], b[0][1], b[0][2]) ||
    isWin(b[0][0], b[1][0], b[2][0]) ||
    isWin(b[0][0], b[1][1], b[2][2]) ||
    isWin(b[1][0], b[1][1], b[1][2]) ||
    isWin(b[0][2], b[1][1], b[2][0]) ||
    isWin(b[2][0], b[2][1], b[2][2]) ||
    isWin(b[0][1], b[1][1], b[2][1]) ||
    isWin(b[0][2], b[1][2], b[2][2]);
};

model.noBlanksLeft = function () {
  function flatten(grid) {
    return grid.reduce(function (acc, row) {
      return acc.concat(row);
    }, []);
  }
  return flatten(model.state.gameBoard)
    .filter(function (cell) {
      return cell === BLANK;
    }).length === 0;
};

model.tick = function (x, y) {
  var addScore = function (player) {
    if (player === 'X') {
      model.state.xPlayerScore += 1;
    } else if (player === 'O') {
      model.state.oPlayerScore += 1;
    } else {
      throw new Error(player + ' is not a valid player');
    }
  };

  var changePlayer = function () {
    if (model.state.currentPlayer === X_TOKEN) {
      model.state.currentPlayer = O_TOKEN;
    } else if (model.state.currentPlayer === O_TOKEN) {
      model.state.currentPlayer = X_TOKEN;
    } else {
      throw new Error('Invalid player name');
    }
  };

  if (model.state.currentPlayer === X_TOKEN) {
    model.state.gameBoard[y][x] = 'x';
  } else if (model.state.currentPlayer === O_TOKEN) {
    model.state.gameBoard[y][x] = 'o';
  } else {
    throw new Error('Invalid player');
  }

  if (model.isGameWon()) {
    model.state.isWon = true;
    addScore(model.state.currentPlayer);
  } else if (model.noBlanksLeft()) {
    model.state.isDraw = true;
  }
  changePlayer();
};

view.drawBoard = function () {
  var x;
  var y;
  var $board = $('#xo-board');
  var cell;
  var dims = model.state.dimensions;
  var cellLength = $board.width() / dims;
  var $cells = $(document.createDocumentFragment());
  var removeBorderOutline = function () {
    $('#0_0').css({ 'border-top': '0', 'border-left': '0' });
    $('#1_0').css({ 'border-top': '0' });
    $('#2_0').css({ 'border-top': '0', 'border-right': '0' });
    $('#0_1').css({ 'border-left': '0' });
    $('#2_1').css({ 'border-right': '0' });
    $('#0_2').css({ 'border-left': '0', 'border-bottom': '0' });
    $('#1_2').css({ 'border-bottom': '0' });
    $('#2_2').css({ 'border-bottom': '0', 'border-right': '0' });
  };

  for (y = 0; y < dims; y += 1) {
    for (x = 0; x < dims; x += 1) {
      cell = $('<div class="cell has-text-centered"></div>');
      cell.width(cellLength);
      cell.height(cellLength);
      cell.attr('id', x + '_' + y);
      $cells.append(cell);
    }
  }
  $board.append($cells);
  removeBorderOutline();
};

view.drawNewGameBtn = function () {
  $('.section').append('<button id="btn" class="is-info button xcentered">New Round</button>');
};

view.drawTitle = function () {
  $('.title').html('X/O');
};

view.drawGameOver = function (player) {
  var prevPlayer;
  var $title = $('.title');
  if (model.state.isDraw) {
    $title.html('Game was a draw');
  } else if (model.state.isWon) {
    prevPlayer = player === X_TOKEN ? O_TOKEN : X_TOKEN;
    $title.html('Player ' + prevPlayer + ' has won.');
  }
};

view.drawScores = function () {
  $('#xscore').html('X: ' + model.state.xPlayerScore);
  $('#oscore').html('O: ' + model.state.oPlayerScore);
};

view.render = function () {
  var x;
  var y;
  for (y = 0; y < model.state.dimensions; y += 1) {
    for (x = 0; x < model.state.dimensions; x += 1) {
      if (model.state.gameBoard[y][x] === 'x') {
        $('#' + x + '_' + y).html(X_TOKEN);
      } else if (model.state.gameBoard[y][x] === 'o') {
        $('#' + x + '_' + y).html(O_TOKEN);
      } else {
        $('#' + x + '_' + y).html('');
      }
    }
  }
  this.drawScores();

  if (model.state.isWon || model.state.isDraw) {
    view.drawGameOver(model.state.currentPlayer);
  }
};

handlers.clickListener = function () {
  $('#xo-board').on('click', '.cell', function () {
    var xIndex;
    var yIndex;
    if ($(this).html() !== X_TOKEN && $(this).html() !== O_TOKEN) {
      xIndex = parseInt($(this).attr('id').split('').shift(), 10);
      yIndex = parseInt($(this).attr('id').split('').pop(), 10);
      model.tick(xIndex, yIndex);
      view.render();
    }
  });
};

handlers.newRoundListener = function () {
  var newRound = function () {
    model.resetBoard();
    view.drawTitle();
    view.render();
  };
  $('#btn').on('click', newRound);
};

handlers.init = function () {
  model.resetBoard();
  view.drawBoard();
  view.drawScores();
  view.drawNewGameBtn();
  this.clickListener();
  this.newRoundListener();
};

$(document).ready(handlers.init.bind(handlers));
