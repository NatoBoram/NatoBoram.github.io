function newGame() {
	board = new Array();
	for (var x = 0; x < (8 * 8) / 2; x++) {
		if (x < 12) {
			board.push(1);
		} else if (x >= 32 - 12) {
			board.push(-1);
		} else {
			board.push(0);
		}
	}
}

function colorBoard() {
	table = document.getElementsByTagName("td");
	for (var x = 0; x < table.length; x++) {
		table[x].style.backgroundColor = "white";
	}
	for (var x = 0; x < blacks.length; x++) {
		if (board[x] == 0) {
			table[blacks[x]].style.backgroundColor = "black";
		} else if (board[x] == 1) {
			table[blacks[x]].style.backgroundColor = "red";
		} else if (board[x] == -1) {
			table[blacks[x]].style.backgroundColor = "blue";
		}
	}
}

function getBlacks() {
	var max = 8;
	var blacks = new Array();
	for (var x = 0; x < max * max; x++) {
		if (x % 2 == Math.floor(x / max) % 2) {

		} else {
			blacks.push(x);
		}
	}
	return blacks;
}

var blacks = getBlacks();
var board = new Array();

window.onload = function () {
	console.clear();
	newGame();
	colorBoard();
}
