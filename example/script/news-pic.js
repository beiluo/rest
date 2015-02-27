function initSlide() {
    var slide = $api.byId('slide');

    var wrap = $api.dom(slide, '.swipe-wrap');
    wrap.style.width = api.winWidth + 'px';
    wrap.style.height = api.winHeight + 'px';

    var pointer = $api.domAll('#pointer a');
    window.mySlide = Swipe(slide, {
        // continuous: true,
        disableScroll: true,
        stopPropagation: true,
        callback: function (index, element) {
            var pointer = $api.dom('#pointer em');
            index++;
            $api.text(pointer, index);
        },
        transitionEnd: function (index, element) {
        }
    });
}


//toggle show button
function toggleTxt(el) {
    var pointer = $api.byId('pointer');
    var label = $api.domAll('#slide div label');
    if ($api.hasCls(el, 'show')) {
        $api.text(el, '隐藏文字');
    } else {
        $api.text(el, '显示文字');
    }
    $api.toggleCls(el, 'show');
    $api.toggleCls(pointer, 'hide');
    var i = 0, len = label.length;
    for (i; i < len; i++) {
        $api.toggleCls(label[i], 'hide');
    }
}

function closeWin() {
    api.closeWin();
    //api.setFullScreen({fullScreen: false});
}

apiready = function () {
    var newsId = api.pageParam.newsId;
    var getNewsByIdUrl = '/news/?filter=';
    var urlParam = {where: {id: newsId}};

    api.showProgress({
        title: '加载中...',
        modal: false
    });
    var News=factory("news");
    News.query({filter:urlParam}, function (ret, err) {
        if (ret) {
            var pics = ret[0].pics.split(',');
            var picsContent = ret[0].content;
            var picArr = [];

            for (var i = 0; i < pics.length; i++) {
                picArr.push({
                    url: pics[i],
                    content: picsContent
                });
            }
            var content = $api.byId('slide');
            var tpl = $api.byId('banner-template').text;
            var tempFn = doT.template(tpl);
            content.innerHTML = tempFn(picArr);

            initSlide();

            api.hideProgress();
            api.parseTapmode();

        } else {
            api.toast({msg: err.msg, location: 'middle'})
        }
        api.hideProgress();
    });
};