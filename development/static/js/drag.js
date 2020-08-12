/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yesong
 * @Date: 2019-10-21 12:45:12
 * @LastEditors: yesong
 * @LastEditTime: 2020-03-04 17:42:57
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
        if (isdrag == 0 || !isdrag) return
        if (this.move) {
            var posix = !document.move_target ? { 'x': 0, 'y': 0 } : document.move_target.posix,
                callback = document.call_down || function() {
                    $(this.move_target).css({
                        'top': parseInt(e.pageY - posix.y),
                        'left': parseInt(e.pageX - posix.x)
                    });
                    dragtop = e.pageY - posix.y,
                        dragleft = e.pageX - posix.x
                    move_target = this.move_target
                        // console.log(move_target);
                };
            callback.call(this, e, posix);
        }
    }).mouseup(function(e) {

        if (this.move) {
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

        // 判断是否只有标题能拖动
        if ($(this).find('.darg-title').length == 0) {
            $.extend(document, { 'move': true, 'move_target': this });
        }
        
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

    // 判断是否只有标题能拖动
    if ($box.find('.darg-title').length > 0) {
        $box.find('.darg-title').on('mousedown', function () {
            $.extend(document, { 'move': true, 'move_target':  $box.find('.box')[0]});
        })
    }

    arr[index] = $box
}

// });