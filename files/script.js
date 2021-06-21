var canvas = document.getElementById("mycanvas")
var ctx = canvas.getContext("2d")

unit = canvas.height / 20

person = "jelmer"

loadLanguages() // I prefer this at the bottom of the code 

standardLanguage() // too set the standard language too english 

varReset()

highScore = 0

knaken = 0

pascalUnlocked = false
samUnlocked = false
tobinUnlocked = false

hitboxes = false

tripmode = false

endx = unit * 3
endy = unit * 5

function varReset() {

    block = {
        x: unit,
        y: canvas.height - (unit*10),
        d: 6 * unit,
        s:0,
        health: 200,
        maxhealth: 200,
        direction: "right",
        person: person
    }

    if(person == "pascal") {
        block.health = 300
        block.maxhealth = 300
    }

    floor = {
        y: canvas.height - (unit*4)
    }

    upDown = false
    downDown = false
    leftDown = false
    rightDown = false

    jump = true

    level = 0

    bullets = {

    }
    
    enBullets = {

    }

    enemies = {
        
    }

    paused = false

    canProgress = false

    red = 0

    green = 0

    gracePeriod = 0

    alreadyShot = false
    
    metronomeValue = 50
    metronomeGoingUp = true

    bandaid = {
        x: 0,
        y: 0,
        d: unit * 2,
        exists: false
    }

}

//main menu

gameOn = false


ctx.beginPath()
ctx.font = "72px Arial";
ctx.fillStyle = "white";
ctx.fillText("Enter to start", 50, 270)
ctx.closePath()

ctx.beginPath()
ctx.font = "30px Arial";
ctx.fillStyle = "white";
ctx.fillText("N for Dutch", canvas.width / 2 + 50, 30)
ctx.closePath()

ctx.beginPath()
ctx.font = "30px Arial";
ctx.fillStyle = "green";
ctx.fillText("E for English", canvas.width / 2 + 50, 80)
ctx.closePath()

var pascpic = new Image;
pascpic.src = "./files/flipscal.png"

ctx.beginPath()
ctx.drawImage(pascpic, canvas.width / 2 + 100, canvas.height / 2)
ctx.closePath()


//drawing

function draw() {
    if(!tripmode) {
        ctx.clearRect(0,0,canvas.width,canvas.height)
    }
    drawBackgroundMisc()
    drawEnemies() 
    drawFloor()
    drawBullets()
    drawMisc()
    checkInteraction() 
    drawBlock()
    metronome()

}

function drawBlock() {   
    if(rightDown) {
        if(block.person == "pascal") {
            block.x += 1
        }
        block.x += 3
        block.direction = "right"
    }

    if(leftDown) {
        if(block.person == "pascal") {
            block.x -= 1
        }
        block.x -= 3
        block.direction = "left"
    }

    if(upDown && jump) {
        if(block.person == "pascal") {
            jump = false
            block.s = 15
        } else {
            jump = false
            block.s = 13.5
        }
        
    }

    block.y -= block.s

    block.s -=0.5

    cubeimg=new Image();
    if(block.person == "pascal") {
        if(block.direction == "right") {
            cubeimg.src="./files/pascal.png";
        } else {
            cubeimg.src="./files/flipscal.png";
        }
    } else if(block.person == "jelmer") {
        if(block.direction == "right") {
            cubeimg.src="./files/jelmer.png";
        } else {
            cubeimg.src="./files/flipmer.png";
        }
    } else if(block.person == "sam") {
        if(block.direction == "right") {
            cubeimg.src="./files/sam.png";
        } else {
            cubeimg.src="./files/flipsam.png";
        }
    } else if(block.person == "tobin") {
        if(block.direction == "right") {
            cubeimg.src="./files/tobin.png";
        } else {
            cubeimg.src="./files/flipbin.png";
        }
    }
    

    ctx.beginPath()
    ctx.drawImage(cubeimg, block.x, block.y)
    ctx.closePath()
    /*ctx.beginPath()
    ctx.rect(block.x, block.y, block.d, block.d)
    ctx.fillStyle = "red"
    ctx.fill()
    ctx.closePath()*/

    if(hitboxes) {
        ctx.beginPath()
        ctx.rect(block.x,block.y, block.d,block.d)
        ctx.strokeStyle = "red"
        ctx.stroke()
        ctx.closePath()
    }

    ctx.beginPath()
    ctx.rect(block.x - unit, block.y - (unit * 2), block.d + unit * 2, 10)
    ctx.fillStyle = "red"
    ctx.fill()
    ctx.closePath()
    ctx.beginPath()
    ctx.rect(block.x - unit, block.y - (unit * 2), (block.d + unit * 2) * (block.health / block.maxhealth), 10)
    ctx.fillStyle = "green"
    ctx.fill()
    ctx.closePath()

    gracePeriod -= 1

    if(block.health <= 0) {
        new Audio("./files/dood.mp3").play()
        dood()

    }
}

