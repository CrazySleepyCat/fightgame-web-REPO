const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.8

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

class Sprite {
    constructor({ position, velocity, color = '#ea3c53' }) {
        this.position = position
        this.velocity = velocity
        this.color = color
        this.height = 150
        this.width = 50
        this.lastKey = 'none'
        this.isAttacking = false
        this.direction = 'r'

        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 150,
            height: 50,
            leftOffset: 0
        }
        this.attackBox.leftOffset = -this.attackBox.width + this.width


        this.health = 100
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        if (this.isAttacking) {
            c.fillStyle = '#59ea3c'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y + 20, this.attackBox.width, this.attackBox.height)
        }
    }

    update() {

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.x + this.width + this.velocity.x > canvas.width) {
            this.position.x = canvas.width - this.width
            this.velocity.x = 0
        }
        if (this.position.x + this.velocity.x < 0) {
            this.position.x = 0
            this.velocity.x = 0
        }

        if (this.position.y + this.height + this.velocity.y > canvas.height) {
            this.position.y = canvas.height - this.height
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }

        this.updateAttackBox()
        this.draw()
    }

    updateAttackBox() {
        switch (this.direction) {
            case 'l':
                this.attackBox.position.x = this.position.x + this.attackBox.leftOffset
                this.attackBox.position.y = this.position.y
                break;
            case 'r':
                this.attackBox.position.x = this.position.x
                this.attackBox.position.y = this.position.y
                break;
        }
    }

}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
})
const enemy = new Sprite({
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


function animate() {
    if (!gameEnded) window.requestAnimationFrame(animate)
    c.fillStyle = '#2b2b2b'
    c.fillRect(0, 0, canvas.width, canvas.height)
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

}

animate()
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
































