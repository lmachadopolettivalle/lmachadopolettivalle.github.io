class Boid {
  constructor() {
    this.max_vel = 8;
    this.max_force = 1;

    this.position = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.vel.setMag(random(2, 4));
    this.acc = createVector(0, 0);
  }

  flock(flock) {
    let cohesion_strength = cohesionSlider.value();
    let alignment_strength = alignSlider.value();
    let separation_strength = separationSlider.value();

    let cohesion = this.cohesion(flock);
    let alignment = this.alignment(flock);
    let separation = this.separation(flock);

    cohesion.mult(cohesion_strength);
    alignment.mult(alignment_strength);
    separation.mult(separation_strength);

    this.acc.add(alignment);
    this.acc.add(cohesion);
    this.acc.add(separation);
  }

  cohesion(flock) {
    const cohesion_radius = 100;

    let avg = createVector();
    let total = 0;

    for (let other of flock) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);

      if (this != other && d < cohesion_radius) {
        avg.add(other.position);
        total++;
      }
    }

    if (total > 0) {
      avg.div(total);
      avg.sub(this.position);
      avg.setMag(this.max_vel);
      avg.sub(this.vel);
      avg.limit(this.max_force);
    }

    return avg;
  }

  alignment(flock) {
    const alignment_radius = 50;

    let avg = createVector();
    let total = 0;

    for (let other of flock) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);

      if (this != other && d < alignment_radius) {
        avg.add(other.vel);
        total++;
      }
    }

    if (total > 0) {
      avg.div(total);
      avg.setMag(this.max_vel);
      avg.sub(this.vel);
      avg.limit(this.max_force);
    }

    return avg;
  }

  separation(flock) {
    const separation_radius = 50;

    let avg = createVector();
    let total = 0;

    for (let other of flock) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);

      if (this != other && d < separation_radius) {
        let diff = p5.Vector.sub(this.position, other.position);
        if (d > 0) {
          diff.div(d * d);
        }
        avg.add(diff);
        total++;
      }
    }

    if (total > 0) {
      avg.div(total);
      avg.setMag(this.max_vel);
      avg.sub(this.vel);
      avg.limit(this.max_force);
    }

    return avg;
  }

  update() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }

    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }

    this.position.add(this.vel);
    this.vel.add(this.acc);
    this.vel.limit(this.max_vel);
    this.acc.mult(0);
  }

  show() {
    fill(255);
    push();
    translate(this.position.x, this.position.y);
    let angle = atan2(this.vel.y, this.vel.x);
    rotate(angle + HALF_PI);
    let offset = 10;
    triangle(-offset * 0.5, offset, offset * 0.5, offset, 0, -offset / 2);
    //ellipse(this.position.x, this.position.y, 10);
    pop();
  }
}