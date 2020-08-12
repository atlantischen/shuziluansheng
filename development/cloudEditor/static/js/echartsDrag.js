/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yesong
 * @Date: 2019-10-21 12:45:12
 * @LastEditors: yesong
 * @LastEditTime: 2019-10-21 12:45:12
 */
/**
 * author levi
 * url http://levi.cg.am这是js插件，看看吧
 */
// $(function() {
import $ from 'jquery';
var coorIndex, arr = {},
    timeOut, move_target = '',
    dragtop = 0,
    dragleft = 0;
export default function drag(el, index = "", fncallback = function() {}) {
    // console.log(el, index)
    // if (arr[index]) return
    $(document).mousemove(function(e) {
        var isdrag = $(this.move_target).attr('data-drag'); // 判断是否可拖拽
        // console.log(isdrag, 'isdragisdragisdrag')
        if (isdrag == 0 || !isdrag) return
            // console.log(this.move, 'this.move');
        if (!!this.move) {
            var posix = !document.move_target ? { 'x': 0, 'y': 0 } : document.move_target.posix,
                callback = document.call_down || function() {

                    var header = $('header') ? $('header').height() : 0; // 获取顶部导航高度
                     header += $('.nav_ul') ? $('.nav_ul').height() : 0; // 获取顶部导航高度
                     header += $('.toolbar') ? $('.toolbar').height() : 0; // 获取顶部导航高度
                    var lefttab = $('.CP_scenario') ? $('.CP_scenario').width() : 0; // 获取左侧导航宽度
                    // debugger
                    $(this.move_target).css({
                        'top': parseInt(e.pageY - posix.y - header),
                        'left': parseInt(e.pageX - posix.x - lefttab)
                    });
                    dragtop = e.pageY - posix.y - header,
                        dragleft = e.pageX - posix.x - lefttab
                    move_target = this.move_target
                        // console.log(move_target);
                };
            callback.call(this, e, posix);
        }
    }).mouseup(function(e) {

        if (!!this.move) {
            var callback = document.call_up || function() {};
            callback.call(this, e);
            // console.log($(move_target).attr('data-id'), "$(move_target).attr('data-id')")
            var result = {
                type: 'drag',
                id: move_target == '' ? '' : $(move_target).attr('data-id'),
                top: dragtop,
                left: dragleft
            }
            fncallback(result) // 拖拽结束后回调
            move_target = ''
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
    }).on('mousedown', '.coor', function(e) {
        coorIndex = $(this).attr('data-index') || ''
        var posix = {
            'w': $box.find('.box' + coorIndex).width(),
            'h': $box.find('.box' + coorIndex).height(),
            'x': e.pageX,
            'y': e.pageY
        };
        // console.log(posix)
        $.extend(document, {
            'move': true,
            'move_target': $box.find('.box' + coorIndex),
            'call_down': function(e) {
                $box.find('.box' + coorIndex).css({
                    'width': Math.max(30, e.pageX - posix.x + posix.w),
                    'height': Math.max(30, e.pageY - posix.y + posix.h)
                });
                if (timeOut) clearTimeout(timeOut)
                timeOut = setTimeout(() => {
                    var result = {
                        type: 'coor',
                        id: $box.find('.box' + coorIndex).attr('data-id')
                    }
                    fncallback(result)
                }, 50)

            }
        });
        return false;
    });

    arr[index] = $box
}

// });