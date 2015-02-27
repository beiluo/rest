function initSlide() {
	var slide = $api.byId('slide');
	var pointer = $api.domAll('#pointer a');
	window.mySlide = Swipe(slide, {
		// startSlide: 2,
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

function openActDetail(did) {
	api.openWin({
		name : 'actDetail',
		url : 'actDetail.html',
		pageParam : {
			dataId : did
		}
	});
}

function openLifeDetail(title, type) {
	api.openWin({
		name : 'life-list',
		url : 'life-list.html',
		opaque : true,
		vScrollBarEnabled : false,
		pageParam : {
			title : title,
			type : type
		}
	});
}

function getData(id) {
	var urlParam = {
		include : ["activity"],
		where : {
			id : id
		}
	};
	var TabBar = factory("tabBar");
	TabBar.query({
		filter : urlParam
	}, function(ret, err) {
		if (ret) {
			var content = $api.byId('act-content');
			var tpl = $api.byId('act-template').text;
			var tempFn = doT.template(tpl);
			content.innerHTML = tempFn(ret[0].activity);
		} else {
			api.alert({
				msg : err.msg
			});
		}
		api.hideProgress();
	})
}

function getBanner(id) {
	api.showProgress({
		title : '加载中...',
		modal : false
	});
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
			api.alert({
				msg : err.msg
			});
		}
	})
}

apiready = function() {
	getBanner(api.pageParam.tid);
	getData(api.pageParam.tid);
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
		getData(api.pageParam.tid);
		api.refreshHeaderLoadDone();
	});

	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		//getBanner(api.pageParam.tid);
		// getData(api.pageParam.tid);
	});

}; 