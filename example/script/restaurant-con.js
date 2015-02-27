function initBanner() {
    /*var banner = $api.byId('banner');
     var bannerUrl = $api.attr(banner, 'rel');
     $api.css(banner, 'background-image:url(' + bannerUrl + ')');*/

//	var pos = $api.offset(banner);
//	var content = $api.byId('content');
//	
//	var hammer = new Hammer(content);
//	hammer.get('pan').set({
//	    direction: Hammer.DIRECTION_VERTICAL
//	});
//	hammer.on('pandown', function(ev) {
//	    var distance = ev.distance;
//	    var h = pos.h + parseInt(distance, 10);
//	    $api.css(banner, 'height:' + h + 'px;');
//	});
//	hammer.on('panend', function(ev) {
//	    $api.css(banner, 'height: 150px;');
//	});

}

function call(el) {
    var num = $api.attr(el, 'rel');
    api.call({
        type: 'tel_prompt',
        number: num
    });
}

function openAlbum(imgs) {
    var arr = imgs.split(",");


    if (arr.length > 0) {
        var obj = api.require('imageBrowser');
        obj.openImages({
            imageUrls: arr,
            activeIndex: 0,
            showList: false
        });
    }

}

apiready = function () {


    var dataId = api.pageParam.dataId;


    var urlParam = {
        where: {
            id: dataId
        },
        include: ["pics", "cityPointer", "typePointer"],
        includefilter: {file: {fields: ["url"]}}
    };

    api.showProgress({
        title: '加载中...',
        modal: false
    });
    var Merchant=factory("merchant");
    Merchant.query({filter:urlParam}, function (ret, err) {
        if (ret) {
            var pics = ret[0].pics;
            var picArr = [];
            for (var i in pics) {
                picArr[i] = pics[i].url;
            }
            var content = $api.byId('res-content');
            var tpl = $api.byId('res-template').text;
            var tempFn = doT.template(tpl);
            ret[0].pic = picArr;
            content.innerHTML = tempFn(ret[0]);

            initBanner();
            api.hideProgress();
            api.parseTapmode();
        } else {
            api.toast({
                msg: err.msg
            })
        }
        api.hideProgress();
    });
}
