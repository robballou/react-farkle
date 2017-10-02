# Notes

Various notes on developing this

## Todo

* Must score 500 initially... might be interesting to figure out a way to make "rules" for the game that are somewhat pluggable. This could be rule that basically states for turn 1, a player must get 500. The rule then will block a player from gaining any score until they meet all rules. "Farkling" could also be rule... Rules could also be "applicable" (e.g. initial turn only applies when the turn is 1, etc.)
* When you roll again with the initial turn message, you lose the 500 point message temporarily because "roll" does not check or run this rule...
* Getting 500 points doesn't remove the message
* Winning rule (10,000)
* Localize the numbers
* Select number of players screen at the beginning of the game

## State

Without Redux, tracking state can be handled via:

* Looking a parameters in the Game state and intuiting the game state. Eg. they have selected things, etc.
* Have specific state flags that mean certain actions are available.

--

Initial state/new turn state:

- Show roll button
- Show message for current player

During turn loop:

- Can select dice if they did not farkle
  - Selecting die updates the in-turn score.
  - Also need to validate that they *can* select the die. This probably
    only needs to happen on the "next" button press (so they have the
    opportunity of selecting multiple).
- Can keep rolling dice if there are unselected dice...

TODO toggling selected based on the die index won't work or needs to be updated
 in cases with subsequent rolls. E.g. use selects die index 0, then rolls
 remaining dice, we now have a new die index 0.

Potential state changes:

- initial/new turn (show roll button, show player message)
- roll (show the dice, show the select die message)
- select die (update the selected die, show the "roll" and "next" button)
- next (update score, update current player, fire new turn)
