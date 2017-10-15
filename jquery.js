var model = {};
var view = {};

model.board = {
  gameBoard: [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ],
  isGameOver: false,
  currentPlayer: 'x',
  dimensions: 3,
  calcDims: function () {
    var dims = this.dimensions;
    return $('#xo-board').width() / dims;
  }
};

model.isGameWon = function () {
  model.board.gameBoard.forEach(function (row, y) {
    row.forEach(function (cell, x) {
      if (model.board.gameBoard[y][x] === 'x' || model.board.gameBoard[y][x] === 'o') {
        return true;
      }
      return false;
    });
    if (model.board.gameBoard[y][y] === 'x' || model.board.gameBoard[y][y] === 'o') {
      return true;
    }
    return false;
  });
};

model.tick = function (x, y) {
  if (model.board.currentPlayer === 'x' && model.board.gameBoard[y][x] === '') {
    model.board.gameBoard[y][x] = 'x';
    model.changePlayer();
  } else if (model.board.currentPlayer === 'o' && model.board.gameBoard[y][x] === '') {
    model.board.gameBoard[y][x] = 'o';
    model.changePlayer();
  }

  if (model.isGameWon()) {
    model.board.isGameOver = true;
  }
  view.render();
};

model.changePlayer = function () {
  if (model.board.currentPlayer === 'x') {
    model.board.currentPlayer = 'o';
  } else if (model.board.currentPlayer === 'o') {
    model.board.currentPlayer = 'x';
  } else if (model.board.isGameOver) {
    model.board.currentPlayer = '';
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
};

$(document).ready(function () {
  view.drawBoard();
  view.clickListener();
});
