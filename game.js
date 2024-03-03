const canvas = document.createElement("canvas")
const g_size = 768
const c_size = 48

canvas.width = g_size
canvas.height = g_size

document.querySelector("body").insertBefore(canvas, document.querySelector("body").firstChild)

const c = canvas.getContext("2d")

const tit = new Image()
tit.src = "assets/img/item-titanium.png"
tit.height = 30
tit.width = 30

const conv1 = new Image()
conv1.src = "assets/img/conv1.png"

const conv2 = new Image()
conv2.src = "assets/img/conv2.png"

const conv3 = new Image()
conv3.src = "assets/img/conv3.png"

const conv4 = new Image()
conv4.src = "assets/img/conv4.png"

const grass = new Image()
grass.src = "assets/img/grass.png"

const coll = new Image()
coll.src = "assets/img/collector.png"

const spawn = new Image()
spawn.src = "assets/img/spawner.png"

const stats = 
{
    titanium: 100,
    power: 8543,
}

const titanium = document.getElementById("score")
const power = document.getElementById("power")
const item_desc =  document.getElementById("item-desc")

const blocks =
{
    conveyor: {
        letter: "D",
        color: "gray",
        cost: 10,
        name: "conveyor",
        desc: "Basic conveyor used for material transportation"
    },
    freeblock: {
        letter: "F",
        color: "darkgreen",
        cost: 0,
        name: "freeblock",
        desc: "Grass block commonly found on the map"
    },
    spawner: {
        letter: "P",
        color: "pink",
        cost: 80,
        name: "spawner",
        desc: "Basic drill used for material mining",
    },
    collector: {
        letter: "C",
        color: "lightcoral",
        cost: 10,
        name: "collector",
        desc: "The core holds all materials that are transported to it"
    }
}

var rotation = 1

/* var rotdecode = {
    1: "↑",
    2: "→",
    3: "↓",
    4: "←"
} */

function velocity(x, y, rot)
{
    switch(rot)
    {
        case 1:
            return [x, y-c_size]
        case 2:
            return [x+c_size, y]
        case 3:
            return [x, y+c_size]
        case 4:
            return [x-c_size, y]
    }
}

var cells = []
/* cells = 
[
    [
        [state, rotation],
    ],
] */

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const orbs = []

class Orb 
{
    constructor (x, y, r, dx=x, dy=y, moving=false)
    {
        this.x = x
        this.y = y
        this.r = r
        this.moving = moving
        this.dx = dx
        this.dy = dy
    }

    move_c() 
    {   
        if (!this.moving) 
        {
            this.cell_x = Math.floor(this.x/c_size)
            this.cell_y = Math.floor(this.y/c_size)

            if (this.cell_x >= 0 && this.cell_x < cells[0].length && this.cell_y >= 0 && this.cell_y < cells[0].length)
            {
                if (cells[this.cell_x][this.cell_y][0] == "D")
                {
                    let xy = velocity(this.x, this.y, cells[this.cell_x][this.cell_y][1])
                    this.dx = xy[0]
                    this.dy = xy[1]
                    this.moving = true
                }
                else if (cells[this.cell_x][this.cell_y][0] == "C")
                {   
                    stats.titanium += 1
                    this.x = null
                    this.y = null
                    this.r = null
                    this.moving = null
                    this.dx = null
                    this.dy = null
                    this.score = null
                    this.cell_x = null
                    this.cell_y = null
                    delete this.cell_x
                    delete this.cell_y
                    this.x = 99999
                    this.y = 99999
                   
                }
                c.drawImage(tit, this.x-tit.width/2-cameraX, this.y-tit.height/2-cameraY, tit.width, tit.height)
            }
        }
        else
        {
            if (this.x < this.dx)
            {
                this.x += 1
            }
            else if (this.x > this.dx)
            {
                this.x -= 1
            }
            if (this.y < this.dy)
            {
                this.y += 1
            }
            else if (this.y > this.dy)
            {
                this.y -= 1
            }

            c.drawImage(tit, this.x-tit.width/2-cameraX, this.y-tit.height/2-cameraY, tit.width, tit.height)

            if (this.x == this.dx && this.y == this.dy)
            {
                this.moving = false
            }
        }
    }
}