function drawBullets() {
    if(!bullets[0]) return
    var size = Object.keys(bullets).length;
    for(var i=0 ; i<size ; i++) {
        if(bullets[i].direction == "right") {
            bullets[i].x += 5  
        } else {
            bullets[i].x -= 5
            
        }
        ctx.beginPath()
        ctx.rect(bullets[i].x, bullets[i].y, bullets[i].d, bullets[i].dy)
        ctx.fillStyle = "red"
        ctx.fill()
        ctx.closePath()    
    }

    if(!enBullets[0]) return
    var size = Object.keys(enBullets).length;
    for(var i=0 ; i<size ; i++) {
        if(enBullets[i].direction == "right") {
            enBullets[i].x += 5  
        } else {
            enBullets[i].x -= 5
            
        }
        ctx.beginPath()
        ctx.rect(enBullets[i].x, enBullets[i].y, enBullets[i].d, enBullets[i].dy)
        ctx.fillStyle = "green"
        ctx.fill()
        ctx.closePath()
        
    }

}

function drawEnemies() {
    var size = Object.keys(enemies).length;
    for(var i=0 ; i<size ; i++) {
        if(!enemies[i]) continue;
        if(enemies[i].dood == true) continue
        if(enemies[i].type == "loop") {
            if(block.x <= enemies[i].x) {
                if(enemies[i].direction == "right") {
                    enemies[i].direction = "left"
                    enemies[i].speed = 0
                } else {
                    enemies[i].speed -= 0.01
                }
            } else {
                if(enemies[i].direction == "left") {
                    enemies[i].direction = "right"
                    enemies[i].speed = 0
                } else {
                    enemies[i].speed += 0.01
                }
            }
        } else if (enemies[i].type == "shoot") {
            enemies[i].speed = -0.5 + (metronomeValue / 100)
        }

        enemies[i].x += enemies[i].speed * (1 - enemies[i].speedhandicap)

        if(enemies[i].type == "shoot") {
            var yorick = new Image;
            yorick.src = "./files/yorick.png"
        } else {
            var yorick = new Image;
            yorick.src = "./files/shankrick.png"
        }
        

        ctx.beginPath()
        ctx.drawImage(yorick, enemies[i].x, enemies[i].y)
        ctx.closePath()
    
        /*ctx.beginPath()
        ctx.rect(enemies[i].x, enemies[i].y, enemies[i].dx, enemies[i].dy)
        ctx.fillStyle = "green"
        ctx.fill()
        ctx.closePath()*/
        /*ctx.beginPath()
        ctx.font = "30px Arial";
        ctx.fillText(enemies[i].health, enemies[i].x, enemies[i].y);
        ctx.closePath()*/
        
        if(hitboxes) {
            ctx.beginPath()
            ctx.rect(enemies[i].x,enemies[i].y,enemies[i].dx,enemies[i].dy)
            ctx.strokeStyle = "green"
            ctx.stroke()
            ctx.closePath()
        }

        ctx.beginPath()
        ctx.rect(enemies[i].x - unit, enemies[i].y - (unit * 2), enemies[i].dx + unit * 2, 10)
        ctx.fillStyle = "red"
        ctx.fill()
        ctx.closePath()
        ctx.beginPath()
        ctx.rect(enemies[i].x - unit, enemies[i].y - (unit * 2), (enemies[i].dx + unit * 2) * (enemies[i].health / enemies[i].maxhealth), 10)
        ctx.fillStyle = "green"
        ctx.fill()
        ctx.closePath()
        
        if(enemies[i].type == "shoot") {

            if(Math.random() <= 0.005) {

                if(enBullets[0]) {
                    size = Object.keys(enBullets).length - 1;
                } else {
                    var size = -1
                }
                var n = size + 1

                if(block.x >= enemies[i].x) {
                    enBullets[n] = {
                        x: enemies[i].x + enemies[i].dx,
                        y: enemies[i].y + (enemies[i].dy * (5/12)),
                        d: block.d / 2,
                        dy: block.d / 12,
                        direction: "right" 
                    }
                    
                } else {
                    enBullets[n] = {
                        x: enemies[i].x - (enemies[i].dx/2),
                        y: enemies[i].y + (enemies[i].dy * (5/12)),
                        d: block.d / 2,
                        dy: block.d / 12,
                        direction: "left"
                    }
                }
            }
        }
    }
}

