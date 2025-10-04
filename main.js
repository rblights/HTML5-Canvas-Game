import {Canvas} from "./Canvas.js"
import {Player} from "./Player.js"
import {Projectile} from "./Projectile.js"
import {Enemy} from "./Enemy.js"
import {Particle} from "./Particle.js"


const CANVAS = new Canvas();

console.log(gsap)
let Frames = 0;

const SCORE = document.querySelector('#Score')
const START_BUTTON = document.querySelector('#startButton')
const POPUP = document.querySelector('#Popup')
const POPUP_SCORE = document.querySelector('#popupScore')

let PLAYER = new Player(CANVAS.canvas.width / 2, CANVAS.canvas.height / 2, 10, 'white', CANVAS.context);
console.log(PLAYER)
let PROJECTILES = [];
let ENEMIES = [];
let PARTICLES = [];
let Score = 0

console.log(CANVAS.context === PLAYER.context) //true

function Init() {
    PLAYER = new Player(CANVAS.canvas.width / 2, CANVAS.canvas.height / 2, 10, 'white', CANVAS.context);
    ENEMIES = [];
    PROJECTILES = [];
    PARTICLES = [];
    Score = 0
    SCORE.innerHTML = POPUP_SCORE.innerHTML = Score
}

function spawnEnemies() {
    let radius = Math.random() * (50 - 10) + 10
    let x
    let y
    if (Math.random() < .5) {
        x = Math.random() < .5 ? 0 - radius : CANVAS.canvas.width + radius
        y = Math.random() * CANVAS.canvas.height
    } else {
        x = Math.random() * CANVAS.canvas.width
        y = Math.random() < .5 ? 0 - radius : CANVAS.canvas.height + radius
    }
    const ANGLE = Math.atan2(PLAYER.y - y, PLAYER.x - x)
    const VELOCITY = {x: Math.cos(ANGLE), y: Math.sin(ANGLE)}
    const ENEMY_COLOR = `hsl(${Math.random() * 360}, 50%, 50%)`
    ENEMIES.push(new Enemy(x, y, radius, ENEMY_COLOR, VELOCITY, CANVAS.context))
}



let animationID
function Animate() {
    animationID = requestAnimationFrame(Animate);
    Frames++;
    CANVAS.context.fillStyle = 'rgba(0, 0, 0, .1)'
    CANVAS.context.fillRect(0, 0, CANVAS.canvas.width, CANVAS.canvas.height);
    PLAYER.draw();

    PROJECTILES.forEach((PROJECTILE, projectileIndex) => {
        PROJECTILE.update();
        PROJECTILE.draw();
        PARTICLES.forEach((Particle, particleIndex) => {
             if (Particle.alpha <= 0) {
                PARTICLES.splice(particleIndex, 1)
            } else {
                Particle.update();
                Particle.draw(); 
            }
        
        })

        if (PROJECTILE.x + PROJECTILE.radius < 0 ||
            PROJECTILE.x - PROJECTILE.radius > CANVAS.canvas.width ||
            PROJECTILE.y + PROJECTILE.radius < 0 ||
            PROJECTILE.y - PROJECTILE.radius > CANVAS.canvas.height
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
                    window.gsap.to(Enemy, {
                        radius: Enemy.radius - 10
                    })
                    setTimeout(() => {
                        PROJECTILES.splice(projectileIndex, 1)
                    }, 0)
                } else {
                    setTimeout(() => {
                        ENEMIES.splice(enemyIndex, 1)
                        PROJECTILES.splice(projectileIndex, 1)
                        for (let i = 0; i < Enemy.radius / 2; i++) {
                            PARTICLES.push(new Particle(
                                Projectile.x, 
                                Projectile.y, 
                                Math.random() * 2, 
                                Enemy.color, 
                                {x: (Math.random() - .5) * (Math.random() * 8), y: (Math.random() - .5) * (Math.random() * 8)},
                                CANVAS.context))
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

    const PROJECTILE = new Projectile(
        PLAYER.x,
        PLAYER.y,
        5,
        'red',
        VELOCITY,
        CANVAS.context)  

    PROJECTILES.push(PROJECTILE) 
});

START_BUTTON.addEventListener('click', () => {
    Init();
    Animate();
    POPUP.style.display = 'none';
})

