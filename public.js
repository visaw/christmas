var container = document.getElementById("container");
var img_arr = document.getElementsByTagName("img");
var out_box_arr = document.getElementsByClassName("outbox");
var count = 0;
var src = null;
var index = null;
var width = out_box_arr[0].clientWidth;
var height = out_box_arr[0].clientHeight;
var isStart = false;
var isPaused = false;
var img_array = [1,1,2,2,3,3,4,4,5,5,6,6];
img_array.sort(randomSort);
var left = 6;

var time = 0;
var calTime = null;

/**
 * 游戏开始
 */
function start() {
    clearInterval(calTime);
    document.getElementById("start").disabled = "disabled";
    for (var i = 0; i < img_array.length; i++) {
        var img = img_arr[i];
        img.src = "images/" + img_array[i] + ".jpg";
    }
    setTimeout(function() {
        for (var j = 0; j < img_array.length; j++) {
            var img = img_arr[j];
            img.src = "images/7.jpg";
        }
        isStart = true;
    }, 5000);

    calTime = setInterval(function() {
        time += 1;
    }, 1000)
}

/**
 * 用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
 * @param a
 * @param b
 * @returns {number}
 */
function randomSort(a, b) {
    return Math.random()>.5 ? -1 : 1;
}

function clearOutBox(obj) {
    obj.style.width = width + "px";
    obj.style.height = height + "px";
    if (obj.getElementsByTagName("img").length > 0) {
        obj.removeChild(obj.getElementsByTagName("img")[0]);
        var img = document.createElement("img");
        obj.append(img);
    }
}

function clickImg(event) {
    if (!isPaused) {
        if(isStart) {
            isPaused = true;
            var img = event.target;
            img.src = "images/" + img_array[Number(img.id)] + ".jpg";
            if (count === 0) {
                count = 1;
                src = img_array[Number(img.id)];
                index = Number(img.id);
                isPaused = false;
            } else if (count === 1) {
                if (index !== Number(img.id)) {
                    if (src === img_array[Number(img.id)]) {
                        count = 0;
                        left -= 1;
                        setTimeout(function() {
                            clearOutBox(out_box_arr[index]);
                            clearOutBox(out_box_arr[Number(img.id)]);
                            isPaused = false;
                            if (left === 0) {
                                clearInterval(calTime);
                                alert("恭喜你用时" + time + "s找到你家娃")
                            }
                        },1000)
                    } else {
                        count = 0;
                        setTimeout(function() {
                            img_arr[index].src = "images/7.jpg";
                            img.src = "images/7.jpg";
                            isPaused = false;
                        },1000)
                    }
                } else {
                    isPaused = false;
                }
            }
        }
    }
}
