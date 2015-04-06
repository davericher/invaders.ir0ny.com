/*globals Game, Board, Invader */

/** A group of Invaders **/

var Invaders = function Invaders() {
    'use strict';
    this.invulnrable = true;
    this.dx = 10;
    this.dy = 0;
    this.hit = 1;
    this.lastHit = 0;
    this.speed = 10;
    this.isGameOver = false;
};

Invaders.prototype = {
    die: function () {
        'use strict';
        // Get a 1000 points of completeing the match
        Game.Score.Add(1000);
        // Trigger the win state
        Game.callbacks.win();
    },
    step: function () {
        'use strict';

        // Check to see if they are about to step off the screen
        if (this.isGameOver) {
            // If so, kill them
            Game.callbacks.die();
        }

        // Move the invaders away in a typerwriter fashion
        // checking to see if they hit any bounds
        if (this.hit && this.hit !== this.lastHit) {
            this.lastHit = this.hit;
            this.dy = this.speed;
        } else {
            this.dy = 0;
        }
        this.dx = this.speed * this.hit;

        var max = {},
            count = 0;

        this.board.iterate(function () {
            if (this instanceof Invader) {
                if (!max[this.x] || this.y > max[this.x]) {
                    max[this.x] = this.y;
                }
                count += 1;
            }
        });

        // No invaders left, Que win
        if (count === 0) {
            this.die();
        }

        // Record the current outer invader 
        this.max_y = max;
        return true;
    }
};