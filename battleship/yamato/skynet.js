/**
 * List of perceptrons
 */
var perceptrons = new Array();
// var nn = new NeuralNetwork(100, 100, 100, "tanh");

/**
 * Creating a Neural Network with inputs, hidden neurons and outputs
 */
function newNetwork() {
	var inputs = 100;
	// var n = 1 / 1000;
	var n = 1;
	perceptrons = new Array();
	for (var c = 0; c < inputs; c++) {
		perceptrons.push(new Perceptron(inputs, n));
	}
	saveNetwork();
	console.log("Created a new neural network.");
}

/**
 * Changes the Learning Rate.
 * @param {Number} newConstant 
 */
function changeLearningRate(newConstant) {
	for (var c = 0; c < perceptrons.length; c++) {
		perceptrons[c].setLearningRate(newConstant);
	}
}

/**
 * Save the network to the local storage
 */
function saveNetwork() {
	localStorage.setItem("network", JSON.stringify(perceptrons));
}

/**
 * Load the network from the local storage
 */
function loadNetwork() {
	if (localStorage.getItem("network") === null) {
		useBackup();
	} else {
		perceptrons = JSON.parse(localStorage.getItem("network"));
		for (var c = 0; c < perceptrons.length; c++) {
			perceptrons[c] = Object.assign(new Perceptron, perceptrons[c]);
		}
		console.log("Loaded an existing neural network.");
	}
}

/**
 * Use the backup in Backup.js
 */
function useBackup() {
	perceptrons = JSON.parse(getBackup());
	for (var c = 0; c < perceptrons.length; c++) {
		perceptrons[c] = Object.assign(new Perceptron, perceptrons[c]);
	}
	saveNetwork();
	console.log("Loaded a pre-trained neural network.");
}

/**
 * Select the best move
 * @param {Array} inputGrid 
 * @return {Number}
 */
function skynetSelect(inputGrid) {

	// Get all the neuron scores
	var neuronScores = new Array();
	for (var c = 0; c < perceptrons.length; c++) {
		neuronScores.push(perceptrons[c].feedforward(inputGrid));
	}
	//console.log(neuronScores);

	// Select the max score
	var max = Number.NEGATIVE_INFINITY;
	for (var c = 0; c < 100; c++) {
		if (inputGrid[c] == 0) {
			max = Math.max(max, neuronScores[c]);
		}
	}
	// console.log("Max : " + max);

	// Get an array containing only the maximum score
	var maxArray = new Array();
	for (var c = 0; c < neuronScores.length; c++) {
		if (neuronScores[c] == max && inputGrid[c] == 0) {
			maxArray.push(c);
		}
	}
	//console.log(maxArray);

	// Select randomly
	var position = maxArray[Math.floor(Math.random() * maxArray.length)];
	// console.log("Selection : " + position);

	return position;
}

/**
 * Enables Skynet to learn from its mistakes
 * @param {Number} selection 
 * @param {Array} inputGrid 
 * @param {Number} desired 
 */
function learn(selection, inputGrid, desired) {
	perceptrons[selection].train(inputGrid, desired);
}

// Import & Export

/**
 * Creates a .json file and downloads it.
 */
function exportJSON() {
	var blob = new Blob([JSON.stringify(perceptrons)], {
		type: "text/json;charset=utf-8"
	});
	saveAs(blob, "yamato.json");
}

/**
 * Selects a JSON file and imports it.
 */
async function importJSON() {
	// MDN
	var selectedFile = document.getElementById("file-input").files[0];
	var reader = new FileReader();
	await reader.readAsText(selectedFile);
	perceptrons = JSON.parse(reader.result);
	for (var x in perceptrons) {
		perceptrons[x] = Object.assign(new Perceptron, perceptrons[x]);
	}
	console.log("Imported a neural network!");
}

/**
 * Place a ship where it wouldn't click
 * @param {Array} grid 
 * @param {Number} size 
 */
function placeShip(grid, size) {

	// Select worst position to click
	var position = getWorstPosition(getTrueVision(grid));
	// console.log("Start ship at : " + position)

	// Get valid orientations for that position
	var orientations = getOrientations(getTrueVision(grid), position, size);

	// Get lowest score from the orientations
	var min = Number.POSITIVE_INFINITY;
	for (var c = 0; c < orientations.length; c++) {
		min = Math.min(min, orientations[c][1]);
	}

	// Get array containing only the minimum scores
	var smallOrientations = new Array();
	for (var c = 0; c < orientations.length; c++) {
		if (orientations[c][1] == min) {
			smallOrientations.push(orientations[c][0]);
		}
	}
	// console.table(smallOrientations);

	// Select random orientation
	var orientation = smallOrientations[Math.floor(Math.random() * smallOrientations.length)]
	// console.log("Selected orientation : " + orientation);

	// Place ship
	applyShip(grid, position, size, orientation);
}

