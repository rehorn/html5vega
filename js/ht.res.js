(function(){

var ns = Q.use("ht");

var R = ns.R = {};

R.sources = 
[
    {id:"background", size:545, src:"images/background.jpg?"+Math.random()},
    {id:"background2", size:545, src:"images/background2.jpg?"+Math.random()},
    {id:"help", size:16, src:"images/help.png?"+Math.random()},
    {id:"score", size:16, src:"images/score.png?"+Math.random()},
    {id:"ground", size:16, src:"images/ground.png?"+Math.random()},
    {id:"ground2", size:16, src:"images/ground2.png?"+Math.random()}
];


R.init = function(images)
{
    this.images = images;
    this.initResources();
};

R.initResources = function(){
    this.background = this.getImage("background");
    this.background2 = this.getImage("background2");
    this.help = this.getImage("help");
    var vega = this.vega = {
        image:this.getImage("ground2"),
        frames:[
            {rect:[0,0,90,90], label:"ground0", stop:1},
            {rect:[90,0,90,90], label:"ground1"},
            {rect:[180,0,90,90], label:"ground2"},
            {rect:[270,0,90,90], label:"ground3"},
            {rect:[360,0,90,90], label:"ground4"},
            {rect:[450,0,90,90], label:"ground5"},
            {rect:[540,0,90,90], label:"ground6"},
            {rect:[630,0,90,90], label:"ground7"}
        ]
    };
    var score = this.score = {
        image:this.getImage("score"),
        9: [0, 0, 20, 24],
        8: [0, 24, 20, 24],
        7: [0, 48, 20, 24],
        6: [0, 72, 20, 24],
        5: [0, 96, 20, 24],
        4: [0, 120, 20, 24],
        3: [0, 144, 20, 24],
        2: [0, 168, 20, 24],
        1: [0, 192, 20, 24],
        0: [0, 216, 20, 24],
        hint: [0, 240, 20, 20],
        plus: [0, 0, 0, 0],
        minus: [0, 0, 0, 0]
    };
    var ground0 = {image:this.getImage("ground"), rect:[0,0,90,90]};
    var ground1 = {image:this.getImage("ground"), rect:[90,0,90,90]};
    var ground2 = {image:this.getImage("ground"), rect:[180,0,90,90]};
    var ground3 = {image:this.getImage("ground"), rect:[270,0,90,90]};
    var ground4 = {image:this.getImage("ground"), rect:[360,0,90,90]};
    var ground5 = {image:this.getImage("ground"), rect:[450,0,90,90]};
    var ground6 = {image:this.getImage("ground"), rect:[540,0,90,90]};
    var ground7 = {image:this.getImage("ground"), rect:[630,0,90,90]};
    
    this.groundTypes = [ground0, ground1, ground2, ground3, ground4, ground5, ground6, ground7];
};

R.getImage = function(id)
{
    return this.images[id].image;
};

})();
