/**
 * author levi
 * url http://levi.cg.am这是js插件
 */
// $(function() {
import $ from 'jquery';
var coorIndex, arr = {};
export default function drag(el, index = "") {
    // console.log(el, index)
    if (arr[index]) return
    $(document).mousemove(function(e) {
        // console.log(this.move, 'this.move');
        if (!!this.move) {
            var posix = !document.move_target ? { 'x': 0, 'y': 0 } : document.move_target.posix,
                callback = document.call_down || function() {
                    var header = $('header') ? $('header').height() : 0; // 获取顶部导航高度
                    var lefttab = $('.toolbar') ? $('.toolbar').width() : 0; // 获取左侧导航宽度
                    $(this.move_target).css({
                        'top': e.pageY - posix.y - header,
                        'left': e.pageX - posix.x - lefttab
                    });
                };
            callback.call(this, e, posix);
        }
    }).mouseup(function(e) {

        if (!!this.move) {
            var callback = document.call_up || function() {};
            callback.call(this, e);
            $.extend(this, {
                'move': false,
                'move_target': null,
                'call_down': false,
                'call_up': false
            });
        }
    });

    var $box = $('.' + el).on('mousedown', '.box' + index, function(e) {
        var offset = $(this).offset();

        this.posix = { 'x': e.pageX - offset.left, 'y': e.pageY - offset.top };

        $.extend(document, { 'move': true, 'move_target': this });
        // console.log(this.move)
    }).on('mousedown', '.coor', function(e) {
        coorIndex = $(this).attr('data-index') || ''
        console.log(coorIndex, 'coorIndex')
        var posix = {
            'w': $box.find('.box' + coorIndex).width(),
            'h': $box.find('.box' + coorIndex).height(),
            'x': e.pageX,
            'y': e.pageY
        };
        console.log(posix)
        $.extend(document, {
            'move': true,
            'call_down': function(e) {
                $box.find('.box' + coorIndex).css({
                    'width': Math.max(30, e.pageX - posix.x + posix.w),
                    'height': Math.max(30, e.pageY - posix.y + posix.h)
                });
            }
        });
        return false;
    });

    arr[index] = $box
}

// });