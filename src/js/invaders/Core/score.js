/*global Game,prompt,localStorage */

var Score = function () {
    'use strict';
    this.score = 0;
    this.initials = '';
};

Score.prototype = {
    initialize: function () {
        'use strict';
        // Check local cache for scores and initials first
        this.Initials = this.GetInitials();
        this.Score = this.GetScore();
    },
    // Draw the Initials and Score
    draw: function () {
        'use strict';
        Game.canvas.fillStyle = 'white';

        // Draw the Score
        Game.canvas.fillText(this.Score, 10, 20);

        // Draw the Initials
        var initialsSize = Game.canvas.measureText(this.Initials).width;
        Game.canvas.fillText(this.Initials, Game.width - initialsSize - 10, 20);
    },
    // Add to the score
    Add: function (score) {
        'use strict';
        this.Score += Math.round(score); // Round to nearest whole number
    },
    // Get Initials from the user then cache them in local storage
    /**
     * @return {string}
     */
    GetInitials: function () {
        'use strict';
        var initials = '';
        if (localStorage.getItem('initials') !== null && localStorage.getItem('initials') !== '') {
            return localStorage.getItem('initials');
        }
        while (initials === null || initials.length < 3) {
            initials = prompt('Incas you get a high score we need your initials. Ex DJR');
            if (initials !== null) {
                initials = initials.trim();
            }
        }
        initials = initials.substr(0, 3).toUpperCase();
        localStorage.setItem('initials', initials);
        return initials;
    },
    ClearInitials: function () {
        'use strict';
        localStorage.removeItem('initials');
        this.Initials = '';
    },
    /**
     * @return {number}
     */
    GetScore: function () {
        'use strict';
        return Math.round(parseInt(localStorage.getItem('score'), 0) || 0);
    },
    SaveScore: function () {
        'use strict';
        localStorage.setItem('score', this.Score);
    },
    ClearScore: function () {
        'use strict';
        localStorage.removeItem('score');
        this.Score = 0;
    },
    NewPlayer: function () {
        'use strict';
        this.ClearInitials();
        this.ClearScore();
        this.Initials = this.GetInitials();
        this.Score = this.GetScore();
    }
};