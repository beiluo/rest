//previous page id, current page id
var prevPid = '', curPid = '';
//save opened frame name
var frameArr = [];

//frame whether open
function isOpened(frmName){
    var i = 0, len = frameArr.length;
    var mark = false;
    for(i; i<len; i++){
        if(frameArr[i] === frmName){
            mark = true;
            return mark;
        }
    }
    return mark;
}

//toggle header
function showHeader(type){
    if(!type){return;}
    var header = $api.dom('#header .active');
    $api.removeCls(header,'active');
    var thisHeader = $api.dom('#header .'+type);
    $api.addCls(thisHeader,'active');
}

//open tab
function openTab(type,tid){
    
    if(type === 'user'){
    	//login
	    var uid = $api.getStorage('uid');
		if(!uid){
			api.openWin({
		        name: 'userLogin',
		        url: './html/userLogin.html',
		        opaque: true,
		        vScrollBarEnabled:false
		    });
		    return;
		}
    }
    
    showHeader(type);
    var width = api.winWidth;
    var nav = $api.byId('nav');
    var navPos = $api.offset(nav);
    var header = $api.byId('header');
    var headerPos = $api.offset(header);
    var height = api.winHeight - navPos.h - headerPos.h;
    
    type = type || 'main';

    var actTab = $api.dom('#nav .active');
    $api.removeCls(actTab,'active');
    var thisTab = $api.dom('#nav .'+ type);
    thisTab = thisTab.parentNode;
    $api.addCls(thisTab,'active');

    //record page id
    prevPid = curPid;
    curPid = type;
    if(prevPid !== curPid){

        // alert(type+':'+isOpened(type));
    
        if(isOpened(type)){
            api.setFrameAttr({
                name: type,
                hidden: false
            });
        }else{
            api.openFrame({
                name: type,
                url: 'html/'+ type +'.html',
                bounces: true,
                opaque: true,
                vScrollBarEnabled: false,
                pageParam:{ headerHeight: headerPos.h,tid:tid},
                rect: {
                    x: 0,
                    y: headerPos.h,
                    w: width,
                    h: height
                }
            });
        }

        if(prevPid){
            api.setFrameAttr({
                name: prevPid,
                hidden: true
            });
            
        }

        if(!isOpened(type)){
            //save frame name
            frameArr.push(type);
        }
        
    }
    
}

function changeCityTab(str){
    if(str){
        var title = $api.dom('#header .activity .city span');
        $api.text(title, str);
    }
}

function changeTypeTab(str){
    if(str){
        var title = $api.dom('#header .activity .hot span');
        $api.text(title, str);
    }
}

//search activity
var searchActOpened = false;

function closeFramGroup(){
    api.closeFrameGroup({
        name: 'searchAct'
    });

    var actLi = $api.dom('#header .activity li.active');
    $api.removeCls(actLi,'active');
    searchActOpened = false;
}

//search activity
function searchAct(el,type){
    if(!el || !type){return;}

    var header = $api.byId('header');
    var pos = $api.offset(header);

    var index = 0;  //frame group index
    if(type === "type"){
        index = 1;
    }

    if(!searchActOpened){
        api.openFrameGroup ({
            name: 'searchAct',
            scrollEnabled: false,
            rect:{x: 0, y: pos.h, w: 'auto', h: 'auto'},
            index: index,
            frames:[{
                name: 'searchActBy-city',
                url: 'html/searchActBy-city.html',
                bounces: false,
                opaque: false,
                bgColor: 'rgba(51,51,51,0.6)',
                vScrollBarEnabled: false
            },{
                name: 'searchActBy-type',
                url: 'html/searchActBy-type.html',
                bounces: false,
                opaque: false,
                bgColor: 'rgba(51,51,51,0.6)',
                vScrollBarEnabled:false
            }]
        }, function(ret, err){
            
        });

        searchActOpened = true;
    }else{
        api.setFrameGroupIndex ({
            name: 'searchAct',
            index: index
            // ,scroll: true
        });
        api.setFrameGroupAttr({
            name: 'searchAct',
            hidden: false
        });
    }

    //toggle active style
    var curLi = el.parentNode;
    //close frame group
    if($api.hasCls(curLi,'active')){
        
        api.setFrameGroupAttr({
            name: 'searchAct',
            hidden: true
        });
        
    }
    $api.toggleCls(curLi,'active');

    var lis = $api.domAll('#header .activity li');
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

function setting(){
    api.openWin({
        name: 'setting',
        url: 'html/setting.html',
        opaque: true,
        vScrollBarEnabled:false
    });
}

function filterNews(type){
	var nav = $api.dom('#header .news .submenu');
	var actNav = $api.dom(nav, '.light');
	$api.removeCls(actNav, 'light');
	$api.addCls(event.target, 'light');
	var id='548ec1f272c60e937d21c8cf';

	switch (type){
		case 'hot':
			api.execScript({
				frameName: 'news',
	            script: 'initPage(\''+id+'\');'
            });
			break;
		case 'local':
			api.execScript({
				frameName: 'news',
	            script: 'initPage(\''+id+'\');'
            });
			break;
		case 'topic':
			api.execScript({
				frameName: 'news',
	            script: 'initPage(\''+id+'\');'
            });
			break;
	}
}

function scan(){
	var obj = api.require('scanner');
	obj.open(function(ret,err) {
		var resUrl = ret.msg;
		if(!resUrl){return;}
		
	    api.openApp({
	        iosUrl: resUrl,
	        androidPkg: 'android.intent.action.VIEW',
	        mimeType: 'text/html',
	        uri: resUrl
	    }, function (ret, err) {
			
	    });
	    
	});
}

apiready = function(){
    var header = $api.byId('header');
    $api.fixIos7Bar(header);

    //status bar style
    api.setStatusBarStyle({
        style: 'light'
    });
    openTab('main','548ec1e708d4718e7d771bbe');
};