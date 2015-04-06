/*global Game,Invaders*/
var Board = function Board() {
    'use strict';
    // Hold objects removed from screen
    this.removed_objs = [];

    //Amount of current projectiles
    this.missiles = 0;

    // Construct the level 
    this.loadBoard();
};

Board.prototype = {
    // there is no place like home
    board: this,
    // Level Map Data: Grid and rows are extensible
    // 0: No Invader
    // 1: White Invader
    // 2: Red Invader
    level: [
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0]
    ],
    add: function (obj) {
        'use strict';
        obj.board = this;
        this.objects.push(obj);
        return obj;
    },
    remove: function (obj) {
        'use strict';
        this.removed_objs.push(obj);
    },
    addSprite: function (name, x, y, opts) {
        'use strict';
        var sprite = this.add(new Game.Sprites.map[name].Type(opts));
        sprite.name = name;
        sprite.x = x;
        sprite.y = y;
        sprite.width = Game.Sprites.map[name].width;
        sprite.height = Game.Sprites.map[name].height;
        return sprite;
    },
    iterate: function (func) {
        'use strict';
        var i, len;
        for (i = 0, len = this.objects.length; i < len; i += 1) {
            func.call(this.objects[i]);
        }
    },
    detect: function (func) {
        'use strict';
        var i, len;
        for (i = 0, len = this.objects.length; i < len; i += 1) {
            if (func.call(this.objects[i])) {
                return this.objects[i];
            }
        }
        return false;
    },
    step: function (dt) {
        'use strict';
        var i,
            len,
            idx;

        this.removed_objs = [];
        this.iterate(function () {
            if (!this.step(dt)) {
                this.die();
            }
        });

        for (i = 0, len = this.removed_objs.length; i < len; i += 1) {
            idx = this.objects.indexOf(this.removed_objs[i]);
            if (idx !== -1) {
                this.objects.splice(idx, 1);
            }
        }
    },
    render: function (canvas) {
        'use strict';
        canvas.clearRect(0, 0, Game.width, Game.height);
        this.iterate(function () {
            // Do not draw the collection of invaders
            if (!(this instanceof Invaders)) {
                this.draw(canvas);
            }
        });
    },
    collision: function (object1, object2) {
        'use strict';
        return !((object1.y + object1.height - 1 < object2.y) || (object1.y > object2.y + object2.height - 1) ||
        (object1.x + object1.width - 1 < object2.x) || (object1.x > object2.x + object2.width - 1));
    },
    collide: function (obj) {
        'use strict';
        return this.detect(function () {
            if (obj !== this && !this.invulnrable) {
                if (obj instanceof Game.Types.Missile && this instanceof Game.Types.Invader && !obj.player) {
                    return false; // If a missle fired by an invader it can not kill an invader, no friendly fire!
                }
                return this.board.collision(obj, this) ? this : false;
            }
        });
    },
    loadBoard: function () {
        'use strict';
        var y,
            x,
            columns,
            rows,
            invaders,
            invader;

        this.objects = [];

        // Draw The player
        this.player = this.addSprite('player', // Sprite
            Game.width / 2, // X
            Game.height - Game.Sprites.map.player.height - 15); // Y Offset

        // Draw the Invaders
        this.Space = {
            BetweenInvaders: 15,
            BetweenTop: 12,
            BetweenRows: 12
        };

        invaders = this.add(new Invaders());
        // Load the level from the level object
        for (y = 0, rows = this.level.length; y < rows; y += 1) {
            for (x = 0, columns = this.level[y].length; x < columns; x += 1) {
                invader = Game.Sprites.map['invader' + this.level[y][x]];
                if (invader) {
                    this.addSprite('invader' + this.level[y][x], // Which Sprite
                        (invader.width + this.Space.BetweenInvaders) * x, // X
                        (invader.height * y) + (this.Space.BetweenRows * y), // Yw
                        {
                            group: invaders
                        }); // Options
                }
            }
        }
    }
};