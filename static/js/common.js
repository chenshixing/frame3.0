/**!
 * 页面共同部分
 * by frontpay F2E Team
 * created on 2015-08-25
 */

// 判断IE版本
var isIE = (function(){
    return function(ver) {
        var b = document.createElement('b');
        b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
        return b.getElementsByTagName('i').length === 1;
    }
})();

// 判断至少IE几
var detectIE = (function() {
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    return function() {
      if(!isIE) return -1;
      if (document.documentMode) {
        return document.documentMode;
      } else {
        for (var i = 12; i > 0; i--) {
          var div = document.createElement("div");
          div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";
          if (div.getElementsByTagName("span").length) {
            return i;
          }
        }
      }
      return false;
    }
})();

~(function($) {

    // 判断IE版本
    /*var isIE = function(ver){
      var b = document.createElement('b');
      b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
      return b.getElementsByTagName('i').length === 1;
    };*/

    var App = {
        // 页面初始化
        initPage: function(){
            for(var i in App) {
                i != 'initPage' && typeof App[i] === 'function' && App[i]();
            }
        },
        // 提现金额展开隐藏
        amountRemind: function(){
            $("#sh").on('click', function(){
                var isOpen = $(this).data('isOpen'), strText = $(this).text(), strLabel = $(this).data('label'), target = $(this).data('target');
                if(isIE(7)) { // i7 bug
                  $("#arb")[isOpen ? 'hide': 'show']();
                  $(target).slider('init');
                } else {
                  $("#arb")[isOpen ? 'slideUp': 'slideDown'](function(){
                    //console.log(target);
                    if($(this).is(':visible')) {
                      $(target).slider('init');
                    }
                  });
                }
                $(this).html(strLabel).data('label', strText).data('isOpen', !isOpen);
            });
        },
        moreBanks:function(){
            var Toggle={
                isHidden:!0,
                init:function(){
                    this[this.isHidden?"show":"hide"]()
                },
                show:function(){
                   // this.isHidden=!1,
                    this.$li.show(),
                    this.$btn.html("收起").data('hidden', !1);//.hide()
                },
                hide:function(){
                    var iLen = this.$li.length;
                    //this.isHidden=!0,
                    this.$li.slice(8,iLen-1).hide(),
                    this.$btn.html("查看更多").data('hidden', !0)
                },
                tab: function(li, btn) {
                    this.$li = li;
                    this.$btn = btn;
                    var isHidden = this.$btn.data('hidden') === undefined ? true : this.$btn.data('hidden');
                    this[isHidden ? "show" : "hide"]();
                }
            };
            function showMore() {
                var $ul=$(this).parents('ul'),
                    $li=$ul.children("li"),
                    $btn=$(this),
                    iLen=$li.length;

                    Toggle.tab($li, $btn);
            }

            // 隐藏银行
            $(".j-banks-more").map(function() {
                var $li = $(this).children('li');
                var iLen = $li.length;
                $li.slice(8,iLen-1).hide();
            });

            $(".more-ebank").on("click", showMore)
        },


        // 搜索框
        searchInput: function(){
          var handler = {
            // 延迟隐藏
            timer: null,
            // 自动隐藏，如果input是focus状态则不自动隐藏
            autoHide: true,
            // 按钮是否点击，点击保持不隐藏，等input再次blur隐藏
            clicked: false,
            // 显示 obj-按钮, ip 是否input触发
            show: function(obj, ip){
              if(!obj) return;
              clearTimeout(this.timer);
              // 设置自动隐藏状态
              this.autoHide = ip ? true : false;
              $(obj).removeClass('hidden');
            },
            // 隐藏 obj-按钮, ip 是否input触发
            hide: function(obj, ip) {
              if(!obj) return;
              var that = this;
              clearTimeout(this.timer);
              this.timer = setTimeout(function(){
                $(obj).addClass('hidden');
                // 设置自动隐藏状态
                that.autoHide = true;
              }, 500)
            }
            //},
            //bindEvent: function(obj) {
            //  var that = this;
            //  // 按钮鼠标移入移开
            //  $(obj).off('mouseenter mouseleave').on('mouseenter mouseleave', function(e) {
            //    if(e.type == 'mouseenter') {
            //      handler.show(obj, 1);
            //    } else {
            //      if(!that.clicked && that.autoHide) { // 未点击，自动隐藏
            //        handler.hide(obj, 1);
            //      }
            //    }
            //  });
            //  // 按钮点击
            //  $(obj).off('click').on('click', function(){
            //    that.clicked = true;
            //    that.show($(this), 1)
            //  });
            //}
          };
          $('[data-toggle="searchInput"]').on('focus blur', function(e){
            var obj = $(this).next('button');
            //if(e.type == 'focus') {
            //  handler.show(obj, 0);
            //} else {
            //  if($.trim($(this).val()) == '' && $(this).val().length == 0) {
            //    handler.hide(obj, 0);
            //  }
            //}
            // input触发显示隐藏
            handler[e.type == 'focus' ? 'show' : 'hide'](obj, 0);
            // 按钮鼠标滑过、移开、点击事件
            //handler.bindEvent(obj)
          });
        },
      // 密码输入框禁止复制黏贴
      pwdLimit: function() {
      	//var tips;
        $('input[type="password"]').on('copy paste cut', function(e) { e.preventDefault(); return false; })
        							.on('keyup', function(e) {  // 不能输入空格
        								if(e.keyCode == 32) {
        									$(this).val($.trim($(this).val()));
        									//!tips && $.notify({message: '<i class="icon-info"></i> 密码不能包括空格！', timeout: 1000, onClose: function(){ tips = false }});
        									//tips = !0;
        									e.preventDefault();
        								}
        							})

      },
      // 限制文本不能输入空格
      inputSpaceLimit: function() {
        $('input[type="text"]').on('keydown', function(e) {
            if(e.which == 32) {
                e.preventDefault();
                return false;
            }
        });
      },
      // 未验证用户提示
      limitUrl: function() {
        if(typeof CONFIG != 'undefined' && CONFIG.userVerify === 0) {
          $(document).on('click', 'a', function(e) {
            var url = decodeURIComponent(this.href),
                index = -1;

            $.each(CONFIG.limitUrl, function(i, item){
              if(url.indexOf(item) > -1) index = i;
            });

            if(index > -1){
              $('#j-not-verify').modal({
                title: '提示',
                content: '<div class="notice-wrap info in-modal">\
                            <div class="notice-box">\
                                <span class="notice-img"></span>\
                                <h3 style="margin-top: 15px;">你尚未通过账户验证，暂不能使用此功能！</h3>\
                            </div>\
                         </div>'
              });
              e.preventDefault();
            }
          });
        }
      },
      otherBank: function() {
          // 其他银行交互
          $('.form-control-dropdown').on('selected.ui.dropdown', function(e, obj) {
              var $item = $(obj),
                  title = $item.attr('title'),
                  $target = $(this).parents('.form-control-wrap').find('.form-control-tools-link');

              if(!!$target.length) {
                  if(title == -1) { // title = -1 其他银行
                      $target.show().find(':input').val('').focus();
                  } else {
                      $target.hide();
                  }
              }
          })
      }
    };

    $(document).ready(App.initPage);
})(jQuery);

