/*global Game*/
var Missile = function Missile(opts) {
    'use strict';
    this.dy = opts.dy;
    this.player = opts.player;
};

Missile.prototype = {
    draw: function (canvas) {
        'use strict';
        Game.Sprites.draw(canvas, 'missile', this.x, this.y);
    },
    step: function (dt) {
        'use strict';
        this.y += this.dy * dt;

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