function drawFloor() {
    //ctx.beginPath()
    //ctx.rect(0, floor.y, canvas.width, unit*4)
    //ctx.fillStyle = "#999"
    //ctx.fill()
    //ctx.closePath()

    var vloer = new Image;
    vloer.src = "./files/floor.png"

    ctx.beginPath()
    ctx.drawImage(vloer, 0, floor.y)    
    ctx.closePath()


    ctx.beginPath()
    ctx.rect(0, floor.y, canvas.width, 5)
    ctx.fillStyle = "black"
    ctx.fill()
    ctx.closePath()
}

function drawBackgroundMisc() {

    // actual background

    var mountain = new Image()
    mountain.src = "./files/berg.png"
    
    var boom = new Image()
    boom.src = "./files/bomen.png"


    if(!tripmode){
        ctx.beginPath()
        ctx.drawImage(mountain,0,0)
        ctx.closePath()

        if(level/2 == Math.round(level/2)) {
            boomx = -200
        } else {
            boomx = 0
        }

        ctx.beginPath()
        ctx.drawImage(boom,boomx,floor.y - 200)
        ctx.closePath()
    }
    

    //hud

    var levelhud = new Image;
    levelhud.src = "./files/levelhud.png"

    ctx.beginPath()
    ctx.drawImage(levelhud, 10, 10)
    ctx.closePath()
    ctx.beginPath()
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(level, 115, 61);
    ctx.closePath()

    var highscorehud = new Image;
    highscorehud.src = "./files/highscorehud.png"

    ctx.beginPath()
    ctx.drawImage(highscorehud, 198, 10)
    ctx.closePath()
    ctx.beginPath()
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(highScore, 318, 61);
    ctx.closePath()

    var coinhud = new Image;
    coinhud.src = "./files/coinhud.png"

    ctx.beginPath()
    ctx.drawImage(coinhud, 386, 10)
    ctx.closePath()
    ctx.beginPath()
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(knaken, 480, 61);
    ctx.closePath()

    /*ctx.beginPath()
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Level: " + level + ". Highest level: " + highScore + ". Knaken ($): " + knaken + ".", 50, 50);
    ctx.closePath()*/


    //tutorial
    ctx.beginPath()
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(tutText, 100, 150);
    ctx.closePath()
    ctx.beginPath()
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(subTutText, 100, 185);
    ctx.closePath()
}

function drawMisc() {

    //red screen on damage   
    red -= 1
    if(block.health <= 0) red = 0
    ctx.beginPath()
    ctx.rect(0,0,canvas.width, canvas.height)
    ctx.fillStyle = "rgba(255, 0, 0, " + red/100 +")"
    ctx.fill()
    ctx.closePath()

    //green screen on healing
    green -= 1
    ctx.beginPath()
    ctx.rect(0,0,canvas.width, canvas.height)
    ctx.fillStyle = "rgba(0, 255, 0, " + green/100 +")"
    ctx.fill()
    ctx.closePath()


    //bandaid
    aidimg=new Image();
    aidimg.src = "./files/bandaid.png";
    if(bandaid.exists) {
        	
        ctx.beginPath()
        ctx.drawImage(aidimg, bandaid.x, bandaid.y)
        ctx.closePath()
        /*ctx.beginPath()
        ctx.rect(bandaid.x, bandaid.y, bandaid.d, bandaid.d)
        ctx.fillStyle = "white"
        ctx.fill()
        ctx.closePath()*/
    }
    
}

