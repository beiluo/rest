var inputWrap = $api.domAll('.input-wrap');
var i = 0, len = inputWrap.length;
for (i; i < len; i++) {
    var txt = $api.dom(inputWrap[i], '.txt');
    var del = $api.dom(inputWrap[i], '.del');
    (function (txt, del) {
        $api.addEvt(txt, 'focus', function () {
            if (txt.value) {
                $api.addCls(del, 'show');
            }
            $api.addCls(txt, 'light');
        });
        $api.addEvt(txt, 'blur', function () {
            $api.removeCls(del, 'show');
            $api.removeCls(txt, 'light');
        });
    })(txt, del);

}

function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}

function ensure() {
    api.showProgress({
        title: '注册中...',
        modal: false
    });
    var uname = $api.byId('userName').value;
    var pwd = $api.byId('userPwd').value;
    var pwd2 = $api.byId('userPwd2').value;
    if (pwd !== pwd2) {
        api.alert({
            msg: '两次密码不一致'
        }, function (ret, err) {
            //coding...
        });
        return;
    }
    var registerUrl = '/user';
    var bodyParam = {
        username: uname,
        password: pwd2
    }
    var User=factory("user");
    User.save(bodyParam, function (ret, err) {
        if (ret) {
            api.alert({
                msg: '注册成功！'
            }, function () {
                api.closeWin();
            });

        } else {
            api.alert({
                msg: err.msg
            });
        }
        api.hideProgress();
    })
}

apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
};