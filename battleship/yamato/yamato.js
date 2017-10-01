/**
 * Creating a Neural Network with # of inputs, hidden neurons, and outputs
 * @param {Number} inputs 
 * @param {Number} hidden 
 * @param {Number} outputs 
 * @return {NeuralNetwork}
 */
function newNN(inputs, hidden, outputs) {
	return new NeuralNetwork(inputs, hidden, outputs, 1/100, "tanh");
}

/**
 * This represents the whole neural network.
 * @return {NeuralNetwork}
 */
var nn = newNN(100, 1, 100);

/**
 * Save the network to the local storage
 */
function saveNN() {
	localStorage.setItem("nn", JSON.stringify(nn));
}

/**
 * Load the network from the local storage
 */
function loadNN() {
	if (localStorage.getItem("nn") === null) {
		//nn = JSON.parse(getBackup());
		nn = newNN(100, 1, 100);
		//nn = Object.assign(new NeuralNetwork, nn);
		//console.log("Loaded a pre-trained neural network.");
		console.log("Loaded a new neural network.");
	} else {
		nn = JSON.parse(localStorage.getItem("nn"));
		nn = Object.assign(new NeuralNetwork, nn);
		nn.wih = Object.assign(new Matrix, nn.wih);
		nn.who = Object.assign(new Matrix, nn.who);
		//nn = nn.copy();
		console.log("Loaded an existing neural network.");
	}
}

/**
 * Select the best move
 * @param {Array} inputGrid 
 * @return {Number}
 */
function nnSelect(inputGrid) {

	// Get all the neuron scores
	var scores = nn.query(inputGrid);

	// Select the max score
	var max = Number.NEGATIVE_INFINITY;
	for (var x in inputGrid) {
		if (inputGrid[x] == 0) {
			max = Math.max(max, scores[x]);
		}
	}
	console.log("Max : " + max);

	// Get an array containing only the maximum score
	var maxArray = new Array();
	for (var x in scores) {
		if (scores[x] == max && inputGrid[x] == 0) {
			maxArray.push(x);
		}
	}
	//console.log(maxArray);

	// Select randomly
	var position = maxArray[Math.floor(Math.random() * maxArray.length)];
	console.log("Selection : " + position);

	return position;
}

/**
 * Enables Skynet to learn from its mistakes
 * @param {Number} selection 
 * @param {Array} inputGrid 
 * @param {Number} desired 
 */
function learn(selection, inputGrid, desired) {
	//var target = nn.query(inputGrid);
	var target = getTrueVision(inputGrid);
	target[selection] = desired;
	nn.train(inputGrid, target);
	saveNN();
}

/**
 * Creates a .json file and downloads it.
 */
function exportJSON() {
	var blob = new Blob([JSON.stringify(nn)], {
		type: "text/json;charset=utf-8"
	});
	saveAs(blob, "yamato.json");
}

/**
 * Selects a JSON file and imports it.
 */
function importJSON() {
	var i = document.getElementById("file-input");
	var f = i.files;

	// Create a FileReader object to read the file
	var reader = new FileReader();

	// Add an event listener for the onloaded event
	reader.addEventListener("load", fileRead, false);

	// When the file is loaded, fileRead will be called
	reader.readAsText(f[0]);
}