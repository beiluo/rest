function initSlide() {
	var slide = $api.byId('slide');
	var pointer = $api.domAll('#pointer a');
	window.mySlide = Swipe(slide, {
		// startSlide: 4,
		auto : 5000,
		continuous : true,
		disableScroll : true,
		stopPropagation : true,
		callback : function(index, element) {
			$api.addCls(pointer[index], 'active');
			var actPoint = $api.dom('#pointer a.active');
			$api.removeCls(actPoint, 'active');

		},
		transitionEnd : function(index, element) {

		}
	});
}

function getBanner(id) {
	api.showProgress({
		title : '加载中...',
		modal : false
	});
	var getTabBarBannerUrl = '/tabBar?filter=';
	var urlParam = {
		include : ["banner"],
		where : {
			id : id
		}
	};
	var TabBar = factory("tabBar");
	TabBar.query({
		filter : urlParam
	}, function(ret, err) {
		if (ret) {
			var content = $api.byId('banner-content');
			var tpl = $api.byId('banner-template').text;
			var tempFn = doT.template(tpl);
			content.innerHTML = tempFn(ret[0].banner);
			initSlide();
		} else {
			api.toast({
				msg : err.msg,
				location : 'middle'
			})
		}
	})
}

function openNews(el, type) {
	type = type || 't';

	var newsId = $api.attr(el, 'newsId');
	//text news
	if (type === 't') {
		api.openWin({
			name : 'news-text',
			url : 'news-text.html',
			pageParam : {
				newsId : newsId
			},
			opaque : true,
			vScrollBarEnabled : false
		});
	} else if (type === 'p') {//picture news
		api.openWin({
			name : 'news-pic',
			url : 'news-pic.html',
			pageParam : {
				newsId : newsId
			},
			opaque : true,
			vScrollBarEnabled : false
		});

	} else if (type === 'v') {//video news

		api.openWin({
			name : 'news-video',
			url : 'news-video.html',
			opaque : true,
			vScrollBarEnabled : false,
			pageParam : {
				newsId : newsId
			}
		});

		event.preventDefault();
	}

}

function initPage(id) {
	var urlParam = {
		include : ["news"],
		where : {
			id : id
		}
	};
	var TabBar = factory("tabBar");
	TabBar.query({
		filter : urlParam
	}, function(ret, err) {
		if (ret) {
			var obj = $api.byId('txtNewsList');
			var html = '';
			for (var i = 0, len = ret[0].news.length; i < len; i++) {
				var thisItem = ret[0].news[i];
				var nType = thisItem.type;
				if (nType === 'p') {
					var pic = thisItem.pics;
					var picArr = pic.split(',');
					html += '<li class="pic"><h2>' + thisItem.title + '</h2><div class="p">';
					for (var j = 0; j < 3; j++) {
						html += '<a tapmode="" style="background-image:url(' + picArr[j] + ')" newsId="' + thisItem.id + '" onclick="openNews(this, \'p\');">';
						html += '</a>';
					}
					html += '</div></li>';
				} else {
					html += '<li class="' + nType + '"><a tapmode="active" newsId="' + thisItem.id + '" onclick="openNews(this, \'' + nType + '\');"><img src="' + thisItem.img.url + '" />';
					html += '<div class="content"><h2>' + thisItem.title + '</h2><p>' + thisItem.summary + '</p></div></a></li>';
				}
			}
			$api.html(obj, html);
			api.hideProgress();
			//init tapmode
			api.parseTapmode();
		} else {
			api.toast({
				msg : err.msg,
				location : 'middle'
			})
		}
		api.hideProgress();
	})
}

apiready = function() {

	getBanner(api.pageParam.tid);
	initPage(api.pageParam.tid);

	//pull to refresh
	api.setRefreshHeaderInfo({
		visible : true,
		// loadingImgae: 'wgt://image/refresh-white.png',
		bgColor : '#f2f2f2',
		textColor : '#4d4d4d',
		textDown : '下拉刷新...',
		textUp : '松开刷新...',
		showTime : true
	}, function(ret, err) {
		getBanner(api.pageParam.tid);
		initPage(api.pageParam.tid);
		api.refreshHeaderLoadDone();
	});
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		//getBanner(api.pageParam.tid);
		//initPage(api.pageParam.tid);
	});
}; 