/**
 * Place a ship
 * @param {Array} grid 
 * @param {Number} size 
 * @param {String} orientation 
 */
function applyShip(grid, position, size, orientation) {
	switch (orientation) {
		case "East":
			for (var c = 0; c < size; c++) {
				grid[position + c] = 2;
			}
			break;
		case "West":
			for (var c = 0; c < size; c++) {
				grid[position - c] = 2;
			}
			break;
		case "South":
			for (var c = 0; c < size; c++) {
				grid[position + 10 * c] = 2;
			}
			break;
		case "North":
			for (var c = 0; c < size; c++) {
				grid[position - 10 * c] = 2;
			}
			break;
	}
}

/**
 * Get the possible orientations and their score
 * @param {Array} inputGrid 
 * @param {Number} position 
 * @param {Number} size 
 */
function getOrientations(inputGrid, position, size) {
	var y = Math.floor(position / 10);
	var x = position - (y * 10);

	var orientations = new Array();

	// East
	if (x + (size - 1) <= 9) {
		var valid = true;
		var score = 0;

		// Something in the way?
		for (var c = 0; c < size; c++) {
			if (inputGrid[x + (10 * y) + c] != 0) {
				// console.log("Can't go East because there's something at " + (x + (10 * y) + c) + ".");
				valid = false;
			}
			score += perceptrons[x + (10 * y) + c].feedforward(inputGrid);
		}

		if (valid) {
			orientations.push(["East", score]);
		}

	}

	// West
	if (x - (size - 1) >= 0) {
		var valid = true;
		var score = 0;

		// Something in the way?
		for (var c = 0; c < size; c++) {
			if (inputGrid[x + (10 * y) - c] != 0) {
				// console.log("Can't go West because there's something at " + (x + (10 * y) - c) + ".");
				valid = false;
			}
			score += perceptrons[x + (10 * y) - c].feedforward(inputGrid);
		}

		if (valid) {
			orientations.push(["West", score]);
		}
	}

	// South
	if (y + (size - 1) <= 9) {
		var valid = true;
		var score = 0;

		// Something in the way?
		for (var c = 0; c < size; c++) {
			if (inputGrid[x + 10 * (y + c)] != 0) {
				// console.log("Can't go South because there's something at " + (x + 10 * (y + c)) + ".");
				valid = false;
			}
			score += perceptrons[x + 10 * (y + c)].feedforward(inputGrid);
		}

		if (valid) {
			orientations.push(["South", score]);
		}
	}

	// North
	if (y - (size - 1) >= 0) {
		var valid = true;
		var score = 0;

		// Something in the way?
		for (var c = 0; c < size; c++) {
			if (inputGrid[x + 10 * (y - c)] != 0) {
				// console.log("Can't go North because there's something at " + (x + 10 * (y - c)) + ".");
				valid = false;
			}
			score += perceptrons[x + 10 * (y - c)].feedforward(inputGrid);
		}

		if (valid) {
			orientations.push(["North", score]);
		}
	}

	return orientations;
}

/**
 * Get the worst position to click
 * @param {Array} inputGrid 
 * @return {Number}
 */
function getWorstPosition(inputGrid) {

	// Get all the neuron scores
	var neuronScores = new Array();
	for (var c = 0; c < perceptrons.length; c++) {
		neuronScores.push(perceptrons[c].feedforward(inputGrid));
	}
	//console.log(neuronScores);

	// Select the min score
	var min = Number.POSITIVE_INFINITY;
	for (var c = 0; c < 100; c++) {
		if (inputGrid[c] == 0) {
			min = Math.min(min, neuronScores[c]);
		}
	}
	// console.log("Min : " + min);

	// Get an array containing only the minimum score
	var minArray = new Array();
	for (var c = 0; c < neuronScores.length; c++) {
		if (neuronScores[c] == min && inputGrid[c] == 0) {
			minArray.push(c);
		}
	}
	//console.log(maxArray);

	// Select randomly
	var position = minArray[Math.floor(Math.random() * minArray.length)];
	// console.log("Selection : " + position);

	return position;
}

/**
 * Learn the position of the hidden ships at the end of a game.
 * @param {Array} grid 
 */
function learnFromDefeat(grid) {
	for (var c = 0; c < grid.length; c++) {
		if (grid[c] == 2) {
			perceptrons[c].train(getVision(grid), 1);
		}
	}
}