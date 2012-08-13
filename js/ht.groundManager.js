/*
* author:rehorn@vip.qq.com
*/

(function(){
	
	var ns = Q.use("ht"), game = ns.game;

	var GroundManager = ns.GroundManager = function(container){
		this.items = {};
		this.startX = 10;
		this.startY = 180;
		this.itemCountX = 6;
		this.itemCountY = 6;
		this.itemWidth = 90;
		this.itemHeight = 90;
		this.container = container;
		this.initGround();
	};
	
	GroundManager.prototype.initGround = function(){
		var ground = [];
//		for(var i = 0; i < this.itemCountX; i++){
//			ground[i] = [];
//			for(var j = 0; j < this.itemCountY; j++){
//				// 0:障碍物，1可走，2-5种类，
//				ground[i][j] = parseInt(Math.random() * 6);
//			}
//		}
		ground[0] = [
			[2, 2, 1, 3, 1, 2],
			[1, 1, 3, 1, 4, 1],
			[1, 1, 1, 1, 1, 5],
			[4, 0, 3, 1, 1, 5],
			[5, 3, 2, 1, 1, 1],
			[1, 1, 3, 1, 0, 3]
		];
		
		ground[1] = [
			[2, 2, 1, 1, 4, 1],	
			[1, 5, 0, 0, 2, 0],	
			[3, 3, 2, 4, 2, 5],	
			[0, 1, 3, 1, 0, 0],	
			[3, 1, 3, 1, 1, 1],	
			[2, 0, 1, 4, 1, 1]	
		];
		
		ground[99] = [
			[1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1]
		];
		var rand = parseInt(Math.random() * 2);
		//var rand = 99;
		
		this.createItems(ground[rand]);
	};
	
	GroundManager.prototype.createItems = function(ground){
		var item, type;
		this.ground = ground;
		for(var i = 0; i < ground.length; i++){
			for(var j = 0; j < ground[i].length; j++){
				type = ground[i][j];
				this.addItem(type, i, j);
			}
		}	
	};
	
	GroundManager.prototype.addItem = function(type, i, j){
		var item = new ns.Ground(ns.R.groundTypes[type]);
		item.x = this.startX + j * this.itemWidth;
		item.y = this.startY + i * this.itemHeight;
		item.alpha = 0;
		this.container.addChild(item);
		this.items[i+','+j] = item;
		Q.Tween.to(item, {
		    alpha: 1
		}, {
		    time: 300,
		    delay: 20,
		    onComplete: function() {
		        //trace("tween end");
		    }
		});
		
		game.player.addPoint(type);
	};
	
	GroundManager.prototype.addGround = function(targetPoint, type){
		var cellIndex = this.getGroundByPoint(targetPoint);
		if(this.checkCellIndex(cellIndex) && this.ground[cellIndex.i][cellIndex.j] == 1){
			this.replaceItem(cellIndex, type);
			this.groundMerge(cellIndex);
			// is game over
			if(this.isNoFreeGround()){
				if(confirm('风雨过后见彩虹，再奋斗一次？')){
					location.reload();	
				}
			}else{
				game.vega.next();
			}
		}
	};
	
	GroundManager.prototype.getGroundByPoint = function(targetPoint){
		var x = parseInt((targetPoint.x - this.startX) / this.itemWidth);
		var y = parseInt((targetPoint.y - this.startY) / this.itemHeight);
		var r = {
			i: y,
			j: x
		};
		return r;
	};
	
	GroundManager.prototype.replaceItem = function(cellIndex, type, play, toCellIndex){
		var i = cellIndex.i, j = cellIndex.j;
		play = (play == undefined) ? true : false;
		// 可走方块
		if(!play || (play && this.ground[i][j] == 1)){
			var item = this.items[i+','+j];
			var destoryProps = undefined;
			if(toCellIndex){
				destoryProps = this.getCellCenterPointByIndex(toCellIndex);
			}
			item.destory(destoryProps);
			this.addItem(type, i, j);
			this.ground[i][j] = type;
			//game.player.minusPoint(type);
		}
	};
	
	GroundManager.prototype.getCellCenterPointByIndex = function(cellIndex){
		return {
			x: this.startX + cellIndex.j * this.itemWidth,
			y: this.startY + cellIndex.i * this.itemHeight
		};
	};
	
	GroundManager.prototype.groundMerge = function(cellIndex){
		this.toMerge = [];
		var curScore = game.player.score;
		
		// 检测 四个正方向 连续3个
		this.triMerge(cellIndex);
		
		// 检测 9宫格内直角
		this.rightAngelMerge(cellIndex);
		
		// 检测 9宫格周围
		this.roundMerge(cellIndex);
		
		// 真正合并
		this.doMerge();
		
		var curScore2 = game.player.score;
		this.showCoins(cellIndex, curScore, curScore2);
	};
	
	GroundManager.prototype.showCoins = function(cellIndex, coin1, coin2){
		var c = coin2 - coin1;
		if(c<=0){
			return;
		}
		var cellIndex = this.getCellCenterPointByIndex(cellIndex);
		var coin = new ns.Num({
		    id: "coinNum_" + Math.random(),
		    src: ns.R.score,
		    max: 3,
		    gap: 1,
		    alpha: 1,
		    x: cellIndex.x - 35,
		    y: cellIndex.y - 20,
		    scaleX: 1.5,
		    scaleY: 1.5,
		    autoAddZero: false
		});
		coin.setValue(c);
		this.container.addChild(coin);
		Q.Tween.to(coin, {
		    x: cellIndex.x - 35,
		    y: cellIndex.y - 20 - 100,
		    alpha: 0
		}, {
		    time: 1500,
		    delay: 0,
		    onComplete: function() {
				coin.parent.removeChild(coin);
		    }
		});
	};
	
	GroundManager.prototype.doMerge = function(){
		var cellIndex = undefined, me = this;
		var count = 0, type = -1;
		for(var i = 0; i < this.toMerge.length; i++){
			type = this.toMerge[i][3];
			if(type >= 6){
				return;
			}
			cellIndex = this.toMerge[i][0];
			var cell1 = this.toMerge[i][1];
			var cell2 = this.toMerge[i][2];
			this.replaceItem(cellIndex, type+1, false);
			this.replaceItem(cell1, 1, false, cellIndex);
			this.replaceItem(cell2, 1, false, cellIndex);
			count++;
		}
		if(cellIndex){
			setTimeout(function(){
				me.groundMerge(cellIndex);
			}, 300);
		}
	};
	
	GroundManager.prototype.rightAngelMerge = function(cellIndex){
		var tocheck = [
			[[-1, 0], [1, 0]], // -
			[[0, 1], [0, -1]], // |
			[[0, -1], [1, 0]],  // |_
			[[1, 0], [0, 1]],
			[[0, 1], [-1, 0]],
			[[-1, 0], [0, -1]]
		];
		
		for(var i=0; i<tocheck.length;i++){
			this.merge(cellIndex, tocheck[i][0], tocheck[i][1]);
		}	
	};
	
	GroundManager.prototype.roundMerge = function(cellIndex){
		var tocheck = [
			[[-1, -1], [0, -1]],
			[[0, -1], [1, -1]],
			[[1, -1], [1, 0]],
			[[1, 0], [1, 1]],
			[[1, 1], [0, 1]],
			[[0, 1], [-1, 1]],
			[[-1, 1], [-1, 0]],
			[[-1, 0], [-1, -1]] // 9四周依次
		];
		
		for(var i=0; i<tocheck.length;i++){
			this.merge(cellIndex, tocheck[i][0], tocheck[i][1]);
		}
	};
	
	GroundManager.prototype.triMerge = function(cellIndex){
		var tocheck = [
			[[-2, 0], [-1, 0]],
			[[2, 0], [1, 0]],
			[[0, 1], [0, 2]],
			[[0, -1], [0, -2]]
		];
		
		for(var i=0; i<tocheck.length;i++){
			this.merge(cellIndex, tocheck[i][0], tocheck[i][1]);
		}
	};
	
	GroundManager.prototype.merge = function(cellIndex, offset1, offset2){
		var type = this.ground[cellIndex.i][cellIndex.j];
		var cell1 = {
			i: cellIndex.i + offset1[0],
			j: cellIndex.j + offset1[1]
		};
		var cell2 = {
			i: cellIndex.i + offset2[0],
			j: cellIndex.j + offset2[1]
		};
		if(this.isMerge(cellIndex, cell1, cell2)){
//			this.replaceItem(cellIndex, type+1, false);
//			this.replaceItem(cell1, 1, false, cellIndex);
//			this.replaceItem(cell2, 1, false, cellIndex);
//			
//			//再次触发
//			this.groundMerge(cellIndex);
			this.toMerge.push([cellIndex, cell1, cell2, type]);
		}
	};
	
	GroundManager.prototype.isMerge = function(cellIndex, cell1, cell2){
		var type = this.ground[cellIndex.i][cellIndex.j];
		if(this.checkCellIndex(cell1) && this.checkCellIndex(cell2)){
			var type1 = this.ground[cell1.i][cell1.j];
			var type2 = this.ground[cell2.i][cell2.j];
			if(type == type1 && type == type2){
				return true;
			}
		}
		return false;
	};
	
	GroundManager.prototype.checkCellIndex = function(cellIndex){
		if(cellIndex.i >= 0 && cellIndex.j >= 0 && cellIndex.i < this.itemCountX && cellIndex.j < this.itemCountY){
			return true;
		}
		return false;
	};
	
	GroundManager.prototype.listen = function(targetPoint){
		var cellIndex = this.getGroundByPoint(targetPoint);
		if(this.checkCellIndex(cellIndex) && this.ground[cellIndex.i][cellIndex.j] == 1){
			var props = this.getCellCenterPointByIndex(cellIndex);
			game.vega.moveTo(props);
		}
	};
	
	GroundManager.prototype.isNoFreeGround = function(){
		for(var i = 0; i < this.itemCountX; i++)	{
			for(var j = 0; j < this.itemCountY; j++){
				if(this.ground[i][j] == 1){
					return false;
				}
			}
		}
		return true;
	};
	
	
})();