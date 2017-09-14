# Notes

Various notes on developing this

## Todo

* Farkled player roll should not be selectable
* Must score 500 initially
* Scoring should be roll-specific or account for rolls. E.g., score a 5 on first roll then three 5's on second roll would be 550, not 1000.

## State

Without Redux, tracking state can be handled via:

* Looking a parameters in the Game state and intuiting the game state. Eg. they have selected things, etc.
* Have specific state flags that mean certain actions are available.