function spawnOrb() 
{
    let x = 0
    let y = 0

    for (i = 0; i < g_size; i += c_size) 
    {
        for (j = 0; j < g_size; j += c_size)
        {
            let cell = cells[x][y][0]
            
            if (cell == "P") {
                c.fillStyle = "red"

                let ii = (c_size/2)+i
                let jj = (c_size/2)+j

                if (x + 1 < g_size / c_size)
                {
                    if (cells[x+1][y][0] == "D") // right
                    {
                        orbs.push(new Orb(ii, jj, c_size/8, ii+c_size, jj, true))
                        stats.power -= 1
                    }
                }
                
                if (x != 0)
                {
                    if (cells[x-1][y][0] == "D") // left
                    {
                        orbs.push(new Orb(ii, jj, c_size/8, ii-c_size, jj, true))
                        stats.power -= 1
                    }
                }
            
                if (y + 1 < g_size / c_size)
                {
                    if (cells[x][y+1][0] == "D") // down
                    {
                        orbs.push(new Orb(ii, jj, c_size/8, ii, jj+c_size, true))
                        stats.power -= 1
                    }
                }

                if (y != 0) 
                {
                    if (cells[x][y-1][0] == "D") // up
                    {
                        orbs.push(new Orb(ii, jj, c_size/8, ii, jj-c_size, true))
                        stats.power -= 1
                    }   
                }
            }

            y += 1
        }
        y = 0
        x += 1
    }
}

