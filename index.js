var win = document.getElementById("win");
win.style.display = "none";

const image = document.getElementById("img");
const image1 = document.getElementById("imghills");
const image2 = document.getElementById("imgbackground");

const spriteRunLeft = document.getElementById("spriteRunLeft");
const spriteRunRight = document.getElementById("spriteRunRight");
const spriteStandLeft = document.getElementById("spriteStandLeft");
const spriteStandRight = document.getElementById("spriteStandRight");

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

document.getElementById("btnNeon").addEventListener("click", function () {
    window.location.reload();
});


//Player start
function Player() {
    this.speed = 10;
    this.position = {
        x: 100,
        y: 100
    }
    this.velocity = {
        x: 0,
        y: 0
    }
    this.width = 66;
    this.height = 150;

    this.image = spriteStandRight
    this.frame = 0;
    this.sprites = {
        stand: {
            right: spriteStandRight,
            left: spriteStandLeft,
            cropWidth: 177,
            width: 66
        },
        run: {
            right: spriteRunRight,
            left: spriteRunLeft,
            cropWidth: 341,
            width: 127.875
        }
    }
    this.currentSprite = this.sprites.stand.right
    this.currentCropWidth = 177
}

Player.prototype.update = function () {
    this.frame++;
    if (this.frame > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) {
        this.frame = 0
    } else if (this.frame > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) {
        this.frame = 0
    }
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
        this.velocity.y += gravity;

}

Player.prototype.draw = function () {
    c.drawImage(this.currentSprite,
        this.currentCropWidth * this.frame, 0, this.currentCropWidth, 400,
        this.position.x, this.position.y,
        this.width, this.height)
}

//Player End

//Platform Start
function Platform({x, y, image}) {
    this.position = {
        x,
        y
    }

    this.image = image;
    this.width = 580;
    this.height = 20;

}

Platform.prototype.draw = function () {
    c.drawImage(this.image, this.position.x, this.position.y)
}

//Platform End

//GenericObject Start

function GenericObject({x, y, image}) {
    this.position = {
        x,
        y
    }

    this.image = image;
    this.width = 400;
    this.height = 20;

}

GenericObject.prototype.draw = function () {
    c.drawImage(this.image, this.position.x, this.position.y)
}

//GenericObject End

let player = new Player();
let platforms = []
let genericObjects = []

let currentKey

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0;


function init() {

    player = new Player();
    platforms = [
        new Platform({x: -1, y: 470, image}),
        new Platform({x: 576, y: 470, image}),
        new Platform({x: 1330, y: 470, image}),
        new Platform({x: 2127, y: 470, image}),
        new Platform({x: 2700, y: 470, image}),
        new Platform({x: 3580, y: 470, image}),
        new Platform({x: 4157, y: 470, image}),
        new Platform({x: 5000, y: 470, image}),
        new Platform({x: 5578, y: 470, image})
    ]

    genericObjects = [new GenericObject({
        x: -1,
        y: -1,
        image: image2
    }),
        new GenericObject({
            x: -1,
            y: -1,
            image: image1
        })]

    scrollOffset = 0;
}


function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach(genericObjects => {
        genericObjects.draw()
    })

    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed;
    } else if ((keys.left.pressed && player.position.x > 100) || keys.left.pressed && scrollOffset === 0 && player.positionx > 0) {
        player.velocity.x = -player.speed;
    } else {
        player.velocity.x = 0;

        if (keys.right.pressed) {
            scrollOffset += player.speed;
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })
            genericObjects.forEach(genericObjects => {
                genericObjects.position.x -= player.speed * 0.66
            })
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed;
            platforms.forEach(platform => {
                platform.position.x += player.speed
            })
            genericObjects.forEach(genericObjects => {
                genericObjects.position.x += player.speed * 0.66
            })
        }
    }


    platforms.forEach(platform => {

        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y
            && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })

    if (keys.right.pressed && currentKey === 'right' && player.currentSprite !== player.sprites.run.right) {
        player.frame = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width

    } else if (keys.left.pressed && currentKey === 'left' && player.currentSprite !== player.sprites.run.left) {
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (!keys.left.pressed && currentKey === 'left' && player.currentSprite !== player.sprites.stand.left) {
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    } else if (!keys.right.pressed && currentKey === 'right' && player.currentSprite !== player.sprites.stand.right) {
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }

    if (scrollOffset > 5000) {
        win.style.display = "inline"
    }

    if (player.position.y > canvas.height) {
        init();
    }
}

init()
animate()

addEventListener('keydown', ({keyCode}) => {
    switch (keyCode) {
        case 65:
            keys.left.pressed = true;
            currentKey = 'left'
            break;

        case 83:
            break;

        case 68:
            keys.right.pressed = true;
            currentKey = 'right'

            break;

        case 87:
            player.velocity.y -= 15
            break;
    }
})


addEventListener('keyup', ({keyCode}) => {
    switch (keyCode) {
        case 65:
            keys.left.pressed = false;
            break;

        case 83:
            break;

        case 68:
            keys.right.pressed = false;

            break;

        case 87:
            break;
    }
})