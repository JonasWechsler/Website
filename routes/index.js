/*
 * GET home page.
 */
var request = require('request');

var render = function(res,file,params){
  if('undefined' === typeof params)
    params = {};
  if('undefined' === typeof params['highlight'])
    params['highlight']=1;
  res.render(file,params);
}

var projects = [{
            'title': 'Tetris',
            'img': './images/tetris_2.png',
            'desc': 'Tetrisu',
            'link': '/tetris',
            'w': 1,
            'h': 2
        }, {
            'title': 'Calculator',
            'img': './images/calculator.png',
            'desc': 'A function based graphing calculator',
            'link': '/calculator',
            'w':1,
            'h':1
        }, {
            'title': 'Perlin',
            'img': './images/perlin.jpg',
            'desc': 'A function based graphing calculator',
            'link': '/perlin',
            'w':1,
            'h':1
        }, {
            'title': 'Isometric',
            'img': './images/isometric.jpg',
            'desc': 'A function based graphing calculator',
            'link': '/isometric',
            'w':1,
            'h':1
        }, {
            'title': 'Cubes',
            'img': './images/cubes.png',
            'desc': 'A function based graphing calculator',
            'link': '/cubes',
            'w':1,
            'h':1
        }, {
            'title': 'Squares',
            'img': './images/squares.png',
            'desc': 'A function based graphing calculator',
            'link': '/squares',
            'w':1,
            'h':1
        }, {
            'title': 'Star',
            'img': './images/zbuff.png',
            'desc': 'Probability distro',
            'link': '/zbuff',
            'w':1,
            'h':1
        }, {
            'title': 'Gravity',
            'img': './images/gravity.png',
            'desc': 'Brevity',
            'link': '/gravity',
            'w':1,
            'h':1
        }, {
            'title': 'Bullseye',
            'img': './images/seuss.png',
            'desc': 'somein',
            'link': '/bullseye',
            'w':1,
            'h':1
        }, {

        }];

/**************************************/
/**************************************/
/**************************************/

exports.home = function (req, res) {
     render(res,'home', {
        projects: projects
    });
}

exports.about = function(req, res){
    render(res,'about',{'highlight':2});
}

exports.resume = function(req, res){
    render(res,'resume');
}

exports.projects = function (req, res) {
    render(res,'projects/projects', {
        projects: projects
    });
}

/**************************************/
/**************************************/
/**************************************/

exports.gravity = function (req, res) {
    render(res,'projects/gravity');
}
exports.golf = function(req, res){
    render(res,'projects/golf');
}
exports.calculator = function (req, res) {
    render(res,'projects/calculator');
}
exports.tetris = function (req, res){
    render(res,'projects/tetris');
}

/**************************************/
/**************************************/
/**************************************/

exports.seuss = function (req, res) {
    render(res,'projects/fullscreen', {
        title: 'Bullseye',
        src: './js/seuss.js'
    });
}
exports.zbuff = function (req, res) {
    render(res,'projects/fullscreen', {
        title: 'Star',
        src: './js/zbuff.js'
    });
}
exports.isometric = function (req, res) {
    render(res,'projects/fullscreen', {
        title: 'Isometric',
        src: './js/isometric.js'
    });
}
exports.perlin = function (req, res) {
    render(res,'projects/fullscreen', {
        title: 'Perlin',
        src: './js/perlin.js'
    })
}
exports.squares = function (req, res) {
    render(res,'projects/fullscreen', {
        title: 'Squares',
        src: './js/squares.js'
    })
}
exports.cubes = function (req, res) {
    render(res,'projects/cubes');
}

/**************************************/
/**************************************/
/**************************************/

exports.rainbow = function (req, res) {
    request('http://www.iheartquotes.com/api/v1/random?format=json&show_source=0&max_characters=288&source=joel_on_software+paul_graham+prog_style', function (error, response, content) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(content);
            var quote = json.quote;
            console.log(quote);
            render(res,'projects/theatre', {
                title: 'Rainbow',
                src: './js/rainbow.js',
                styles: './stylesheets/rainbow.css',
                quote: quote.substr(0, quote.indexOf("-")).split(''),
                width: 0,
                height: 0
            });
        } else {
            render(res,'projects/theatre', {
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

exports.flower = function (req, res) {
    render(res,'projects/theatre', {
        title: 'Flower',
        src: './js/flower.js'
    });
}
