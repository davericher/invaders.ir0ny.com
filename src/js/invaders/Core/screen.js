/*global Game */

var Screen = function (title, callback) {
    'use strict';
    this.callback = callback;
    this.title = title;
};

Screen.prototype = {
    PlayAgainText: "W: Play Again",
    NewPlayerText: "X: New Player",
    step: function () {
        'use strict';
        // If they press the continue key, restart
        /** @namespace Game.keys.again */
        if (Game.keys.again && this.callback) {
            this.callback();
        }
        // If they press the new player key, reset player data, then restart
        if (Game.keys.newPlayer && this.callback) {
            Game.Score.NewPlayer();

            // HACK: not sure why this is not being unbidden by the events
            // regardless, unbind the button press
            Game.keys.newPlayer = false;
            this.callback();
        }

    },
    render: function (canvas) {
        'use strict';
        var titleSize,
            textSize,
            x;

        // Write the title
        canvas.clearRect(0, 0, Game.width, Game.height);

        // Draw the effectively  box thing in the titles
        for (x = 1; x <= 11; x += 1) {
            // Draw The box 
            canvas.rect(
                Game.width - (Game.width - 40) + (x * 5),
                Game.height - (Game.height - 40) + (x * 5),
                Game.width / 2 + Game.width / 3 - (x * 10),
                Game.height / 2 + Game.width / 3 - (x * 10)
            );
            canvas.lineWidth = '1';
            canvas.strokeStyle = x % 2 ? '#9C3030' : 'white';
            canvas.stroke();
        }

        canvas.font = "bold 20px Roboto";
        titleSize = canvas.measureText(this.title);
        canvas.fillStyle = "#5FA2AC";
        canvas.fillText(this.title, Game.width / 2 - titleSize.width / 2, Game.height / 2 - 120);

        canvas.font = "17px 'Open Sans'";
        canvas.fillStyle = 'white';
        textSize = canvas.measureText(this.PlayAgainText);
        canvas.fillText(this.PlayAgainText, Game.width / 2 - textSize.width / 2, Game.height / 2 - 60 + 40);

        textSize = canvas.measureText(this.NewPlayerText);
        canvas.fillText(this.NewPlayerText, Game.width / 2 - textSize.width / 2, Game.height / 2 - 60 + 80);
    }
};