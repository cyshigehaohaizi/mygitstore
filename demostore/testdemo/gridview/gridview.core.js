/**
 * Created by Administrator on 2016/7/21.
 */
(function(factory){
	if(typeof define === 'function' && define.amd){
		define(['jquery','gridview.footer'],factory);
	}else{
		factory(jQuery);
	}
}(function(){
    $.extend(true, window, { Slick: { GridView : SlickGridView}});
    function SlickGridView(id,cols,data,options){//表格id,表格列,表格显示的数据,表格信息
        var that=this;
        //创建节点
        this.el=document.getElementById(id);//容器
        this.head=document.createElement("div");//表头
        this.content=document.createElement("div");//表格内容容器
        this.con=document.createElement("div");//装入数据的表格
        this.el.className="dataview";
        this.head.className="header";
        this.content.className="content";
        this.con.className="con";


        //节点装载
        this.el.appendChild(this.head);
        this.content.appendChild(this.con);
        this.el.appendChild(this.content);



        //判断是否有分页
        if(options.showToolpaging==true){
            this.foot=document.createElement("div");//表尾
            this.el.appendChild(this.foot);
            this.foot.className="footer";
            this.foot.style.height ="30px";
        }

        //表格可调用方法
        //数据加载
        function loadData(data){

            if(typeof data == undefined || data == null)
            	return;
            else if(!(Object.prototype.toString.call(data) === '[object Array]'))
                data = data.list||[];

            console.time("loadData");
            unloadData();
            var len = data.length,
                cols_len = cols.length, i, j;
            var table="";
            for (i = 0; i < len; i++) {
                var tr="<div class='tr' style='height:"+options.rowHeight+"'>";
                //tr.style.height=+"px";
                for (j = 0; j < cols_len; j++) {

                    var wd=cols[j].width||options.defaultColumnWidth,data_name = cols[j].field;
                    var td =  "<div  title='"+data[i][data_name] +"' " +
                    		"class='td' " +
                    		"style='width: "+wd+";" +
                    				"min-width:"+wd+";"
                    				;
                    (cols[j].dataAlign) && (td+=("text-align:"+cols[j].dataAlign+";"));
                    td+=("'>" + data[i][data_name] + "</div>");
                    tr= tr +""+ td;
                }
                tr=tr+""+"</div>";
                table=table+""+tr;
            }
            this.con.innerHTML = table;
            adjustTableWidth();
            console.timeEnd('loadData');
            
        }
        //数据清除
        function unloadData(){
            that.con.innerHTML="";
        }
        
        //数据排序
        function colSort(colname,method,order){//按哪一列排序,排序方法str||num,升序还是降序
            var emethod=method||"str",eorder=order||"asc",temp;
            var dataTmp = data;
            if(typeof dataTmp == undefined || dataTmp == null)
            	return;
            else if(!(Object.prototype.toString.call(dataTmp) === '[object Array]'))
            	dataTmp = dataTmp.list;
            
            dataTmp.sort(function(a,b) {
                   if (eorder == "desc") {//asc还是desc
                       temp = a;
                       a = b;
                       b = temp;
                   }
                   if (emethod == "str") {//按拼音
                       return a[colname].toString().localeCompare(b[colname].toString());
                   }
                   if (emethod == "num") {//按字母
                       return parseInt(a[colname]) - parseInt(b[colname]);
                   }
               });
            that.loadData(dataTmp);
        }

        
        //创建表格
        function createSimpleTable(){
            //填充表头
            var head_str="",col_len=cols.length,i;
            for (i=0;i<col_len;i++) {
                var wd=cols[i].width||options.defaultColumnWidth;
                var td =" <div " +
                    "data-name='" +cols[i].field + "' " +
                    "title='"+cols[i].name+"' " +
                    "data-type='"+cols[i].dataType+"' " +
                    "style='width: "+wd+";" +
                    "min-width:"+wd+";";
                (cols[i].headerBackgroundColor) && (td+=("background-color:"+cols[i].headerBackgroundColor +";"));
                (cols[i].align) && (td+=("text-align:"+cols[i].align+";"));
                td += ("'>" + cols[i].name); 
                (cols[i].sortable == 'true') && (td += ("<span class='sort_con' ><span class='asc' ></span><span class='desc'></span></span>"));
                td += ("</div>");
                head_str=head_str+""+td;
            }
            that.head.innerHTML=head_str;
            //容器样式设定
            that.el.style.width=options.width;
            
            options.height.indexOf("%")>0 &&(options.height=that.el.parentNode.offsetHeight+"px");
            that.el.style.height=options.height;
            that.head.style.width=that.el.offsetWidth-18+"px";
            var head_height=parseInt(options.rowHeight)*parseInt(options.headerColumnsRows);
            that.head.style.height=head_height+"px";
            var foot_heigth = ((that.foot && that.foot.style.height ||'0px')||'0px');
            that.content.style.height=(parseInt(options.height)-parseInt(head_height)-parseInt(foot_heigth)) + "px";
            that.con.style.width=that.el.offsetWidth-18+"px";
            
            $(".asc").bind("click",function(e,index){
                var colname=this.parentNode.parentNode.getAttribute("data-name");
                var dataType = this.parentNode.parentNode.getAttribute("data-type");
                var method = (dataType=="number")?"num":"str";
                colSort(colname,method,"asc");

            });
            $(".desc").bind("click",function(e,index){
                var colname=this.parentNode.parentNode.getAttribute("data-name");
                var dataType = this.parentNode.parentNode.getAttribute("data-type");
                var method = (dataType=="number")?"num":"str";
                 colSort(colname,method,"desc");
            });


            if(options.showToolpaging==true){
                //调用foot的创建函数O(∩_∩)O哈哈~
                that.footer = new Slick.GridViewControls.Footer(that,that.foot,data,options.footerOptions);
            }
        }
        var resizeTimer = null;
        $(window).bind("resize", function () {
            //做优化有时延
            //if (resizeTimer) {
            //    clearTimeout(resizeTimer)
            //}
            //resizeTimer = setTimeout(function(){
            //    adjustTableWidth()
            //}, 100);
            adjustTableWidth();
        });
        function  adjustTableWidth(){
            that.head.style.width=that.el.offsetWidth-18+"px";
            that.con.style.width=that.el.offsetWidth-18+"px";

        }

        //滚动控制
        this.content.onscroll=function(){
            var left=that.content.scrollLeft;
            that.head.style.left= -left + "px";
        }

        //表格初始化
        function  init(){
            console.time("start")
            createSimpleTable();
            that.loadData(data);
            console.timeEnd("start");
        }

        function getGridId(){
            return id;
        }

        $.extend(this,{
        	"cmptype":'dataview',
            "slickGridViewVersion": "1.0",
            getGridId : getGridId,
            loadData : loadData,
            clearData: unloadData,
        });

        init();
    }

}));
