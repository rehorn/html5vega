/*
* author:rehorn@vip.qq.com
*/

(function(){
	
	var ns = Q.use("ht"), game = ns.game;
	
	var Ground = ns.Ground = function(type){
		this.type = type;
		Ground.superClass.constructor.call(this, type);
		this.id = Q.UIDUtil.createUID("Ground");
	};
	Q.inherit(Ground, Q.Bitmap);
	
	Ground.prototype.destory = function(props){
		var me = this;
		if(props){
			Q.Tween.to(me, {
			    x: props.x,
			    y: props.y,
			    alpha: 0
			}, {
			    time: 300,
			    delay: 0,
			    onComplete: function() {
					me.parent.removeChild(me);
			        //trace("tween end");
			    }
			});
		}else{
			me.parent.removeChild(me);
		}
	};
	
})();