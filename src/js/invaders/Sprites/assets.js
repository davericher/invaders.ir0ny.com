var Assets = function () {
    'use strict';
    this.map = {};
};

Assets.prototype = {
    load: function (sprite_data, callback) {
        'use strict';
        this.map = sprite_data;
        this.image = new Image();
        this.image.onload = callback;
        this.image.src = 'img/sprites.png';
    },

    draw: function (canvas, sprite, x, y, frame) {
        'use strict';
        var s = this.map[sprite];
        if (!frame) {
            frame = 0;
        }
        canvas.drawImage(this.image, s.sx + frame * s.width, s.sy, s.width, s.height, x, y, s.width, s.height);
    }
};