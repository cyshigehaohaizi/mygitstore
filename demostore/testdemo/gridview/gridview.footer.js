/**
 * Created by Administrator on 2016/7/21.
 */
//构造表尾
(function(factory){
	if(typeof define === 'function' && define.amd){
		define(['jquery'],factory);
	}else{
		factory(jQuery);
	}
}(function(){
    $.extend(true, window, { Slick :{ GridViewControls:{ Footer: SlickGridViewFooter }}});

    //构造表尾
    function SlickGridViewFooter(gridView,$footer,data,options){
        var foot_elem = {};
        //填充表尾
        var footContent =

            '<div><select id="tagridView_' + gridView.getGridId() + '_var_pagesize">' +
            '   <option value="10">10</option>' +
            '   <option value="20">20</option>' +
            '   <option value="50">50</option>' +
            '   <option value="100">100</option>' +
            '   <option value="200">200</option>' +
            '   <option value="500">500</option>' +
            '</select>' +
            '<span id="tagridView_' + gridView.getGridId() + '_btn_starty" type="button" class="fa fa-step-backward footbtn footunactive"></span>' +
            '<span id="tagridView_' + gridView.getGridId() + '_btn_upy" type="button" class="fa fa-caret-left footbtn fa-lg footunactive" ></span>' +
            '<input id="tagridView_' + gridView.getGridId() + '_var_page" type="text"/>\/<span id="tagridView_' + gridView.getGridId() + '_var_totalpage" style="margin-right: 10px"></span> ' +
            '<span id="tagridView_' + gridView.getGridId() + '_btn_downy"  class="fa fa-caret-right footbtn fa-lg footactive" /></span>' +
            '<span id="tagridView_' + gridView.getGridId() + '_btn_endy" class="fa fa-step-forward footbtn footactive"/></span>' +
            		'<input id="'+gridView.getGridId()+'_start" type="hidden" name="gridInfo[\''+gridView.getGridId()+'_start\']" />' +
            		'<input id="'+gridView.getGridId()+'_limit" type="hidden" name="gridInfo[\''+gridView.getGridId()+'_limit\']" />' +

        '<span>共 <span id="tagridView_' + gridView.getGridId() + '_var_total"></span> 条</span></div>' ;
        $footer.innerHTML = footContent;

        //页尾元素
        foot_elem.foot_btn_starty = document.getElementById("tagridView_" + gridView.getGridId() + "_btn_starty");
        foot_elem.foot_btn_upy = document.getElementById("tagridView_" + gridView.getGridId() + "_btn_upy");
        foot_elem.foot_btn_downy = document.getElementById("tagridView_" + gridView.getGridId() + "_btn_downy");
        foot_elem.foot_btn_endy = document.getElementById("tagridView_" + gridView.getGridId() + "_btn_endy");
        foot_elem.foot_var_pagesize = document.getElementById("tagridView_" + gridView.getGridId() + "_var_pagesize");
        foot_elem.foot_var_page = document.getElementById("tagridView_" + gridView.getGridId() + "_var_page");
        foot_elem.foot_var_total = document.getElementById("tagridView_" + gridView.getGridId() + "_var_total");
        foot_elem.foot_var_totalpage = document.getElementById("tagridView_" + gridView.getGridId() + "_var_totalpage");

        foot_elem.foot_hidden_start = document.getElementById(gridView.getGridId() + "_start");
        foot_elem.foot_hidden_limit = document.getElementById(gridView.getGridId() + "_limit");
        
        //页码默认值
        if(typeof data == undefined 
        		|| data == null 
        		|| Object.prototype.toString.call(data) === '[object Array]'
        		|| (data.total == null || data.total == 0))
            refreshFooter();
        else
            refreshFooter(1, data.limit, data.total);


        //事件绑定
        //首页按钮
        addEvent(foot_elem.foot_btn_starty, 'click', function () {
            var page = 1;
            var pageSize = parseInt(foot_elem.foot_var_pagesize.value);

            refreshFootData(page, pageSize);
        });
        //上页按钮
        addEvent(foot_elem.foot_btn_upy, 'click', function () {
            var page = parseInt(foot_elem.foot_var_page.value);
            if (page <= 1) {
                return;
            }

            page = page - 1;
            var pageSize = parseInt(foot_elem.foot_var_pagesize.value);

            refreshFootData(page, pageSize);
        });
        //下页按钮
        addEvent(foot_elem.foot_btn_downy, 'click', function () {
            var page = parseInt(foot_elem.foot_var_page.value);
            var totalPage = parseInt(foot_elem.foot_var_totalpage.value);
            if (page >= totalPage) {
                foot_elem.foot_var_page.value = totalPage;
                return;
            }

            page = page + 1;
            var pageSize = parseInt(foot_elem.foot_var_pagesize.value);

            refreshFootData(page, pageSize);
        });
        //末页按钮
        addEvent(foot_elem.foot_btn_endy, 'click', function () {
            var page = parseInt(foot_elem.foot_var_totalpage.value);
            var pageSize = parseInt(foot_elem.foot_var_pagesize.value);

            refreshFootData(page, pageSize);
        });
        //页容量变动
        addEvent(foot_elem.foot_var_pagesize, 'change', function () {
            var page = parseInt(foot_elem.foot_var_page.value);
            var pageSize = parseInt(foot_elem.foot_var_pagesize.value);
            var totalPage = parseInt(foot_elem.foot_var_totalpage.value);

            //页容量从小变大时，可能造成页码大于总页码而导致表格无数据的情况
            refreshFootData(page, pageSize);
        });
        //页变动
        addEvent(foot_elem.foot_var_page, 'change', function () {
            var page = parseInt(foot_elem.foot_var_page.value);
            var totalPage = parseInt(foot_elem.foot_var_totalpage.value);
            var pageSize = parseInt(foot_elem.foot_var_pagesize.value);

            (isNaN(page)) && (page = 1);
            (page < 1) && (page = 1);
            (page > totalPage) && (page = totalPage);

            refreshFootData(page, pageSize);
        });

        //添加事件
        function addEvent(el, type, fn) {
            if (el.addEventListener)
                el.addEventListener(type, fn, false);
            else if (el.attachEvent)
                el.attachEvent('on' + type, function () {
                    fn.call(el);
                });
            else
                throw new Error('unknow environment of event.');
        }

        //分页变动，数据刷新，分页信息更新
        function refreshFootData(page, pageSize) {
            //unloadData();
        	var _url = options.url;
        	var _successCallBack = options.successCallBack;
        	var _param = options.param || {};
        	(page < 1) && (page = 1);
            _param["gridInfo['"+gridView.getGridId()+"_start']"] = (page - 1) * pageSize;
            _param["gridInfo['"+gridView.getGridId()+"_limit']"] = pageSize;
//        	Base._ajax({
//				"url":_url,
//				"data":_param,
//				"succCallback":function(data,dataType){
//					gridView.loadData(data.lists[gridView.getGridId()]);
//					refreshFooter(page, pageSize, data.lists[gridView.getGridId()].total);
//					if(_successCallBack)_successCallBack(data,dataType);
//				},
//				"failCallback":function(data,dataType){
//
//				},
//				"type":'POST'
//				//,
//				//"async":(async===false?false:true)
//				
//				,"dataType":"json"
//				
//			});

            //隐藏属性
            (page < 1) && (page = 1);
            foot_elem.foot_hidden_start.value = (page-1) * pageSize;
            foot_elem.foot_hidden_limit.value = pageSize;
                  
            var submitString = options.submitIds != undefined? options.submitIds +  "," + gridView.getGridId(): gridView.getGridId();
            var suburl = options.url;
             if (options.successCallBack == undefined) {
            	 Base.submit(submitString, suburl, options.parameter);
             } else {
            	 Base.submit(submitString, suburl, options.parameter, null, null, _successCallBack);
             }
        }

        //分页信息更新
        function refreshFooter(page, pageSize, total) {
            (!page) && (page = 0);
            (!pageSize) && (pageSize = options.pageSize);
            (!total) && (total = 0);
            
            //页容量
            foot_elem.foot_var_pagesize.value = pageSize;
            //页码
            foot_elem.foot_var_page.value = page;
            //总共记录
            foot_elem.foot_var_total.value = total;
            foot_elem.foot_var_total.innerHTML = total;
            //总页码
            var totalpage = Math.ceil(total / pageSize);
            foot_elem.foot_var_totalpage.value = totalpage;
            foot_elem.foot_var_totalpage.innerHTML = totalpage;
        }
        
        $.extend(this,{
        	"cmptype" : 'dataviewfooter',
        	"slickGridViewFooterVersion": "1.0",
        	refreshFooter : refreshFooter,
        });

    }
}));