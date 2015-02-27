apiready = function(){
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
    var pos = $api.offset(header);
    
    var dataId = api.pageParam.dataId;
    api.openFrame({
        name: 'restaurant-con',
        url: 'restaurant-con.html',
        pageParam:{dataId: dataId},
        rect:{
          x: 0,
          y: pos.h,
          w: 'auto',
          h: 'auto'
        },
        bounces: false,
        opaque: true,
        vScrollBarEnabled: false
    });

};