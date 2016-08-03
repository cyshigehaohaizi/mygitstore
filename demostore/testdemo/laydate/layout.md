

## LayDate文档

### 1引入

#### 1.1简单引入

最简单的引入，如下：

    <input onclick="laydate()" type="text" class="laydate-icon"/>

这是是一个最简单的调用方式，它会把自身作为目标元素。除此之外，您还可以按照需求传入一些其它key，如下： 

    <input onclick="laydate({istime: true, format: 'YYYY-MM-DD hh:mm:ss'})" class="laydate-icon"/>

还可以设定任何html元素作为目标对象，如下：

    <div onclick="laydate()" class="laydate-icon"></div>
ps：其中的 `class="laydate-icon" ` 添加日期图标
#### 1.2外部js引入

laydate可以通过外部js把组件bind到目标元素上需要传入参数：

elem：目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 `'#id .clas'`

event：响应事件。如果没有传入event，则按照默认的click

引入方法如下：
				
	<input id="hello" class="laydate-icon">
	<script>
	laydate({
	    elem: '#hello',
	    event: 'focus' 
	});
	</script>



#### 1.3其他标签触发
laydate可以通过其他元素触发，需要传入被bind的目标元素

	<input id="hello1">
	<span onclick="laydate({elem: '#hello1'});">选择日期</span>

### 2.API

#### 2.1核心方法
核心方法是是`laydate(options)`, `options`是一个对象，它包含了以下属性：

		key: '默认值'
		elem: '#id', //需显示日期的元素选择器
		event: 'click', //触发事件，默认是点击事件
		format: 'YYYY-MM-DD hh:mm:ss', // 日期格式，默认格式是YYYY-MM-DD
		istime: false, //true||false  是否开启时间选择，默认不开启事件选择
		isclear: true, //true||false 是否显示清空，默认显示清空
		istoday: true, //true||false 是否显示今天，默认显示
		issure: true, //true||false 是否显示确认,默认显示
		festival: true //true||false 是否显示节日，默认显示
		min: '1900-01-01 00:00:00', //最小日期
		max: '2099-12-31 23:59:59', //最大日期
		start: '2014-6-15 23:00:00',//开始日期
		fixed: false, // true||false 是否固定在可视区域，默认false
		zIndex: 99999999, //css z-index
		choose: function(dates){ //选择好日期的回调
		
		}


#### 2.2其他方法
   

1. laydate.v 　　获取laydate版本号
2. laydate.skin(lib)　　加载皮肤，参数lib为皮肤名
3. laydate.reset();　重设日历控件坐标，一般用于页面dom结构改变时。无参 
4. laydate.now(timestamp,format) 　　返回一个时间
 - timestamp：时间戳
 - format：返回的日期格式，如果不填写，默认是`'-'`分隔
 
 `laydate.now`提供两个功能，第一个返回当前时间前后的若干天，第二个是时间戳转换，下面是几个例子：

　4.1返回当前时间 

	laydate.now();//结果是 2016-07-12

　4.2返回当前时间前后若干天

	laydate.now(-2,"YYYY/MM/DD")//将返回前天，以此类推 现在返回的是 2016/07/10	
    laydate.now(2)//将返回后天，以此类推 现在返回的是 2016-07-14

　4.3时间戳转换1
			          
    laydate.now(3999634079890,'YYYY/MM/DD hh:mm:ss')//返回2096/09/28 09:27:59

　4.3时间戳转换2，传入的参数必须是日期：

    var myDate = new Date();//获取当前日期时间
    var str="2015-9-15";
    //字符串转化成日期格式
    var mydate=Date.parse(str);
    console.log(
            laydate.now(mydate)//时间戳转换
    )//打印出2015-09-15




### 3.功能演示

#### 3.1 自定义日期格式
以下设置日期格式是`YYYY/MM/DD`，默认的日期是 `2016/7/12`，并且选择了日期之后弹出选择的日期：

	<input id="test1" class="laydate-icon"/>
	<script>
	laydate({
	    key:'2016/7/12',//默认值
	    elem: '#test1',//需要显示日期的元素
	    event:'click',//触发事件，默认是click
	    format: 'YYYY/MM/DD', // 分隔符可以任意定义，该例子表示只显示年月日
	    istime: true, //是否开启时间选择，默认不开启
	    choose: function(datas){ //选择日期完毕的回调
	        alert('选择的日期是：'+datas);
	    }
	})
	</script>

#### 3.2 规定日期选择范围

    规定选择日期为近5天：<input id="test2" class="laydate-icon" type="text"/>
    <script>
        laydate({
            elem: '#test2',
            min: laydate.now(-5), //-1代表昨天，-2代表前天，以此类推
            max: laydate.now(+5) //+1代表明天，+2代表后天，以此类推
        });
    </script>
#### 3.3 规定日期范围限制
以下的例子就是一个开始时间是今天，结束日期大于开始日期的例子：

    开始日：<input class="laydate-icon" id="start" style="width:200px; margin-right:10px;"/>
    结束日：<input class="laydate-icon" id="end" style="width:200px;"/>

    <script>
        var start = {
            elem: '#start',
            format: 'YYYY/MM/DD hh:mm:ss',
            min: laydate.now(), //设定最小日期为当前日期
            max: '2099-06-16 23:59:59', //最大日期
            istime: true,
            istoday: false,
            choose: function(datas){
                end.min = datas; //开始日选好后，重置结束日的最小日期
                end.start = datas //将结束日的初始值设定为开始日
            }
        };
        var end = {
            elem: '#end',
            format: 'YYYY/MM/DD hh:mm:ss',
            min: laydate.now(),
            max: '2099-06-16 23:59:59',
            istime: true,
            istoday: false,
            choose: function(datas){
                start.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };
        laydate(start);
        laydate(end);
    </script>