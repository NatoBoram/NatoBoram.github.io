var perceptrons = new Array();
// var nn = new NeuralNetwork(100, 100, 100, "tanh");

/**
 * Creating a Neural Network with inputs, hidden neurons and outputs
 */
function newNetwork() {
	var inputs = 100;
	var n = 1 / 1000;
	perceptrons = new Array();
	for (var c = 0; c < inputs; c++) {
		perceptrons.push(new Perceptron(inputs, n));
	}
	saveNetwork();
	console.log("Created a new neural network.");
}

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
		loadTrainedNetwork();
	} else {
		perceptrons = JSON.parse(localStorage.getItem("network"));
		for (var c = 0; c < perceptrons.length; c++) {
			perceptrons[c] = Object.assign(new Perceptron, perceptrons[c]);
		}
		console.log("Loaded an existing neural network.");
	}
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
	console.log(neuronScores);

	// Select the max score
	var max = Number.NEGATIVE_INFINITY;
	for (var c = 0; c < 100; c++) {
		if (inputGrid[c] == 0) {
			max = Math.max(max, neuronScores[c]);
		}
	}
	console.log("Max : " + max);

	// Get an array containing only the maximum score
	var maxArray = new Array();
	for (var c = 0; c < neuronScores.length; c++) {
		if (neuronScores[c] == max && inputGrid[c] == 0) {
			maxArray.push(c);
		}
	}
	console.log(maxArray);

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
function skynetLearn(selection, inputGrid, desired) {
	perceptrons[selection].train(inputGrid, desired);
	saveNetwork();
}

// Import & Export

/**
 * Creates a .json file and downloads it.
 */
function exportJSON() {
	var json = perceptrons;

	var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
	var a = document.createElement('a');
	a.href = 'data:' + data;
	a.download = 'skynet.json';
	a.innerHTML = 'download JSON';

	var container = document.getElementById('useless');
	container.appendChild(a);
	a.click();

	a.remove();
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

/**
 * Called when the load event fires on the FileReader.
 * The target of the event is the FileReader object instance.
 * The result property of the FileReader contains the file contents.
 * @param {Event} event
 */
function fileRead(event) {
	perceptrons = JSON.parse(event.target.result);
	for (var c = 0; c < perceptrons.length; c++) {
		perceptrons[c] = Object.assign(new Perceptron, perceptrons[c]);
	}
}

// Place ships

// Place first ship randomly

// Get true vision

// feedfoward ( true vision )

// get min

// the rest


function loadTrainedNetwork() {
	perceptrons = JSON.parse(getBackup());
	for (var c = 0; c < perceptrons.length; c++) {
		perceptrons[c] = Object.assign(new Perceptron, perceptrons[c]);
	}
	console.log("Loaded a trained neural network.");
}