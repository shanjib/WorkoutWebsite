# Initial Description of Behaviors

## home screen:
* today’s date
* create new workout button
* list previous 12 workouts + dates
* see exercises button

creating a new workout:
* hit the new workout button
* show the last workout of the PPL schedule
    * if it’s pull day, list weights of last pull day
    * if no day exists, show the exercises with 0 weight
    * showing means a list of the exercises and their previous weight
    * show plus/minus buttons to adjust weight of any exercise
    * have a date edit screen
    * have a confirm/cancel button at the bottom
        * confirm will create the new workout with the adjusted weights
        * cancel will go back to home screen
* if confirm, go to workout screen

workout screen:
* save button at bottom that will save the complete workout and any changes
* for each exercise show a card displaying
    * exercise name
    * weight
    * breakdown of weight if applicable
    * subcards for each set, and buttons for each rep
        * subcard should have a complete set button that is more prominent
    * edit button to change weight

see exercises screen:
* new exercise button
* table of existing exercises
    * name
    * type
    * increment weight
    * sets
    * reps
    * edit button

new/edit exercise
* fill out exercise information
* save button that will save and go to exercises screen



## Work to be Done
* refactor exercise new/edit
  * follow workout pattern
  * edit component has a prop that takes in the edit details
  * edit component emits the updated edit details
  * the parent new/edit pages consume the emit and make the appropriate calls
* WorkoutPage
  * make each exercise card a component?
  * have collapsable exercise cards
  * auto-collapse card when all sets are complete
  * add a notes section
  * determine best saving strategy
    * auto save on each set? with a disappearing banner to confirm?
  * during edit and creation, add or remove an exercise
  * add a new workout type that can designate 
* figure out if there's a way to avoid constant refreshes