function updateOrbPos()
{
    orbs.forEach(orb => 
    {
        orb.move_c()
    })
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const player = {
    x: g_size/2,
    y: g_size/2,
    radius: 15,
    speed: 5,
}

const keys = {}

window.addEventListener("keydown", e => 
{
    keys[e.key] = true
})

window.addEventListener("keyup", e => 
{
    keys[e.key] = false
})

var cameraX = player.x - g_size / 2
var cameraY = player.y - g_size / 2

function updatePlayer() {
    if (keys["ArrowUp"] || keys["w"]) 
    {
        player.y -= player.speed
    }
    if (keys["ArrowDown"] || keys["s"]) 
    {
        player.y += player.speed
    }
    if (keys["ArrowLeft"] || keys["a"]) 
    {
        player.x -= player.speed
    }
    if (keys["ArrowRight"] || keys["d"]) 
    {
        player.x += player.speed
    }
    cameraX = player.x - g_size / 2
    cameraY = player.y - g_size / 2
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var current_block = blocks.freeblock

const select = document.getElementById("select")

function createBlock(src, id, onclick) {
    const block = document.createElement("img")
    block.src = src
    block.id = id
    block.onclick = onclick
    block.setAttribute("draggable", false)
    select.appendChild(block)
}

createBlock(grass.src, "freeblock", function() {current_block = blocks.freeblock})
createBlock(spawn.src, "spawner", function() {current_block = blocks.spawner})
createBlock(conv1.src, "conveyor", function() {current_block = blocks.conveyor})
createBlock(coll.src, "collector", function() {current_block = blocks.collector})

const cost_span = document.getElementById("item_requirements")

/* const audio = new Audio('assets/audio/game3.mp3')
audio.loop = true
audio.volume = 0.2

const speaker = document.getElementById("speaker")
let music_on = false
speaker.onclick = function ()
{
    if(!music_on) 
    {
        audio.play()
        music_on = true
        speaker.src = "assets/img/speakerON.png"
    } 
    else 
    {
        audio.pause()
        music_on = false
        speaker.src = "assets/img/speaker.png"
    }
} */

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function line(x, y, x1, x2, fstyle="black") 
{
    c.beginPath()
    c.moveTo(x, y)
    c.lineTo(x1, x2)
    c.strokeStyle = fstyle
    c.stroke()
    c.closePath()
}

function text(txt, x, y, fsize=32, fstyle="white")
{
    let lastStyle = c.fillStyle
    c.font = `${fsize}px Arial`
    c.fillStyle = fstyle
    c.textAlign = "center"
    c.fillText(txt, x, y + 7)
    c.fillStyle = lastStyle
}

function circle(x, y, radius, style="white")
{
    c.beginPath()
    c.arc(x, y, radius, 0, Math.PI*2, false)
    c.fillStyle = style
    c.fill()
    c.closePath()
}

function circleE(x, y, radius, style="white")
{
    c.beginPath()
    c.arc(x, y, radius, 0, Math.PI*2, false)
    c.strokeStyle = style
    c.stroke()
    c.closePath()
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function draw_grid() {
    const expanded_size = g_size + 2 * c_size

    const startX = -cameraX % c_size - c_size
    const endX = expanded_size - cameraX % c_size + c_size
    const startY = -cameraY % c_size - c_size
    const endY = expanded_size - cameraY % c_size + c_size

    // horizontal lines
    for (let i = startY; i <= endY; i += c_size) 
    {
        line(startX, i, endX, i, "rgba(233,233,233,0.3)")
    }

    // vertical lines
    for (let j = startX; j <= endX; j += c_size) 
    {
        line(j, startY, j, endY, "rgba(233,233,233,0.3)")
    }
}

function draw_conveyors()
{
    let x = 0
    let y = 0

    for (i = 0; i < g_size; i += c_size) 
    {
        for (j = 0; j < g_size; j += c_size)
        {
            let cell = cells[x][y][0]
            let rot  = cells[x][y][1]

            let fx = i - cameraX
            let fy = j - cameraY

            if (cell == "D")
            {
                switch(rot)
                {
                    case 1: 
                        c.drawImage(conv1, fx, fy, c_size, c_size)
                        break
                    case 2: 
                        c.drawImage(conv2, fx, fy, c_size, c_size)
                        break
                    case 3: 
                        c.drawImage(conv3, fx, fy, c_size, c_size)
                        break
                    case 4: 
                        c.drawImage(conv4, fx, fy, c_size, c_size)
                        break
                }
            }
            y += 1
        }
        y = 0
        x += 1
    }
}

function draw_tiles() 
{
    let x = 0
    let y = 0

    for (i = 0; i < g_size; i += c_size) 
    {
        for (j = 0; j < g_size; j += c_size)
        {
            let cell = cells[x][y][0]

            let fx = i - cameraX
            let fy = j - cameraY

            switch(cell)
            {
                default:
                    break
                case "F":
                    {
                        c.drawImage(grass, fx, fy, c_size, c_size)
                        break
                    }
                case "D":
                    {   
                        break
                    }
                case "P":
                    {
                        c.drawImage(spawn, fx, fy, c_size, c_size)
                        break
                    }
                case "C":
                    {
                        c.drawImage(coll, fx, fy, c_size, c_size)
                        break
                    }
            }
            //text(`[${x}][${y}]`, fx + c_size/2, fy + c_size/2 -3, 14, "black")
            y += 1
        }
        y = 0
        x += 1
    }
}

function selectedBlock()
{
    let selchild = select.children
    for (let i = 0; i < selchild.length; i++)
    {
        if (selchild[i].id == current_block.name) {
            selchild[i].style.outline =  "2px white solid"
            selchild[i].style.boxShadow = "0 0 10px white"
        }
        else
        {
            selchild[i].style.outline = "none"
            selchild[i].style.boxShadow = "none"
        }
    }
}

function kFormat(value)
{
    let svalue = String(value)
    if (value < 1000)
    {
        return svalue
    }
    else if (1000 <= value && value < 10000)
    {
        return `${svalue[0]}.${svalue[1]}k`
    }
    else if (10000 <= value && value < 100000)
    {
        return `${svalue[0]}${svalue[1]}.${svalue[2]}k`
    }
}


function updateStats()
{
    if (stats.titanium < 1000)
    {
        titanium.innerHTML = "<img src='assets/img/item-titanium.png' class='mat_icon'>" + kFormat(stats.titanium)
    }
    else if (1000 <= stats.titanium && stats.titanium < 10000)
    {
        titanium.innerHTML = "<img src='assets/img/item-titanium.png' class='mat_icon'>" + kFormat(stats.titanium)
    }
    else if (10000 <= stats.titanium && stats.titanium < 100000)
    {
        titanium.innerHTML = "<img src='assets/img/item-titanium.png' class='mat_icon'>" + kFormat(stats.titanium)
    }
    
    power.innerHTML = "<img src='assets/img/power.png' class='mat_icon'>" + kFormat(stats.power)

    cost_span.innerHTML = current_block.cost
    if (current_block.cost <= stats.titanium) {cost_span.style.color = "lightgreen"}
    else {cost_span.style.color = "rgb(237, 84, 84)"}

    item_desc.innerHTML = current_block.desc
}

function init()
{
    if (cells.length == 0) 
    {
        let x = 0
        let y = 0
        let rows = g_size / c_size

        // init cells
        for (let i = 0; i < rows; i += 1) 
        {
            cells[i] = []
        }

        // set all cells to free
        for (let i = 0; i < g_size; i += c_size) 
        {
            for (let j = 0; j < g_size; j += c_size) 
            {
                cells[x][y] = ["F", 1]
                y += 1
            }
            y = 0
            x += 1
        }
    }
    //cells = [[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]]]
}

function frame() 
{   
    updatePlayer()
    updateStats()
    selectedBlock()
    draw_conveyors()
    updateOrbPos()
    draw_tiles()
    draw_grid()

    circleE(g_size / 2, g_size / 2, player.radius, "white")
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var mouseheld = false
canvas.addEventListener("mousedown", function(e)
{
    if (e.button === 0 && current_block.cost <= stats.titanium)
    {
        cell_x = Math.floor((e.offsetX+cameraX)/c_size)
        cell_y = Math.floor((e.offsetY+cameraY)/c_size)

        if (cells[cell_x][cell_y][0] != current_block.letter || cells[cell_x][cell_y][1] != rotation)
        {
            stats.titanium -= current_block.cost
            
            Object.keys(blocks).forEach(key => {
                if (cells[cell_x][cell_y][0] == blocks[key].letter)
                {
                    stats.titanium += blocks[key].cost
                }
            })

            cells[cell_x][cell_y] = [current_block.letter, rotation]
        }
        
        mouseheld = true
    }
    
    //c.fillStyle = current_block.color
    //c.fillRect(cell_x * c_size, cell_y * c_size, c_size, c_size)
})

canvas.addEventListener("mouseup", function(e)
{
    if (e.button === 0)
    {
        mouseheld = false
    }
})

canvas.addEventListener("mousemove", function(e)
{
    if (mouseheld && current_block.cost <= stats.titanium)
    {
        cell_x = Math.floor((e.offsetX+cameraX)/c_size)
        cell_y = Math.floor((e.offsetY+cameraY)/c_size)

        if (cells[cell_x][cell_y][0] != current_block.letter || cells[cell_x][cell_y][1] != rotation)
        {
            stats.titanium -= current_block.cost

            Object.keys(blocks).forEach(key => {
                if (cells[cell_x][cell_y][0] == blocks[key].letter)
                {
                    stats.titanium += blocks[key].cost
                }
            })

            cells[cell_x][cell_y] = [current_block.letter, rotation]
        }
    }
})

var spawnToggle = false
window.addEventListener("keydown", function (e)
{
    if (e.key === "r")
    {
        if (rotation < 4) 
        {
            rotation++
        } 
        else 
        {
            rotation = 1
        }
        switch (rotation)
        {
            case 1:
            {
                conveyor.src = conv1.src 
                break
            }
            case 2:
            {
                conveyor.src = conv2.src 
                break
            }
            case 3:
            {
                conveyor.src = conv3.src 
                break
            }
            case 4:
            {
                conveyor.src = conv4.src 
                break
            }
                
        }
    }
    else if (e.key === "e")
    {
        spawnToggle = spawnToggle ? false : true
    }
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, canvas.width, canvas.height)

  frame()
}

init()
animate()
setInterval(() => {
    if (stats.power > 0 && spawnToggle)
    {
        spawnOrb()
    }
    if (stats.power < 100)
    {
        stats.power += 1
    }
}, 500)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// block preview, did not work, dont want do to it any more

/* var last_x = 99
var last_y = 99

canvas.addEventListener("mousemove", function(e) 
{
    cell_x = Math.floor(e.offsetX/c_size)
    cell_y = Math.floor(e.offsetY/c_size)

    let trigger = false

    if ((cell_x > (g_size / c_size - 1)) || (cell_y > (g_size / c_size - 1)))
    {
        trigger = true
    }

    if (((cell_x != last_x) || (cell_y != last_y)) && !trigger) 
    {
        let lastCellState = cells[cell_x][cell_y]
        cells[cell_x][cell_y] = current_block.letter

        last_x = cell_x
        last_y = cell_y

        c.fillStyle = current_block.color

        for (let i = 0; i < cells.length; i++) 
        {
            for (let j = 0; j < cells[i].length; j++)
            {
                if (cells[i][j] == current_block.letter && ((i != cell_x) || (j != cell_y)))
                {
                    cells[i][j] = lastCellState.letter
                    update(g_size, c_size)
                }
            }
        }
    }
}) */