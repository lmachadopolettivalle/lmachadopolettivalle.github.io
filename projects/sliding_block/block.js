function Block(x, y, w, h, options) {
    let angle = 0;
    console.log(options);
    if (options.angle) {
        angle = options.angle;
    }
    let body = Bodies.rectangle(x, y, w, h, options);
    World.add(world, body);

    return {
        w: w,
        h: h,
        angle: angle,

        body: body,

        show: function () {
            let x = this.body.position.x;
            let y = this.body.position.y;

            rectMode(CENTER);
            push();
            translate(x, y);
            rotate(this.angle);
            rect(0, 0, this.w, this.h);
            pop();
        },

        remove: function () {
            World.remove(world, this.body);
        },
    }
}