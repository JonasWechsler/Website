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

exports.projectList = [{
            'desc':'Non-binary cellular automata by generating a random list of coefficients and comparisons.',
            'name':'evo'
        },{
            'desc':'Generating plant-like images through a randomized binary tree.',
            'name':'plant'
        },{
            'desc':'Generating flower-like images through perlin noise.',
            'name':'flower'
        }, {
            'name':'golf'
        }, {
            'desc': 'Terrain generation through perlin noise.',
            'name': 'perlin'
        }, {
            'desc': 'Good old-fashioned Tetris according to the standard Tetris guidelines.',
            'name': 'tetris'
        }, {
            'desc': 'A function based graphing calculator.',
            'name': 'calculator'
        },{
            'name':'heat'
        }, {
            'name': 'isometric'
        }, {
            'desc': 'Pure CSS cubes.',
            'name': 'cubes'
        }, {
            'name': 'clover'
        }, {
            'name': 'zbuff'
        }, {
            'name': 'gravity'
        }, {
            'name': 'bullseye'
        }, {
            'desc': 'Moving seamlessly between different methods of random generation.',
            'name': 'level'
        }, {
            'name': 'squares'
        }, {
            'name': 'ball'
        }];

/**************************************/
/*** Basic pages- index, home, etc. ***/
/**************************************/

exports.home = function (req, res) {
     render(res,'home', {
        projects: exports.projectList
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
/* Generates all the fullscreen demos */
/**************************************/

exports.projectList.forEach(function(val){
    exports[val.name] = function(req, res){
        render(res,'projects/fullscreen', {
            title: val.name.charAt(0).toUpperCase() + val.name.slice(1),
            src: './js/' + val.name + ".js"
        });
    }
});

/**************************************/
/***** Custom jade files, replaces ****/
/***** the auto generated ones.    ****/
/**************************************/

exports.golf = function(req, res){
    render(res,'projects/golf');
}
exports.calculator = function (req, res) {
    render(res,'projects/calculator');
}
exports.tetris = function (req, res){
    render(res,'projects/tetris');
}
exports.cubes = function (req, res) {
    render(res,'projects/cubes');
}


/**************************************/
/*********** Depricated? **************/
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
