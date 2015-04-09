/*global Game*/

var Invader = function (opts) {
    'use strict';
    this.group = opts.group;
    this.frame = 0;
    this.mx = 0;
};

Invader.prototype = {
    // CONSTANTS
    CHANCE_TO_FIRE: 4, // The random card between 0 (no chance) to 10 (always fire)
    SPEED_MULTI: 1, // Increase the speed every time an Invader dies

    //FUNCTIONS

    // Draw the Invader on the canvas
    draw: function (canvas) {
        'use strict';
        Game.Sprites.draw(canvas, this.name, this.x, this.y, this.frame);
    },
    die: function () {
        'use strict';
        // Increase the speed for each invader defeated
        this.group.speed += this.SPEED_MULTI;
        this.board.remove(this);

        // Add the Score
        // default 50 points per kill
        // 100 points divides by the amount of missles on the screen
        var score = 100 / this.board.missiles, // 100 points divides by the amount of missles on the screen
            tmpScore;
        switch (this.name) {
        case 'invader1': // The blue guys
            tmpScore = 50;
            break;
        case 'invader2':    // The pink guys
            tmpScore = 100;
            break;
        default:    // This should not happen but ahh well
            tmpScore = 25;
            break;
        }
        if (!isNaN(tmpScore)) {
            score += tmpScore;
        }
        if (isNaN(score)) {
            score = 0;
        }
        // Add the score
        Game.Score.Add(score);
    },

    // Move the invader in a typerwriter fashion
    step: function (dt) {
        'use strict';
        // Set the speed of the invaders every time one die
        // formula
        this.mx += dt * ((this.group.dx / 2) * (Game.Score.level / 2));
        this.y += this.group.dy;
        if (Math.abs(this.mx) > 10) { // Step the row

            // Only the Invaders at the outer edge can fire   
            if (this.y === this.group.max_y[this.x]) {
                this.fireSometimes();
            }

            this.x += this.mx;
            this.mx = 0;

            // Alternate the animations
            this.frame = (this.frame + 1) % 2;
            // Check to see if they have hit the site of the wall or not
            if (this.x > Game.width - Game.Sprites.map[this.name].width) {
                this.group.hit = -1;
            }
            if (this.x < 1) {
                this.group.hit = 1;
            }
            // Check to see if the invader has left the screen
            if (this.y > Game.height - (Game.Sprites.map.player.height * 2) - 15) {
                this.group.isGameOver = true;
            }
        }
        return true;
    },

    // Occasionaly an invader will fire
    fireSometimes: function () {
        'use strict';
        if (Math.random() * 100 < (Game.Score.level > 5 ? 2 + this.CHANCE_TO_FIRE : this.CHANCE_TO_FIRE)) {
            this.board.addSprite((this.name === 'invader2') ? 'missile2' : 'missile', this.x + this.width / 2 - Game.Sprites.map.missile2.width / 2,
                this.y + this.height, {
                    dy: 100, // Sasdet the direction
                    player: false // It is not a player missle
                });
        }
    }
};