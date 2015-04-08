/**
 * David Richer
 * Dave@Ir0nY.com
 * Web Imaging and Animations Final
 * (c) 2015
 **/

/*jslint browser: true, forin:true */
/*global $, jQuery, InvadersFromSpace, Data, App*/

/** Site Specific code **/
var Site = {
    // Variables
    GetScoreService: "http://playdoh.algonquincollege.com/lts/mike/WebServices/MessageService.asmx/GetScores", // Provided
    // Functions
    createFromTemplate: function (id, data) {
        'use strict';
        var param, html;

        //Append a hash tag to the id if one did not exist
        if (id.indexOf('#') !== 0) {
            id = '#' + id;
        }
        //Get the html contents of the element with the provided id
        html = $(id).html();

        //Replace data placeholders
        for (param in data) {
            if (data.hasOwnProperty(param)) {
                while (html.indexOf('[' + param + ']') !== -1) {
                    html = html.replace('[' + param + ']', data[param]);
                }
            }
        }
        return $(html);
    },
    onAjaxError: function (jqXHR, status, errorThrown) {
        'use strict';
        $('#error').html(status + ': ' + errorThrown + '<br><br>' + jqXHR.responseText);
    },
    onGetMessageSuccess: function (data) {
        'use strict';
        /** @namespace data.d */
        var messageList = data.d,
            i,
            $item;
        $('#scoresHolder').empty();

        for (i in messageList) {
            if (messageList.hasOwnProperty(i)) {
                $item = Site.createFromTemplate('scoreTemplate', messageList[i]);
                $item.appendTo('#scoresHolder');
            }
        }
    },
    getMessages: function () {
        'use strict';
        $.ajax({
            url: Site.GetScoreService,
            type: 'GET',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: Site.onGetMessageSuccess,
            error: Site.onAjaxError
        });
    }
};

// Grab the game object and declare it globally
var Game = App.New();

$(function () {
    'use strict';

    // AJAX
    Site.getMessages(); // Initial Fetch
    setInterval(Site.getMessages(), 5000); // Fetch every five seconds

    // JQuery UI
    $("#tabs").tabs({
        heightStyle: "fill" // Set the content containers to be of equal height
    });

    // Load up 'Invaders from space'
    Game.initialize("#gameCanvas", Data.sprite, {
        "start": Data.States.splash,
        "die": Data.States.gameOver,
        "win": Data.States.winner
    });

    // Associate Key handlers to the window using Jquery
    $(window).keydown(function (event) { // Handle the Key Down event
        if (Game.KeyBindings[event.keyCode]) {
            Game.keys[Game.KeyBindings[event.keyCode]] = true;
        }
        // Hack to take pause out of the main loop
        if (event.keyCode === Game.GetBindingByValue('pause')) {
            Game.Pause();
        }
    }).keyup(function (event) { // Handle the Key Up event
        if (Game.KeyBindings[event.keyCode]) {
            Game.keys[Game.KeyBindings[event.keyCode]] = false;
        }
    }).blur(function () {
        if (!Game.paused) {
            Game.Pause();
        }
    });
});