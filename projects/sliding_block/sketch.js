// module aliases
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

let engine;
let world;

let bodies = [];

function setup() {
    let mySketchDiv = document.getElementById("my-sketch");
    let width = mySketchDiv.offsetWidth;

    let canvas = createCanvas(0.75 * width, 600);
    canvas.parent('my-sketch');

    background(0);

    // create an engine
    engine = Engine.create();

    world = engine.world;

    // create two boxes and a ground
    bodies.push(new Block(200, 100, 80, 80, {
        angle: PI / 6,
        velocity: {
            x: 0,
            y: 0
        },
    }));
    bodies.push(new Block(0, height / 2, windowWidth, 60, {
        isStatic: true,
        angle: PI / 6,
    }));
}

function draw() {
    background(0);
    fill(255);
    for (let body of bodies) {
        body.show();
    }

    if (frameCount > 20000) {
        for (let body of bodies) {
            body.remove();
        }
    }


    Engine.update(engine);
}