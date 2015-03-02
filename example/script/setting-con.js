function modifyNick(nickname) {
    nickname = nickname || '';
    api.openWin({
        name: 'modifyNick',
        url: 'modifyNick.html',
        opaque: true,
        pageParam: {
            nickname: nickname
        },
        vScrollBarEnabled: false
    });
}

function modifyPwd() {
    api.openWin({
        name: 'modifyPwd',
        url: 'modifyPwd.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

function loginBtn() {
    api.openWin({
        name: 'userLogin',
        url: 'userLogin.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

function loginOut() {
    api.showProgress({
        title: '正在注销...',
        modal: false
    });
    var User=factory("user");
    User.logout(function (ret, err) {
        if (ret) {
            $api.clearStorage();
            api.execScript({
                name: 'root',
                script: 'openTab("main");'
            });
            setTimeout(function () {
                api.closeWin();
            }, 100);
        } else {
            alert(JSON.stringify(err));
        }
        api.hideProgress();
    });
}

function toRegister() {
    api.openWin({
        name: 'userLogin',
        url: 'userLogin.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

//清除下载缓存文件、拍照临时文件、网页缓存文件等
function clearData() {
    api.clearCache();

    setTimeout(function () {
        api.alert({
            msg: '缓存已清空!'
        });
    }, 300);
}

function openAbout() {
    api.openWin({
        name: 'about',
        url: './about.html'
    });
}

function init() {
    api.showProgress({
        title: '加载中...',
        modal: false
    });
    var uid = $api.getStorage('uid');
    var User=factory("user");
    User.get({"_id":uid}, function (ret, err) {
        if (ret) {
            var content = $api.byId('content');
            var tpl = $api.byId('template').text;
            var tempFn = doT.template(tpl);
            content.innerHTML = tempFn(ret);
        } else {
            api.toast({msg: err.msg})
        }
        api.hideProgress();
    })
}

apiready = function () {
    init();
};