(function($win) {

if(!localStorage in $win) {
    return alert('请更换浏览器，推荐使用chrome浏览器体验~！');
}

var SCORE = 0;
var $DOC = document, $HTML = $DOC.documentElement, $BODY = $DOC.body;

var Store = {
    store: $win.localStorage,
    init: function() {
        var _store = this.store.getItem('__VEGADATA__');
        
        if(!_store) {
            this.store.setItem('__VEGADATA__', JSON.stringify({'last': 'guest', 'data': {}}));
        }
    },
    setScore: function(user, score) {
        if(undefined === user || undefined === score) {
            return;
        }
        
        user = user || 'guest';
        
        var d = JSON.parse(this.store.getItem('__VEGADATA__')),
            data = d.data;
        
        if(!data[user]) {
            data[user] = new Array();
        }
        
        d.last = user;
        data[user].push(score);
        
        this.store.setItem('__VEGADATA__', JSON.stringify(d));
    },
    getLastUser: function() {
        return JSON.parse(this.store.getItem('__VEGADATA__')).last;
    },
    getScore: function(user) {
        var data = JSON.parse(this.store.getItem('__VEGADATA__')).data;
        
        return undefined === user ? data : (data[user] ? data[user] : []);
    },
    getList: function() {
        return JSON.parse(this.store.getItem('__VEGADATA__')).data;
    }
};

function showMask() {
    var mask = $DOC.querySelector('#mask'),
        _H = $HTML.scrollHeight,
        _W = $HTML.scrollWidth;
    
    mask.style.width = _W + 'px';
    mask.style.height = _H + 'px';
    $win.$viewWidth = _W - $BODY.scrollLeft;
    $win.$viewHeight = _H - $HTML.scrollTop;
    mask.style.display = 'block';
}

function hideMask() {
    $DOC.querySelector('#mask').style.display = 'none';
}

var isSignBoxShow = false;
function record(n) {
    var _user = $DOC.querySelector('#user-name'),
        _score = $DOC.querySelector('#game-scroe'),
        _signBox = $DOC.querySelector('#sign'),
        _name = Store.getLastUser();
    
    SCORE = n || 0;
    _score.innerHTML = SCORE;
    _user.value = _name;
    
    showMask();
    _signBox.style.display = 'block';
    // _signBox.style.right = ($viewWidth - _signBox.offsetWidth) / 2 + 'px';
    _signBox.style.top = ($viewHeight - _signBox.offsetHeight) / 2 + 'px';
    _signBox.style.opacity = 1;
    isSignBoxShow = true;
}

function hideSignBox(cb) {
    var _user = $DOC.querySelector('#user-name').value || 'guest',
        _signBox = $DOC.querySelector('#sign');
    
    Store.setScore(_user, SCORE);
    _signBox.style.display = 'none';
    _signBox.style.opacity = 0;
    _signBox.style.bottom = 0;
    _signBox.style.right = 0;
    isSignBoxShow = false;
    
    cb && cb();
}

//按照分数排序Store里的数据
function sortByScore(data) {
    var r = [];
    
    for(var k in data) {
        var scores = data[k];
        scores.forEach(function(score) {
            r.push({
                name: k,
                score: score
            });
        });
    }
    
    return r.sort(function(a, b) {
        return b.score - a.score;
    });
}

var inRankBoxShow = false;
function showRank() {
    var data = Store.getList(),
        list = sortByScore(data),
        rankBox = $DOC.querySelector('#rank'),
        listUl = rankBox.querySelectorAll('ul')[0],
        winW = $DOC.documentElement.offsetWidth,
        winH = $DOC.documentElement.offsetHeight,
        html = '';
    
    list.forEach(function(item, i) {
        html += '<li>\
            <span class="ranking">'+(++i)+'</span>\
            <span class="user">'+item.name+'</span>\
            <span class="score">'+item.score+'</span>\
        </li>';
    });
    
    listUl.innerHTML = html;
    rankBox.style.left = (winW - 426) / 2 + 'px';
    rankBox.style.top = (winH - 308) / 2 + 'px';
    rankBox.style.display = 'block';
    inRankBoxShow = true;
}
//showRank();

$win.addEventListener('load', function() {
    Store.init();
    
    $DOC.addEventListener('click', function(e) {
        var tgt = e.target;
        var rankBox = $DOC.querySelector('#rank');
        
        if(inRankBoxShow && tgt.getAttribute('id') === 'mask') {
            rankBox.style.display = 'none';
            hideMask();
            inRankBoxShow = false;
        }
    });
    
    var isRegister = false;
    $DOC.querySelector('#sign').addEventListener('click', function() {//要点一下sign box再注册键盘事件
        if(!isRegister) {
            isRegister = true;
            $DOC.addEventListener('keydown', function(e) {
                if(isSignBoxShow && e.keyCode === 13) {
                    hideSignBox(showRank);
                }
            });
        }
    });
    
    $DOC.querySelector('#btn-showRank').addEventListener('click', function() {
        hideSignBox(showRank);
    });
    
    $DOC.querySelector('#btn-replay').addEventListener('click', function() {
        location.reload();
    });
    
    $DOC.querySelector('#btn-cancel').addEventListener('click', function() {
        hideSignBox();
        hideMask();
    });
    
    $win.record = record;
    // record(Math.max(parseInt(Math.random()*2000), 500));//for test
});

}(window, undefined));