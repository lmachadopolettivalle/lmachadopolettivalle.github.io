function Block(x, y, w, h, options) {
    let body = Bodies.rectangle(x, y, w, h, options);
    body.velocity.x = 100;
    World.add(world, body);

    return {
        w: w,
        h: h,

        body: body,

        show: function () {
            let x = this.body.position.x;
            let y = this.body.position.y;

            rectMode(CENTER);
            rect(x, y, this.w, this.h);
        },

        remove: function () {
            World.remove(world, this.body);
        },
    }
}