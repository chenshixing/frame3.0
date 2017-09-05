/**!
 * iframe嵌套跨域 高度自适应
 * @author: tommyshao <jinhong.shao@frontpay.cn>
 * @copyright www.frontpay.cn
 * @date:   2015-06-18
 * @update: 2015-09-24
 */
~(function(root, d, undefined){
  // 配置proxyUrl地址
  if(!root['proxyUrl']) return;
  var proxyUrl = root['proxyUrl'], proxyIframe;
  var parent = root.top;
  var isFrame = root != parent;
  function setIframeHeight(height){
    // 不被iframe嵌套时不操作
    if(!isFrame) return;
    var oBody = d.body;

    if(!proxyIframe){
      var container = d.createElement("div");
      var docHeight = d.body.scrollHeight;
      container.innerHTML = '<iframe style="display:none;" src="'+ proxyUrl +'#height='+ docHeight +'" scrolling="no" height="0" width="0"></iframe>';
      proxyIframe = container.firstChild;
      oBody.appendChild(proxyIframe);
    } else {
      if(height) proxyIframe.src = proxyUrl+'#height='+height;
    }
  }

  // 隐藏滚动条
  function setStyle(){
    var cssText = 'html,body{ overflow-y: hidden;}';
    var oHead = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if(style.styleSheet) {
      try{
        style.styleSheet.cssText = cssText;
      }catch(e){}
    } else{
      var textNode = document.createTextNode(cssText);
      style.appendChild(textNode);
    }

    oHead.appendChild(style);
  }




  var loaded = function(element, fn, context){
    if(element.attachEvent){ // ie
      element.attachEvent("onload", function(){
        fn.call(context, element);
      });
    }else{
      element.onload = function(){
        fn.call(context, element);
      };
    }
  };

  if(isFrame){
    setStyle();
    loaded(window, function(){
      setIframeHeight();
    })
  }
})(window, document);
