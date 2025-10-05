import {Canvas} from "./Canvas.js"
import {Player} from "./Player.js"
import {Projectile} from "./Projectile.js"
import {Enemy} from "./Enemy.js"
import {Particle} from "./Particle.js"


const CANVAS = new Canvas();
const SCORE = document.querySelector('#Score')
const START_BUTTON = document.querySelector('#startButton')
const POPUP = document.querySelector('#Popup')
const POPUP_SCORE = document.querySelector('#popupScore')

let PLAYER = new Player(CANVAS.canvas.width / 2, CANVAS.canvas.height / 2, 10, 'white', CANVAS.context);

let frameCount = 0;
let Projectiles = [];
let Enemies = [];
let Particles = [];
let Score = 0

function Init() {
    CANVAS.context.fillStyle = 'rgba(0, 0, 0, 1)';
    CANVAS.context.fillRect(0, 0, CANVAS.canvas.width, CANVAS.canvas.height);
    PLAYER = new Player(CANVAS.canvas.width / 2, CANVAS.canvas.height / 2, 10, 'white', CANVAS.context);
    Enemies = [];
    Projectiles = [];
    Particles = [];
    Score = 0
    SCORE.innerHTML = POPUP_SCORE.innerHTML = Score
}

function handleTimingAndSpawning() {
    frameCount++;
    if (frameCount % 60 === 0) {
        spawnEnemies();
    }
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
    const Enemy_COLOR = `hsl(${Math.random() * 360}, 50%, 50%)`
    Enemies.push(new Enemy(x, y, radius, Enemy_COLOR, VELOCITY, CANVAS.context))
}

function renderEntities() {
    CANVAS.context.fillStyle = 'rgba(0, 0, 0, .1)';
    CANVAS.context.fillRect(0, 0, CANVAS.canvas.width, CANVAS.canvas.height);

    PLAYER.draw();
    Particles.forEach(p => p.draw());
    Projectiles.forEach(p => p.draw());
    Enemies.forEach(e => e.draw());
}

function updateEntities() {
    Particles.forEach(p => p.update());
    Projectiles.forEach(p => p.update());
    Enemies.forEach(e => e.update());
}

function handleCollisionsAndCleanup() {
    Particles = Particles.filter(p => p.alpha > 0);

    for (let i = Projectiles.length - 1; i >= 0; i--) {
        let projectile = Projectiles[i];

        if (projectile.x + projectile.radius < 0 || 
            projectile.x - projectile.radius > CANVAS.canvas.width
        ) {
            Projectiles.splice(i, 1);
            continue;
        }

        for (let j = Enemies.length - 1; j >= 0; j--) {
            let Enemy = Enemies[j];
            const DISTANCE = Math.hypot(projectile.x - Enemy.x, projectile.y - Enemy.y);

            if (DISTANCE - Enemy.radius - projectile.radius <= 0) {
                Score += 10;
                SCORE.innerHTML = Score;
                Projectiles.splice(i, 1); 
                if (Enemy.radius > 20) {
                    Enemy.radius -= 10
                } else {
                    for (let k = 0; k < Enemy.radius / 2; k++) {
                        let angle = Math.random() * Math.PI * 2;
                        let speed = Math.random() * 10 + 5
                        let velocity = {
                            x: Math.cos(angle) * speed,
                            y: Math.sin(angle) * speed
                        };
                        let particle = new Particle(
                        Enemy.x,
                        Enemy.y,
                        Math.random() * 3 + 1,
                        Enemy.color,
                        velocity,
                        CANVAS.context)  
                        Particles.push(particle)
                    }
                    Enemies.splice(j, 1)
                }
                continue;
            }
        }
    }

    for (let Enemy of Enemies) {
        const DISTANCE = Math.hypot(PLAYER.x - Enemy.x, PLAYER.y - Enemy.y);

        if (DISTANCE - Enemy.radius - PLAYER.radius < 0) {
            cancelAnimationFrame(animationID);
            POPUP_SCORE.innerHTML = Score;
            POPUP.style.display = 'flex';
            return;
        }
    }
}




let animationID
function Animate() {
    animationID = requestAnimationFrame(Animate);
    handleTimingAndSpawning();
    updateEntities();
    handleCollisionsAndCleanup();
    renderEntities();
    
}

addEventListener('click', (event) => {   

    const ANGLE = Math.atan2(event.clientY - PLAYER.y, event.clientX - PLAYER.x);
    const VELOCITY = {x: Math.cos(ANGLE),y: Math.sin(ANGLE)};

    let projectile = new Projectile(
        PLAYER.x,
        PLAYER.y,
        5,
        'red',
        VELOCITY,
        CANVAS.context)  

    Projectiles.push(projectile) 
});

START_BUTTON.addEventListener('click', () => {
    Init();
    Animate();
    POPUP.style.display = 'none';
})

