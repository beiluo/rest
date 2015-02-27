function ensure() {
    var uid = $api.getStorage('uid');
    var nickname = $api.byId('nickname').value;

    var bodyParam = {
        nickname: nickname
    }
    var User=factory("user");
    User.save({"_id":uid},bodyParam, function (ret, err) {
        if (ret) {
            //update personal center
            api.execScript({
                name: 'setting',
                frameName: 'setting-con',
                script: 'init();'
            });

            api.execScript({
                name: 'root',
                frameName: 'user',
                script: 'updateInfo();'
            });

            setTimeout(function () {
                api.alert({
                    msg: '修改成功'
                }, function (ret, err) {
                    api.closeWin();
                });
            }, 200);

        } else {
            api.toast({msg: err.msg})
        }
    })
}

apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);

    var nickname = api.pageParam.nickname || '';
    $api.byId('nickname').value = nickname;
};