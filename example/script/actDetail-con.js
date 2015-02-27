var fav = false;
apiready = function () {

    api.showProgress({
        title: '加载中...',
        modal: false
    });


    var dataId = api.pageParam.dataId; //activity id

    var urlParam = {
        where: {
            id: dataId
        }
    };
    var Activity=factory("activity");
    Activity.query({filter:urlParam},function (ret, err) {
        if (ret) {
            var content = $api.byId('act-detail');
            var tpl = $api.byId('act-template').text;
            var tempFn = doT.template(tpl);
            content.innerHTML = tempFn(ret[0]);
            var picLen = ret[0].pics.split(',').length;
            if (picLen >= 4) {
                //carousel
                $('#picture').carousel();
            }
            $("#activeId").off('click').on('click', function () {
                collect(this, 'act_fav');
            })
            var uid = $api.getStorage('uid');
            if (uid) {
                var act_urlParam = {
                    fields: {"act_fav": true},
                    include: ["act_fav"],
                    where: {
                        id: uid
                    }
                };
                var User=factory("user");
                User.query({filter:act_urlParam}, function (ret, err) {
                    if (ret) {
                        var act_favArr = ret[0].act_fav;
                        for (var i = 0; i < act_favArr.length; i++) {
                            if (act_favArr[i].activity == api.pageParam.dataId) {
                                fav = true;
                                if (fav) {
                                    $api.html($api.byId('activeId'), "已收藏");
                                    $("#activeId").off('click').on('click', function () {
                                        uncollect('act_fav', act_favArr[i].id, this);
                                    })
                                }
                                break;
                            }
                        }

                    } else {
                        api.toast({msg: err.msg, location: 'middle'})
                    }

                })

            }
        } else {
            api.toast({msg: err.msg, location: 'middle'})
        }
        api.hideProgress();
    });


};