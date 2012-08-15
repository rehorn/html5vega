/*
* author:rehorn@vip.qq.com
*/

(function(){
    var ns = Q.use("ht"), game = ns.game;
    
    var Player = ns.Player = function(props){
        this.id = null;
        this.score = 0;
        this.pointMap = {
            0: 0,
            1: 0,
            2: 1,
            3: 3,
            4: 9,
            5: 27,
            6: 81,
            7: 243,
            99: 888, // 拿走一张船票，获得888分
            98: -100 // 拿走一块石头，减少100
        };

        this.mergeRatio = {
            1: 1,
            3: 1,
            4: 1.2,
            5: 1.5,
            6: 1.8,
            7: 2,
            8: 4
        };
        
        props = props || {};
        Q.merge(this, props, true);
        
        this.init();
    };
    
    Player.prototype.init = function(){
        //初始化分数
        
            
    };
    
    Player.prototype.go = function(targetPoint){
        // vega.getCurrent
        var state = game.vega.getState();
        // ground.addGround
        game.groundManager.addGround(targetPoint, state);
        // ground.call
    };
    
    // point manage
    Player.prototype.addPoint = function(type, itemLength){
        //console.log('type:'+type);
        itemLength = (itemLength == undefined) ? 1 : itemLength;
        // this.score += parseInt(this.pointMap[type] * this.mergeRatio[itemLength]);
        this.score += this.pointMap[type];
        this.setValue();
    };
    
    Player.prototype.minusPoint = function(type){
        this.score -= this.pointMap[type];
        this.setValue();
    };
    
    Player.prototype.setValue = function(){
        if(this.score <0){
            this.score = 0;
        }
        game.num.setValue(this.score);
        //console.log('score:' + this.score);
    };
    
    // 
    
    
})();
