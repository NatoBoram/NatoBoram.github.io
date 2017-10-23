/**
 * Place les bateaux de façon aléatoire
 * @param {Number} size 
 * @param {Array} grid 
 */
function placerBateau(size, grid) {
	var
		pos1,
		pos2,
		bateauPlace,
		allOrientations,
		orientationsValides,
		orientationsRestantes,
		valide,
		orientationChoisie;
	do {
		
		// X and Y
		pos1 = Math.floor(Math.random() * 10);
		pos2 = Math.floor(Math.random() * 10);
		
		// Confirmation
		bateauPlace = false;

		// Orientations
		allOrientations = [0, 1, 2, 3];
		orientationsValides = [];
		orientationsRestantes = [];

		// Confirmation
		valide = true;

		if (verifierBateau(pos1, pos2, grid)) {
			
			//Vérifie si l'extrémité du bateau reste à l'intérieur de la grille et ajoute les orientations valides dans le Array
			if (verifierExtremiteBateau(pos1, pos2 + size)) {
				orientationsValides.push("0")
			}

			if (verifierExtremiteBateau(pos1 + size, pos2)) {
				orientationsValides.push("1")
			}

			if (verifierExtremiteBateau(pos1, pos2 - size)) {
				orientationsValides.push("2")
			}

			if (verifierExtremiteBateau(pos1 - size, pos2)) {
				orientationsValides.push("3")
			}
			// Vérifie si il existe encore des orientations valides
			if (orientationsValides.length > 0) {
				//Vérifie si il y a un bateau dans le chemin, ajoute les orientations dans le Array
				for (ctr = 0; ctr <= orientationsValides.length; ctr++) {
					//Regarde selon les orientations valides (clockwise de 0 à 3)
					if (orientationsValides[ctr] == 0) {
						for (ctr2 = 1; ctr2 <= size - 1 && valide; ctr2++) {
							if (verifierBateau(pos1, pos2 + ctr2, grid) == false) {
								valide = false
							}
						}
						if (valide) {
							orientationsRestantes.push(0);
						}
						else continue;

						valide = true;
					}

					if (orientationsValides[ctr] == 1) {
						for (ctr2 = 1; ctr2 <= size - 1 && valide; ctr2++) {
							if (verifierBateau(pos1 + ctr2, pos2, grid) == false) {
								valide = false
							}
						}
						if (valide) {
							orientationsRestantes.push(1);
						}
						else continue;

						valide = true;
					}

					if (orientationsValides[ctr] == 2) {
						for (ctr2 = 1; ctr2 <= size - 1 && valide; ctr2++) {
							if (verifierBateau(pos1, pos2 - ctr2, grid) == false) {
								valide = false
							}
						}
						if (valide) {
							orientationsRestantes.push(2);
						}
						else continue;

						valide = true;
					}

					if (orientationsValides[ctr] == 3) {
						for (ctr2 = 1; ctr2 <= size - 1 && valide; ctr2++) {
							if (verifierBateau(pos1 - ctr2, pos2, grid) == false) {
								valide = false
							}
						}
						if (valide) {
							orientationsRestantes.push(3);
						}
						else continue;
						valide = true;
					}
				}

				// Vérifie si il existe encore des orientations valides
				if (orientationsRestantes.length > 0) {
					//Choisit une orientation au hasard
					orientationChoisie = Math.floor(Math.random() * orientationsRestantes.length);
				}
				else continue;
				//Place le bateau selon l'orientation
				if (orientationsRestantes[orientationChoisie] == 0) {
					for (ctr = 0; ctr <= size - 1; ctr++) {
						placerBoutBateau(pos1, pos2 + ctr, grid);
					}
					bateauPlace = true;
				}

				if (orientationsRestantes[orientationChoisie] == 1) {
					for (ctr = 0; ctr <= size - 1; ctr++) {
						placerBoutBateau(pos1 + ctr, pos2, grid);
					}
					bateauPlace = true;
				}

				if (orientationsRestantes[orientationChoisie] == 2) {
					for (ctr = 0; ctr <= size - 1; ctr++) {
						placerBoutBateau(pos1, pos2 - ctr, grid);
					}
					bateauPlace = true;
				}

				if (orientationsRestantes[orientationChoisie] == 3) {
					for (ctr = 0; ctr <= size - 1; ctr++) {
						placerBoutBateau(pos1 - ctr, pos2, grid);
					}
					bateauPlace = true;
				}
			}
			else continue;
		}
		else continue;
	} while (bateauPlace == false)

	showGrids();
}

/**
 * Vérifie si un bateau se trouve à la position entrée
 * @param {Number} posX 
 * @param {Number} posY 
 * @param {Array} grid 
 */
function verifierBateau(posX, posY, grid) {
	if (grid[10 * posX + posY] == 0) {
		return true;
	}
	else return false;
}

/**
 * Vérifie si l'extrémité du bateau sort de la grille
 * @param {Number} posX 
 * @param {Number} posY 
 */
function verifierExtremiteBateau(posX, posY) {
	if (posX <= 9 && posX > 0 && posY <= 9 && posY > 0) {
		return true;
	}
	else return false;
}

/**
 * Place un bout du bateau
 * @param {Number} posX 
 * @param {Number} posY 
 * @param {Array} grid 
 */
function placerBoutBateau(posX, posY, grid) {
	grid[10 * posX + posY] = 2;
}

/**
 * Place tous les bateaux d'une grille
 * @param {Array} grid 
 */
function placerTousLesBateaux(grid) {
	placerBateau(5, grid);
	placerBateau(4, grid);
	placerBateau(3, grid);
	placerBateau(3, grid);
	placerBateau(2, grid);
}

function placerTousLesBateauxProf(grid) {
	placerBateau(4, grid);
	placerBateau(3, grid);
	placerBateau(3, grid);
	placerBateau(2, grid);
	placerBateau(2, grid);
	placerBateau(2, grid);
}

/**
 * Use its neural network to place all of its ships.
 * @param {Array} grid 
 */
function placeAllShips(grid) {
	placeShip(grid, 5);
	placeShip(grid, 4);
	placeShip(grid, 3);
	placeShip(grid, 3);
	placeShip(grid, 2);
}

/**
 * Use its neural network to place all of its ships. Use the teacher's ships.
 * @param {Array} grid 
 */
function placeAllShipsProf(grid) {
	placeShip(grid, 4);
	placeShip(grid, 3);
	placeShip(grid, 3);
	placeShip(grid, 2);
	placeShip(grid, 2);
	placeShip(grid, 2);
}
