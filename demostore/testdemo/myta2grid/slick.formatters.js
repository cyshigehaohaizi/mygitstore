/***
 * Contains basic SlickGrid formatters.
 *
 * NOTE:  These are merely examples.  You will most likely need to implement something more
 *        robust/extensible/localizable/etc. for your use!
 *
 * @module Formatters
 * @namespace Slick
 */

(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Formatters": {//设置显示格式
        "PercentComplete": PercentCompleteFormatter,//百分比
        "PercentCompleteBar": PercentCompleteBarFormatter,//百分比显示条
        "YesNo": YesNoFormatter,//显示是否
        "Checkmark": CheckmarkFormatter,//显示是否完成 就是一个钩钩
        "ImageModel":ImageFormatter,//显示图片
        "collection":collectionFormatter,//码表显示
        "format":formatFormatter,//日期&数字
        "valueExpression":valueExpressionFormatter,//表达式
      }
    }
  });

//function XXFormatter(row, cell, value, columnDef, dataContext){
  //  row:行数
  //  cell:列数
  //value:本cell的值
  //columnDef:本列属性
  //dataContext:本行的值
//}

    function valueExpressionFormatter(row, cell, value, columnDef, dataContext){
      var exstr=columnDef.valueExpression,colname=columnDef.field;

        for(var i in dataContext){
            eval("var "+i+" = \'"+ dataContext[i]+"\'");
        }
        eval(exstr);
        return   eval(exstr);

    }

  function formatFormatter(row, cell, value, columnDef, dataContext){
    var ft=columnDef.format;

    if(ft){
      //日期处理
      if(Date.parse(value)){
          var  newdate=new Date(Date.parse(value));
         return  newdate.format(ft);
      }else{//数字处理

      }

    }
    else {
      return value;
    }

  }

 function collectionFormatter(row, cell, value, columnDef, dataContext){
    //码表处理 返回对应值
   return value;
 }

  function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "-";
    } else if (value < 50) {
      return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
    } else {
      return "<span style='color:green'>" + value + "%</span>";
    }
  }

  function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "";
    }

    var color;

    if (value < 30) {
      color = "red";
    } else if (value < 70) {
      color = "silver";
    } else {
      color = "green";
    }

    return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%'></span>";
  }
  function YesNoFormatter(row, cell, value, columnDef, dataContext) {

    return value ? "yes" : "no";
  }

  function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {

    return value ? "<img src='../images/tick.png'>" : "";
  }

  function ImageFormatter(row, cell, value, columnDef, dataContext){
    return "<img src='../images/icon/"+columnDef.image+"' style='width: 19px;height: 19px' />" ;
  }
  function DateYMFormatter(row, cell, value, columnDef, dataContext){
    if (value){
      var  newdate=new Date(Date.parse(value));
      return newdate.format("yyyy-MM")

    }
    else {
      return value;
    }

  }
  function DateYMDFormatter(row, cell, value, columnDef, dataContext){

    if (value){
      var  newdate=new Date(Date.parse(value));
      return newdate.format("yyyy-MM-dd");

    }
    else {
      return value;
    }

  }
  function DateYMDSFormatter(row, cell, value, columnDef, dataContext){
    if (value){
      var  newdate=new Date(Date.parse(value));
      return newdate.format("yyyy-MM-dd hh:mm:ss");
    }
    else {
      return value;
    }
  }

  Date.prototype.format = function(format)
  {
    var o = {
      "M+" : this.getMonth()+1, //month
      "d+" : this.getDate(),    //day
      "h+" : this.getHours(),   //hour
      "m+" : this.getMinutes(), //minute
      "s+" : this.getSeconds(), //second
      "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
      "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
      format = format.replace(RegExp.$1,
          RegExp.$1.length==1 ? o[k] :
              ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
  }


})(jQuery);
