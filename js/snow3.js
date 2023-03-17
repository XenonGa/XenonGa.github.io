/*样式二*/
/* 控制下雪 */
function snowFall(snow) {
    /* 可配置属性 */
    snow = snow || {};
    this.maxFlake = snow.maxFlake || 200; /* 最多片数 */
    this.flakeSize = snow.flakeSize || 10; /* 雪花形状 */
    this.fallSpeed = snow.fallSpeed || 1; /* 坠落速度 */
}
/* 兼容写法 */
requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) {
        setTimeout(callback, 1000 / 60);
    };

cancelAnimationFrame = window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    window.oCancelAnimationFrame;
/* 开始下雪 */
snowFall.prototype.start = function () {
    /* 创建画布 */
    snowCanvas.apply(this);
    /* 创建雪花形状 */
    createFlakes.apply(this);
    /* 画雪 */
    drawSnow.apply(this)
}
/* 创建画布 */
function snowCanvas() {
    /* 添加Dom结点 */
    var snowcanvas = document.createElement("canvas");
    snowcanvas.id = "snowfall";
    snowcanvas.width = window.innerWidth;
    snowcanvas.height = document.body.clientHeight;
    snowcanvas.setAttribute("style", "position:absolute; top: 0; left: 0; z-index: 1; pointer-events: none;");
    document.getElementsByTagName("body")[0].appendChild(snowcanvas);
    this.canvas = snowcanvas;
    this.ctx = snowcanvas.getContext("2d");
    /* 窗口大小改变的处理 */
    window.onresize = function () {
        snowcanvas.width = window.innerWidth;
        /* snowcanvas.height = window.innerHeight */
    }
}
/* 雪运动对象 */
function flakeMove(canvasWidth, canvasHeight, flakeSize, fallSpeed) {
    this.x = Math.floor(Math.random() * canvasWidth); /* x坐标 */
    this.y = Math.floor(Math.random() * canvasHeight); /* y坐标 */
    this.size = Math.random() * flakeSize + 2; /* 形状 */
    this.maxSize = flakeSize; /* 最大形状 */
    this.speed = Math.random() * 1 + fallSpeed; /* 坠落速度 */
    this.fallSpeed = fallSpeed; /* 坠落速度 */
    this.velY = this.speed; /* Y方向速度 */
    this.velX = 0; /* X方向速度 */
    this.stepSize = Math.random() / 30; /* 步长 */
    this.step = 0 /* 步数 */
}
flakeMove.prototype.update = function () {
    var x = this.x,
        y = this.y;
    /* 左右摆动(余弦) */
    this.velX *= 0.98;
    if (this.velY <= this.speed) {
        this.velY = this.speed
    }
    this.velX += Math.cos(this.step += .05) * this.stepSize;

    this.y += this.velY;
    this.x += this.velX;
    /* 飞出边界的处理 */
    if (this.x >= canvas.width || this.x <= 0 || this.y >= canvas.height || this.y <= 0) {
        this.reset(canvas.width, canvas.height)
    }
};
/* 飞出边界-放置最顶端继续坠落 */
flakeMove.prototype.reset = function (width, height) {
    this.x = Math.floor(Math.random() * width);
    this.y = 0;
    this.size = Math.random() * this.maxSize + 2;
    this.speed = Math.random() * 1 + this.fallSpeed;
    this.velY = this.speed;
    this.velX = 0;
};
// 渲染雪花-随机形状（此处可修改雪花颜色！！！）
flakeMove.prototype.render = function (ctx) {
    var snowFlake = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    snowFlake.addColorStop(0, "rgba(255, 255, 255, 0.9)"); /* 此处是雪花颜色，默认是白色 */
    snowFlake.addColorStop(.5, "rgba(255, 255, 255, 0.5)"); /* 若要改为其他颜色，请自行查 */
    snowFlake.addColorStop(1, "rgba(255, 255, 255, 0)"); /* 找16进制的RGB 颜色代码。 */
    ctx.save();
    ctx.fillStyle = snowFlake;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
};
/* 创建雪花-定义形状 */
function createFlakes() {
    var maxFlake = this.maxFlake,
        flakes = this.flakes = [],
        canvas = this.canvas;
    for (var i = 0; i < maxFlake; i++) {
        flakes.push(new flakeMove(canvas.width, canvas.height, this.flakeSize, this.fallSpeed))
    }
}
/* 画雪 */
function drawSnow() {
    var maxFlake = this.maxFlake,
        flakes = this.flakes;
    ctx = this.ctx, canvas = this.canvas, that = this;
    /* 清空雪花 */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var e = 0; e < maxFlake; e++) {
        flakes[e].update();
        flakes[e].render(ctx);
    }
    /*  一帧一帧的画 */
    this.loop = requestAnimationFrame(function () {
        drawSnow.apply(that);
    });
}
/* 调用及控制方法 */
var snow = new snowFall({
    maxFlake: 60
});
snow.start();


