// Global variables
let boyScore = 0;
let bugScore = 0;
const boyCount = document.querySelector('.boy-counter');
const bugCount = document.querySelector('.bug-counter');
const bugs = document.querySelector('.bug-sprite-counter');
const goldenBoy = document.querySelector('.boy-sprite-counter');
const modal = document.querySelector('.win-modal');
modal.innerHTML = '<button class="modal-close">play again</button>';
const message = document.createElement('h3');
modal.appendChild(message);
const modalClose = document.querySelector('.modal-close');

// Initialize Enemy Class with basic settings
var Enemy = function(y, speed) {

    // Set initial location and speed
    this.x = -100;
    this.y = y;
    this.speed = speed;
    // Load image for enemy instance
    this.sprite = 'images/enemy-bug.png';
    // Set entity height and width for collision detection
    this.height = 30;
    this.width = 70;

};

// Updates to enemy class while game is running
Enemy.prototype.update = function(dt) {

    const canvas = document.querySelector('canvas');

    // Update location
    this.x += 100*this.speed*dt;

    // When bugs score, all of their instances glow red for 500ms
    this.hitsBoy = function () {
        for(enemy of allEnemies) {
            enemy.sprite = 'images/enemy-bug-hit.png';
        }
        setTimeout(function() {
            for(enemy of allEnemies) {
            enemy.sprite = 'images/enemy-bug.png';
            }
        }, 500);
    }

    // Reset enemy instance's location and speed
    this.resetEnemy = function () {
        this.x = -100;
        this.y = Math.floor(Math.random()*3+1)*70;
        this.speed = Math.floor(Math.random()*5+2);
    }

    // When instance disappears from screen to the right --> resetEnemy()
    if(this.x > canvas.width) {
        this.resetEnemy();
    }

    // Stop enemy instance and move it offscreen
    this.stopEnemy = function () {
        this.speed = 0;
        this.x = -100;
    }

    // Handle collisions between all enemy instances and player; Collisions between enemys are ignored
    for(let n = 0; n < allEnemies.length; n++) {
        if (allEnemies[n].x < player.x + player.width  && allEnemies[n].x + allEnemies[n].width  > player.x &&
        allEnemies[n].y < player.y + player.height && allEnemies[n].y + allEnemies[n].height > player.y) {
            scoreCounter('bug');
            allEnemies[n].hitsBoy();
            player.resetLocation();
        }
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Initialize Player Class with basic settings
var Player = function() {
    // Set initial location
    this.x = 200;
    this.y = 400;

    // Set vertical start position which will be updated with every vertical movement of player to detect success
    this.yPosition = 6;

    // Set entity height and width for collision detection
    this.height = 30;
    this.width = 30;

    this.sprite = 'images/char-boy.png';
}


// Updates to player class while game is running
Player.prototype.update = function(dt) {
    // Reset player instance's location
    this.resetLocation = function () {
        this.x = 200;
        this.y = 400;
        this.yPosition = 6;
    };

    // Player glows golden for 500ms when successfully crosses the screen vertically
    this.crossedSuccess = function () {
        player.sprite = 'images/char-boy-wins.png';
        scoreCounter('boy');
        setTimeout(function() {
            player.resetLocation();
            player.sprite = 'images/char-boy.png';
        }, 500);
    }
};

// Configure input handler for player
Player.prototype.handleInput = function(key) {
    const canvas = document.querySelector('canvas');

        // Translation of keyboard events into spacial change of players position on canvas
        if(key === 'left') {
            if(this.x >= 0) {
                this.x -= canvas.width / 5;
            }
        } else if (key === 'right') {
            if(this.x < 400) {
                this.x += canvas.width / 5;
            }
        }
        else if (key === 'up') {
            if(this.y >= 0) {
                this.y -= canvas.width / 6;
                this.yPosition--;
                if(this.yPosition < 2)
                {
                    player.crossedSuccess();
                }
            }
        } else if (key === 'down') {
            if(this.y < 400) {
                this.y += canvas.width / 6;
                this.yPosition++;
            }
        }
    }

// Render player instance on canvas
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Creating a new Player object
var player = new Player();

// Creating several new Enemies objects
var enemy1 = new Enemy(140, 1);
var enemy2 = new Enemy(210, 3);
var enemy3 = new Enemy(70, 2);
var enemy4 = new Enemy(140, 5);

// Place all enemy objects in an array called allEnemies
var allEnemies = [enemy1, enemy2, enemy3, enemy4];

// Listen for key presses and send the keys to Player.handleInput() method
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Add functionality for score panel
function scoreCounter(team) {

    // Game runs as long as both sides haven't scored 5 yet
    if(boyScore <= 5 && bugScore <= 5) {
        // If either side scores increase team score and add a symbol to the visual counter
        if(team === 'bug')
        {
            bugScore++;
            bugCount.textContent = bugScore;
            const newBug = document.createElement('span');
            newBug.innerHTML = '<img src="images/enemy-bug.png">';
            bugs.appendChild(newBug);
        } else if (team === 'boy') {
            boyScore++;
            boyCount.textContent = boyScore;
            const newBoy = document.createElement('span');
            newBoy.innerHTML = '<img src="images/char-boy-wins.png">';
            goldenBoy.appendChild(newBoy);
        }
    }
    // As soon as one team reaches a score of 5
    if (boyScore === 5 || bugScore === 5) {
        // Stop enemy movement
        for(enemy of allEnemies) {
            enemy.stopEnemy();
        }
        // Open modal and display winner message
        if (boyScore > bugScore) {
            modal.classList.add('open');
            message.textContent = 'Boy wins';
        } else {
            modal.classList.add('open');
            message.textContent = 'Bugs win';
        }
    }
}

// Event handler for closing modal and restarting the game
modalClose.addEventListener('click', function () {
    // Close modal
    modal.classList.remove('open');
    // Reset counters and empty score panel
    boyScore = 0;
    boyCount.textContent = boyScore;
    goldenBoy.innerHTML = '';
    bugScore = 0;
    bugCount.textContent = bugScore;
    bugs.innerHTML = '';
    // Reset enemy instances position and speed for another new game
    setTimeout(function() {
        for(enemy of allEnemies) {
        enemy.resetEnemy();
        }
    }, 500);
});