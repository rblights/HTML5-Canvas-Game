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
        //this.context.save()
        this.context.globalAlpha = this.alpha
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.context.fillStyle = this.color;
        this.context.fill()
        //this.context.restore()
    }

    update() {
        this.x += this.velocity.x * .1;
        this.y += this.velocity.y * .1;
        this.alpha -= .001
    }
}