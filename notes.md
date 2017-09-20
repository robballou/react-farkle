# Notes

Various notes on developing this

## Todo

* Roll again if they use up all the dice...
* Must score 500 initially... might be interesting to figure out a way to make "rules" for the game that are somewhat pluggable. This could be rule that basically states for turn 1, a player must get 500. The rule then will block a player from gaining any score until they meet all rules. "Farkling" could also be rule... Rules could also be "applicable" (e.g. initial turn only applies when the turn is 1, etc.)
* Select number of players screen at the beginning of the game

## State

Without Redux, tracking state can be handled via:

* Looking a parameters in the Game state and intuiting the game state. Eg. they have selected things, etc.
* Have specific state flags that mean certain actions are available.