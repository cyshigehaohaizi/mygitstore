#### 这个demo主要是实现块拖拽,以及块拖拽改变大小和布局

ps:还未完成
https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
   function getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle[prop];
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            } else {
                return element.style[prop];


