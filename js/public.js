var container = document.getElementById("container");                                              //游戏区
var img_field = document.getElementById('img_field');                               //定义整个图片区
var img_arr = document.getElementsByTagName("img");                                 //每一张图片区
var out_box_arr = document.getElementsByClassName("outbox");                        //图片盒子
var count = 0;                                                                      //当前点开展示的图片，初始为0
var src = null;
var index = null;
var isStart = false;                                                                //是否已开始，初始为false
var isPaused = false;

var length = 6;                                                                     //设置一共6组图片

var left = 6;                                                                       //剩余未找到的图片组数，初始为6组
var time = 0;                                                                       //初始计时秒数为0
var calTime = null;                                                                 //计算时长的定时函数
var startBtn = document.getElementById("start");                                    //获取开始按钮

var showTime = 5000;                                                                //开始时的图片记忆时间，单位：毫秒

var width = document.defaultView.getComputedStyle(out_box_arr[0],null).width;       //获取当前屏幕下图片适合的宽度
var height = document.defaultView.getComputedStyle(out_box_arr[0],null).height;     //获取当前屏幕下图片适合的高度

/**
 * 统一为每个图片盒子设置一致的宽度和高度
 */
for (var i = 0; i < length * 2; i++) {
    out_box_arr[i].style.width = width;
    out_box_arr[i].style.height = height;
}

//定义图片index数组，每一张图片都在数组中存在两次
var img_array = [];
for (var i = 1; i <= length; i++) {
    for (var j = 0; j < 2; j++) {
        img_array.push(i);
    }
}

//为开始按钮绑定click事件
startBtn.onclick = start;

/**
 * 设置按钮可用不可用的状态
 * @param btn {Object} 按钮元素
 * @param state {String} 按钮需要设置的状态
 */
function setBtnState(btn, state) {
    btn.disabled = state;
}

/**
 *根据打乱的图片数组依次设置每张图片区域的图片地址
 *显示图片以供记忆
 */
function setImg() {
    for (var i = 0; i < length * 2; i++) {
        var img = img_arr[i];
        img.src = "images/" + img_array[i] + ".jpg";
    }
}

//在给定的记忆时间后，所有图片区域内的图片统一变为遮盖图片
function coverImg() {
    setTimeout(function() {
        for (var j = 0; j < length * 2; j++) {
            var img = img_arr[j];
            img.src = "images/7.jpg";
        }
        isStart = true;
    }, showTime);
}

//计算游戏耗时
function countTime() {
    calTime = setInterval(function() {
        time += 1;
    }, 1000);
}

/**
 * 打乱数组的顺序
 * 用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
 * @param a
 * @param b
 * @returns {number}
 */
function randomSort(a, b) {
    return Math.random()>.5 ? -1 : 1;
}

//打乱数组的顺序
img_array.sort(randomSort);

function imgBindClick() {
    img_field.onclick = clickImg;
}

/**
 * 游戏开始
 * 首先清除计算时长的定时函数
 * 开始按钮变为不可用状态
 * 根据打乱的图片数组依次设置每张图片区域的图片地址
 * 设置完后统一显示5s以供记忆，5s后图片统一变为红色
 * 开始计算游戏时长
 * 利用事件委托为每一张图片绑定click事件
 */
function start() {
    clearInterval(calTime);
    setBtnState(startBtn, 'disabled');
    setImg();
    coverImg();
    countTime();
    imgBindClick();
}

//清除正确的图片组
function clearOutBox(obj) {
    if (obj.getElementsByTagName("img").length > 0) {
        obj.removeChild(obj.getElementsByTagName("img")[0]);
        var img = document.createElement('img');
        obj.appendChild(img);
    }
}

/*
判断是否所有图片组都被找到
如果所有图片组都找到
清除游戏计时
弹出恭喜弹窗
 */
function isFinished() {
    if (left === 0) {
        clearInterval(calTime);
        alert("恭喜你用时" + time + "s找到你家娃")
    }
}

//隐藏已点开的图片
function hideImg(img) {
    setTimeout(function() {
        img_arr[index].src = "images/7.jpg";
        img.src = "images/7.jpg";
        isPaused = false;
    },1000)
}

/**
 * 图片点击事件
 * @param event {Object}
 */
function clickImg(event) {
    if (!isPaused) {
        if(isStart) {
            isPaused = true;
            var img = event.target;
            img.src = "images/" + img_array[Number(img.id)] + ".jpg";
            if (count === 0) {                                          //如果当前没有已点开的图片
                count = 1;                                              //当前点开的图片数为1
                src = img_array[Number(img.id)];                        //获取当前点开的图片地址
                index = Number(img.id);                                 //获取当前点开图片元素的index
                isPaused = false;
            } else if (count === 1) {                                   //如果当前已有点开的图片
                if (index !== Number(img.id)) {                         //如果此次点击的图片元素不是已经点开的图片元素
                    if (src === img_array[Number(img.id)]) {            //如果此次点击的图片地址和已点开的图片地址一致
                        count = 0;                                      //设置当前已点开图片为0
                        left -= 1;                                      //设置未点开的图片组数-1
                        setTimeout(function() {
                            clearOutBox(out_box_arr[index]);
                            clearOutBox(out_box_arr[Number(img.id)]);
                            isPaused = false;
                            isFinished();
                        },1000)
                    } else {                                            //如果此次点击的图片地址和已点开的图片地址不同
                        count = 0;
                        hideImg(img);
                    }
                } else {
                    isPaused = false;
                }
            }
        }
    }
}
