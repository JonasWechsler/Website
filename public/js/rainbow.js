function hsv(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
    case 0:
        r = v, g = t, b = p;
        break;
    case 1:
        r = q, g = v, b = p;
        break;
    case 2:
        r = p, g = v, b = t;
        break;
    case 3:
        r = p, g = q, b = v;
        break;
    case 4:
        r = t, g = p, b = v;
        break;
    case 5:
        r = v, g = p, b = q;
        break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}

function rgbToHex(r, g, b) {
    if (r && g === undefined && b === undefined) {
        g = r.g;
        b = r.b;
        r = r.r;
    }
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
$.get("/quote", function (data) {
    console.log(data);
    quotejson = jQuery.parseJSON(data);
    set(quotejson.quote);
});
var length = 16 * 8;
var quote = "";
var quotejson;

function set(quoteth) {
    console.log(quoteth);
    quote = quoteth.substr(0, quoteth.indexOf("-"));
    space();
}

function space() {
    var width = $(document).width();
    var height = $(document).height();
    $('.title').css('width', width);
    $('.title').css('height', height);
    width /= 16;
    $('.letter').css('width', width);
    $('.letter').css('height', width);
    $('.letter').css('font-size', width * .7);
}
$(function () {
    space();
});
var h = Math.random();
var offset = 0;
var gold = 0.618033988749895;
var cycle = setInterval(function () {
    offset++;
    for (var i = 0; i < length; i++) {
        var h0 = h + i * .02 + offset / 100;
        h0 %= 1;
        var rgb0 = hsv(h0, .9, .3);
        var rgb1 = hsv((h0 + gold) % 1, .9, .9);
        var hex0 = rgbToHex(rgb0);
        var hex1 = rgbToHex(rgb1);
        $('.letter.' + i).css('background-color', hex1);
        $('.letter.' + i).css('color', 'black');
        var index = (i + offset) % length;
        if (quote[index])
            $('.letter.' + i).html(quote[index]);
        else
            $('.letter.' + i).html(" ");
    }
}, 100);
