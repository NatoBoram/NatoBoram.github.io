# Checkers
My personnal attempt at training a neural network for the game of Checkers.

## Game
Board size : 8 * 8

This board size was chosen because it requires way less memory and resources to compute.

Here are the rules.

* Men can only move foward
* Kings can't fly
* Capture isn't mandatory

## Network
Each square represents a separate neural network that gets activated when a stone lands on it, for a total of 32 neural networks.
* Input Layer : 32
* Output Layer : 4

The output layer is described as following : `Backwards Left`, `Left`, `Right`, `Backwards Right`.

The state of the game and its selected move is saved before each moves in an array. At the end of the game, the neural network will be trained once.

To train, the agent will be trained with every states of the game and the desired output of 1 or 0 and a learning step of `1/x`, with `x` being the number of moves before the end of the game. As such, beginning moves will receive less rewards than the finishing move. This will allow the network to learn every steps towards victory.