/*
* author:rehorn@vip.qq.com
*/

(function(){
    
    var ns = Q.use("ht"), game = ns.game;
    
    var Vega = ns.Vega = function(type){
        this.type = type;
        this.state = 0;
        Vega.superClass.constructor.call(this, type);
        this.id = Q.UIDUtil.createUID("Vega");
        this.ratioCount = 0;
        var typeRatioMap = {
            1: 5, // 铲子出现概率
            2: 40,
            3: 35,
            4: 30
        };
        this.typeArray = [];
        for(var key in typeRatioMap){
            var value = typeRatioMap[key];
            for(var i = 0; i < value; i++){
                this.typeArray.push(key);
            }
            this.ratioCount += value;
        }
        this.next();
    };
    Q.inherit(Vega, Q.MovieClip);
    
    Vega.prototype.destory = function(){
        this.parent.removeChild(this);
    };
    
    Vega.prototype.move = function(e){
        this.x = e.x - (90/2);
        this.y = e.y - (90/2) - 15;
    };
    
    Vega.prototype.next = function(){
        // 2 - 4 random
        // var rand = parseInt((Math.random() * 3)) + 2;
        var rand = parseInt(this.typeArray[parseInt((Math.random() * this.ratioCount))]);
        // rand = 6;
        this.state = rand;
        //console.log('ground'+rand);
        this.gotoAndStop('ground'+rand);
    };
    
    Vega.prototype.showShovel = function(){
        this.gotoAndStop('ground1');
    };
    
    Vega.prototype.hideShovel = function(){
        this.gotoAndStop('ground'+this.state);
    };
    
    Vega.prototype.getState = function(){
        return this.state;  
    };
    
    Vega.prototype.moveTo = function(props){
        this.x = props.x;
        this.y = props.y;
    };
    
})();
