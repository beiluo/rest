
apiready = function(){
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
	
	var newsId = api.pageParam.newsId;
    var pos = $api.offset(header);
    api.openFrame({
        name: 'news-textCon',
        url: 'news-textCon.html',
        pageParam: {newsId: newsId},
        rect:{
            x: 0,
            y: pos.h,
            w: 'auto',
            h: 'auto'
        },
        bounces: true,
        vScrollBarEnabled: false
    });
};