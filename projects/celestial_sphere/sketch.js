let easycam;

const CONST = {
    sphereRadius: 100,

    revertMouseDragRotation: 1, // 1 or -1, 1 is for being outside sphere, -1 for inside

    numberOfStarsShown: 200,
};

// Each special point has {RA, Dec, Name}
let starsX = [];
let starsY = [];
let starsZ = [];

let starTable;
let starObjects;

function preload() {
    starTable = loadTable("/assets/hygfull.csv", "csv", "header");
}

function setup() {
    for (let i = 0; i < CONST.numberOfStarsShown; i++) {
        let star = starTable.getObject()[floor(85000 * i / CONST.numberOfStarsShown)];
        XYZ = XYZfromRADec(star.RA, star.Dec);
        x = XYZ.x;
        y = XYZ.y;
        z = XYZ.z;

        starsX.push(x);
        starsY.push(y);
        starsZ.push(z);
    }


    createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);

    // For conversion from RA/DEC to x, y, z
    // Since RA, DEC are in degrees in .csv file
    angleMode(DEGREES);

    // For Great Circles
    ellipseMode(RADIUS);

    // Fix to "renderer.camera is not a function" issue
    // From https://github.com/diwi/p5.EasyCam/issues/5
    Dw.EasyCam.prototype.apply = function (n) {
        var o = this.cam;
        n = n || o.renderer,
            n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
    };

    // Make mouse drag rotation go to opposite direction when inside vs. outside sphere
    // See variable 'CONST.revertMouseDragRotation'
    Dw.EasyCam.prototype.mouseDragRotate = function () {
        var cam = this;
        var mouse = cam.mouse;

        var mx = mouse.curr[0],
            my = mouse.curr[1];
        var dx = CONST.revertMouseDragRotation * mouse.dist[0],
            dy = CONST.revertMouseDragRotation * mouse.dist[1];

        // mouse [-1, +1]
        var mxNdc = Math.min(Math.max((mx - cam.viewport[0]) / cam.viewport[2], 0), 1) * 2 - 1;
        var myNdc = Math.min(Math.max((my - cam.viewport[1]) / cam.viewport[3], 0), 1) * 2 - 1;

        if (cam.DRAG_CONSTRAINT & cam.AXIS.YAW) {
            cam.dampedRotY.addForce(+dx * (1.0 - myNdc * myNdc));
        }
        if (cam.DRAG_CONSTRAINT & cam.AXIS.PITCH) {
            cam.dampedRotX.addForce(-dy * (1.0 - mxNdc * mxNdc));
        }
        if (cam.DRAG_CONSTRAINT & cam.AXIS.ROLL) {
            cam.dampedRotZ.addForce(-dx * myNdc);
            cam.dampedRotZ.addForce(+dy * mxNdc);
        }
    }

    // From https://jsfiddle.net/93a5xjyv/
    easycam = createEasyCam({
        distance: 300,
    });

    // Reduce wobbling. See https://github.com/diwi/p5.EasyCam/issues/1
    easycam.setRotationConstraint(true, true, false);

    // Prevent from zooming too far out which would make the sphere disappear
    easycam.setDistanceMax(750);

    // TODO : find out why these exist
    document.oncontextmenu = function () {
        return false;
    }
    document.onmousedown = function () {
        return false;
    }
}


//function windowResized() {
//    resizeCanvas(windowWidth, windowHeight);
//    easycam.setViewport([0, 0, windowWidth, windowHeight]);
//}


function draw() {
    if (frameCount > 2000) {
        noLoop();
    }
    perspective(60 * PI / 180, width / height, 1, 5000);

    // Black background
    background(0);

    // Sphere

    // For night sky colors, see https://www.color-hex.com/color-palette/4619
    //fill(19, 24, 98, 100);
    fill(46, 68, 130, 250);

    stroke(255);
    strokeWeight(0.5);
    noStroke();

    sphere(CONST.sphereRadius);

    // Great Circles
    // Ecliptic, Green
    stroke(0, 255, 0);

    push();
    rotateX(90);
    rotateY(-23);
    noFill();
    ellipse(0, 0, CONST.sphereRadius, CONST.sphereRadius, 50);
    pop();

    // Celestial Equator, Green
    stroke(255, 0, 0);

    push();
    rotateX(90);
    noFill();
    ellipse(0, 0, CONST.sphereRadius, CONST.sphereRadius, 50);
    pop();


    // Important Points
    strokeWeight(16);

    // North, Red
    stroke(255, 0, 0);
    point(0, -CONST.sphereRadius, 0);

    // Vernal, Blue
    stroke(0, 0, 255);
    point(0, 0, CONST.sphereRadius);

    // Center, Black
    stroke(0);
    point(0, 0, 0);


    // Draw stars
    stroke(255);
    strokeWeight(4);

    for (let i = 0; i < CONST.numberOfStarsShown; i++) {
        point(starsX[i], starsY[i], starsZ[i]);
    }

    if (easycam.getDistance() < 1.4 * CONST.sphereRadius) {
        CONST.revertMouseDragRotation = -1;
    } else {
        CONST.revertMouseDragRotation = 1;
    }
}

// x : Horizontal
// y : Vertical
// z : Through screen
// RA in hours, DEC in degrees
function XYZfromRADec(RA, DEC) {
    let ra = RA * 15; // 15 degrees for each hour
    return {
        x: CONST.sphereRadius * cos(DEC) * sin(ra),
        y: -1 * CONST.sphereRadius * sin(DEC),
        z: CONST.sphereRadius * cos(DEC) * cos(ra)
    };
}