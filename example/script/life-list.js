var opened = false;

function closeFramGroup(){
    api.closeFrameGroup({
        name: 'searchMer'
    });

    var actLi = $api.dom('#main .submenu li.active');
    $api.removeCls(actLi,'active');
    opened = false;
}

function searchMer(el,type){
    if(!el || !type){return;}

    var header = $api.byId('main');
    var pos = $api.offset(header);

    var index = 0;  //frame group index
    if(type === "type"){
        index = 1;
    }

    if(!opened){
        api.openFrameGroup ({
            name: 'searchMer',
            scrollEnabled: false,
            rect:{x: 0, y: pos.h, w: 'auto', h: 'auto'},
            index: index,
            frames:[{
                name: 'searchMerBy-city',
                url: 'searchMerBy-city.html',
                bounces: false,
                opaque: false,
                bgColor: 'rgba(51,51,51,0.6)',
                vScrollBarEnabled: false
            },{
                name: 'searchMerBy-type',
                url: 'searchMerBy-type.html',
                bounces: false,
                opaque: false,
                bgColor: 'rgba(51,51,51,0.6)',
                vScrollBarEnabled:false,
                pageParam:{type:api.pageParam.type}
            }]
        }, function(ret, err){
            
        });

        opened = true;
    }else{
        api.setFrameGroupIndex ({
            name: 'searchMer',
            index: index
            // ,scroll: true
        });
        api.setFrameGroupAttr({
            name: 'searchMer',
            hidden: false
        });
    }

    //toggle active style
    var curLi = el.parentNode;
    //close frame group
    if($api.hasCls(curLi,'active')){
        
        api.setFrameGroupAttr({
            name: 'searchMer',
            hidden: true
        });
        
    }
    $api.toggleCls(curLi,'active');

    var lis = $api.domAll('#main .submenu li');
    var i = 0, len = lis.length;

    for(i; i<len; i++){
        var thisLi = lis[i];
        if(thisLi === curLi){
            continue;
        }else{
            if($api.hasCls(thisLi,'active')){
                $api.removeCls(thisLi,'active');
            }
        }
    }

}

function changeCityTab(str){
    if(str){
        var title = $api.dom('#submenu .city span');
        $api.text(title, str);
    }
}

function changeTypeTab(str){
    if(str){
        var title = $api.dom('#submenu .type span');
        $api.text(title, str);
    }
}

apiready = function(){
    var header = $api.byId('main');
    $api.fixIos7Bar(header);
    var pos = $api.offset(header);
    var h1=$api.dom(header,'h1');
    $api.html(h1,api.pageParam.title);
    api.openFrame({
        name: 'life-listCon',
        url: 'life-listCon.html',
        rect:{
          x: 0,
          y: pos.h + 4,
          w: 'auto',
          h: 'auto'
        },
        bounces: true,
        opaque: true,
        vScrollBarEnabled: false,
        pageParam:{
            type:api.pageParam.type
        }
    });
};