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

view.drawBoard = function () {
  var x;
  var y;
  var cell;
  var dims = model.board.dimensions;

  for (y = 1; y <= dims; y += 1) {
    for (x = 1; x <= dims; x += 1) {
      cell = $('<div class="cell has-text-centered"></div>');
      cell.width(model.board.calcDims());
      cell.height(cell.width());
      cell.attr('id', x + '_' + y);
      $('#xo-board').append(cell);
    }
  }
};

view.clickListener = function () {
  $('#xo-board').on('click', '.cell', function (e) {
    if ($(e.target).hasClass('cell')) {
      model.tick($(this).attr('id'));
    }
  });
};

$(document).ready(function () {
  view.drawBoard();
  view.clickListener();
});
