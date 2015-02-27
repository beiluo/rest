function openLifeDetail(title,type){
    api.openWin({
        name: 'life-list',
        url: 'life-list.html',
        opaque: true,
        vScrollBarEnabled: false,
        pageParam:{title:title,type:type}
    });
}
