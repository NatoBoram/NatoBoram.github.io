/* Variables
 * This region contains everything needed to simplify the coding experience.
 */

/** Empty grid, very useful later on */
function emptyGrid() {
	var emptyGrid = new Array();
	for (var x = 0; x < 10; x++) {
		for (var y = 0; y < 10; y++) {
			emptyGrid.push(0);
		}
	}
	return emptyGrid;
}

/* Game Board
 * This region contains all functions that runs the game
 */

/** Hide the enemy team's ships.
 * @param {Array} grid
 * @return {Array}
 * -1 : Miss.
 *  0 : Nothing.
 *  1 : Hit.
 *  2 : Untouched ship, will become 0.
 */
function getVision(grid) {
	var visionGrid = emptyGrid();
	for (var x = 0; x < 10; x++) {
		for (var y = 0; y < 10; y++) {
			if (grid[10 * x + y] == 2) {
				visionGrid[10 * x + y] = 0;
			} else {
				visionGrid[10 * x + y] = grid[10 * x + y];
			}
		}
	}
	return visionGrid;
}

/**
 * Add some color to a cell
 * @param {} td
 * @param {Array} grid
 * @param {number} position
*/
function colorCell(td, grid, position) {
	switch (grid[position]) {
		case -1:
			td.style.backgroundColor = "MintCream";
			break;
		case 0:
			td.style.backgroundColor = "LightBlue";
			break;
		case 1:
			td.style.backgroundColor = "OrangeRed";
			break;
		case 2:
			td.style.backgroundColor = "Gray";
			break;
	}
}

/**
 * Actualiser la grille
 */
function showGrids() {
	for (var x = 0; x < 10; x++) {
		for (var y = 0; y < 10; y++) {
			var position = 10 * x + y;
			var td = document.getElementById("agentTable").getElementsByTagName("td")[position];
			colorCell(td, getVision(agentGrid), position)

			var td = document.getElementById("playerTable").getElementsByTagName("td")[position];
			colorCell(td, playerGrid, position)
		}
	}
}

function showChange(position) {
	var td = document.getElementById("agentTable").getElementsByTagName("td")[position];
	colorCell(td, getVision(agentGrid), position)

	var td = document.getElementById("playerTable").getElementsByTagName("td")[position];
	colorCell(td, playerGrid, position)
}

/**
 * Create a new game
 */
function newGame() {
	console.log("Creating a new game!");
	agentGrid = emptyGrid();
	playerGrid = emptyGrid();
	placerTousLesBateaux(playerGrid);
	placerTousLesBateaux(agentGrid);
	//placerTousLesBateauxProf(playerGrid);
	//placerTousLesBateauxProf(agentGrid);
	showGrids();
}

/** Créer le onClick */
async function playerClick() {

	// Check if player's selection is valid
	if (this.style.backgroundColor == "lightblue" && isGameOver() == false) {

		// Where is the click?
		this.innerHTML = "playerClick";

		// Find playerClick
		var agentTable = document.getElementById("agentTable").getElementsByTagName("td");
		for (var x = 0; x < 10; x++) {
			for (var y = 0; y < 10; y++) {
				if (agentTable[10 * x + y].innerHTML == "playerClick") {

					// Remove dummy text
					agentTable[10 * x + y].innerHTML = "";

					// Apply to agentGrid
					if (agentGrid[10 * x + y] == 0) {
						agentGrid[10 * x + y] = -1;
						skynetLearn(10 * x + y, getVision(agentGrid), 0);
					} else if (agentGrid[10 * x + y] == 2) {
						agentGrid[10 * x + y] = 1;
						skynetLearn(10 * x + y, getVision(agentGrid), 1);
					} else {
						console.log("Player has made an illegal move."); // Unreachable code
					}
				}
			}
		}

		// Show what the player just did
		showGrids();

		// If GameOver, the agent can't play
		if (isGameOver() == false) {
			cpu(playerGrid, "Skynet");
			//cpu(playerGrid, "Random");
		}

		// Call Game Over!
		if (isGameOver()) {
			console.log("Game over!");
			await sleep(1);
			alert("Game over!");
		}

	} else if (isGameOver()) {
		newGame();

	} else {
		console.log(this.style.backgroundColor);
		alert("Please select a valid target.");
	}
}

/**
 * Manages the turn of the CPU
 * @param {Array} grid 
 * @param {String} cpuType
 */
function cpu(grid, cpuType) {
	var vision = getVision(grid);

	switch (cpuType) {

		case "Skynet":

			// Skynet
			var selection = skynetSelect(vision)

			// Illegal move?
			if (vision[selection] == 0) {
				var result = agentApply(grid, selection);
				skynetLearn(selection, vision, result);
			} else {
				skynetLearn(selection, vision, 0);
				console.log("Illegal move.");
				// cpu(grid, cpuType);
			}

			// Show it on the grid
			showChange(selection);
			break;

		case "Random":

			// Random
			var selection = randomAgent(vision);
			var result = agentApply(grid, selection);
			skynetLearn(selection, vision, result);

			// Show it on the grid
			showChange(selection);
			break;
	}
}

/**
 * Plays the selected move for an agent.
 * @param {Array} grid 
 * @param {Number} position 
 */
function agentApply(grid, position) {
	switch (grid[position]) {
		case 0:
			grid[position] = -1;
			return 0;
			break;
		case 2:
			grid[position] = 1;
			return 1;
			break;
	}

	// In case of illegal move
	return 0;
}

/**
 * Est-ce que la partie est terminée?
 * @return {boolean}
*/
function isGameOver() {

	// Theory : Everyone is dead
	var playerIsDead = true;
	var agentIsDead = true;

	// Is the theory true?
	for (var x = 0; x < 10; x++) {
		for (var y = 0; y < 10; y++) {

			// Disprove Player's death
			if (playerGrid[10 * x + y] == 2) {
				playerIsDead = false;
			}

			// Disprove Agent's death
			if (agentGrid[10 * x + y] == 2) {
				agentIsDead = false;
			}
		}
	}

	// Is one of them dead? If not, return false.
	return (playerIsDead || agentIsDead);
}

/* Script
 * This region contains the initial script that starts the game
 */

// Game board
var agentGrid = emptyGrid();
var playerGrid = emptyGrid();

window.onload = function () {
	showGrids();

	// Add OnClick everywhere!
	for (var x = 0; x < document.getElementById("agentTable").getElementsByTagName("td").length; x++) {
		document.getElementById("agentTable").getElementsByTagName("td")[x].onclick = playerClick;
	}

	// Load the neural network
	loadNetwork();
	//newNetwork(); // Start with a new network!
}

/* Buttons
 * This region contains buttons.
 */

/**
 * Machine Learning
 */
async function AIvsRandom() {
	while (true) {
		newGame();
		while (!isGameOver()) {

			// Skynet
			if (!isGameOver()) {
				cpu(agentGrid, "Skynet");
			}

			// Random
			if (!isGameOver()) {
				cpu(playerGrid, "Random");
			}

			// So I can actually see what's happening!
			await sleep(1);
		}
		await sleep(100);
	}
}

async function AIvsAI() {
	while (true) {
		newGame();
		while (!isGameOver()) {

			// Skynet
			if (!isGameOver()) {
				cpu(agentGrid, "Skynet");
			}

			// Random
			if (!isGameOver()) {
				cpu(playerGrid, "Skynet");
			}

			// So I can actually see what's happening!
			await sleep(1);
		}
		await sleep(100);
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}