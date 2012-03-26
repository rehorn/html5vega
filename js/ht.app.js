/*
* author:rehorn@vip.qq.com
*/

(function() {

    window.onload = function() {
        setTimeout(function() {
            game.load();
        }, 10);
    };


    var ns = Q.use("ht");

    var game = ns.game = {
        container: null,
        width: 560,
        height: 725,
        fps: 60,
        frames: 0,
        params: null,
        events: Q.supportTouch ? ["touchstart", "touchend", "touchmove"] : ["mousedown", "mouseup", "mousemove"],

        fireInterval: 30,
        fireCount: 0
    };


    game.load = function(container) {

        //初始化容器设置
        this.container = container || Q.getDOM("container");
        this.container.style.overflow = "hidden";
        this.container.style.width = this.width + "px";
        this.container.style.height = this.height + "px";
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;

        //load info
        var div = Q.createDOM("div", {
            innerHTML: "正在加载资源中，请稍候...<br>",
            style: {
                id: "loader",
                position: "absolute",
                width: this.width + "px",
                left: "0px",
                top: (this.height >> 1) + "px",
                textAlign: "center",
                color: "#fff",
                font: Q.isMobile ? 'bold 16px 黑体' : 'bold 16px 宋体',
                textShadow: "0 2px 2px #111"
            }
        });
        this.container.appendChild(div);
        this.loader = div;

        //start load image
        var imgLoader = new Q.ImageLoader();
        imgLoader.addEventListener("loaded", Q.delegate(this.onLoadLoaded, this));
        imgLoader.addEventListener("complete", Q.delegate(this.onLoadComplete, this));
        imgLoader.load(ns.R.sources);
    };

    game.onLoadLoaded = function(e) {
        var content = "正在加载资源中，请稍候...<br>(" + Math.round(e.target.getLoadedSize() / e.target.getTotalSize() * 100) + "%)";
        this.loader.innerHTML = content;
    };

    game.onLoadComplete = function(e) {
        e.target.removeAllEventListeners();
        this.init(e.images);
    };

    game.init = function(images) {
        ns.R.init(images);
        this.startup();
    };

    game.showFPS = function() {
        var me = this,
            fpsContainer = Quark.getDOM("fps");
        if (fpsContainer) {
            setInterval(function() {
                fpsContainer.innerHTML = "FPS:" + me.frames;
                me.frames = 0;
            }, 1000);
        }
    };

    game.startup = function() {
        var me = this;
        this.container.removeChild(this.loader);
        this.loader = null;
        var context = null;
        this.context = new Q.DOMContext({
            canvas: this.container
        });

        this.stage = new Q.Stage({
            width: this.width,
            height: this.height,
            context: this.context,
            update: Q.delegate(this.update, this)
        });
        this.stage.scaleX = this.stage.scaleY = 1;

        var em = this.evtManager = new Q.EventManager();
        em.registerStage(this.stage, this.events, true, true);
        
        this.initBackground();
        this.showHelp();
        

        var timer = this.timer = new Q.Timer(1000 / this.fps);
        timer.addListener(this.stage);
        timer.addListener(Q.Tween);
        timer.start();
        
        this.bgAudio = new Q.Audio("audios/menu_music.m4a", true, true, true);
        this.showFPS();
    };
    
    game.initBackground = function(){
        this.background = new Q.Bitmap({
            id: "background",
            image: ns.R.background,
            transformEnabled: false
        });
        this.stage.addChild(this.background);
    };
    
    game.showHelp = function(){
        var me = this;
        var help = this.help = new Q.Bitmap({
            image: ns.R.help,
            rect: [0,0,426,308],
            x: 75,
            y: 230,
            alpha:0
        });
            
        this.help.onEvent = function(e){
            if (e.type == game.events[0]){
                me.hideHelp();
                me.initUI();
                me.initScore();
                me.initPlayer();
                me.initGround();
            }
        }
        me.stage.addChild(help);
        
        Q.Tween.to(me.help, {
            alpha: 1
        }, {
            time: 300,
            delay: 100
        });
    };
    
    game.hideHelp = function(){
        var me = this;
        Q.Tween.to(me.help, {
            alpha: 0
        }, {
            time: 200,
            delay: 0,
            onComplete: function() {
                me.help.parent.removeChild(me.help);
            }
        });
    };

    game.initUI = function() {
        this.htContainer = new Q.DisplayObjectContainer({
            id: "htContainer",
            width: this.width,
            height: this.height,
            eventChildren: false,
            transformEnabled: false
        });
            
        this.htPointer = new Q.DisplayObjectContainer({
            id: "htPointer",
            width: this.width,
            height: this.height,
            eventChildren: false,
            transformEnabled: false
        });

        this.htPointer.onEvent = function(e) {
            if (e.type == game.events[0] && game.fireCount >= game.fireInterval) {
                game.fireCount = 0;
                game.player.go({
                    x: e.eventX,
                    y: e.eventY
                });

                //load background audio for ios devices.
//                if (game.bgAudio && !game.bgAudio.playing() && !game.bgAudio.loading) {
//                    game.bgAudio.loading = true;
//                    game.bgAudio.load();
//                }
            }else if(e.type == game.events[2]){
                game.vega.move({
                    x: e.eventX,
                    y: e.eventY 
                });
                game.groundManager.listen({
                    x: e.eventX,
                    y: e.eventY 
                });
            }
        };

        this.stage.addChild(this.htContainer, this.htPointer);
    };
    
    game.initScore = function(){
         this.scoreContainer = new Q.DisplayObjectContainer({
            id: "scoreContainer",
            x: 380,
            y: 150,
            width: 300,
            height: 50,
            eventChildren: false,
            transformEnabled: false
        });
            
        var hint = new Q.Bitmap({
            image: ns.R.score.image,
            rect: ns.R.score.hint   
        });
        this.scoreContainer.addChild(hint);
        
        var num = this.num = new ns.Num({
            id: "coinNum",
            src: ns.R.score,
            max: 6,
            gap: 3,
            autoAddZero: true,
            offsetX: 30
        });
        this.scoreContainer.addChild(num);
            
        game.htContainer.addChild(this.scoreContainer);
    };
    
    game.initGround = function(){
        this.groundManager = new ns.GroundManager(this.htContainer);
    };

    game.initPlayer = function() {
        this.vega = new ns.Vega(ns.R.vega);
        this.player = new ns.Player();
        this.htPointer.addChild(this.vega);
    };

    game.update = function(timeInfo) {
        this.frames++;
        this.fireCount++;
        //this.fishManager.update();
    };

})();