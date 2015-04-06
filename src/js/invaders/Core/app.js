/*global $, Game, Assets, Player, Invader, Missile, Worker,Score,setTimeout */

var App = function () {
    'use strict';
    // Place holder for current pressed keys
    this.keys = {};
};

//noinspection JSUnusedGlobalSymbols
App.prototype = {
    // CONSTANTS
    KeyBindings: {
        65: 'left', // A
        68: 'right', // D
        83: 'fire', // S
        87: 'again', // W
        88: 'newPlayer' // X
    },
    // Functions

    // Initialize the game
    initialize: function (canvas_dom, sprite_data, callbacks) {
        'use strict';
        this.game = this;
        // Extrpolate Canavas elements, get context, set width and height
        this.canvas_elem = $(canvas_dom)[0];
        this.canvas = this.canvas_elem.getContext('2d');
        this.width = $(this.canvas_elem).attr('width');
        this.height = $(this.canvas_elem).attr('height');

        this.FPS = 60;
        this.SECOND = 1000;
        this.callbacks = callbacks;

        this.Score = new Score();
        this.Score.initialize();

        this.Sprites = new Assets();

        this.Sprites.load(sprite_data, this.callbacks.start);

    },
    LoadBoard: function (board) {
        'use strict';
        this.board = board;
    },
    Loop: function () {
        'use strict';
        // Set the stepping, which will act like our fps limiter
        Game.board.step(Game.FPS / Game.SECOND);
        // Render the Canvas
        Game.board.render(Game.canvas);
        // Draw the game elements
        Game.World.draw();
        // Recursivley call this function every thrity seconds
        setTimeout(Game.Loop, 30);
    },
    // The Global UI elements
    World: {
        draw: function () {
            'use strict';
            // Draw the ground bar
            Game.canvas.beginPath();
            Game.canvas.rect(5, Game.height - 12, Game.width - 10, 8);
            Game.canvas.fillStyle = 'black';
            Game.canvas.fill();
            Game.canvas.lineWidth = 2;
            Game.canvas.strokeStyle = 'gray';
            Game.canvas.stroke();
            // Draw the score and initials
            Game.Score.draw();
        }
    },
    Types: {
        Missile: Missile,
        Player: Player,
        Invader: Invader
    }
};

// Return a new Instance of the Space Invaders Game
App.New = function () {
    'use strict';
    return new App();
};