/**
 * Created by Administrator on 2016/6/30.
 */


var sizeX = [57, 124, 191, 258, 325, 392, 459, 526, 593, 660, 727, 794];
var sizeY = [57, 124, 191, 258, 325, 392, 459, 526, 593, 660, 727, 794,
    861, 928, 995, 1062, 1129, 1196, 1263, 1330, 1397, 1464, 1531, 1598, 1665, 1732, 1799];
var Col = [5, 72, 139, 206, 273, 340, 407, 474, 541, 608, 675, 742, 809];
var Row = [5, 72, 139, 206, 273, 340, 407, 474, 541, 608, 675, 742, 809,
    876, 943, 1010, 1077, 1144, 1211, 1278, 1345, 1412, 1479, 1546, 1613, 1680, 1747, 1814];
//装入盒子容器list
var conlist = [];
$(function () {
    //$("#add_con").
    $.each($(".con"), function (i, el) {
        var drag_el = new DragCon(el);
        conlist.push(drag_el);
    });
    initAllBoxPosition();
});

$("#add_con").bind("click", function () {

    Mask_con.chooseCreate(function () {
        //如果是用户选择了创建那么运行创建函数
        creatDragcon("系统","https://www.baidu.com/",5,2,1,1)
    });
})

var Mask_con = {
    panel_name: "",
    panel_src: "",
    chooseCreate: function (callback) {
        this.openMask();
        //确认创建那么运行回调函数
        this.ensureCreate(callback);
        this.cancelCreate();
    },
    openMask: function () {
        document.getElementById("mask_con").style.display = "block";
    },
    cancelCreate: function () {
        $("#close_mask").click(function () {
            this.panel_name = "";
            this.panel_src = "";
            document.getElementById("mask_con").style.display = "none";
        })
    },
    closeMask: function () {
        var m_name = document.getElementById("m_name").value,
            m_src = document.getElementById("m_src").value;
        this.panel_name = m_name;
        this.panel_src = m_src;
        document.getElementById("mask_con").style.display = "none";

    },
    ensureCreate: function (callback) {
        var that = this;
        $("#ensure_create").click(function () {
            if (typeof (callback) == "function") {
                that.closeMask();
                callback();
            }
        })
    }
}


function creatDragcon(type, src, sizeX, sizeY, col, row) {
    var pl = "  <li class='con' data-sizeX='" + sizeX + "' data-sizeY='" + sizeY + "' data-col='" + col + "' data-row='" + row + "'> " +
        "<div class='drag_bar'> " +
        "<span class='con_head_type'>" + type + "</span> " +
        "<span class='con_head_delete'></span> " +
        "<span class='con_head_refresh'></span> " +
        "</div> " +
        "<div class='con_content'> " +
        "<iframe  frameborder='0' scrolling='yes' src='" + src + "'></iframe> " +
        "</div> " +
        "<span class=resize_bar'><span></span></span> " +
        "</li>";
       $(".auto_con").append(pl);
}


