/* Variables
 * This region contains everything needed to simplify the coding experience.
 */

var timeToDuel = false;

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
			td.style.backgroundColor = "mintcream";
			break;
		case 0:
			td.style.backgroundColor = "lightblue";
			break;
		case 1:
			td.style.backgroundColor = "orangered";
			break;
		case 2:
			td.style.backgroundColor = "gray";
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
			if (playerWantsTrueSight()) {
				colorCell(td, agentGrid, position);
			} else {
				colorCell(td, getVision(agentGrid), position);
			}

			var td = document.getElementById("playerTable").getElementsByTagName("td")[position];
			colorCell(td, playerGrid, position)
		}
	}
}
/**
 * Change only one cell of the grids for better performances
 * @param {Number} position 
 */
function showChange(position) {
	var td = document.getElementById("agentTable").getElementsByTagName("td")[position];
	if (playerWantsTrueSight()) {
		colorCell(td, agentGrid, position);
	} else {
		colorCell(td, getVision(agentGrid), position);
	}
	var td = document.getElementById("playerTable").getElementsByTagName("td")[position];
	colorCell(td, playerGrid, position);
}

/**
 * Create a new game
 */
function newGame() {

	// Clean up
	agentGrid = emptyGrid();
	playerGrid = emptyGrid();

	// Place boats
	switch (getBoatSelection()) {
		case "classic":
			// console.log("Creating a new classic game!");

			// Random
			//placerTousLesBateaux(playerGrid);
			//placerTousLesBateaux(agentGrid);

			// Smart
			placeAllShips(playerGrid)
			placeAllShips(agentGrid)
			break;
		case "prof":
			// console.log("Creating a new prof game!");

			// Random
			//placerTousLesBateauxProf(playerGrid);
			//placerTousLesBateauxProf(agentGrid);

			// Smart
			placeAllShipsProf(playerGrid)
			placeAllShipsProf(agentGrid)
			break;
		default:
			alert("Can't create a new game!");
			break;
	}

	// Visible
	//console.clear();
	document.getElementById("alert-container").innerHTML = "";
	showGrids();
}

/** Créer le onClick */
async function playerClick() {
	if (!timeToDuel) {

		// Check if player's selection is valid
		if (((this.style.backgroundColor == "lightblue") || (this.style.backgroundColor == "gray")) && !isGameOver()) {

			// Where is the click?
			this.innerHTML = "playerClick";

			// Find playerClick
			var agentTable = document.getElementById("agentTable").getElementsByTagName("td");
			for (var x = 0; x < 10; x++) {
				for (var y = 0; y < 10; y++) {
					if (agentTable[10 * x + y].innerHTML == "playerClick") {

						// Remove dummy text
						agentTable[10 * x + y].innerHTML = null;

						// Apply to agentGrid
						if (agentGrid[10 * x + y] == 0) {
							agentGrid[10 * x + y] = -1;
							learn(10 * x + y, getVision(agentGrid), 0);
						} else if (agentGrid[10 * x + y] == 2) {
							agentGrid[10 * x + y] = 1;
							learn(10 * x + y, getVision(agentGrid), 1);
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
				cpu(playerGrid, "Yamato");
				//cpu(playerGrid, "Random");
			}

			// Call Game Over!
			if (isGameOver()) {
				console.log("Game over!");
				await sleep(1);

				// Alert Game Over
				if (getWinner() == "Player") {
					var element = document.createElement("div");
					element.className = "alert alert-success alert-dismissable";
					element.innerHTML = '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Victory!';
					document.getElementById("alert-container").appendChild(element);
				} else if (getWinner() == "Agent") {
					var element = document.createElement("div");
					element.className = "alert alert-danger alert-dismissable";
					element.innerHTML = '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Defeat!';
					document.getElementById("alert-container").appendChild(element);
				}
			}

		} else if (isGameOver()) {
			newGame();
		} else {
			console.log(this.style.backgroundColor);
		}
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
		case "Yamato":

			// Yamato
			var selection = skynetSelect(vision);
			//var selection = nnSelect(vision);

			var result = agentApply(grid, selection);
			learn(selection, vision, result);

			// Show it on the grid
			showChange(selection);
			break;
		case "Random":

			// Random
			var selection = randomAgent(vision);
			var result = agentApply(grid, selection);
			learn(selection, vision, result);

			// Show it on the grid
			showChange(selection);
			break;
		default:
			alert("I was asked to play the CPU's turn but I don't know which one!");
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
		case 2:
			grid[position] = 1;
			return 1;
		default:
			// In case of illegal move
			return 0;
	}
}

/**
 * Vérifie si partie est terminée
 */
var fastSave = 0;
function isGameOver() {
	if (getWinner() != "None") {
		learnFromDefeat(playerGrid);
		learnFromDefeat(agentGrid);
		if (fast) {
			if (fastSave++ == 1000) {
				saveNetwork();
				fastSave = 0;
			}
		} else {
			saveNetwork();
		}
		return true;
	} else {
		return false;
	}
}

function getWinner() {

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

	// Who's dead?
	if (!playerIsDead && agentIsDead) {
		return "Player";
	} else if (!agentIsDead && playerIsDead) {
		return "Agent";
	}

	return "None";
}

/* Script
 * This region contains the initial script that starts the game
 */

// Game board
var agentGrid = emptyGrid();
var playerGrid = emptyGrid();

window.onload = function () {

	// Add OnClick everywhere!
	for (var x = 0; x < document.getElementById("agentTable").getElementsByTagName("td").length; x++) {
		document.getElementById("agentTable").getElementsByTagName("td")[x].onclick = playerClick;
	}

	// Load the neural network
	loadNetwork();
	//loadNN();
	//newNetwork(); // Start with a new network!

	newGame();
}

/* Buttons
 * This region contains buttons.
 */

var fast = false;
function trainFast() {
	fast = document.getElementById("TrainFast").checked;
}

/**
 * Machine Learning
 */
async function beginTraining() {

	// Display
	document.getElementById("btnTrain").style.display = "none";
	document.getElementById("btnStop").style.display = "block";
	timeToDuel = true;

	while (timeToDuel) {
		newGame();
		while (!isGameOver()) {

			// CPU 1
			if (!isGameOver()) {
				cpu(agentGrid, "Yamato");
				if (!fast) { await sleep(1); }
			}

			// CPU 2
			if (!isGameOver()) {
				cpu(playerGrid, "Yamato");
				if (!fast) { await sleep(1); }
			}
		}

		// Small pause between games
		await sleep(1);
	}
}

/**
 * Stops Yamato's training.
 */
function stopTraining() {
	document.getElementById("btnTrain").style.display = "block";
	document.getElementById("btnStop").style.display = "none";
	timeToDuel = false;
}

/**
 * Sleep for ms milliseconds.
 * @param {Number} ms 
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get the selected list of boats.
 * Returns "classic" or "prof".
 * @return {String}
 */
function getBoatSelection() {
	var b = document.getElementById("ships").value;
	return b;
}

/**
 * Get the desired value of the whole grid.
 * @param {Array} grid 
 * @return {Array}
 */
function getTrueVision(grid) {
	var trueVision = new Array();
	for (x in grid) {
		switch (grid[x]) {
			case 1, 2:
				trueVision.push(1);
				break;
			default:
				trueVision.push(0);
				break;
		}
	}
	return trueVision;
}

/**
 * Get whether the player wanted True Sight or not.
 * @return {Boolean}
 */
function playerWantsTrueSight() {
	return document.getElementById("PlayerTrueSight").checked;
}