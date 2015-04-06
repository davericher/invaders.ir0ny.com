/*global Game*/

/**
 * Player Sprite Information
 */
var Player = function Player() {
    'use strict';
    this.reloading = 0;
};

Player.prototype = {
    // CONSTANTS
    SPEED: 100,
    FIRE_SPEED: 7,
    SHOTS_ALLOWED: 6,

    // FUNCTIONS

    // Draw the player ship to the screen
    draw: function (canvas) {
        'use strict';
        Game.Sprites.draw(canvas, 'player', this.x, this.y);
    },

    // Kill the Player
    die: function () {
        'use strict';
        Game.callbacks.die();
    },
    step: function (distance) {
        'use strict';
        if (Game.keys.left) {
            this.x -= this.SPEED * distance;
        }
        if (Game.keys.right) {
            this.x += this.SPEED * distance;
        }

        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > Game.width - this.width) {
            this.x = Game.width - this.width;
        }

        this.reloading -= 1;

        if (Game.keys.fire && this.reloading <= 0 && this.board.missiles < this.SHOTS_ALLOWED) {
            this.board.addSprite('missile',
                this.x + this.width / 2 - Game.Sprites.map.missile.width / 2,
                this.y - this.height, {
                    dy: -this.SPEED, // Set the direction and speed
                    player: true // This is a player missle
                });

            // Increment the total amountof missles on the screen 
            this.board.missiles += 1;

            // Set the time out until the next shot can be fired
            this.reloading = this.FIRE_SPEED;
        }
        return true;
    }
};