/**
 * Created by Administrator on 2016/6/29.
 */
/*
 * 函数式封装*
 * */

/*
 * 获取元素
 * @parameter
 * id:传入id
 * */

//function getId(id){
//    return document.getElementById(id);
//}

/*
 * 对象式封装
 * 基本封装
 * */

//var Base={
//    getId:function(id){
//        return document.getElementById(id);
//    },
//    getName:function(name){
//        return document.getElementsByName(name);
//    },
//    getTagName:function(tag){
//        return document.getElementsByTagName(tag);
//    }
//}

/*
* 连缀
* 主要是每个函数调用了之后就返回他本身this,那么下次使用是会后就可以继续调用,这个就是
* 调用方法
* */


//前台调用
var $=function(){
    return new Base();
}
//基础库
function Base(){
    //创建数组,保存获取的节点或者是节点数组
    this.elements=[];
    //获取id节点
    this.getId=function(id){
        this.elements.push(document.getElementById(id));
        return this;
    }
    //获取tag节点
    this.getTagName=function(tag){
        var tags=document.getElementsByTagName(tag);
        //因为是多个对象
        for(var i=0;i<tags.length;i++){
            this.elements.push(tags[i])
        }
        return this;
    }

}

//设置css
//获取css样式的值一般只传入一个参数
Base.prototype.css=function(attr,value){
    for(var i=0;i<this.elements.length;i++){
        if(arguments.length==1){
            //这种方式只能获取行内的style不能获取内嵌或者外联之类的样式,
            //所以我们这里用到了getComputedStyle()这个方法
            //return this.elements[0].style[attr];
            if(typeof window.getComputedStyle()!="undifed"){

            }
        }
         this.elements[i].style[attr]=value;
    }
    return this;
};
//设置innerHtml
//两种情况 一种是调用的时候 设置innerHtml
//一种是 获取html中的值,一般获取html的值之后就不需要连缀了,所以可以直接放在循环里面
Base.prototype.html=function(str){
    for(var i=0;i<this.elements.length;i++){
        if(arguments.length==0){
            return this.elements[i].innerHTML;
        }
        this.elements[i].innerHTML=str;
    }
    return this;
};
//设置 触发动作
Base.prototype.click=function(fn){
    for(var i=0;i<this.elements.length;i++){
        this.elements[i].onclick=fn;
    }
    return this;
}