/**
 * 进度条组件
 * api
 * $(selector).progress({
 *      timer: 1000, // 自动进度时间间隔
 *      auto: false,  // 是否自动进度
 *      complete: fn  // 完成100%回调
 * })
 * $(selector).progress('width', 10); // 直接设置刻度
 * $(selector).progress('error' [, '下载失败']) // 直接
 * $(selector).on('progress', function(e, percent) // 进度中
 * $(selector).on('complete', function(){}) // 加载完成
 * $(selector).progress('auto') // 设置为自动
 * $(selector).progress('stop') // 禁止自动
 */
;(function($) {
    var Progress = function(el, options) {
        this.$el = $(el);
        this.$bar = this.$el.find('.progress-bar');
        this.timer = null;
        this._progress = 0;
        this.options = $.extend({}, Progress.DEFAULTS, options);
        this.init();
    };

    Progress.DEFAULTS = {
      auto: false,
      timer: 1000,
      complete: $.noop
    };

    Progress.prototype = {
      constructor: Progress,
      init: function() {
        if(this.options.auto) this.auto();
        this.active();
      },
      active: function() {
          this.$el.addClass('active').removeClass('progress-danger');
      },
      error: function(str) {
          this.$el.removeClass('active').addClass('progress-danger');
          !!str && this.$bar.html(str);
      },
      width: function(val) {
        if(val === undefined || val === null) {
            return this._progress;
        } else {
            val = parseInt(val, 10);
            var Event = $.Event('progress');
            var endEvent = $.Event('complete');
            if(val >= 100) {
                this._progress = 100;
                this.stop();
                this.options.complete(null, this.$el, this.$bar);
            } else {
                this._progress = val;
            }
            this.$bar.css('width', this._progress +'%').html(this._progress+'%');
            this.$el.trigger(Event, this._progress);
            if(this._progress == 100) this.$el.trigger(endEvent);
        }
      },
      auto: function() {
        var self = this, p;
        this.timer = setInterval(function() {
            p = self._progress + Math.max(Math.random() * 10, 1);
            self.width(p);
        }, this.options.timer)
      },
      stop: function() {
          clearInterval(this.timer);
      }
    };

    $.fn.progress = function(options) {
        var args = [].slice.call(arguments, 1);
        return $(this).each(function() {
            var self = $(this),
                data = self.data('ui.progress');

            if(!data) self.data('ui.progress', (data = new Progress(self, options)));

            if(typeof options === 'string') data && data[options].apply(data, args);
        })
    }
})(jQuery);



