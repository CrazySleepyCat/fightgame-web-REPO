class Sprite {
    constructor({ position, imgSrc, scale = 1, frames = 1 }) {
        this.position = position
        this.image = new Image()
        this.image.src = imgSrc
        this.scale = scale
        this.frames = frames
        this.currentFrame = 1

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
                this.image.width / this.frames * (this.currentFrame - 1),
                0,
                this.image.width / this.frames,
                this.image.height,
                this.position.x,
                this.position.y,
                this.image.width / this.frames * this.scale,
                this.image.height * this.scale
            )
        }

    }

    update() {
        if (++this.currentFrame > this.frames) {
            this.currentFrame = 1
        }
        this.draw()
    }

}

class Fighter {
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

        if (this.position.y + this.height + this.velocity.y > canvas.height - 100) {
            this.position.y = canvas.height - 95 - this.height
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