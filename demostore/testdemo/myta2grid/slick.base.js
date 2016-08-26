/**
 * Created by whisper on 2016/8/25.
 */


//创建初始化
function ta2CreateSlickGrid(container, cols, options,da){
    //视图初始化
    var dataView = new Slick.Data.DataView();



    //判断是否有选择框
    var columns= cols;
    if(options.selectType){

        //添加复选框列
        var selectProduct="";
        if(options.selectType=="checkbox"){
            selectProduct = new Slick.CheckboxSelectColumn();
            columns.unshift(selectProduct.getColumnDefinition());
        }
        if(options.selectType=="radio"){
            //添加单选列
            var RadioProduct= new Slick.RadioSelectColumn();
            columns.unshift(RadioProduct.getColumnDefinition());
        }
    }

    //表格初始化
    var grid = new Slick.Grid(container, dataView, columns, options);

    if(options.selectType){
        grid.registerPlugin(selectProduct);
        //选择模式是行选择模式
        grid.setSelectionModel(new Slick.RowSelectionModel());
    }


    //让grid响应dataview的改变事件
    dataView.onRowCountChanged.subscribe(function (e, args) {
        grid.updateRowCount();
        grid.render();
    });
    dataView.onRowsChanged.subscribe(function (e, args) {
        grid.invalidateRows(args.rows);
        grid.render();
    });



    //数据装载
    if(da){//如果有da直接显示数据
        dataView.setItems(da,"name");
    }else if(options.url){//异步
        $.ajax({
            type:'post',
            url:options.url,
            data:{},
            success:function(data){
                dataView.setItems(data,"name");
            },
            error:function(){}
        });
    }else {
        dataView.setItems([]);
    }



    //dataViewSort排序
    grid.onSort.subscribe(function(e, args) {
        var comparer = function(a, b) {
            if (args.sortCol.dataType == "num") {//按数字
                return Number(a[args.sortCol.field]) - Number(b[args.sortCol.field]);
            }else if(args.sortCol.dataType == "string"){//按拼音
                return a[args.sortCol.field].toString().localeCompare(b[args.sortCol.field].toString());
            }
        }
        dataView.sort(comparer,args.sortAsc);
    });


    //表格导出
    /**
     * 表格默认导出方法
     */
   grid.exportDefaultGridData=function(args, options) {
        var a, b;
        if (args == "dangqian") {//导出当前页
            a = grid.getColumns();
            b = dataView.getItems();
        } else if (args == "xuanze") {//导出选择数据
            a = grid.getColumns();
            b = grid.getSelectedRows();

            b = $.extend(true, [], b);
            if (b.length < 1) {
                alert('请至少选择一条数据');
                return;
            }
        }

        var collection = grid.getOptions().collectionsDataArrayObject;
        var row = [];
        var cell = [];
        var head = [];
        for (var i = 0; i < a.length; i++) {
            if (a[i].id != "_checkbox_selector" && a[i].id != "__no" && !a[i].icon && a[i].id != "img") {
                cell.push("\"" + a[i].id + "\"");
                head.push("\"" + a[i].name + "\"");
            }
        }

        row.push(head);

        for (var i = 0; i < b.length; i++) {
            var cells = [];
            for (var j = 0; j < cell.length; j++) {

                var cData = b[i][cell[j].replace(/\"/g, "")];
                if (cData == undefined || cData === "") {
                    cData = "";
                } else {
                    //处理转义字符
                    cData = JSON.stringify(cData.toString());
                    cData = cData.substring(1, cData.length - 1);
                }

                //码表处理
                //if (options.expKeyOrName == true && collection != undefined) {
                //    var collectcell = collection[cell[j].replace(/\"/, "")];
                //    var b_collected = false;
                //    if (collectcell && collectcell.length > 0) {
                //        for (var c = 0; c < collectcell.length; c++) {
                //            if (collectcell[c].id == cData) {
                //                //处理转义字符
                //                var collData = collectcell[c].name;
                //                collData = JSON.stringify(collData.toString());
                //                cells.push(collData);
                //                b_collected = false;
                //                break;
                //            } else {
                //                b_collected = true;
                //            }
                //        }
                //        if (b_collected) {
                //            cells.push("\"" + cData + "\"");
                //        }
                //    } else if (!b_collected) cells.push("\"" + cData + "\"");
                //} else
                    cells.push("\"" + cData + "\"");
            }
            row.push(cells);
        }
       //console.table(row)
        //var $input = $("<textarea/>").attr("display", "none").val(Ta.util.obj2string(row)).attr("name", "_grid_item_export_excel");
        //var $inputFileName = $("<textarea/>").attr("display", "none").val(options.exportExcelName).attr("name", "_grid__export_excelName");
        //var $form = $("<form/>")//.attr("enctype","multipart/form-data")//.attr("accept-charset", "GBK")
        //    .append($input).append($inputFileName).attr("method", "post")
        //    .attr("display", "none")
        //    .appendTo("body")
        //    .attr("action", Base.globvar.contextPath + "/exportGridDefaultExcel.do")
        //    .submit()
        //    .remove();
    }




    return grid;
}
