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
			6: 81
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
	Player.prototype.addPoint = function(type){
		//console.log('type:'+type);
		this.score += this.pointMap[type];
		this.setValue();
	};
	
	Player.prototype.minusPoint = function(type){
		this.score -= this.pointMap[type];
		this.setValue();
	};
	
	Player.prototype.setValue = function(){
		game.num.setValue(this.score);
		//console.log('score:' + this.score);
	};
	
	// 
	
	
})();