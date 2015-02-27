//var avatar = $api.dom('#avatar img');
//var url = avatar.src;
//var cover = $api.dom('#cover');
//var pos = $api.offset(cover);
//var coverImg = $api.dom('#cover .cover');
//coverImg.src = url;
//var css = 'width:'+ pos.w +'px; height:'+ pos.h +'px;';
//$api.css(coverImg,css);

//function openActDetail(){
//api.openWin({
//  name: 'actDetail',
//  url: 'actDetail.html',
//  delay: 400
//});
//}
function openNewDetail(type, did) {
    var name = ''
    switch (type) {
        case 't':
            name = 'news-text';
            break;
        case 'v':
            name = 'news-video';
            break;
    }
    api.openWin({
        name: name,
        url: name + '.html',
        pageParam: {newsId: did}
    });
}


function openActDetail(did) {
    api.openWin({
        name: 'actDetail',
        url: 'actDetail.html',
//		delay: 200,
        pageParam: {dataId: did}
    });
}

function openMer(did) {
    api.openWin({
        name: 'restaurant',
        url: 'restaurant.html',
        opaque: true,
        pageParam: {dataId: did},
        vScrollBarEnabled: false
    });
}

//init personal center
function initPersonalCenter(json) {
    api.showProgress({
        title: '加载中...',
        modal: false
    });
    json = json || {};
    if (!json.nickname) {
        return;
    }

    var uid = $api.getStorage('uid');
    var act_urlParam = {
        include: ["act_fav", "news_fav", "mer_fav"],
        where: {
            id: uid
        }
    };
    var User=factory("user");
    User.query({filter:act_urlParam}, function (ret, err) {
        if (ret) {
            var pc = api.require('personalCenter');
            var headerH = api.pageParam.headerHeight;
            var photo = json.photo || 'widget://image/userTitle.png';
            var point = json.point || 0;
            var actFav = ret[0].act_fav.length || 0;
            var merFav = ret[0].mer_fav.length || 0;
            var newsFav = ret[0].news_fav.length || 0;

            var actFavArr = [], merFavArr = [], newsFavArr = [];
            for (var i in ret[0].act_fav) {
                actFavArr[i] = ret[0].act_fav[i].activity;
            }
            for (var i in ret[0].mer_fav) {
                merFavArr[i] = ret[0].mer_fav[i].merchant;
            }
            for (var i in ret[0].news_fav) {
                newsFavArr[i] = ret[0].news_fav[i].news;
            }
            localStorage.setItem('actFavArr', actFavArr);
            localStorage.setItem('merFavArr', merFavArr);
            localStorage.setItem('newsFavArr', newsFavArr);
            pc.open({
                y: 0,
                height: 200,
                fixedOn: 'user',
                fixed: true,
                imgPath: photo,
                placeHoldImg: photo,
                showLeftBtn: false,
                showRightBtn: false,
                username: json.nickname,
                count: point,
                modButton: {
                    bgImg: 'widget://image/edit.png',
                    lightImg: 'widget://image/edit.png'
                },
                btnArray: [
                    {
                        bgImg: 'widget://image/personal_btn_nor.png',
                        lightImg: 'widget://image/personal_btn_light.png',
                        selectedImg: 'widget://image/personal_btn_sele.png',
                        title: '活动收藏',
                        count: actFav,
                        titleColor: '#ffffff',
                        titleLightColor: '#55abce',
                        countColor: '#ffffff',
                        countLightColor: '#55abce'
                    },
                    {
                        bgImg: 'widget://image/personal_btn_nor.png',
                        lightImg: 'widget://image/personal_btn_light.png',
                        selectedImg: 'widget://image/personal_btn_sele.png',
                        title: '商家收藏',
                        count: merFav,
                        titleColor: '#ffffff',
                        titleLightColor: '#55abce',
                        countColor: '#ffffff',
                        countLightColor: '#55abce'
                    },
                    {
                        bgImg: 'widget://image/personal_btn_nor.png',
                        lightImg: 'widget://image/personal_btn_light.png',
                        selectedImg: 'widget://image/personal_btn_sele.png',
                        title: '新闻收藏',
                        count: newsFav,
                        titleColor: '#ffffff',
                        titleLightColor: '#55abce',
                        countColor: '#ffffff',
                        countLightColor: '#55abce'
                    }
                ]
            }, function (ret, err) {


                $api.byId('activity').innerHTML = '';
                if (ret.click === 0) {
                    getFavData('activity', localStorage.getItem('actFavArr'));
                }
                if (ret.click === 1) {
                    getFavData('merchant', localStorage.getItem('merFavArr'));
                }
                if (ret.click === 2) {
                    getFavData('news', localStorage.getItem('newsFavArr'));
                }
            });
            api.hideProgress();
            getFavData('activity', localStorage.getItem('actFavArr'));
        } else {
            api.toast({msg: err.msg, location: 'middle'})
            api.hideProgress();
        }

    })
}


function getFavData(type, ids) {
    var arr = ids.split(',');
    var urlParam = {
        where: {
            id: {
                inq: arr
            }
        }
    };
    var Type=factory("type");
    Type.query({filter:urlParam}, function (ret, err) {
        switch (type) {
            case 'activity':
                activityCallBack(ret, err);
                break;
            case 'merchant':
                merchantCallBack(ret, err)
                break;
            case 'news':
                newsCallBack(ret, err)
                break;
        }
    })
}

function activityCallBack(ret, err) {
    if (ret) {
        var data = {};
        data.favType = 'act';
        data.ret = ret;
        var content = $api.byId('activity');
        var tpl = $api.byId('template').text;
        var tempFn = doT.template(tpl);
        $api.byId('activity').innerHTML = '';
        $api.append(content, tempFn(data));
    } else {
        alert(JSON.stringify(err))
    }
}
function merchantCallBack(ret, err) {
    if (ret) {
        var content = $api.byId('activity');
        var tpl = $api.byId('template').text;
        var tempFn = doT.template(tpl);
        $api.byId('activity').innerHTML = '';
        $api.append(content, tempFn(data));
    } else {
        alert(JSON.stringify(err))
    }
}
function newsCallBack(ret, err) {
    if (ret) {
        var data = {};
        data.favType = 'news';
        data.ret = ret;
        var content = $api.byId('activity');
        var tpl = $api.byId('template').text;
        var tempFn = doT.template(tpl);
        $api.byId('activity').innerHTML = '';
        $api.append(content, tempFn(data));
    } else {
        alert(JSON.stringify(err))
    }
}


function init() {
    var photoUrl = 'http://file.apicloud.com/mcm/A6965864070945/91f4a5f93b962c7c0f4e83effc4973fd.png';
    initPersonalCenter({
        nickname: 'APICloud',
        photo: photoUrl,
        point: 0
    });
}

function updateInfo() {
    var pc = api.require('personalCenter');
    pc.close();
    init();
}

apiready = function () {

    init();

};

