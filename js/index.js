
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.8

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: "./assets/background.png"
})

const shop = new Sprite({
    position: {
        x: 620,
        y: 225
    },
    imgSrc: "./assets/shop.png",
    scale: 2,
    frames: 6
})

const keys = {
    player: {
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        w: {
            pressed: false
        }
    },
    enemy: {
        al: {
            pressed: false
        },
        ar: {
            pressed: false
        },
        au: {
            pressed: false
        }
    }
}

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
})
const enemy = new Fighter({
    position: {
        x: 974,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: '#3ceaa7'
})

player.draw()
enemy.draw()

function spriteCollision(aggressor, victim) {
    return (
        aggressor.attackBox.position.x + aggressor.attackBox.width >= victim.position.x &&
        aggressor.attackBox.position.x <= victim.position.x + victim.width &&
        aggressor.attackBox.position.y + aggressor.attackBox.height >= victim.position.y &&
        aggressor.attackBox.position.y <= victim.position.y + victim.height
    )
}
let gameEnded = false
function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector("#resultDisplay").style.display = 'flex'
    if (player.health > enemy.health) {
        document.querySelector("#resultDisplay").innerHTML = 'P1 WINS'
    } else if (player.health < enemy.health) {
        document.querySelector("#resultDisplay").innerHTML = 'P2 WINS'
    }
    gameEnded = true
}

let fightTimer = 60
let timerId
function decreaseTimer() {
    if (fightTimer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        fightTimer--
        document.querySelector('#timer').innerHTML = '' + fightTimer
    }
    if (fightTimer === 0) {
        determineWinner({ player, enemy, timerId })
    }

}

var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;


// initialize the timer variables and start the animation

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    startTime = then;
    animate();
}

function animate(newtime) {

    // request another frame

    if (!gameEnded) window.requestAnimationFrame(animate)

    // calc elapsed time since last loop

    now = newtime;
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        // Put your drawing code here
        background.update()
        if (frameCount%2 == 0) {
            shop.update()
        } else {
            shop.draw()
        }
        player.update()
        enemy.update()

        //P1 move
        player.velocity.x = 0
        if (keys.player.a.pressed && player.lastKey == 'a') {
            player.velocity.x = -10
        } else if (keys.player.d.pressed && player.lastKey == 'd') {
            player.velocity.x = 10
        }

        //P2 move
        enemy.velocity.x = 0
        if (keys.enemy.al.pressed && enemy.lastKey == 'al') {
            enemy.velocity.x = -10
        } else if (keys.enemy.ar.pressed && enemy.lastKey == 'ar') {
            enemy.velocity.x = 10
        }

        // Collision p1
        if (spriteCollision(player, enemy) && player.isAttacking) {
            enemy.health -= 20
            document.querySelector('#p2hp').style.width = enemy.health + '%'
            player.isAttacking = false
        }
        // Collision p2
        if (spriteCollision(enemy, player) && enemy.isAttacking) {
            player.health -= 20
            document.querySelector('#p1hp').style.width = player.health + '%'
            enemy.isAttacking = false
        }

        // END GAME
        if (player.health <= 0 || enemy.health <= 0) {
            determineWinner({ player, enemy, timerId })
        }

        //FPS
        var sinceStart = now - startTime;
        document.querySelector('#fps').innerHTML = (Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100) + "fps";
    }

}

startAnimating(60)
decreaseTimer()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //P1
        case 'a':
            keys.player.a.pressed = true
            player.lastKey = 'a'
            player.direction = 'l'
            break
        case 'd':
            keys.player.d.pressed = true
            player.lastKey = 'd'
            player.direction = 'r'
            break
        case 'w':
            keys.player.w.pressed = true
            player.velocity.y = -20
            break
        case 'j':
            player.attack()
            break
        //P2
        case 'ArrowLeft':
            keys.enemy.al.pressed = true
            enemy.lastKey = 'al'
            enemy.direction = 'l'
            break
        case 'ArrowRight':
            keys.enemy.ar.pressed = true
            enemy.lastKey = 'ar'
            enemy.direction = 'r'
            break
        case 'ArrowUp':
            keys.enemy.au.pressed = true
            enemy.velocity.y = -20
            break
        case '4':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //P1
        case 'a':
            keys.player.a.pressed = false
            break
        case 'd':
            keys.player.d.pressed = false
            break
        case 'w':
            keys.player.w.pressed = false
            break
        //P2
        case 'ArrowLeft':
            keys.enemy.al.pressed = false
            break
        case 'ArrowRight':
            keys.enemy.ar.pressed = false
            break
        case 'ArrowUp':
            keys.enemy.au.pressed = false
            break
    }
})
































