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
    bodies.push(new Block(200, 200, 80, 80, {
        restitution: 2,
        velocity: {
            x: 1,
            y: 0
        },
    }));
    bodies.push(new Block(400, 50, 80, 80, {
        restitution: 2
    }));
    bodies.push(new Block(width / 2, 500, windowWidth, 60, {
        isStatic: true,
        restitution: 2,
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