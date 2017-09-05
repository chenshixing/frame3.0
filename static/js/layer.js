/**
 * Created by tommyshao on 16/3/10.
 */

/**
 * 自定义弹层 Layer
 * 1. $(selector).layer();
 * 2. $(selector).layer({
 *      title: '',
 *      content: '',
 *      ok: fn,
 *      cancel: fn
 * });
 * 3. $(selector).layer('show');
 * 4. $(selector).layer('hide');
 * 5. $(selector).layer('show', {title: 'xxx', content: 'ooo'});
 * 6. $(selector).on('show.layer', fn)
 * 7. $(selector).on('hide.layer', fn)
 * 8. $(selector).on('btn.layer', fn)
 */
;(function($) {
    var Layer = function(obj, option) {
        // 配置
        var config = $.extend({
            title: '提示',
            content: '',
            ok: $.noop,
            cancel: $.noop
        }, option);

        this.$el = $(obj);
        this.config = config;
        // 交换主要 element
        if(this.$el.is('.layer-bg')) {
            this.$backdrop = this.$el;
        } else {
            this.$backdrop = this.$el.parents('.layer-bg');
        }
//            this.$backdrop = this.$el.is('.layer-bg') ? this.$el : this.$el.parents('.layer-bg');
        this.$title = this.$el.find('.layer-title');
        this.$content = this.$el.find('.layer-content');

        this.__initEvent();
    };

    // prototype method
    // show 显示
    // hide 隐藏
    // set  重新设置 title 和 内容
    Layer.prototype = {
        constructor: Layer,
        __initEvent: function() {
            var self = this;
            var config = this.config;
            this.$el.on('click', '[data-fn="ok"]', function() {
                !config.ok() && self.hide();
            });
            this.$el.on('click', '[data-fn="cancel"]', function() {
                config.cancel() || self.hide();
            });

            var btnEvt = $.Event('btn.layer');
            this.$el.on('click', '.layer-btn', function(e) {
                $(this).trigger(btnEvt, e.target);
            })
        },
        show: function(config) {
            var Evt = $.Event('show.layer');
            if(!!config) this.set(config);
            this.$backdrop.addClass('layer-bg-show');
            this.$el.trigger(Evt);
            return this;
        },
        hide: function() {
            var Evt = $.Event('hide.layer');
            this.$backdrop.removeClass('layer-bg-show');
            this.$el.trigger(Evt);
            return this;
        },
        set: function(config) {
            if(!!config) {
                if(config['title']) this.__setTitle(config['title']);
                if(config['content']) this.__setContent(config['content']);
            }
            return this;
        },
        __setTitle: function(title) {
            this.$title.html(title)
        },
        __setContent: function(content) {
            this.$content.html(content);
        }
    };

    // jQuery api
    $.fn.layer = function(option) {
        var args = [].slice.call(arguments, 1);
        return this.each(function() {
            var self = $(this),
                data = self.data('ui.layer');

            if(!data) {
                self.data('ui.layer', (data = new Layer(self, option)))
            }

            if(typeof option === 'string') {
                data[option] && data[option].apply(data, args);
            }else {
                data.show();
            }
        });
    }
})(jQuery);