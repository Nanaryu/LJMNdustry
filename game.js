var canvas = document.getElementById("grid")
var c = canvas.getContext("2d")
var g_size = 640
var c_size = 64

var tit = new Image()
tit.src = "item-titanium.png"

var conv1 = new Image()
conv1.src = "conv1.png"

var conv2 = new Image()
conv2.src = "conv2.png"

var conv3 = new Image()
conv3.src = "conv3.png"

var conv4 = new Image()
conv4.src = "conv4.png"

var stats = 
{
    titanium: 100,
}

var blocks =
{
    def_block: {
        letter: "D",
        color: "gray",
        cost: 10,
    },
    free_block: {
        letter: "F",
        color: "darkgreen",
        cost: 0,
    },
    pink_block: {
        letter: "P",
        color: "pink",
        cost: 80,
    },
    blue_block: {
        letter: "B",
        color: "blue",
        cost: 10,
    }
}

var rotation = 1

var rotdecode = {
    1: "↑",
    2: "→",
    3: "↓",
    4: "←"
}

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
                c.fillStyle = this.fstyle
                text(`Score: ${this.score}`, this.x, this.y + 15, 10)
                circle(this.x, this.y, this.r)
                c.drawImage(tit, this.x-tit.width/2, this.y-tit.height/2)
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
            text(`Score: ${this.score}`, this.x, this.y + 15, 10)
            circle(this.x, this.y, this.r)
            c.drawImage(tit, this.x-tit.width/2, this.y-tit.height/2)
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

                if (x !=  g_size / c_size + 1)
                {
                    if (cells[x+1][y][0] == "D") // right
                    {
                        orbs.push(new Orb(ii, jj, c_size/8, ii+c_size, jj, true))
                    }
                }
                
                if (x != 0)
                {
                    if (cells[x-1][y][0] == "D") // left
                    {
                        orbs.push(new Orb(ii, jj, c_size/8, ii-c_size, jj, true))
                    }
                }
            
                if (y != g_size / c_size + 1)
                {
                    if (cells[x][y+1][0] == "D") // up
                    {
                        orbs.push(new Orb(ii, jj, c_size/8, ii, jj+c_size, true))
                    }
                }

                if (y != 0) 
                {
                    if (cells[x][y-1][0] == "D") // down
                    {
                        orbs.push(new Orb(ii, jj, c_size/8, ii, jj-c_size, true))
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

var current_block = blocks.free_block

var select = document.getElementById("select")

var freeblock = document.createElement("div")
freeblock.innerHTML = "free"
freeblock.id = "freeblock"
freeblock.onclick = function () {current_block = blocks.free_block}
select.appendChild(freeblock)

var spawner = document.createElement("div")
spawner.innerHTML = "spawner"
spawner.id = "spawner"
spawner.onclick = function () {current_block = blocks.pink_block}
select.appendChild(spawner)

var conveyor = document.createElement("div")
conveyor.innerHTML = rotdecode[rotation]
conveyor.id = "conveyor"
conveyor.onclick = function () {current_block = blocks.def_block}
select.appendChild(conveyor)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function line(x, y, x1, x2) 
{
    c.beginPath()
    c.moveTo(x, y)
    c.lineTo(x1, x2)
    c.stroke()
    c.closePath()
}

function text(txt, x, y, fsize=32, fstyle="white")
{
    let lastStyle = c.fillStyle
    c.font = `${fsize}px Arial`
    c.fillStyle = fstyle
    c.textAlign = "center"
    c.fillText(txt, x, y+7)
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
        line(0, i, g_size, i) // horizontal lines

        for (j = 0; j < g_size; j += c_size) 
        {
            line(j, 0, j, g_size) // vertical lines
        }
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
                        text("spawner", i+c_size/2, j+c_size/2-3, 16, "black")
                    }
                    break
            }
            y += 1
        }
        y = 0
        x += 1
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
}

function update() 
{
    draw_tiles()
    updateOrbPos()
    draw_grid()
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

canvas.addEventListener("click", function(e)
{
    cell_x = Math.floor(e.offsetX/c_size)
    cell_y = Math.floor(e.offsetY/c_size)

    cells[cell_x][cell_y] = [current_block.letter, rotation]


    c.fillStyle = current_block.color
    c.fillRect(cell_x * c_size, cell_y * c_size, c_size, c_size)
})

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
        conveyor.innerHTML = rotdecode[rotation]
    }
    else if (e.key === "e")
    {
        spawnOrb()
    }
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, canvas.width, canvas.height)

  update()
}

init()
animate()

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        cells[cell_x][cell_y] = `H`

        last_x = cell_x
        last_y = cell_y

        c.fillStyle = current_block.color
        c.fillRect(cell_x * c_size, cell_y * c_size, c_size, c_size)

        draw_grid(g_size, c_size)

        for (let i = 0; i < cells.length; i++) 
        {
            for (let j = 0; j < cells[i].length; j++)
            {
                if (cells[i][j] == "H" && ((i != cell_x) || (j != cell_y)))
                {
                    cells[i][j] = "F"
                    update(g_size, c_size)
                }
            }
        }
    } 
}) */