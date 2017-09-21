// Daniel Shiffman
// The Nature of Code
// http://natureofcode.com

// Simple Perceptron Example
// See: http://en.wikipedia.org/wiki/Perceptron

// Perceptron Class

/**
 * Perceptron is created with n weights and learning constant
 * @param {Number} n 
 * @param {Number} c 
 * @return {Perceptron}
 */
function Perceptron(n, c) {

	// Array of weights for inputs
	this.weights = new Array(n);

	// Start with random weights
	for (var i = 0; i < this.weights.length; i++) {
		this.weights[i] = random(-1 / 100, 1 / 100);
	}

	// learning rate
	this.c = c;
}

/**
 * Function to train the Perceptron
 * Weights are adjusted based on "desired" answer
 * @param {Array} inputs
 * @param {Number} desired
 */
Perceptron.prototype.train = function (inputs, desired) {

	// Guess the result
	var guess = this.feedforward(inputs);

	// Compute the factor for changing the weight based on the error
	// Error = desired output - guessed output
	// Note this can only be 0, -2, or 2
	// Multiply by learning constant
	var error = desired - guess;

	// Adjust weights based on weightChange * input
	for (var i = 0; i < this.weights.length; i++) {
		this.weights[i] += this.c * error * inputs[i];
	}
}

/**
 * Guess 0 or 1 based on input values
 * @param {Array} inputs
 * @return {Number}
 */
Perceptron.prototype.feedforward = function (inputs) {

	// Sum all values
	var sum = 0;
	for (var i = 0; i < this.weights.length; i++) {
		sum += inputs[i] * this.weights[i];
	}

	// Result is between 0 and 1
	return this.activate(sum);
}

/**
 * @param {Number}
 * @return {Number}
 */
Perceptron.prototype.activate = function (sum) {
	return Math.tanh(sum);
}

/**
 * Return weights
 * @return {Number}
 */
Perceptron.prototype.getWeights = function () {
	return this.weights;
}

/**
 * @param {Number} c
 */
Perceptron.prototype.setLearningRate = function (c) {
	this.c = c;
}

/**
 * Returns a random number between min and max
 * @param {Number} min 
 * @param {Number} max 
 * @return {Number}
 */
function random(min, max) {
	return Math.random() * (max - min) + min
}
