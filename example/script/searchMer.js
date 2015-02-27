var body = $api.dom('body');
$api.addEvt(body, 'touchend', function (e) {
    var main = $api.dom('#main');
    var wrap = $api.dom('#wrap');

    if (!$api.contains(main, e.target) || !$api.contains(wrap, e.target)) {
        api.execScript({
            name: 'life-list',
            script: 'closeFramGroup();'
        });
    }
});


function searchMerArea(id) {
    if (!id) {
        return;
    }

    /*var that = $api.dom(event.target, 'span');
     var txt = $api.text(that);
     api.execScript({
     name: 'life-list',
     script: 'changeCityTab("' + txt + '");'
     });
     */
    api.execScript({
        frameName: 'life-listCon',
        script: 'getDataByFilter("city", "' + id + '");'
    });
}

function searchMerType(id) {
    if (!id) {
        return;
    }
    /*var that = $api.dom(event.target, 'span');
     var txt = $api.text(that);
     api.execScript({
     name: 'life-list',
     script: 'changeTypeTab("' + txt + '");'
     });*/
    api.execScript({
        frameName: 'life-listCon',
        script: 'getDataByFilter("type", "' + id + '");'
    });

}
apiready = function () {
    var cityCon = $api.byId('city-content');
    var typeCon = $api.byId('type-content');
    if (cityCon) {
        var City=factory("city");
        City.get(function (ret, err) {
            if (ret) {
                var content = $api.byId('city-content');
                var tpl = $api.byId('city-template').text;
                var tempFn = doT.template(tpl);
                content.innerHTML = tempFn(ret);
                api.parseTapmode();
            } else {
                api.toast({
                    msg: err.msg
                })
            }
        })
    }
    if (typeCon) {
        var urlParam = {
            where: {category: api.pageParam.type}
        }
        var Type=factory("type");
        Type.query({filter:urlParam}, function (ret, err) {
            if (ret) {
                var content = $api.byId('type-content');
                var tpl = $api.byId('type-template').text;
                var tempFn = doT.template(tpl);
                content.innerHTML = tempFn(ret);
                api.parseTapmode();
            } else {
                api.toast({
                    msg: err.msg
                })
            }
            api.hideProgress();
        })
    }
};