"use strict";

function updateCoords(e) {
    pointerX = (e.clientX || e.touches[0].clientX) - canvasEl.getBoundingClientRect().left, pointerY = e.clientY || e.touches[
        0].clientY - canvasEl.getBoundingClientRect().top
}

function setParticuleDirection(e) {
    var t = anime.random(0, 360) * Math.PI / 180,
        a = anime.random(50, 180),
        n = [-1, 1][anime.random(0, 1)] * a;
    return {
        x: e.x + n * Math.cos(t),
        y: e.y + n * Math.sin(t)
    }
}

function createParticule(e, t) {
    var a = {};
    return a.x = e, a.y = t, a.color = colors[anime.random(0, colors.length - 1)], a.radius = anime.random(16, 32), a.endPos =
        setParticuleDirection(a), a.draw = function () {
            ctx.beginPath(), ctx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, !0), ctx.fillStyle = a.color, ctx.fill()
        }, a
}

function createCircle(e, t) {
    var a = {};
    return a.x = e, a.y = t, a.color = "#F00", a.radius = 0.1, a.alpha = 0.5, a.lineWidth = 6, a.draw = function () {
        ctx.globalAlpha = a.alpha, ctx.beginPath(), ctx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, !0), ctx.lineWidth =
            a.lineWidth, ctx.strokeStyle = a.color, ctx.stroke(), ctx.globalAlpha = 1
    }, a
}

function renderParticule(e) {
    for (var t = 0; t < e.animatables.length; t++) {
        e.animatables[t].target.draw()
    }
}

function animateParticules(e, t) {
    for (var a = createCircle(e, t), n = [], i = 0; i < numberOfParticules; i++) {
        n.push(createParticule(e, t))
    }
    anime.timeline().add({
        targets: n,
        x: function (e) {
            return e.endPos.x
        },
        y: function (e) {
            return e.endPos.y
        },
        radius: 0.1,
        duration: anime.random(1200, 1800),
        easing: "easeOutExpo",
        update: renderParticule
    }).add({
        targets: a,
        radius: anime.random(80, 160),
        lineWidth: 0,
        alpha: {
            value: 0,
            easing: "linear",
            duration: anime.random(600, 800)
        },
        duration: anime.random(1200, 1800),
        easing: "easeOutExpo",
        update: renderParticule,
        offset: 0
    })
}

function debounce(e, t) {
    var a;
    return function () {
        var n = this,
            i = arguments;
        clearTimeout(a), a = setTimeout(function () {
            e.apply(n, i)
        }, t)
    }
}
var canvasEl = document.querySelector(".fireworks");
if (canvasEl) {
    var ctx = canvasEl.getContext("2d"),
        numberOfParticules = 30,
        pointerX = 0,
        pointerY = 0,
        tap = "mousedown",
        colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"],
        setCanvasSize = debounce(function () {
            canvasEl.width = 2 * window.innerWidth, canvasEl.height = 2 * window.innerHeight, canvasEl.style.width =
                window.innerWidth + "px", canvasEl.style.height = window.innerHeight + "px", canvasEl.getContext(
                    "2d").scale(2, 2)
        }, 500),
        render = anime({
            duration: 1 / 0,
            update: function () {
                ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
            }
        });
    document.addEventListener(tap, function (e) {
        "sidebar" !== e.target.id && "toggle-sidebar" !== e.target.id && "A" !== e.target.nodeName && "IMG" !==
            e.target.nodeName && (render.play(), updateCoords(e), animateParticules(pointerX, pointerY))
    }, !1), setCanvasSize(), window.addEventListener("resize", setCanvasSize, !1)
}
"use strict";