//input

document.addEventListener("keydown", function(e) {
    if(!gameOn){
        if(e.key == "Enter") {

            tutText = T1
            subTutText = ST1
            x = setInterval(draw, 10)
            gameOn = true
        } else if(e.key == "n") {
            T1 = dutch.T1
            ST1 = dutch.ST1
            T2 = dutch.T2
            ST2 = dutch.ST2
            T3 = dutch.T3
            ST3 = dutch.ST3
            T4 = dutch.T4
            ST4 = dutch.ST4
            T5 = dutch.T5
            ST5 = dutch.ST5
            T6 = dutch.T6
            ST6 = dutch.ST6
            skeer = dutch.skeer
            sSkeer = dutch.sSkeer
            skip = dutch.skip
            sSkip = dutch.sSkip

            ctx.beginPath()
            ctx.font = "30px Arial";
            ctx.fillStyle = "green";
            ctx.fillText("N for Dutch", canvas.width / 2 + 50, 30)
            ctx.closePath()

            ctx.beginPath()
            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("E for English", canvas.width / 2 + 50, 80)
            ctx.closePath()

        } else if(e.key == "e") {
            
            standardLanguage()

            ctx.beginPath()
            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("N for Dutch", canvas.width / 2 + 50, 30)
            ctx.closePath()

            ctx.beginPath()
            ctx.font = "30px Arial";
            ctx.fillStyle = "green";
            ctx.fillText("E for English", canvas.width / 2 + 50, 80)
            ctx.closePath()


        }



        return
    }


    if(e.key == "ArrowRight") {
        rightDown = true
    } else {
        if(e.key == "ArrowUp") {
            upDown = true
        } else {
            if(e.key == "ArrowLeft") {
                leftDown = true
            } else {
                if(e.key == "ArrowDown") {
                    downDown = true
                } else {
                    if(e.key == " ") {
                        
                        if(alreadyShot) return;
                
                        alreadyShot = true
                        shot = false
                        if(bullets[0]) {
                            size = Object.keys(bullets).length - 1;
                        } else {
                            var size = -1
                        }
                        var n = size + 1
                        new Audio("./files/shoot.mp3").play()
                        for(var i=0 ; i<size ; i++) {
                            if(bullets[i].x >= canvas.width) {
                                bullets[i].x = block.x + unit*5,
                                bullets[i].y = block.y + (block.d * (5/12)),
                                bullets[i].direction = block.direction
                                shot = true
                                if(block.direction == "left") { 
                                    bullets[i].x = block.x - (block.d/2)
                                }

                            }
                        }
                        if(shot == false){

                            if(block.direction == "right") {
                                bullets[n] = {
                                    x: block.x + unit*5,
                                    y: block.y + (block.d * (5/12)),
                                    d: block.d / 2,
                                    dy: block.d / 12,
                                    direction: block.direction 
                                }
                                shot = true
                            } else {
                                bullets[n] = {
                                    x: block.x - (block.d/2),
                                    y: block.y + (block.d * (5/12)),
                                    d: block.d / 2,
                                    dy: block.d / 12,
                                    direction: block.direction
                                    }
                                shot = true
                            }
                            
                        }

                    } else {
                        if(e.key == "Escape") {
                            if(paused) {
                                stoppauseorwhatever()
                                paused = false
                            } else {
                                clearInterval(x)
                                paused = true

                                ctx.beginPath()
                                ctx.rect(0,0,canvas.width,canvas.height)
                                ctx.fillStyle = "lightblue"
                                ctx.fill()
                                ctx.closePath()
                                ctx.beginPath()
                                ctx.font = "16px Arial"
                                ctx.fillStyle = "blue"
                                ctx.fillText("Press Esc to continue.", 20, canvas.height/2)
                                ctx.closePath()
                            }
                        } else {
                            if(e.key == "Enter") {
                                if(paused) {
                                    
                                    stoppauseorwhatever()
                                    paused = false
                                    varReset()
                                } 
                            } else {
                                if(e.key == "s") {
                                    if(level < 2) {
                                        level = 4
                                        winst()
                                    }
                                } else {
                                    if(e.key == "h") {
                                        if(hitboxes) {
                                            hitboxes = false
                                        } else {
                                            hitboxes = true
                                        }
                                    } else {
                                        if(e.key == "t") {
                                            if(tripmode) {
                                                tripmode = false
                                            } else {
                                                tripmode = true
                                            }
                                        }
                                    }
                                }
                            } 
                        }
                    }
                }
            }
        }
    }
})

