class Sprite {
    constructor({ position, imgSrc, scale = 1, frames = 1, frameHold = 1, offset = { x: 0, y: 0 } }) {
        this.position = position
        this.image = new Image()
        this.image.src = imgSrc
        this.scale = scale
        this.frames = frames
        this.currentFrame = 0
        this.framesElapsed = 0
        this.framesHold = frameHold
        this.offset = offset

    }

    draw() {
        if (this.frames == 1) {
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.image.width * this.scale,
                this.image.height * this.scale
            )
        } else {
            c.drawImage(
                this.image,
                this.image.width / this.frames * this.currentFrame,
                0,
                this.image.width / this.frames,
                this.image.height,
                this.position.x - this.offset.x,
                this.position.y - this.offset.y,
                this.image.width / this.frames * this.scale,
                this.image.height * this.scale
            )
        }

    }

    update() {
        this.draw()
        this.framesElapsed = ++this.framesElapsed % this.framesHold
        if (this.framesElapsed === 0) {
            this.currentFrame = ++this.currentFrame % this.frames
        }
    }

}

class Fighter extends Sprite {
    constructor({ position, velocity, color = '#ea3c53', imgSrc, scale = 1, frames = 1, frameHold = 1, offset = { x: 0, y: 0 } }) {

        super({ position, imgSrc, scale, frames, frameHold, offset })

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
        /*this.image.src = './assets/samuraiMack/Attack1.png'
        this.frames = 6
        this.currentFrame = 0
        this.framesElapsed = 0*/
        setTimeout(() => {
            this.isAttacking = false
        }, 800)
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

        if (this.position.y + this.height + this.velocity.y > canvas.height - 100) {
            this.position.y = canvas.height - 95 - this.height
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }

        this.updateAttackBox()
        super.update()
    }

    updateAttackBox() {
        /*if (!this.isAttacking) {
            this.image.src = './assets/samuraiMack/Idle.png'
            this.frames = 8
            this.currentFrame = 0
            this.framesElapsed = 0
        }*/
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