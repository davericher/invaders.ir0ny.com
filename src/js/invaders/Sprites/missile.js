/*global Game*/
var Missile = function Missile(opts) {
    'use strict';
    this.dy = opts.dy;
    this.player = opts.player;
    this.frame = 0;
};

Missile.prototype = {
    draw: function (canvas) {
        'use strict';
        Game.Sprites.draw(canvas, this.name, this.x, this.y, this.frame);
    },
    step: function (dt) {
        'use strict';
        this.y += this.dy * dt;
        // Change the frame
        this.frame = this.frame < Game.Sprites.map.missile.frames ? this.frame + 1 : 0;

        var invader = this.board.collide(this);
        if (invader) {
            invader.die();
            return false;
        }
        return (!(this.y < 0 || this.y > Game.height));
    },
    die: function () {
        'use strict';
        if (this.player) {
            this.board.missiles -= 1;
        }
        if (this.board.missiles < 0) {
            this.board.missiles = 0;
        }
        this.board.remove(this);
    }
};