document.addEventListener("keyup", function(e) {
    if(e.key == "ArrowRight") {
        rightDown = false
    } else {
        if(e.key == "ArrowUp") {
            upDown = false
        } else {
            if(e.key == "ArrowLeft") {
                leftDown = false
            } else {
                if(e.key == "ArrowDown") {
                    downDown = false
                } else {
                    if(e.key == " ") {
                        alreadyShot = false
                    }
                }
            }
        }
    }
})


//interactions

function checkInteraction() {
    //block with floor interaction
    if(block.y >= floor.y - block.d) {
        jump = true
        block.s = 0
        block.y = floor.y -block.d   
    }

    //block with walls interaction
    if(block.x + block.d >= canvas.width) {
        var size = Object.keys(enemies).length;
        canProgress = true
        for(var i=0 ; i<size ; i++) {
            if(!enemies[i].dood) canProgress = false
        }

        if(canProgress) {

            winst()
        } else {
            block.x = canvas.width - block.d    
        }
        
    }
    if (block.x <= 0) {
        block.x = 0 
    }

    //bullets with enemies
    var size = Object.keys(enemies).length;
    for(var i=0 ; i<size ; i++) {
        if(enemies[i].dood) continue
        if(!bullets[0]) continue
        var bsize = Object.keys(bullets).length;
        for(var o=0 ; o<bsize ; o++) {
            
            if(bullets[o].x + bullets[o].d >= enemies[i].x) {
                
                if(bullets[o].x <= enemies[i].x + enemies[i].dx) {
                    
                    if(bullets[o].y + bullets[o].dy >= enemies[i].y) {
                        
                        enemies[i].health -= 10
                        bullets[o].y = -50
                        if(enemies[i].health <= 0) {
                            enemies[i].dood = true
                            knaken += enemies[i].worth
                            new Audio("./files/dood2.mp3").play()
                        }
                    }
                }
            }
        }
    }

    //bullets with block 

    var size = Object.keys(enBullets).length;
    for(var i=0 ; i<size ; i++) {
        if(enBullets[i].x + enBullets[i].d >= block.x && enBullets[i].x <= block.x + block.d) {
            if(enBullets[i].y + enBullets[i].dy >= block.y && enBullets[i].y <= block.y + block.d) {
                enBullets[i].y = -50
                if(gracePeriod > 0) continue
                red = 50
                block.health -= 5
                gracePeriod = 100
                

            }
        }
    }
    

    //block with enemies 
    var size = Object.keys(enemies).length;
    for(var i=0 ; i<size ; i++) {
        if(enemies[i].dood) continue
        if(block.x + block.d >= enemies[i].x && block.x <= enemies[i].x + enemies[i].dx) {
            if(block.y + block.d >= enemies[i].y && block.y <= enemies[i].y + enemies[i].dy) {
                if(gracePeriod > 0) continue
                red = 50
                block.health -= 10
                gracePeriod = 100

            }
        }

    }

    //block with bandaid
    if(block.x + block.d >= bandaid.x && block.x <= bandaid.x + bandaid.d) {
        if(block.y + block.d >= bandaid.y && block.y <= bandaid.y + bandaid.d) {
            if(!bandaid.exists) return
            bandaid.exists = false
            block.health += 50
            green = 50
            if(block.health >= block.maxhealth) block.health = block.maxhealth
        }
    }
}



