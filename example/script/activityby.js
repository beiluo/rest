var slide = $api.byId('slide');
var pointer = $api.domAll('#pointer a');
window.mySlide = Swipe(slide, {
  // startSlide: 4,
  auto: 5000,
  continuous: true,
  disableScroll: true,
  stopPropagation: true,
  callback: function(index, element) {
    var actPoint = $api.dom('#pointer a.active');
    $api.removeCls(actPoint,'active');
    $api.addCls(pointer[index],'active');
  },
  transitionEnd: function(index, element) {
  }
});

function openActDetail(){
  api.openWin({
    name: 'actDetail',
    url: 'actDetail.html',
    delay: 400
  });
}