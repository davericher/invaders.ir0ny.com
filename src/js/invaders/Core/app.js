/*global $, Game, Assets, Player, Invader, Missile, Worker,Score,setTimeout */

var App = function () {
    'use strict';
    // Place holder for current pressed keys
    this.keys = {};
    this.paused = false;
    this.border = 10;
};

//noinspection JSUnusedGlobalSymbols
App.prototype = {
    // CONSTANTS
    KeyBindings: {
        65: 'left',     // A
        68: 'right',    // D
        83: 'fire',     // S
        87: 'again',    // W
        88: 'newPlayer', // X
        80: 'pause' // P
    },
    GetBindingByValue: function (value) {
        'use strict';
        var prop;
        for (prop in this.KeyBindings) {
            if (this.KeyBindings.hasOwnProperty(prop)) {
                if (this.KeyBindings[prop] === value) {
                    return parseInt(prop, 0);
                }
            }
        }
    },
    // Functions
    // Initialize the game
    initialize: function (canvas_dom, sprite_data, callbacks) {
        'use strict';
        // Extrpolate Canavas elements, get context, set width and height
        this.canvas_elem = $(canvas_dom)[0];
        this.canvas = this.canvas_elem.getContext('2d');
        this.width = $(this.canvas_elem).attr('width');
        this.height = $(this.canvas_elem).attr('height');

        // Declare the globals
        this.Fps = this.FPS = 60;
        this.SECOND = 1000;

        // Set the callbacks
        this.callbacks = callbacks;

        // Load the score subsystem
        this.Score = new Score();
        this.Score.Initialize();

        // Load the sprites
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
        Game.board.step(Game.Fps / Game.SECOND);
        // Render the Canvas
        Game.board.render(Game.canvas);
        // Draw the game elements
        Game.World.draw();

        this.reloading -= 1;

        // Recursivley call this function every thrity seconds
        setTimeout(Game.Loop, Game.SECOND / Game.Fps);
    },
    // The Global UI elements
    // The bar at the bottom and the score basically
    World: {
        draw: function () {
            'use strict';
            // Draw the ground bar
            Game.canvas.beginPath();
            Game.canvas.rect(Game.border, Game.height - 15, Game.width - (Game.border * 2), Game.border);
            Game.canvas.fillStyle = 'black';
            Game.canvas.fill();
            Game.canvas.lineWidth = 2;
            Game.canvas.strokeStyle = 'gray';
            Game.canvas.stroke();
            Game.canvas.font = "bold 12px Roboto";
            Game.canvas.fillStyle = Game.Score.IsTop() ? '#00FF00' : '#FFFFFF';
            // Draw the Score
            Game.canvas.fillText(Game.Score.local.score, Game.border, 20);
            // Draw the Initials
            var initialsSize = Game.canvas.measureText(Game.Score.local.initials).width;
            Game.canvas.fillText(Game.Score.local.initials, Game.width - initialsSize - Game.border, Game.border * 2);
            // Draw the level
            initialsSize = Game.canvas.measureText(Game.Score.level).width;
            Game.canvas.fillText(Game.Score.level, Game.width - initialsSize - Game.border, Game.height - Game.border * 2);
            // Draw if paused
            if (Game.paused) {
                Game.canvas.fillText('Paused', Game.width - (Game.width - Game.border), Game.height - Game.border * 2);
            }
        }
    },
    Pause: function () {
        'use strict';
        if (!Game.paused) {
            Game.Fps = 0;
            Game.paused = true;
        } else {
            // Sanitize some key input to normalize some weird behaviours
            Game.keys.left = false;
            Game.keys.right = false;
            Game.keys.fire = false;
            Game.Fps = Game.FPS;
            Game.paused = false;
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