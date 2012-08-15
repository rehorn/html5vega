/*
* author:rehorn@vip.qq.com
*/

(function() {
    var ns = Q.use("ht"),
        game = ns.game;

    var Num = ns.Num = function(props) {
            this.max = 1;
            this.gap = 2;
            this.addSign = false;
            this.autoAddZero = false;
            this.src = null;
            this.offsetX = 0;

            props = props || {};
            Num.superClass.constructor.call(this, props);
            this.id = props.id || Q.UIDUtil.createUID("Num");
            this.eventEnabled = this.eventChildren = false;
            this.autoSize = true;

            this.init();
        };
    Q.inherit(Num, Q.DisplayObjectContainer);

    Num.prototype.init = function() {
        var count = this.addSign ? this.max + 1 : this.max;
        for (var i = 0; i < count; i++) {
            var rect = this.src[0];
            var n = new Q.Bitmap({
                image: this.src.image,
                rect: rect,
                x: this.offsetX + (rect[2] + this.gap) * i
            });
            this.addChild(n);
        }
    };

    Num.prototype.setValue = function(val) {
        var str = val.toString(),
            len = this.children.length,
            positive = val > 0;

        if (this.autoAddZero) {
            var count = this.addSign ? len - 1 : len;
            while (str.length < count) str = "0" + str;
        }
        if (this.addSign && positive) str = "+" + str;

        for (var i = len - 1, j = str.length - 1; i >= 0; i--) {
            var n = this.getChildAt(i),
                valid = j >= 0;
            n.visible = valid;
            if (valid) n.setRect(this.src[str.charAt(j)]);
            j--;
        }
    };

})();