function DragCon(el) {
    //el被拖动的元素,drag_bar移动控制条,resize_bar,改变大小控制条
    //初始化参数
    this.el = $(el);
    this.drag_bar = $(el).find(".drag_bar");
    this.resize_bar = $(el).find(".resize_bar");

    this.sizeX = parseInt($(el).attr('data-sizeX'));//所占宽度是多少
    this.sizeY = parseInt($(el).attr('data-sizeY'));//所占高度是多少
    this.col = parseInt($(el).attr("data-col"));//所在多少列
    this.row = parseInt($(el).attr("data-row"));//所在多少行

    this.refresh = $(el).find(".con_head_refresh");//刷新
    this.delete = $(el).find(".con_head_delete");//删除
    this.con_content = $(el).find("iframe");
    this.con_src = $(el).find("iframe").attr("src");
    var that = this;//用于在function里面使用更加方便
    //初始记录鼠标的位置也用来记录鼠标上一次的位置
    this.mouse_left = 0;
    this.mouse_top = 0;
    //refresh  click事件
    this.refresh.click(function () {
        that.con_content.attr('src', that.con_src);
    });
    //delete click事件
    this.delete.click(function () {
        //去掉当前节点
        var len = conlist.length;
        for (var i = 0; i < len; i++) {
            console.log(conlist[i], that.el[0])
            if (conlist[i].el == that.el) {
                conlist.splice(i, 1);
                that.el.remove();
                break;
            }
        }
        initAllBoxPosition();
    });

    //给drag_bar bind mousedown事件
    this.drag_bar.bind("mousedown", function (e) {
        that.mouse_left = e.clientX, that.mouse_top = e.clientY;
        //添加拖动标志
        that.el.css({"z-index": 998, "box-shadow": "0px 0px 2px 2px rgba(23, 140, 223, 0.3)"});
        that.el.attr("lock", "locked");
        //鼠标按下之后给document添加onmousemove和onmouseup事件
        $(document).bind("mousemove", mouseMoveDrag).bind("mouseup", mouseUpDrag);
    });
    //拖动改变位置
    function mouseMoveDrag(e) {
        var target = that.el;
        var dx = e.clientX - that.mouse_left;
        var dy = e.clientY - that.mouse_top;
        var l = parseInt(target.css("left"));
        var t = parseInt(target.css("top"));
        if (dx + l < 0 || dx + l + target.width() + 2 >= 802) {//判断左右是否超出范围
            dx = 0;
        }
        if (dy + t < 0) {//判断上面是否超出范围
            dy = 0;
        }
        var movex = l + dx;
        var movey = t + dy;
        that.mouse_left = e.clientX;
        that.mouse_top = e.clientY;
        target.css({'left': movex, 'top': movey});
        calculateBoxPosition(movex, movey);
        adjustAllBoxPosition();

    };
    function mouseUpDrag(e) {
        $(document).unbind("mousemove", mouseMoveDrag).unbind("mouseup", mouseUpDrag);

        //解锁标志
        that.el.attr("rlock", "rlocked");
        adjustAllBoxPosition();
        that.el.css({"z-index": 990, "box-shadow": "none"});
        that.el.removeAttr("lock");
        that.el.removeAttr("rlock");
        //清除预选位置box
        $(".placeholder").remove();

    };
    //计算盒子应该在哪个位置
    function calculateBoxPosition(l, t) {
        that.col = (parseInt((l - 5) / 67)) + 1;
        ( ((l - 5) % 67) > 47) && (that.col = that.col + 1);
        that.row = (parseInt((t - 5) / 67)) + 1;
        ( ((t - 5) % 67) > 47) && (that.row = that.row + 1);
        that.el.attr({"data-row": that.row, "data-col": that.col});
    }

    //调整盒子位置
    this.adjustBoxPosition = function () {
        var col_l = Col[this.col - 1];
        var row_t = Row[this.row - 1];
        this.el.animate({
            left: col_l + "px",
            top: row_t + "px"
        }, "fast");
    }
    this.resize_bar.bind("mousedown", function (e) {
        that.mouse_left = e.clientX, that.mouse_top = e.clientY;
        //被改变元素标志出来
        that.el.css({"z-index": 998, "box-shadow": "0px 0px 2px 2px rgba(23, 140, 223, 0.3)"});
        that.el.attr("lock", "locked");
        $(document).bind("mousemove", mouseMoveResize).bind("mouseup", mouseUpResize);
        e.preventDefault();
    });
    //拖动改变大小
    function mouseMoveResize(e) {
        var target = that.el;
        var dx = e.clientX - that.mouse_left;
        var dy = e.clientY - that.mouse_top;
        var l = parseInt(target.css("left"));
        var t = parseInt(target.css("top"));
        var w = parseInt(target.css("width"));
        var h = parseInt(target.css("height"));
        if (dx + l + target.width() + 2 >= 802) {//判断左右是否超出范围
            dx = 0;
        }
        that.mouse_left = e.clientX;
        that.mouse_top = e.clientY;
        target.css({'width': w + dx, 'height': h + dy});
        //计算现在的宽高是在哪个sizex,sizey里面
        calculateBoxSize(w, h);
        //调整其他盒子的位置
        adjustAllBoxPosition();

    }

    function mouseUpResize(e) {
        $(document).unbind("mousemove", mouseMoveResize).unbind("mouseup", mouseUpResize);
        that.adjustBoxSize();
        //解锁标志
        that.el.attr("rlock", "rlocked");
        adjustAllBoxPosition();
        that.el.css({"z-index": 990, "box-shadow": "none"});
        that.el.removeAttr("lock");
        that.el.removeAttr("rlock");
        //清除预选位置box
        $(".placeholder").remove();

    }

    //计算盒子的宽高是在哪个sizex,sizey里面
    function calculateBoxSize(w, h) {
        that.sizeX = (parseInt((w - 57) / 67)) + 1;
        ( ((w - 57) % 67) > 20) && (that.sizeX = that.sizeX + 1);
        that.sizeY = (parseInt((h - 57) / 67)) + 1;
        ( ((h - 57) % 67) > 20) && (that.sizeY = that.sizeY + 1);
        that.el.attr({"data-sizeX": that.sizeX, "data-sizeY": that.sizeY});

    }

    //调整盒子的宽度
    this.adjustBoxSize = function () {
        var sizeX_w = sizeX[that.sizeX - 1];
        var sizeY_h = sizeY[that.sizeY - 1];
        that.el.animate({
            width: sizeX_w + "px",
            height: sizeY_h + "px"
        })
    }


    function init() {
        that.adjustBoxSize();//初始化盒子的宽高
        that.adjustBoxPosition();

    }

    init();
}

