/* Random Agent
 * This region contains all functions to make a random agent play
 */

/**
 * Plays randomly
 * @param {Array} grid 
 * @return {Number}
 */
function randomAgent(visionGrid) {

	// Select all valid slots
	var validSlots = new Array();
	for (var x = 0; x < 10; x++) {
		for (var y = 0; y < 10; y++) {
			if (visionGrid[10 * x + y] == 0) {
				validSlots.push(10 * x + y);
			}
		}
	}

	// Select random slot
	var randomSlot = validSlots[Math.floor(validSlots.length * Math.random())];
	return randomSlot;
}