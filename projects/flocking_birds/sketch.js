let flock = [];
let NUM_BOIDS = 130;

let alignSlider, cohesionSlider, separationSlider;

function setup() {

  let mySketchDiv = document.getElementById("my-sketch");
  let width = mySketchDiv.offsetWidth;

  let canvas = createCanvas(0.9 * width, 600);
  canvas.parent('my-sketch');


  alignSlider = createSlider(0, 2, 0.5, 0.1);
  cohesionSlider = createSlider(0, 2, 0.8, 0.1);
  separationSlider = createSlider(0, 2, 1, 0.1);

  for (let i = 0; i < NUM_BOIDS; ++i) {
    flock.push(new Boid);
  }
}

function draw() {
  background(0);
  for (let boid of flock) {
    boid.flock(flock);
    boid.update();
    boid.show();
  }
}