//misc

function winst() {
    if(bandaid.exists) bandaid.exists = false
    block.x = 0
    level++
    bullets = {

    }
    enBullets = {

    }
    enemies = {

    }
    if(level == 1) {
        tutText = T2
        subTutText = ST2
        enemies = {
            0: {
                x: unit*30,
                y: floor.y - endy,
                dx: endx,
                dy: endy,
                health: 100,
                maxhealth: 100, 
                dood: false,
                type: "loop",
                speed: 0,
                speedhandicap: 1,
                direction: "left",
                worth: 5
            }
        }
    } else if(level == 2) {
        tutText = T3
        subTutText = ST3
        enemies = {
            0: {
                x: unit*25,
                y: floor.y - endy,
                dx: endx,
                dy: endy,
                health: 100,
                maxhealth: 100, 
                dood: false,
                type: "loop",
                speed: 0,
                speedhandicap: 0.3,
                direction: "left",
                worth: 10
            },
            1: {
                x: unit*30,
                y: floor.y - endy,
                dx: endx,
                dy: endy,
                health: 100,
                maxhealth: 100, 
                dood: false,
                type: "loop",
                speed: 0,
                speedhandicap: 0.5,
                direction: "left",
                worth: 10
            }
        }
    } else if(level == 3) {
        tutText = T4
        subTutText = ST4
        enemies = {
            0: {
                x: unit*30,
                y: floor.y - endy,
                dx: endx,
                dy: endy,
                health: 100,
                maxhealth: 100, 
                dood: false,
                type: "shoot",
                speed: 0,
                speedhandicap: 0,
                direction: "left",
                worth: 20
            }
        }
    } else if(level == 4) {
        tutText = T5
        subTutText = ST5
        bandaid = {
            x: unit * 30,
            y: floor.y - (unit * 10),
            d: unit * 2,
            exists: true
        }
    } else if(level == 5) {
        tutText = T6
        subTutText = ST6
    } else {
        tutText = ""
        subTutText = ""

        enemyAmount = 1 + Math.ceil((0.3 * (level - 5)) * Math.random())
        
        for(var i = 0 ; i < enemyAmount; i++) {
            if(enemies[0]) {
                size = Object.keys(enemies).length - 1;
            } else {
                var size = -1
            }
            var n = size + 1

            theHealth = 100 + Math.round((level * 5) * Math.random())

            if(Math.random() <= 0.3) {
                theType = "loop"
            } else {
                theType = "shoot"
            }

            enemies[n] = {
                x: (canvas.width / 2) + (Math.random() * (canvas.width / 2) - unit * 2),
                y: floor.y - endy,
                dx: endx,
                dy: endy,
                health: theHealth,
                maxhealth: theHealth, 
                dood: false,
                type: theType,
                speed: 0,
                speedhandicap: Math.random() * 0.7,
                direction: "left",
                worth: 20 + Math.round(Math.random() * level)
            }

        }

        if(Math.random() <= 0.2) {
            bandaid = {
                x: Math.random() * (unit * 30),
                y: floor.y - (unit * 10) + (Math.random() * 8),
                d: unit * 2,
                exists: true
            }
        }

    }
}

function dood() {
    if(level >= highScore) {
        highScore = level
    }
    if(highScore <= 5) {
        tutText = T1
        subTutText = ST1
    } else {
        tutText = skip
        subTutText = sSkip
    }
    clearInterval(x)
    paused = true
    ctx.beginPath()
    ctx.rect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = "rgba(135,21,21,0.7)";
    ctx.fill()
    ctx.closePath()
    ctx.beginPath()
    ctx.font = "72px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Death", 400, canvas.height/2)
    ctx.closePath()
    ctx.beginPath()
    ctx.font = "48px Arial";
    ctx.fillText("Click ENTER to restart.", 250, 320)
    ctx.closePath()
    
}

