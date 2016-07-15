/**
 * Created by Administrator on 2016/7/13.
 */

var $ = require("jquery");
require("./SimpleTable.scss")
function SimpleTable(id, header, data) {

    var that = this;
    this.el = $(document.getElementById(id));//容器
    this.head = $("<div class='header'></div>");//表头

    this.content = $("<div class='content'></div>");//表格内容容器
    this.con = $("<table class='con'></table>");//装入数据的表格

    //表格的参数
    this.options = {
        col: Object.getOwnPropertyNames(header).length,//对象的个数
        width: "100%",//width默认100%,随父元素变化而变化
        height: 300,//总高度
        head_height: 30,//表头高度
        content_height: 270,//表身高度
        cell_height: 30,//单元格高度
        cell_min_width: 100,//单元格最小宽度
    };
    //初始化创建表格
    function creatSimpleTable() {


        //填充表头
        for (var i in header) {
            var td = $("<div data-name='" + i + "'>" + header[i] + "</div>")
            that.head.append(td);

        }
        //内容添加
        that.content.append(that.con);
        that.el.append(that.head, that.content);
        that.loadData(data);

        //给容器初始化样式
        that.el.addClass("simple_table");
        that.el.css(
            {
                "width": that.options.width,
                "height": that.options.height + "px"
            });

        //给表头添加样式
        that.head.css({
            "height": that.options.head_height + "px"
        });
        //表格内容容器初始化
        that.content.css({height: that.options.content_height + "px"});



    }

    //装载数据
    this.loadData = function (data) {
        this.unloadData();
        var len = data.length,
            head_list = this.head.find("div"),
            head_len = head_list.length, i, j;
        for (i = 0; i < len; i++) {
            var tr = $("<tr></tr>");
            for (j = 0; j < head_len; j++) {
                var data_name = head_list[j].getAttribute("data-name");
                var wd = $(head_list[j]).outerWidth();

                var td = $("<td data-name='" + data_name + "'>" + data[i][data_name] + "</td>");
                tr.append(td);

            }
            this.con.append(tr);
        }
        adjustTableWidth();
    }
    //清除数据
    this.unloadData = function () {
        this.con.empty();
    }
    //滚动控制
    this.content.bind("scroll",function(){
        var left=that.content.scrollLeft();
        that.head.css({"left": -left + "px"});
    });


    var resizeTimer = null;
    $(window).on('resize', function () {
            //做优化有时延
            //if (resizeTimer) {
            //    clearTimeout(resizeTimer)
            //}
            //resizeTimer = setTimeout(function(){
            //    adjustTableWidth()
            //}, 100);
            adjustTableWidth();
        }
    );
    //表格宽度调整
    function adjustTableWidth() {
        //判断表格是否有数据
        if (that.con.find("tr").length <= 0)  return;
        var i, j,
            head_list = that.head.find("div"),
            head_len = head_list.length,
            td_list = that.con.find("tr:eq(0) td")

        for (i = 0; i < head_len; i++) {
            for (j = 0; j < head_len; j++) {
                if (head_list[i].getAttribute("data-name") == td_list[j].getAttribute("data-name")) {
                    //$(td_list[j]).width($(head_list[i]).css("width"));
                    //console.log($(head_list[i]).css("width"))
                    //td_list[j].width=$(head_list[i]).outerWidth();
                    //td_list[j].width=400;
                    //console.log(td_list[j])
                    break;
                }
            }
        }
    }

    //表格交互样式(鼠标移动||点击表格中的tr颜色改变)
    function addUIStyle() {

    }

    //表格分页---暂定
    function pagination() {

    }

    //初始化
    function init() {
        console.time("start")
        creatSimpleTable();
        console.timeEnd("start");
    }

    init();


}

module.exports = SimpleTable;


