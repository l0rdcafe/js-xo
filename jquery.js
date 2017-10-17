var model = {};
var view = {};
var BLANK = '-';

model.board = {
  gameBoard: [
    [BLANK, BLANK, BLANK],
    [BLANK, BLANK, BLANK],
    [BLANK, BLANK, BLANK]
  ],
  isGameOver: false,
  currentPlayer: 'X',
  dimensions: 3,
  xPlayerScore: 0,
  oPlayerScore: 0,
  calcDims: function () {
    var dims = this.dimensions;
    return $('#xo-board').width() / dims;
  }
};

model.clearBoard = function () {
  model.board.gameBoard.forEach(function (row) {
    row.forEach(function (cell, index) {
      row[index] = BLANK;
    });
  });
};

model.isGameWon = function () {
  var board = this.board.gameBoard;
  function isWin(cell1, cell2, cell3) {
    if (cell1 === BLANK || cell2 === BLANK || cell3 === BLANK) {
      return false;
    } return cell1 === cell2 && cell2 === cell3;
  }
  if (isWin(board[0][0], board[0][1], board[0][2])) {
    return true;
  } else if (isWin(board[0][0], board[1][0], board[2][0])) {
    return true;
  } else if (isWin(board[0][0], board[1][1], board[2][2])) {
    return true;
  } else if (isWin(board[1][0], board[1][1], board[1][2])) {
    return true;
  } else if (isWin(board[0][2], board[1][1], board[2][0])) {
    return true;
  } else if (isWin(board[2][0], board[2][1], board[2][2])) {
    return true;
  } else if (isWin(board[0][1], board[1][1], board[2][1])) {
    return true;
  } else if (isWin(board[0][2], board[1][2], board[2][2])) {
    return true;
  }
  return false;
};

model.addScore = function (player) {
  if (player === 'X') {
    model.board.xPlayerScore += 1;
  } else if (player === 'O') {
    model.board.oPlayerScore += 1;
  }
};

model.tick = function (x, y) {
  if (model.board.currentPlayer === 'X' && model.board.gameBoard[y][x] === BLANK) {
    model.board.gameBoard[y][x] = 'x';
    model.changePlayer();
  } else if (model.board.currentPlayer === 'O' && model.board.gameBoard[y][x] === BLANK) {
    model.board.gameBoard[y][x] = 'o';
    model.changePlayer();
  }

  if (model.isGameWon()) {
    model.board.isGameOver = true;
    model.changePlayer();
    model.addScore(model.board.currentPlayer);
    $('#xo-board').off();
    view.newRoundListener();
    view.drawGameOver(model.board.currentPlayer);
  }
  view.render();
};

model.changePlayer = function () {
  if (model.board.currentPlayer === 'X') {
    model.board.currentPlayer = 'O';
  } else if (model.board.currentPlayer === 'O') {
    model.board.currentPlayer = 'X';
  } else if (model.board.isGameOver) {
    model.board.currentPlayer = model.board.currentPlayer;
  }
};

view.drawBoard = function () {
  var x;
  var y;
  var cell;
  var dims = model.board.dimensions;

  for (y = 0; y < dims; y += 1) {
    for (x = 0; x < dims; x += 1) {
      cell = $('<div class="cell has-text-centered"></div>');
      cell.width(model.board.calcDims());
      cell.height(cell.width());
      cell.attr('id', x + '_' + y);
      $('#xo-board').append(cell);
    }
  }
  view.removeBorderOutline();
};

view.clickListener = function () {
  $('#xo-board').on('click', '.cell', function (e) {
    var xIndex;
    var yIndex;
    if ($(e.target).hasClass('cell')) {
      xIndex = parseInt($(this).attr('id').split('').shift(), 10);
      yIndex = parseInt($(this).attr('id').split('').pop(), 10);
      model.tick(xIndex, yIndex);
    }
  });
};

view.newRoundListener = function () {
  var newRound = function () {
    model.clearBoard();
    model.changePlayer();
    model.board.isGameOver = false;
    view.render();
    view.clickListener();
  };
  $('#btn').on('click', newRound);
};

view.drawNewGameBtn = function () {
  if (model.board.isGameOver) {
    $('.section').append('<button id="btn" class="is-info button xcentered">New Round</button>');
  } else {
    $('#btn').remove();
  }
};

view.drawGameOver = function (player) {
  $('.title').html('Player ' + player + ' has won.');
};

view.drawScores = function () {
  $('#xscore').html('X: ' + model.board.xPlayerScore);
  $('#oscore').html('O: ' + model.board.oPlayerScore);
};

view.removeBorderOutline = function () {
  $('#0_0').css({ 'border-top': '0', 'border-left': '0' });
  $('#1_0').css({ 'border-top': '0' });
  $('#2_0').css({ 'border-top': '0', 'border-right': '0' });
  $('#0_1').css({ 'border-left': '0' });
  $('#2_1').css({ 'border-right': '0' });
  $('#0_2').css({ 'border-left': '0', 'border-bottom': '0' });
  $('#1_2').css({ 'border-bottom': '0' });
  $('#2_2').css({ 'border-bottom': '0', 'border-right': '0' });
};

view.render = function () {
  var x;
  var y;
  for (y = 0; y < model.board.dimensions; y += 1) {
    for (x = 0; x < model.board.dimensions; x += 1) {
      if (model.board.gameBoard[y][x] === 'x') {
        $('#' + x + '_' + y).html('X');
      } else if (model.board.gameBoard[y][x] === 'o') {
        $('#' + x + '_' + y).html('O');
      }
    }
  }
  if (model.board.isGameOver) {
    view.drawNewGameBtn();
  }
};

$(document).ready(function () {
  view.drawBoard();
  view.drawScores();
  view.clickListener();
});
