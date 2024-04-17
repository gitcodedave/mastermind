# 🧠 Mastermind 🧠

## *Prerequisite

You will need to have Node.js installed in order to run this application, here is a link to download if needed:

```bash
https://nodejs.org/en/download
```
## Installation
Fork and clone this repo onto your machine, then open up a terminal and cd to the mastermind directory you cloned. Run this command in the terminal to install dependencies:
```bash
npm install
```
## Start the game

You can now start the application by running this command in your terminal:

```bash
npm start
```
Now open up a web browser window and visit this url to start playing:
```bash
https://localhost:8080/
```
## Rules 
Time to test your critical thinking skills! You have to try and guess my secret number. 

1. The first time you load the game, it will default to the easiest difficulty which is 4 digits. You may use the selector to increase difficulty up to 6 if you are bold enough.
2. A random number will be selected each time you start a new game. It is your mission to try and guess the number using the numbered buttons on the screen.
3. Once your numbers are ready, click the green button to submit your guess.
4. The computer will let you know how many of your numbers are present in the secret number, and of those numbers which ones are also in the correct location.
5. Through the process of elimination you should hopefully be able to figure out the secret number, but you only get 10 tries!
6. The computer will keep track of your wins/losses, but you can always reset it.
7. GOOD LUCK!

## Design

### Overall Thoughts
This was a very fun project to work on! My primary goal for this application was to build something that was fully functional, easy to use, simple to understand, and would be scalable for adding more game features. I wanted to decouple the frontend from the backend as much as possible, so that the backend would be the source of truth for the game data and the frontend's main focus would simply be an interface. When I was doing research on how the game worked, I found that the most important aspect for enjoyability was to have instructions were very clear, and the interface was as convenient to use as possible. Because this was a backend focused challenge, I did not prioritize the styling of the frontend (I couldn't help myself with the 'dark mode' though) but I did end up spending quite a bit of time on small 'quality of life' improvements to the game. Something as simple as having the game trigger a new game automatically after the difficulty is switched made a big difference in the flow. 

### Library/Framework and Language
When first coming up with the architecture for the game I considered the option of using python/flask, which in retrospect could have made the logic a bit simpler to put program but I ended up deciding to build a node/react app. Aside from my familiarity with it, there were some performance gains to be had by going this route. In a flask/terminal or flask/html app, when something changes in the state of the app, it requires the entire terminal/html to be re-rendered in order to update it. With react, it would only reload the component that was affected, which optimizes its performance while still allowing for a more interactive interface. This tech stack allows for a more decoupled server/client application so that the backend can handle most of the heavy lifting, and the frontend can focus on interactivity.

### Routing
I used the express framework to organize the routes for all of the different apis that would be hit each time the client side needed data. It also allowed me to apply middleware to each route, and keep the APIs stateless/easy to debug. It allowed for better scalability, kept the code granular, and made it easier to add new features by simply building new routes or middleware. 

### Database
One of my first thoughts when imagining what the game would be like in action was that I wanted to be able to persist some form of state on the frontend, regardless of the app being restarted. I also wanted to ensure that the backend carried as much of the load as possible, so instead of using something like localStorage, I chose to use a sql database. I went with mysql instead of postgresql because it is simpler and faster to set up for the purposes I needed. The structure ended up like this:

gameSettings:
  id,
  secretNumber,
  difficulty,
  attemptNumber,
  gameStatus, 
  winScore,
  loseScore

The gameSettings table holds information that persists through an entire game so that it could be used to configure the game's status (such as difficulty).


  currentGame:
    attemptId,
    guess,
    correctLocation,
    correctNumber

The currentGame table stores historical information about the current round, and could be used to populate the prior guess attempts.

I considered adding a third table which was going to store user information (such as name, password, and high score) after authentication was added. In considering the scope and time constraints, that would be great as an extension in the future!

### Game Logic
Once the database, routes/apis, and server was set up, I began programming the logic for handling queries made by the client. The first middleware I built was the API for generating the random number. Luckily, it was fairly straightforward with just a bit of string manipulation to get it converted to plain integers. Then, the most important part of this game is the feedback you get after attempting a guess. I created an algorithm that could compare the secret random numbers to the numbers input by the client and provide clear feedback on how close their guess was. 

## Stretch Features
1. Testing - One of the most important aspects of designing this application was to be able to debug quickly. Fortunately, because the app wasn't too complex I was able to do most of the debugging and error handling within each module. I did create a couple of tests (tested the api for the random numbers with Jest). However, I would like to add much more unit testing so that as more features are added and things break, I am able to pinpoint errors.
2. User login - I would like to implement a user creation feature, with this feature a user could log in and be access their high score, possibly compare them to other user scores in the form of a leaderboard.
3. Multi Player - This was a very cool idea, assuming the players are on the same machine it would need to work as a turn-based versus game. In order to make it more interesting, it would be fun to add some weight to each guess, so that if a player's guess is more accurate they get a bigger bonus.
4. Timer - I actually began working on a timer, but ironically 'time' was against me... it turned out to be a bit complex than I was expecting given the side effects I needed it to have on the code. I decided not to leave it within the scope of the challenge, but now I'm curious on what would be the best approach.
5. Styling - I didn't put too much emphasis on the styling of the app (in fact no CSS was used, all of the styling was done inline), so it would be nice to come up with a nicer design and get things aligned more neatly.

# Thank you!
For taking the time to read this. I hope you enjoyed the game as much as I enjoyed building it!