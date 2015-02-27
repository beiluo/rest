apiready = function() {
	
    var dataId = api.pageParam.dataId; //活动id
    api.openFrame({
        name: 'actDetail-con',
        url: 'actDetail-con.html',
        pageParam:{dataId: dataId},
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        bounces: true,
        opaque: true,
        vScrollBarEnabled: false
    });

    //for iOS7 +
    var sys, ver, height = 44;
    sys = api.systemType;
    if (sys === 'ios') {
        ver = api.systemVersion;
        ver = parseInt(ver, 10);
        if (ver >= 7) {
            height += 20;
        }
    }

    api.openFrame({
        name: 'actDetail-head',
        url: 'actDetail-head.html',
        rect: {
            x: 0,
            y: 0,
            w: api.winWidth,
            h: height
        },
        bounces: false,
        vScrollBarEnabled: false
    });

};
