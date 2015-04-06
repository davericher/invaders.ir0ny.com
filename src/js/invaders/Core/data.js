/*global $, Game, Board, Screen, InvadersFromSpace,Invader,Player,Missile */

/**
 * ALl The stuff needed to initialize the game object,
 * Including level data.
 * Sprite data.
 * Gate states
 * and Finally a Jquery ready object that initializes the Game static object
 */

var Data = {
    States: {
        splash: function () {
            'use strict';
            var screen = new Screen("Invaders From Space",
                function () {
                    Game.LoadBoard(new Board());
                });
            Game.LoadBoard(screen);
            // start
            Game.Loop();
        },
        gameOver: function () {
            'use strict';
            var screen = new Screen("Game Over",
                function () {
                    Game.Score.ClearScore(); // Reset the Score
                    Game.LoadBoard(new Board());
                });
            Game.LoadBoard(screen);
        },
        winner: function () {
            'use strict';
            var screen = new Screen("You have saved the Universe",
                function () {
                    Game.Score.SaveScore(); // Save the score
                    Game.LoadBoard(new Board());
                });
            Game.LoadBoard(screen);
        }
    },

    // Sprite Data
    // sx: Sprite x cord
    // sy: Sprite y cord
    // w: width
    // h: height
    // cls: The loaded sprite
    // frames: The amount of frames in the animation
    sprite: {
        'invader1': {
            sx: 0,
            sy: 0,
            width: 30,
            height: 20,
            Type: Invader,
            frames: 2
        },
        'invader2': {
            sx: 0,
            sy: 20,
            width: 30,
            height: 20,
            Type: Invader,
            frames: 2
        },
        'player': {
            sx: 0,
            sy: 40,
            width: 30,
            height: 20,
            Type: Player
        },
        'missile': {
            sx: 0,
            sy: 60,
            width: 2,
            height: 20,
            Type: Missile
        }
    }
};