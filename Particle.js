export class Particle {
    constructor(x, y, radius, color, velocity, context) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.context = context;

    }
    draw() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.context.fillStyle = this.color;
        this.context.fill()
    }

    update() {
        this.x += this.velocity.x * .1;
        this.y += this.velocity.y * .1;
        this.alpha -= .01
    }
}