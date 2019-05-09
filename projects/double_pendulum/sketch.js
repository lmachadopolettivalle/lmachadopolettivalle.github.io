let a1;
let a2;

let a1_v;
let a2_v;

let r1 = 150.;
let r2 = 150.;
let m1 = 10.;
let m2 = 10.;
let g = 0.6;

let path1 = [];
let path2 = [];

function setup() {
    let mySketchDiv = document.getElementById("my-sketch");
    let width = mySketchDiv.offsetWidth;

    let canvas = createCanvas(0.8 * width, 600);
    canvas.parent('my-sketch');

    a1 = PI / 2;
    a2 = PI / 2;

    a1_v = 0.;
    a2_v = 0.;

    a3 = PI / 3;
    a4 = PI / 2;

    a3_v = random(0.01);
    a4_v = random(0.01);
}

function draw() {
    background(255);
    translate(width / 2, height / 3);

    // Reset before floating point imprecision adds up and creates messy values
    if (frameCount % 3000 == 0) {
        a1 = PI / 2;
        a2 = PI / 2;

        a1_v = 0.;
        a2_v = 0.;

        a3 = PI / 2;
        a4 = PI / 2;

        a3_v = random(0.01);
        a4_v = random(0.01);

        path1 = [];
        path2 = [];
    }

    let num1 = -g * (2 * m1 + m2) * sin(a1);
    let num2 = -m2 * g * sin(a1 - 2 * a2);
    let num3 = -2 * sin(a1 - a2) * m2;
    let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * cos(a1 - a2);
    let den = r1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a1_a = (num1 + num2 + num3 * num4) / den;

    num1 = 2 * sin(a1 - a2);
    num2 = (a1_v * a1_v * r1 * (m1 + m2));
    num3 = g * (m1 + m2) * cos(a1);
    num4 = a2_v * a2_v * r2 * m2 * cos(a1 - a2);
    den = r2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a2_a = (num1 * (num2 + num3 + num4)) / den;

    a1_v += a1_a;
    a2_v += a2_a;

    a1 += a1_v;
    a2 += a2_v;

    let x1 = r1 * sin(a1);
    let y1 = r1 * cos(a1);

    let x2 = x1 + r2 * sin(a2);
    let y2 = y1 + r2 * cos(a2);

    show(x1, y1, x2, y2);

    path1.push(createVector(x2, y2));

    // Second double pendulum (blue)
    num1 = -g * (2 * m1 + m2) * sin(a3);
    num2 = -m2 * g * sin(a3 - 2 * a4);
    num3 = -2 * sin(a3 - a4) * m2;
    num4 = a4_v * a4_v * r2 + a3_v * a3_v * r1 * cos(a3 - a4);
    den = r1 * (2 * m1 + m2 - m2 * cos(2 * a3 - 2 * a4));
    let a3_a = (num1 + num2 + num3 * num4) / den;

    num1 = 2 * sin(a3 - a4);
    num2 = (a3_v * a3_v * r1 * (m1 + m2));
    num3 = g * (m1 + m2) * cos(a3);
    num4 = a4_v * a4_v * r2 * m2 * cos(a3 - a4);
    den = r2 * (2 * m1 + m2 - m2 * cos(2 * a3 - 2 * a4));
    let a4_a = (num1 * (num2 + num3 + num4)) / den;

    a3_v += a3_a;
    a4_v += a4_a;

    a3 += a3_v;
    a4 += a4_v;

    let x3 = r1 * sin(a3);
    let y3 = r1 * cos(a3);

    let x4 = x3 + r2 * sin(a4);
    let y4 = y3 + r2 * cos(a4);

    show(x3, y3, x4, y4);

    path2.push(createVector(x4, y4));


    showPath(path1, color(255, 0, 0));
    showPath(path2, color(0, 0, 255));
}

function show(x1, y1, x2, y2) {
    stroke(0);
    strokeWeight(8);
    point(0, 0);
    point(x1, y1);
    point(x2, y2);

    strokeWeight(2);
    line(0, 0, x1, y1);
    line(x1, y1, x2, y2);
}

function showPath(path, cor) {
    noFill();
    stroke(cor);
    beginShape();
    for (let v of path) {
        vertex(v.x, v.y);
    }
    if (path.length > 600) {
        path.shift();
    }
    endShape();
}