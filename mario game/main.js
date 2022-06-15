const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const getImage = (imageName)=>{
    const image = new Image();
    image.src = `img/${imageName}.png`;
    return image;
}

const background = new Image();
background.src = `img/background.png`

const platformImg = new Image();
platformImg.src = "img/platform.png"

const c = canvas.getContext("2d");
const gravity = 0.5;
const jump = 20;
let jumped = 2;
let scrollOffset = 0



class Player{
    constructor(){
        this.position = {
            x: 100,
            y: 100,
        }
        this.image = getImage("background");
        this.width = 50
        this.height = 50
        this.speed = 10

        this.velocity = {
            x: 0, 
            y: 0,
        }

    }
    draw(){
        // c.fillStyle = "red"
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // if(this.position.y<0){
        //     this.position.y = 0
        //     this.velocity.y = 0
        // }

        if(this.position.y+this.height+this.velocity.y<=canvas.height){
            this.velocity.y += gravity
        }else{
            // this.velocity.y = 0
            // this.position.y = 100
            // this.velocity.y = 0
        }


    }
}

class Platform{
    constructor({x, y, image}){
        this.position = {
            x,
            y,
        }
        this.width = 700
        this.height = 100
        this.image = getImage(image)
    }
    draw(){
        // c.fillStyle = "blue";
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update(){
        this.draw()
    }
}

class GenericObject{
    constructor({x, y, image}){
        this.position = {
            x,
            y,
        }
        this.width = 1920
        this.height = 1080
        this.image = getImage(image)
    }
    draw(){
        // c.fillStyle = "blue";
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
}

let player = new Player()
let platforms = []
let genericObjects = []

const keys = {
    left: {
        pressed: false
    },
    right: {
        pressed: false
    }
}


const init = ()=>{

    jumped = 2;
    scrollOffset = 0;

    player = new Player()
    platforms = [
        new Platform({
            x: 0, 
            y: canvas.height-100, 
            image: "platform"
        }), 
        new Platform({
            x: 1000, 
            y: canvas.height-300,
            image: "platform"
        }),
        new Platform({
            x: 2500, 
            y: canvas.height-100,
            image: "platform"
        }),
        new Platform({
            x: 3800, 
            y: canvas.height-300,
            image: "platform"
        }),
        new Platform({
            x: 5000, 
            y: canvas.height-400,
            image: "platform"
        }),
        new Platform({
            x: 6700, 
            y: canvas.height-20,
            image: "platform"
        }),
    ]
        
        genericObjects = [
            new GenericObject({
                x: 0,
                y: 0, 
                image: "background"
            }),
            new GenericObject({
                x: 0, 
                y: 0, 
                image: "cloud"
            }),
            new GenericObject({
                x: 1920, 
                y: 0, 
                image: "cloud2"
            }),
            new GenericObject({
                x: 3840, 
                y: 0, 
                image: "cloud3"
            }),
            new GenericObject({
                x: 5760, 
                y: 0, 
                image: "cloud4"
            }),
        ]
}
init()



const animate = ()=>{
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    genericObjects.forEach(genericObject=>{
        genericObject.draw();
    })
    platforms.forEach(platform=>{
        platform.update();
    })
    player.update();

    console.log(player.speed);
    
    if(keys.right.pressed) player.speed += .1
    else if(keys.right.pressed) player.speed += .1
    else player.speed = 10

    if(keys.right.pressed&&player.position.x < 600) player.velocity.x = player.speed
    else if(keys.left.pressed&&player.position.x >100) player.velocity.x = -player.speed
    else {
        player.velocity.x = 0
        if(keys.right.pressed){
            scrollOffset += player.speed
            platforms.forEach(platform=>{
            platform.position.x -= player.speed
        })
            genericObjects.forEach((genericObject, index)=>{
                if(index == 0) return
                genericObject.position.x -= player.speed * .66
            })
        }
        else if(keys.left.pressed){
            scrollOffset -= player.speed
            platforms.forEach(platform=>{
            platform.position.x += player.speed
            
        })
        genericObjects.forEach((genericObject, index)=>{
            if(index == 0) return
            genericObject.position.x += player.speed * .66
        })
        // genericObjects[1].position.x += player.speed *.66
        }
    }
    platforms.forEach(platform=>{
        if(player.position.y + player.height<=platform.position.y&&player.position.y + player.height+player.velocity.y>=platform.position.y&&player.position.x+player.width>=platform.position.x&&player.position.x<=platform.position.x+platform.width){
        player.velocity.y = 0
        jumped = 0
    }
    })

    // if(scrollOffset>50) platforms.forEach(platform=>platform.image = getImage("background"))
    // else platforms.forEach(platform=>platform.image = getImage("platform"))

    //win
    if(scrollOffset>=6360){
        console.log("you win");
        // player.image = getImage("platform")
    };
    //lose
    if(player.position.y>canvas.height){
        console.log("you lose");
        init();
    }
// console.log(scrollOffset);
}
animate()



window.addEventListener("keydown", function(e){
    // console.log(e.keyCode);
    switch(e.keyCode){
        case 87:
            if(jumped < 2){
                player.velocity.y -= jump;
                jumped += 1
            }
        break;
        case 65:
            keys.left.pressed = true
        break;
        case 68:
            keys.right.pressed = true
        break;
    }
})
window.addEventListener("keyup", function(e){
    // console.log(e.keyCode);
    switch(e.keyCode){
        case 87:
            // player.velocity.y -= jump;
        break;
        case 65:
            keys.left.pressed = false
        break;
        case 68:
            keys.right.pressed = false
        break;
    }
})