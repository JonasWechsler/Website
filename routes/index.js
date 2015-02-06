/*
 * GET home page.
 */
var request = require('request');

var render = function(res,file,params){
  console.log(params);
  if('undefined' === typeof params)
    params = {};
  if('undefined' === typeof params['highlight'])
    params['highlight']=1;
  console.log(params);
  res.render(file,params);
}

exports.home = function (req, res) {
    render(res,'home',{highlight:0});
}
exports.index = function (req, res) {
    render(res,'theatre'/*, {
        candy: [{
            'title': 'Star',
            'img': './images/zbuff.png',
            'desc': 'Probability distro',
            'link': '/zbuff'
        }, {
            'title': 'Flower',
            'img': './images/Flower.png',
            'desc': 'somein',
            'link': '/flower'
        }, {
            'title': 'Gravity',
            'img': './images/gravity.png',
            'desc': 'Brevity',
            'link': '/gravity'
        }, {
            'title': 'Bullseye',
            'img': './images/seuss.png',
            'desc': 'somein',
            'link': '/bullseye'
        }, {
            'title': 'Z buffer',
            'img': './images/Flower.png',
            'desc': 'somein',
            'link': '/flower'
        }, {
            'title': 'Calculator',
            'img': './images/calculator.png',
            'desc': 'A function based graphing calculator',
            'link': '/calculator'
        }]
    }*/);
}
exports.flower = function (req, res) {
    render(res,'theatre', {
        title: 'Flower',
        src: './js/flower.js',
        width: 500,
        height: 500
    });
}
exports.gravity = function (req, res) {
    render(res,'theatre', {
        title: 'Gravity',
        src: './js/grav.js',
        width: 1000,
        height: 500
    });
}
exports.seuss = function (req, res) {
    render(res,'theatre', {
        title: 'Bullseye',
        src: './js/seuss.js',
        width: 1000,
        height: 500
    });
}
exports.zbuff = function (req, res) {
    render(res,'theatre', {
        title: 'Star',
        src: './js/zbuff.js',
        width: 500,
        height: 500
    });
}
exports.calculator = function (req, res) {
    render(res,'calculator');
}
exports.rainbow = function (req, res) {
    request('http://www.iheartquotes.com/api/v1/random?format=json&show_source=0&max_characters=288&source=joel_on_software+paul_graham+prog_style', function (error, response, content) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(content);
            var quote = json.quote;
            console.log(quote);
            render(res,'theatre', {
                title: 'Rainbow',
                src: './js/rainbow.js',
                styles: './stylesheets/rainbow.css',
                quote: quote.substr(0, quote.indexOf("-")).split(''),
                width: 0,
                height: 0
            });
        } else {
            render(res,'theatre', {
                title: 'Rainbow',
                src: './js/rainbow.js',
                styles: './stylesheets/rainbow.css',
                quote: 'There was a problem, please reload.'.split(''),
                width: 0,
                height: 0
            });
        }
    });
}


exports.resume = function(req, res){
    render(res,'resume');
}