// 成功弹层
var successModalLayer = (function($){
    return function(config){
        var id = config['id'] ? config['id'] : '#j-modal-status';
        // 使用modalLayer api
        $(id).modalLayer({
            icon: 'success',
            title: (config['title'] || ''),
            content: (config['content'] || ''),
            buttons: [
                {
                    text: '确认',
                    ok: function(){
                        if(config && typeof config['link'] == 'string') {
                            location.href = config['link'];
                        }
                        if(config && typeof config['callback'] == 'function') {
                            config['callback']();
                        }
                    }
                }
            ]
        });
    }
})(jQuery);

// 确认询问弹层
var confirmModalLayer = (function($) {
    return function(config){
        var id = config['id'] ? config['id'] : '#confirmModalLayer';
        $(id).modalLayer({
            icon: 'info',
            title: (config['title'] || ''),
            content: (config['content'] || ''),
            buttons: [
                {
                    text: '确定',
                    ok: config['callback']
                },
                {
                    text: '取消',
                    style: 'btn secondary fn-ml-10'
                }
            ]
        });
    }
})(jQuery);

// 警告弹层
var alertModalLayer = (function($) {
    return function(config){
        var id = config['id'] ? config['id'] : '#alertModalLayer';
        $(id).modalLayer({
            icon: (config['icon'] || 'info'),
            title: (config['title'] || ''),
            content: (config['content'] || '')
        });
    }
})(jQuery);

// 关闭弹层不是隐藏
var closeModalLayer = (function($){
    return function(id, fn) {
        $(id).modal('hide').on('hide.ui.modal', function(){
            $(this).remove();
            typeof fn === 'function' && fn();
        })
    }
})(jQuery);

// 同意协议激活提交按钮
;(function($) {
    var activeBtn = function(obj) {
        var self = $(obj);
        // 按钮集合
        var $submit = $(self.attr('data-target'));
        // 面板
        var $panel = $(self.attr('data-panel'));

        if(!$submit.length) return;
        self.on('click', function() {

            //  兄弟集合
            var $brother = $($(this).attr('data-brother'));
            // 是否选中
            var isChecked = $(this).is(':checked'), bChecked = false;
            if($brother.length) { // 两个 checkbox
                bChecked = $brother.is(':checked');
                if(isChecked && bChecked) {  // 两个都选中
                    $submit.prop('disabled', !1).addClass('primary');
                    !!$panel.length && $panel.show();
                } else {
                    $submit.prop('disabled', !0).removeClass('primary');
                    !!$panel.length && $panel.hide();
                }
            } else {
                $submit.prop('disabled', !isChecked)[isChecked ? 'addClass' : 'removeClass']('primary');
                // 面板 toggle
                !!$panel.length && $panel[isChecked ? 'show' : 'hide']();
            }
        });
    };
    $(function() {
        activeBtn('[data-toggle="active-btn"]')
    });
})(jQuery);


;(function($, root) {
    var hash = {'12288' : ' '};
    //。．，；：？！……—～〔〕【】｛｝《》‘’“”１２３４５６７８９０／＼＠＃＄％
    //.,;:?!…-~()[]{}<>''""123456789/\!@#$%
    var chars = {
        dbc: '。．，；：？！—～〔〕【】｛｝《》‘’“”１２３４５６７８９０／＼＠＃＄％',
        sbc: '..,;:?!-~()[]{}<>\'\'""1234567890/\@#$%'
    };

    // 全角转半角
    function dbc2sbc(str) {
        var ret = [], i = 0, len = str.length, code, chr;
        for (; i < len; ++i) {
            code = str.charCodeAt(i);
            chr = hash[code];
            if (!chr && code > 65280 && code < 65375) {
                chr = hash[code] = String.fromCharCode(code - 65248);
            }
            ret[i] = chr ? chr : str.charAt(i);
        }
        return ret.join('').replace(/[。．，；：？！—～〔〕【】｛｝《》‘’“”１２３４５６７８９０／＼＠＃＄％]/g, sbc).replace('……', '…');
    }

    function sbc(match) {
        if(match) {
            var i = chars.dbc.indexOf(match);
            return chars.sbc.charAt(i) ? chars.sbc.charAt(i) : match;
        }
    }

    var Handler = function() {
        return $(this).each(function() {
            $(this).on('keyup', function() {
                var thisVal = dbc2sbc($(this).val());
                $(this).val(thisVal);
            })
        });
    }

    $.fn.toSBC = Handler;
    root.toSBC = dbc2sbc;

    $(function(){ $('input[data-toggle="toSBC"]').toSBC() })
})(jQuery, window);

