const canvas = document.createElement("canvas")
const g_size = 768
const c_size = 48

canvas.width = g_size
canvas.height = g_size

const all = document.getElementById("all")
document.querySelector("body").insertBefore(canvas, document.querySelector("body").firstChild)

const c = canvas.getContext("2d")

const tit = new Image()
tit.src = "item-titanium.png"
tit.height = 30
tit.width = 30

const conv1 = new Image()
conv1.src = "conv1.png"

const conv2 = new Image()
conv2.src = "conv2.png"

const conv3 = new Image()
conv3.src = "conv3.png"

const conv4 = new Image()
conv4.src = "conv4.png"

const grass = new Image()
grass.src = "grass.png"

const coll = new Image()
coll.src = "collector.png"

const spawn = new Image()
spawn.src = "spawner.png"

const stats = 
{
    titanium: 12500,
    power: 8345,
}

const score = document.getElementById("score")
const power = document.getElementById("power")

const blocks =
{
    conveyor: {
        letter: "D",
        color: "gray",
        cost: 10,
        name: "conveyor"
    },
    freeblock: {
        letter: "F",
        color: "darkgreen",
        cost: 0,
        name: "freeblock",
    },
    spawner: {
        letter: "P",
        color: "pink",
        cost: 80,
        name: "spawner",
    },
    collector: {
        letter: "C",
        color: "lightcoral",
        cost: 10,
        name: "collector",
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
        this.score = 0
    }

    move_c() 
    {   
        this.fstyle = `rgb(0, ${this.score*5}, 0)`

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
                    this.score++
                }
                else if (cells[this.cell_x][this.cell_y][0] == "C")
                {   
                    //score.innerHTML = `Score: ${parseInt(score.innerHTML.match(/[0-9]+/)) + this.score}`
                    stats.titanium += this.score
                    this.x = -10
                    this.y = -10
                }
                c.fillStyle = this.fstyle
                c.drawImage(tit, this.x-tit.width/2, this.y-tit.height/2, tit.width, tit.height)
                text(`${this.score}`, this.x, this.y-2, 10)
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

            c.fillStyle = this.fstyle
        
            c.drawImage(tit, this.x-tit.width/2, this.y-tit.height/2, tit.width, tit.height)
            text(`${this.score}`, this.x, this.y-2, 10)

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

var current_block = blocks.freeblock

const select = document.getElementById("select")

const freeblock = document.createElement("img")
freeblock.src = grass.src
freeblock.id = "freeblock"
freeblock.onclick = function () {current_block = blocks.freeblock}
freeblock.setAttribute("draggable", false)
select.appendChild(freeblock)

const spawner = document.createElement("img")
spawner.src = spawn.src
spawner.id = "spawner"
spawner.onclick = function () {current_block = blocks.spawner}
spawner.setAttribute("draggable", false)
select.appendChild(spawner)

const conveyor = document.createElement("img")
conveyor.src = conv1.src
conveyor.id = "conveyor"
conveyor.onclick = function () {current_block = blocks.conveyor}
conveyor.setAttribute("draggable", false)
select.appendChild(conveyor)

const collector = document.createElement("img")
collector.src = coll.src
collector.id = "collector"
collector.onclick = function () {current_block = blocks.collector}
collector.setAttribute("draggable", false)
select.appendChild(collector)

const cost_span = document.getElementById("cost_span")

const audio = new Audio('game3.mp3')
audio.loop = true
audio.volume = 0.4

const music_span = document.getElementById("music_span")
let music_on = false
music_span.onclick = function () 
{
    if(!music_on) 
    {
        audio.play()
        music_on = true
        music_span.innerHTML = "ON"
    } 
    else 
    {
        audio.pause()
        music_on = false
        music_span.innerHTML = "OFF"
    }
}

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

function circle(x, y, radius)
{
    c.beginPath()
    c.arc(x, y, radius, 0, Math.PI*2, false)
    c.fill()
    c.closePath()
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function draw_grid() 
{
    for (i = 0; i < g_size ; i += c_size) 
    {
        line(0, i, g_size, i, "rgba(233,233,233,0.3)") // horizontal lines
    }

    for (j = 0; j < g_size; j += c_size) 
    {
        line(j, 0, j, g_size, "rgba(233,233,233,0.3)") // vertical lines
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
            let rot  = cells[x][y][1]

            Object.keys(blocks).forEach(key => {
                if (cell == blocks[key].letter)
                {
                    // choose color based on color code of current block
                    c.fillStyle = blocks[key].color 
                }
            })
            
            c.fillRect(i, j, c_size, c_size) // background 

            switch(cell)
            {
                default:
                    break
                case "F":
                    {
                        c.drawImage(grass, i, j, c_size, c_size)
                        break
                    }
                case "D":
                    {   
                        switch(rot)
                        {
                            case 1: 
                                c.drawImage(conv1, i, j, c_size, c_size)
                                break
                            case 2: 
                                c.drawImage(conv2, i, j, c_size, c_size)
                                break
                            case 3: 
                                c.drawImage(conv3, i, j, c_size, c_size)
                                break
                            case 4: 
                                c.drawImage(conv4, i, j, c_size, c_size)
                                break
                        }
                        
                        //text(rotdecode[rot], i+c_size/2, j+c_size/2, 32, "black")
                    }
                    break
                case "P":
                    {
                        //text("spawner", i+c_size/2, j+c_size/2-3, 16, "black")
                        c.drawImage(spawn, i, j, c_size, c_size)
                        break
                    }
                case "C":
                    {
                        //text("collector", i+c_size/2, j+c_size/2-3, 16, "black")
                        c.drawImage(coll, i, j, c_size, c_size)
                        break
                    }
            }
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

function updateStats()
{
    if (stats.titanium < 1000)
    {
        score.innerHTML = stats.titanium
    }
    else if (1000 <= stats.titanium && stats.titanium < 10000)
    {
        score.innerHTML = `${String(stats.titanium)[0]}.${String(stats.titanium)[1]}k`
    }
    else if (10000 <= stats.titanium && stats.titanium < 100000)
    {
        score.innerHTML = `${String(stats.titanium)[0]}${String(stats.titanium)[1]}.${String(stats.titanium)[2]}k`
    }
    
    power.innerHTML = `${stats.power}`
    cost_span.innerHTML = current_block.cost
    if (current_block.cost <= stats.titanium)
    {
        cost_span.style.color = "lightgreen"
    }
    else
    {
        cost_span.style.color = "rgb(237, 84, 84)"
    }
    if (stats.power == 0) 
    {
        //alert("GAME OVER (obiecuje ta gre rozwinac)")
        //window.location.reload()
    }
    if (stats.titanium > 250)
    {
        //alert("YOU WIN (obiecuje ta gre rozwinac)")
        //window.location.reload()
    }
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
    cells = [[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]],[["P",1],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",3],["D",3],["C",1],["D",1],["P",1],["D",3],["C",1],["D",1],["P",1]]]
}

function frame() 
{   
    updateStats()
    selectedBlock()
    draw_tiles()
    updateOrbPos()
    draw_grid()
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var mouseheld = false
canvas.addEventListener("mousedown", function(e)
{
    if (e.button === 0 && current_block.cost <= stats.titanium)
    {
        cell_x = Math.floor(e.offsetX/c_size)
        cell_y = Math.floor(e.offsetY/c_size)

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
        cell_x = Math.floor(e.offsetX/c_size)
        cell_y = Math.floor(e.offsetY/c_size)

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