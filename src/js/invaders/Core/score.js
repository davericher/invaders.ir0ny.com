/*global Game,prompt,localStorage,alert */

var ScoreEntry = function () {
    'use strict';
    this.initials = 'AAA';
    this.score = 0;
};

var Score = function () {
    'use strict';
    // Local player information
    this.local = new ScoreEntry();
};

//noinspection JSUnusedGlobalSymbols
Score.prototype = {
    Initialize: function () {
        'use strict';
        // Check local cache for scores and initials first
        this.Load();
    },
    // Add to the score
    Add: function (score) {
        'use strict';
        // Sanitize
        if (!isNaN(score)) {
            this.local.score += Math.round(score); // Round to nearest whole number
        }
    },
    // Get Initials from the user
    /**
     * @return {string}
     */
    GetInitials: function () {
        'use strict';
        var initials = '';
        while (initials === null || initials.length < 3) {
            initials = prompt('Please enter a Min of 3 letters');
            if (initials !== null) {
                initials = initials.trim();
            }
        }
        initials = initials.substr(0, 3).toUpperCase();
        return initials;
    },
    ClearInitials: function () {
        'use strict';
        this.local.initials = '';
        this.Save();
    },
    /**
     * Save the local state to the cache
     */
    Save: function () {
        'use strict';
        // Save the local data
        localStorage.setItem('invLocal', JSON.stringify(this.local));
        localStorage.setItem('invLevel', JSON.stringify(this.level));
    },
    SaveTop: function () {
        'use strict';
        localStorage.setItem('invTop', JSON.stringify(this.top));
    },
    /**
     * Try and load the local initial and score state
     * From the cache, if not available initialize them
     * This function is huge because of wanting to over sanitize everything...
     */
    Load: function () {
        'use strict';
        // Grab the local cache object
        var obj = JSON.parse(localStorage.getItem('invLocal')),
            top = JSON.parse(localStorage.getItem('invTop')),
            lvl = JSON.parse(localStorage.getItem('invLevel'));
        // Null check to make sure it exists
        if (obj !== null) {
            // Null check to make sure the score exists
            if (obj.score !== null) {
                this.local.score = Math.round(parseInt(obj.score, 0) || 0);
            } else {
                this.local.score = 0;
            }
            if (obj.initials !== null && obj.initials !== '') {
                this.local.initials = obj.initials;
            } else {
                this.local.initials = this.GetInitials();
            }
            // Null check to make sure the initials exist
        } else {
            this.local.score = 0;
            this.local.initials = this.GetInitials();
        }
        // Check and init the top scores
        if (top !== null) {
            this.top = top;
        } else {
            // Check to see if there is any top scores, if not, build em
            this.top = [new ScoreEntry(), new ScoreEntry(), new ScoreEntry()];
            this.SaveTop();
        }
        // Check the level object
        if (lvl !== null) {
            lvl = Math.round(parseInt(lvl, 0) || 1);
            if (lvl === 0) {
                lvl = 1;
            }
            this.level = lvl;
        }
        // Final sanitation on level object
        if (isNaN(this.level)) {
            this.level = 1;
        }

        // Commit
        this.Save();
    },
    Clear: function () {
        'use strict';
        localStorage.removeItem('invLocal');
        localStorage.removeItem('invTop');
        localStorage.removeItem('invLevel');
    },
    ClearScore: function () {
        'use strict';
        this.local.score = 0;
        this.Save();
    },
    NewPlayer: function () {
        'use strict';
        this.ClearInitials();
        this.ClearScore();
        this.ClearLevel();
        this.Load();
    },
    CheckForTop: function () {
        'use strict';
        var idx,
            found = false;
        for (idx = 0; idx < this.top.length && !found; idx += 1) {
            if (this.local.score > this.top[idx].score) {
                // Set the values
                // check to see if the score above this score needs to be swapped out
                if (idx < this.top.length - 1 && this.top[idx].score > this.top[idx + 1].score) {
                    this.top[idx + 1].initials = this.top[idx].initials;
                    this.top[idx + 1].score = this.top[idx].score;
                }
                this.top[idx].initials = this.local.initials;
                this.top[idx].score = this.local.score;
                // Stop the check
                found = true;
                // Save the scores
                this.SaveTop();
                // Should probably find a more elegant way of doing this
                alert('New top 3 replacing position ' + (idx + 1));
            }
        }
    },
    // Check if top player, if so return place
    /**
     * @return {number}
     */
    IsTop: function (inclusive) {
        'use strict';
        var idx;
        // Default param
        if (inclusive === null) {
            inclusive = false;
        }
        for (idx = 0; idx < this.top.length; idx += 1) {
            if (inclusive) {
                if (this.local.score >= this.top[idx].score) {
                    return idx + 1;
                }
            } else {
                if (this.local.score > this.top[idx].score) {
                    return idx + 1;
                }
            }
        }
        return 0;
    },
    /**
     * Return the 1st 2nd 3rd placing
     * @return {string}
     */
    GetPlacing: function () {
        'use strict';
        var top = this.IsTop(true),
            placing = '';
        if (top) {
            switch (top) {
            case 1:
                placing = '1st';
                break;
            case 2:
                placing = '2nd';
                break;
            case 3:
                placing = '3rd';
                break;
            }
        }
        return placing;
    },
    NextLevel: function () {
        'use strict';
        this.level += 1;
        //this.Save();
    },
    ClearLevel: function () {
        'use strict';
        this.level = 1;
        //this.Save();
    }
};