function stoppauseorwhatever() {
    if(!paused) {
        bgin()
        varreset()
    }
    clearInterval(x)
    x = setInterval(draw, 10)
}



function setPascal() {
    Array.from(document.querySelectorAll("button")).forEach(btn => {
        btn.blur();
    });

    if(!pascalUnlocked) {
        check = checkKnaken(2500)
        if(!check) return;
    }

    document.getElementById("pascalButton").innerHTML = "Godscal"
    pascalUnlocked = true
    person = "pascal"

    dood()
}

function setJelmer() {
    Array.from(document.querySelectorAll("button")).forEach(btn => {
        btn.blur();
    });
    person = "jelmer"
    
    dood()
}

function setSam() {
    Array.from(document.querySelectorAll("button")).forEach(btn => {
        btn.blur();
    });

    if(!samUnlocked) {
        check = checkKnaken(1000)
        if(!check) return;
    }

    document.getElementById("samButton").innerHTML = "Sam"
    samUnlocked = true
    person = "sam"
    
    dood()
}

function setTobin() {
    Array.from(document.querySelectorAll("button")).forEach(btn => {
        btn.blur();
    });

    if(!tobinUnlocked) {
        check = checkKnaken(1000)
        if(!check) return;
    }

    document.getElementById("tobinButton").innerHTML = "Tobin"
    tobinUnlocked = true
    person = "tobin"
    
    dood()
}

function checkKnaken(a) {
    if(knaken < a) {
        tutText = skeer
        subTutText = sSkeer
        return false
    }
    tutText = T1
    subTutText = ST1
    knaken -= a
    return true
    
}

function metronome() {
    if(metronomeGoingUp) {
        metronomeValue++
        if(metronomeValue >= 100) metronomeGoingUp = false
    } else {
        metronomeValue--
        if(metronomeValue <= 0) metronomeGoingUp = true
    }
}

function loadLanguages() { // im so sorry this code is so wet please forgive me 
    dutch = {
        T1: "Welkom! U krijgt hogere scores door die kant op te lopen \u2192",
        ST1: "U kunt bewegen door de pijlknoppen te gebruiken.",
        T2: "Goed gedaan! Er zijn ook tegenstanders die je pijn zullen doen....",
        ST2: "Je kan ze beschieten door op spatie te drukken!",
        T3: "Oh jeetje, nu zijn het er 2! En ze komen op je af.",
        ST3: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        T4: "Deze schiet?",
        ST4: "Oh nee!",
        T5: "Je zal jezelf wel pijn gedaan hebben...",
        ST5: "Neem een pleister. :)",
        T6: "Succes met de rest van het avontuur!",
        ST6: "Je zal het nodig hebben.",
        skeer: "Je hebt niet genoeg knaken!",
        sSkeer: "Ga wat knaken rapen ofzo...",
        skip: "You kan de uitleg overslaan.",
        sSkip: "Gewoon op 's' drukken."
    }
    english = {
        T1: "Welcome! Progress by walking that way \u2192",
        ST1: "You can use your arrow keys to move!",
        T2: "Good job! There are also enemies! They will hurt you...",
        ST2: "Use your space bar to shoot them!",
        T3: "Oh no theres 2 now! They come walking at you!",
        ST3: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        T4: "This one shoots?!?!",
        ST4: "Please no.",
        T5: "You must be hurt by now...",
        ST5: "Take some bandaid :)",
        T6: "The best of luck on the rest of your journey!",
        ST6: "You will need it!",
        skeer: "You don't have enough money!",
        sSkeer: "Just go get some money...",
        skip: "You can skip the tutorial if you want.",
        sSkip: "Just press 's'."
    }
}

function standardLanguage() {
    T1 = english.T1
    ST1 = english.ST1
    T2 = english.T2
    ST2 = english.ST2
    T3 = english.T3
    ST3 = english.ST3
    T4 = english.T4
    ST4 = english.ST4
    T5 = english.T5
    ST5 = english.ST5
    T6 = english.T6
    ST6 = english.ST6
    skeer = english.skeer
    sSkeer = english.sSkeer
    skip = english.skip
    sSkip = english.sSkip
}