export const ChernoffElements = {
    drawNose,
    drawHead,
    drawEyes,
    drawMouth,
    drawEyebrow
}

/**
 * Funkcja rysująca nos.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Współrzędna X w obrębie twarzy.
 * @param {number} y - Współrzędna Y w obrębie twarzy.
 * @param {number} type - 1, 2 lub 3
 */
function drawNose(ctx, x, y, type) {

    ctx.beginPath();
    ctx.moveTo(x + 25, y + 20);
    switch (type) {
        case 1:
            ctx.lineTo(x + 23, y + 25);
            ctx.lineTo(x + 27, y + 25);
            break;
        case 2:
            ctx.lineTo(x + 20, y + 25);
            ctx.lineTo(x + 30, y + 25);
            break;
        case 3:
            ctx.lineTo(x + 20, y + 32);
            ctx.lineTo(x + 30, y + 32);
            break;
    }
    ctx.lineTo(x + 25, y + 20);
    ctx.stroke();
}

/**
 * Funkcja rysująca głowę.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Współrzędna X w obrębie twarzy.
 * @param {number} y - Współrzędna Y w obrębie twarzy.
 * @param {number} type - 1, 2 lub 3
 */
function drawHead(ctx, x, y, type) {

    switch (type) {
        case 1:
            drawEllipse(ctx, (x - /*width*/30 / 2.0) + 25, (y - 50 / 2.0) + 25, /*width*/30, 50);
            break;
        case 2:
            drawEllipse(ctx, (x - /*width*/40 / 2.0) + 25, (y - 50 / 2.0) + 25, /*width*/40, 50);
            break;
        case 3:
            drawEllipse(ctx, (x - /*width*/50 / 2.0) + 25, (y - 50 / 2.0) + 25, /*width*/50, 50);
            break;
    }
}

/**
 * Funkcja rysująca oczy.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Współrzędna X w obrębie twarzy.
 * @param {number} y - Współrzędna Y w obrębie twarzy.
 * @param {number} type - 1, 2 lub 3
 */
function drawEyes(ctx, x, y, type) {

    var size;
    switch (type) {
        case 1:
            size = 6;
            break;
        case 2:
            size = 10;
            break;
        case 3:
            size = 15;
            break;
    }

    drawEllipseByCenter(ctx, x + 15, y + 15, size, size);
    drawEllipseByCenter(ctx, x + 35, y + 15, size, size);
    drawEllipseByCenter(ctx, x + 15, y + 15, size - 5, size - 5);
    drawEllipseByCenter(ctx, x + 35, y + 15, size - 5, size - 5);
}

/**
 * Funkcja rysująca usta.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Współrzędna X w obrębie twarzy.
 * @param {number} y - Współrzędna Y w obrębie twarzy.
 * @param {number} type - 1, 2 lub 3
 */
function drawMouth(ctx, x, y, type) {

    ctx.beginPath();
    switch (type) {
        case 3:
            ctx.arc(x + 25, y + 25, 20, 0.25 * Math.PI, 0.75 * Math.PI);
            break;
        case 2:
            ctx.moveTo(x + 15, y + 40);
            ctx.lineTo(x + 35, y + 40);
            break;
        case 1:
            ctx.arc(x + 25, y + 55, 20, 1.25 * Math.PI, 1.75 * Math.PI);
            break;
    }
    ctx.lineWidth = 2;
    ctx.stroke();
}

/**
 * Funkcja rysująca brwi.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Współrzędna X w obrębie twarzy.
 * @param {number} y - Współrzędna Y w obrębie twarzy.
 * @param {number} type - 1, 2 lub 3
 */
function drawEyebrow(ctx, x, y, type) {

    ctx.beginPath();
    switch (type) {
        case 1:
            //lewa1
            ctx.moveTo(x + 5, y + 15);
            ctx.lineTo(x + 20, y + 5);
            //prawa1
            ctx.moveTo(x + 30, y + 5);
            ctx.lineTo(x + 45, y + 15);
            break;
        case 2:
            //lewa2
            ctx.moveTo(x + 8, y + 8);
            ctx.lineTo(x + 20, y + 8);
            //prawa2
            ctx.moveTo(x + 30, y + 8);
            ctx.lineTo(x + 42, y + 8);
            break;
        case 3:
            //lewa3
            ctx.moveTo(x + 8, y + 5);
            ctx.lineTo(x + 20, y + 8);
            //prawa3
            ctx.moveTo(x + 30, y + 8);
            ctx.lineTo(x + 42, y + 5);
            break;
    }
    ctx.lineWidth = 3;
    ctx.stroke();
}

/**
 * Funkcja rysująca elipsę.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Współrzędna X środka elipsy.
 * @param {number} y - Współrzędna Y środka elipsy.
 * @param {number} w - Szerokość elipsy.
 * @param {number} h - Wysokość elipsy.
 */
function drawEllipseByCenter(ctx, x, y, w, h) {

    drawEllipse(ctx, x - w / 2.0, y - h / 2.0, w, h);
}

/**
 * Funkcja rysująca elipsę.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Współrzędna X elipsy.
 * @param {number} y - Współrzędna Y elipsy.
 * @param {number} w - Szerokość elipsy.
 * @param {number} h - Wysokość elipsy.
 */
function drawEllipse(ctx, x, y, w, h) {

    var kappa = .5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.lineWidth = 1;
    ctx.stroke();
}