function updateCoords(e) {
    pointerX = (e.clientX || e.touches[0].clientX) - canvasEl.getBoundingClientRect().left, pointerY = e.clientY || e.touches[
        0].clientY - canvasEl.getBoundingClientRect().top
}

function setParticuleDirection(e) {
    var t = anime.random(0, 360) * Math.PI / 180,
        a = anime.random(50, 180),
        n = [-1, 1][anime.random(0, 1)] * a;
    return {
        x: e.x + n * Math.cos(t),
        y: e.y + n * Math.sin(t)
    }
}

function createParticule(e, t) {
    var a = {};
    return a.x = e, a.y = t, a.color = colors[anime.random(0, colors.length - 1)], a.radius = anime.random(16, 32), a.endPos =
        setParticuleDirection(a), a.draw = function () {
            ctx.beginPath(), ctx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, !0), ctx.fillStyle = a.color, ctx.fill()
        }, a
}

function createCircle(e, t) {
    var a = {};
    return a.x = e, a.y = t, a.color = "#F00", a.radius = 0.1, a.alpha = 0.5, a.lineWidth = 6, a.draw = function () {
        ctx.globalAlpha = a.alpha, ctx.beginPath(), ctx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, !0), ctx.lineWidth =
            a.lineWidth, ctx.strokeStyle = a.color, ctx.stroke(), ctx.globalAlpha = 1
    }, a
}

function renderParticule(e) {
    for (var t = 0; t < e.animatables.length; t++) {
        e.animatables[t].target.draw()
    }
}

function animateParticules(e, t) {
    for (var a = createCircle(e, t), n = [], i = 0; i < numberOfParticules; i++) {
        n.push(createParticule(e, t))
    }
    anime.timeline().add({
        targets: n,
        x: function (e) {
            return e.endPos.x
        },
        y: function (e) {
            return e.endPos.y
        },
        radius: 0.1,
        duration: anime.random(1200, 1800),
        easing: "easeOutExpo",
        update: renderParticule
    }).add({
        targets: a,
        radius: anime.random(80, 160),
        lineWidth: 0,
        alpha: {
            value: 0,
            easing: "linear",
            duration: anime.random(600, 800)
        },
        duration: anime.random(1200, 1800),
        easing: "easeOutExpo",
        update: renderParticule,
        offset: 0
    })
}

function debounce(e, t) {
    var a;
    return function () {
        var n = this,
            i = arguments;
        clearTimeout(a), a = setTimeout(function () {
            e.apply(n, i)
        }, t)
    }
}
var canvasEl = document.querySelector(".fireworks");
if (canvasEl) {
    var ctx = canvasEl.getContext("2d"),
        numberOfParticules = 30,
        pointerX = 0,
        pointerY = 0,
        tap = "mousedown",
        colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"],
        setCanvasSize = debounce(function () {
            canvasEl.width = 2 * window.innerWidth, canvasEl.height = 2 * window.innerHeight, canvasEl.style.width =
                window.innerWidth + "px", canvasEl.style.height = window.innerHeight + "px", canvasEl.getContext(
                    "2d").scale(2, 2)
        }, 500),
        render = anime({
            duration: 1 / 0,
            update: function () {
                ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
            }
        });
    document.addEventListener(tap, function (e) {
        "sidebar" !== e.target.id && "toggle-sidebar" !== e.target.id && "A" !== e.target.nodeName && "IMG" !==
            e.target.nodeName && (render.play(), updateCoords(e), animateParticules(pointerX, pointerY))
    }, !1), setCanvasSize(), window.addEventListener("resize", setCanvasSize, !1)
};

