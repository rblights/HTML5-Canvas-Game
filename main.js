console.log(gsap)
const CANVAS = document.querySelector('canvas');
const CONTEXT = CANVAS.getContext('2d');
let Frames = 0;

CANVAS.width = innerWidth;
CANVAS.height = innerHeight;

const SCORE = document.querySelector('#Score')
const START_BUTTON = document.querySelector('#startButton')
const POPUP = document.querySelector('#Popup')
const POPUP_SCORE = document.querySelector('#popupScore')



class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        CONTEXT.beginPath();
        CONTEXT.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        CONTEXT.fillStyle = this.color;
        CONTEXT.fill()
    }
}

let PLAYER = new Player(CANVAS.width / 2, CANVAS.height / 2, 10, 'white');
let PROJECTILES = [];
let ENEMIES = [];
let PARTICLES = [];
let Score = 0

function Init() {
    PLAYER = new Player(CANVAS.width / 2, CANVAS.height / 2, 10, 'white');
    ENEMIES = [];
    PROJECTILES = [];
    PARTICLES = [];
    Score = 0
    SCORE.innerHTML = POPUP_SCORE.innerHTML = Score
}


class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;

    }
    draw() {
        CONTEXT.beginPath();
        CONTEXT.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        CONTEXT.fillStyle = this.color;
        CONTEXT.fill()
    }

    update() {
        this.x += this.velocity.x * 5;
        this.y += this.velocity.y * 5;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;

    }
    draw() {
        CONTEXT.beginPath();
        CONTEXT.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        CONTEXT.fillStyle = this.color;
        CONTEXT.fill()
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

function spawnEnemies() {
    let radius = Math.random() * (50 - 10) + 10
    let x
    let y
    if (Math.random() < .5) {
        x = Math.random() < .5 ? 0 - radius : CANVAS.width + radius
        y = Math.random() * CANVAS.height
    } else {
        x = Math.random() * CANVAS.width
        y = Math.random() < .5 ? 0 - radius : CANVAS.height + radius
    }
    const ANGLE = Math.atan2(PLAYER.y - y, PLAYER.x - x)
    const VELOCITY = {x: Math.cos(ANGLE), y: Math.sin(ANGLE)}
    const ENEMY_COLOR = `hsl(${Math.random() * 360}, 50%, 50%)`
    ENEMIES.push(new Enemy(x, y, radius, ENEMY_COLOR, VELOCITY))
}

class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;

    }
    draw() {
        CONTEXT.save()
        CONTEXT.globalAlpha = this.alpha
        CONTEXT.beginPath();
        CONTEXT.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        CONTEXT.fillStyle = this.color;
        CONTEXT.fill()
        CONTEXT.restore()
    }

    update() {
        this.x += this.velocity.x * .1;
        this.y += this.velocity.y * .1;
        this.alpha -= .001
    }
}

let animationID
function Animate() {
    animationID = requestAnimationFrame(Animate);
    Frames++;
    CONTEXT.fillStyle = 'rgba(0, 0, 0, .1)'
    CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);
    PLAYER.draw();

    PROJECTILES.forEach((PROJECTILE, projectileIndex) => {
        PROJECTILE.update();
        PROJECTILE.draw();
        PARTICLES.forEach((Particle, particleIndex) => {
            Particle.update();
            Particle.draw();
             if (Particle.alpha <= 0) {
                PARTICLES.splice(particleIndex, 1)
            } else {
                Particle.update();
                Particle.draw(); 
            }
        
        })

        if (Projectile.x + Projectile.radius < 0 ||
            Projectile.x - Projectile.radius > CANVAS.width ||
            Projectile.y + Projectile.radius < 0 ||
            Projectile.y - Projectile.radius > CANVAS.height
        ) {
            setTimeout(() => {
                PROJECTILES.splice(projectileIndex, 1)
            }, 0)
        }
    })
    if (Frames % 60 === 0) { spawnEnemies(); }
    ENEMIES.forEach((Enemy, enemyIndex) =>{
        Enemy.update();
        Enemy.draw();
        const DISTANCE = Math.hypot(PLAYER.x - Enemy.x, PLAYER.y - Enemy.y)

        if (DISTANCE - Enemy.radius - PLAYER.radius < 1) {
            cancelAnimationFrame(animationID)
            POPUP_SCORE.innerHTML = Score
            POPUP.style.display = 'flex'
        }

        PROJECTILES.forEach((Projectile, projectileIndex) => {
            const DISTANCE = Math.hypot(Projectile.x - Enemy.x, Projectile.y - Enemy.y)

            if (DISTANCE - Enemy.radius - Projectile.radius < 0) {
                Score += 10
                SCORE.innerHTML = Score
                if (Enemy.radius - 10 > 10) {
                    gsap.to(Enemy, {
                        radius: Enemy.radius - 10
                    })
                    setTimeout(() => {
                        PROJECTILES.splice(projectileIndex, 1)
                    }, 0)
                } else {
                    setTimeout(() => {
                        ENEMIES.splice(enemyIndex, 1)
                        PROJECTILES.splice(projectileIndex, 1)
                        for (let i = 0; i < Enemy.radius; i++) {
                            PARTICLES.push(new Particle(
                                Projectile.x, 
                                Projectile.y, 
                                Math.random() * 2, 
                                Enemy.color, 
                                {x: (Math.random() - .5) * (Math.random() * 8), y: (Math.random() - .5) * (Math.random() * 8)}))
                        }
                    
                    }, 0)
                }
            }
        })
    })
    
}

addEventListener('click', (event) => {
    const ANGLE = Math.atan2(event.clientY - PLAYER.y, event.clientX - PLAYER.x);
    const VELOCITY = {x: Math.cos(ANGLE),y: Math.sin(ANGLE)};
    PROJECTILES.push(new Projectile(
        PLAYER.x,
        PLAYER.y,
        5,
        'red',
        VELOCITY) 
    )
});

START_BUTTON.addEventListener('click', () => {
    Init();
    Animate();
    POPUP.style.display = 'none';
})

