   var body = $api.dom('body');
   var contains = function(parent, el) {
       var mark = false;
       if (el === parent) {
           mark = true;
           return mark;
       } else {
           do {
               el = el.parentNode;
               if (el === parent) {
                   mark = true;
                   return mark;
               }
           } while (el === document.body || el === document.documentElement);

           return mark;
       }
   };
   $api.addEvt(body, 'touchend', function(e) {
       var main = $api.dom('#main');
       var wrap = $api.dom('#wrap');
       if (!contains(main, e.target) || !contains(wrap, e.target)) {
           api.execScript({
               name: 'root',
               script: 'closeFramGroup();'
           });
       }
   });



function searchActArea(id) {
    if(!id){return;}
    //change title
    /*var that = $api.dom(event.target, 'span');
    var txt = $api.text(that);
    api.execScript({
		name: 'root',
		script: 'changeCityTab("'+ txt +'");'
    });*/
    //update content
    api.execScript({
		frameName: 'activity',
		script: 'getDataByFilter("city", "'+ id +'");'
    });
    
}


function searchActType(id) {
	if(!id){return;}
    //change title
   /* var that = $api.dom(event.target, 'span');
    var txt = $api.text(that);
    api.execScript({
		name: 'root',
		script: 'changeTypeTab("'+ txt +'");'
    });*/
    api.execScript({
		frameName: 'activity',
		script: 'getDataByFilter("type", "'+ id +'");'
    });
    
}
apiready = function() {

    var cityCon = $api.byId('city-content');
    var typeCon = $api.byId('type-content');
    if (cityCon) {
        var City=factory("city");
        City.get(function (ret, err) {
            if (ret) {
                var content = $api.byId('city-content');
                var tpl = $api.byId('city-template').text;
                var tempFn = doT.template(tpl);
                content.innerHTML = tempFn(ret);
                api.parseTapmode();
            } else {
                api.toast({
                    msg: err.msg
                })
            }
        })
    }
    if (typeCon) {
        var urlParam={
            where:{category:4}
        }
        var Type=factory('type');
        Type.query({filter:urlParam}, function (ret, err) {
            if (ret) {
                var content = $api.byId('type-content');
                var tpl = $api.byId('type-template').text;
                var tempFn = doT.template(tpl);
                content.innerHTML = tempFn(ret);
                api.parseTapmode();
            } else {
                api.toast({
                    msg: err.msg
                })
            }
            api.hideProgress();
        })
    }

};