function adjustAllBoxPosition() {
    var clist = conlist;
    for (var i = 0; i < clist.length; i++) {
        for (var j = i; j < clist.length; j++) {
            if (clist[i].row > clist[j].row) {
                var temp = clist[i];
                clist[i] = clist[j];
                clist[j] = temp;
            }
            if (clist[i].row == clist[j].row && clist[j].el.attr("lock") == "locked") {
                var temp = clist[i];
                clist[i] = clist[j];
                clist[j] = temp;
            }
        }
    }

    var len = clist.length;
    for (var i = 0; i < len; i++) {
        var armlist = [];
        for (var j = 0; j < i; j++) {//找出当前元素的前面的元素
            if ((clist[j].col <= clist[i].col && clist[i].col < clist[j].col + clist[j].sizeX)
                || (clist[j].col < clist[i].col + clist[i].sizeX && clist[i].col + clist[i].sizeX < clist[j].col + clist[j].sizeX)
                || (clist[j].col >= clist[i].col && (clist[j].col + clist[j].sizeX <= clist[i].col + clist[i].sizeX))) {
                //如果 他们出现在当前row的范围里面那么记录下来
                armlist.push(clist[j])
            }
        }
        var row = clist[i].row;
        if (armlist.length <= 0) {//如果上面木有盒子挡住那么移动到最上面
            row = 1;

        } else {//如果上面有挡住那么直接定位到挡住盒子的下面
            var max = armlist[0].row + armlist[0].sizeY;
            for (var m = 0; m < armlist.length; m++) {
                if (armlist[m].row + armlist[m].sizeY > max) {
                    max = armlist[m].row + armlist[m].sizeY;
                }
            }
            row = max;
        }


        //box移动过程中，拖拽box不参与位置变动
        if (!clist[i].el.attr("lock")) {
            //如果两次变动结果一直，不打断当前位移动作
            if (clist[i].row != row) {
                clist[i].el.stop();
                clist[i].row = row;
                clist[i].el.attr("data-row", row);
                clist[i].adjustBoxPosition();
            }

        } else {
            //拖拽box预选位置变动
            clist[i].row = row;
            clist[i].el.attr("data-row", row);
            var li = "<li class='placeholder' style='width:" + sizeX[clist[i].sizeX - 1] + "px;height:" + sizeY[clist[i].sizeY - 1] + "px;left:" + Col[clist[i].col - 1] + "px;top:" + Row[clist[i].row - 1] + "px'></li>";
            $(".placeholder").remove();
            $(".auto_con").append(li);
        }
        //释放box时，拖拽box也要加入布局中
        if (clist[i].el.attr("rlock")) {
            clist[i].row = row;
            clist[i].el.attr("data-row", row);
            clist[i].adjustBoxPosition();
        }


    }
}

function initAllBoxPosition() {
    var clist = conlist;
    for (var i = 0; i < clist.length; i++) {
        for (var j = i; j < clist.length; j++) {
            if (clist[i].row > clist[j].row) {
                var temp = clist[i];
                clist[i] = clist[j];
                clist[j] = temp;
            }
        }
    }

    var len = clist.length;
    for (var i = 0; i < len; i++) {
        var armlist = [];
        for (var j = 0; j < i; j++) {//找出当前元素的前面的元素
            if ((clist[j].col <= clist[i].col && clist[i].col < clist[j].col + clist[j].sizeX)
                || (clist[j].col < clist[i].col + clist[i].sizeX && clist[i].col + clist[i].sizeX < clist[j].col + clist[j].sizeX)
                || (clist[j].col >= clist[i].col && (clist[j].col + clist[j].sizeX <= clist[i].col + clist[i].sizeX))) {
                //如果 他们出现在当前row的范围里面那么记录下来
                armlist.push(clist[j])
            }
        }
        var row = clist[i].row;
        if (armlist.length <= 0) {//如果上面木有盒子挡住那么移动到最上面
            row = 1;

        } else {//如果上面有挡住那么直接定位到挡住盒子的下面
            var max = armlist[0].row + armlist[0].sizeY;
            for (var m = 0; m < armlist.length; m++) {
                if (armlist[m].row + armlist[m].sizeY > max) {
                    max = armlist[m].row + armlist[m].sizeY;
                }
            }
            row = max;
        }

        clist[i].row = row;
        clist[i].el.attr("data-row", row);
        clist[i].adjustBoxPosition();

    }
}
