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

function getBanner() {
	api.showProgress({
		title : '加载中...',
		modal : false
	});

	var Activity = factory("activity");
	Activity.get(function(ret, err) {
		if (ret) {
			var content = $api.byId('banner-content');
			var tpl = $api.byId('banner-template').text;
			var tempFn = doT.template(tpl);
			content.innerHTML = tempFn(ret);
			initSlide();
		} else {
			alert(JSON.stringify(err))
		}
		api.hideProgress();
	})
}

function getData() {

	api.showProgress({
		title : '加载中...',
		modal : false
	});
	var Activity = factory("activity");
	Activity.get(function(ret, err) {
		if (ret) {
			var content = $api.byId('act-content');
			var tpl = $api.byId('act-template').text;
			var tempFn = doT.template(tpl);
			content.innerHTML = tempFn(ret);
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

//filter data
function getDataByFilter(filter, id) {
	if (!id || !filter) {
		return;
	}
	api.showProgress({
		title : '加载中...',
		modal : false
	});
	var urlParam = {}, whereParam = {};
	whereParam[filter] = id;
	whereParam['category'] = 4;
	urlParam['where'] = whereParam;
	var getActivityByIdUrl = '/activity?filter=';
	var Activity = factory("activity");
	Activity.query({
		filter : urlParam
	}, function(ret, err) {
		if (ret) {
			var content = $api.byId('act-content');
			var tpl = $api.byId('act-template').text;
			var tempFn = doT.template(tpl);
			content.innerHTML = tempFn(ret);
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

function openActDetail(did) {
	api.openWin({
		name : 'actDetail',
		url : 'actDetail.html',
		//		delay: 200,
		pageParam : {
			dataId : did
		}
	});
}

apiready = function() {
	getBanner();
	getData();
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
		getBanner();
		getData();
		api.refreshHeaderLoadDone();
	});

	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		//getBanner();
		//getData();
	});
}; 