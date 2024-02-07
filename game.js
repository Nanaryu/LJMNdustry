var canvas = document.getElementById("grid")
var c = canvas.getContext("2d")
var g_size = 640
var c_size = 64

var rotation = 1
var blocks =
{
    def_block: {
        letter: "D",
        color: "blueviolet"
    },
    free_block: {
        letter: "F",
        color: "darkgreen"
    },
    pink_block: {
        letter: "P",
        color: "pink"
    },
    blue_block: {
        letter: "B",
        color: "blue"
    }
}

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

            if (this.cell_x < cells[0].length && this.cell_y < cells[0].length)
            {
                if (cells[this.cell_x][this.cell_y][0] == "D")
                {
                    let xy = velocity(this.x, this.y, cells[this.cell_x][this.cell_y][1])
                    this.dx = xy[0]
                    this.dy = xy[1]
                    this.moving = true
                }
                c.fillStyle = "red"
                circle(this.x, this.y, this.r)
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
            c.fillStyle = "red"
            circle(this.x, this.y, this.r)
            if (this.x == this.dx && this.y == this.dy)
            {
                this.moving = false
            }
        }
    }
}

var current_block = blocks.def_block

var inv = document.getElementById("select")

var c_block = document.createElement("div")
c_block.className = "inv"
c_block.onclick = function () {current_block = blocks.pink_block}
inv.appendChild(c_block)

var r_state = document.createElement("span")
r_state.innerHTML = rotdecode[rotation]
r_state.id = "r_state"
r_state.onclick = function () {current_block = blocks.def_block}
inv.appendChild(r_state)


function line(x, y, x1, x2) 
{
    c.beginPath()
    c.moveTo(x, y)
    c.lineTo(x1, x2)
    c.stroke()
}

function text(txt, x, y)
{
    c.font = "32px Arial"
    c.fillStyle = "white"
    c.textAlign = "center"
    c.fillText(txt, x, y+7)
}

function circle(x, y, radius)
{
    c.beginPath()
    c.arc(x, y, radius, 0, Math.PI*2, false)
    c.fill()
    c.closePath()
}

var cells = []
/* cells = 
[
    [
        [state, rotation],
    ],
] */

var colors = 
{
    free: "darkgreen",
    blocked: "darkred",
    hover: "blue"
}




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
            if (cell == "D") 
            {
                text(rotdecode[rot], i+c_size/2, j+c_size/2) // arrow text in cell
            }
            y += 1
        }
        y = 0
        x += 1
    }
}




const orbs = []

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

canvas.addEventListener("click", function(e)
{
    cell_x = Math.floor(e.offsetX/c_size)
    cell_y = Math.floor(e.offsetY/c_size)

    cells[cell_x][cell_y] = [current_block.letter, rotation]

    c.fillStyle = current_block.color
    c.fillRect(cell_x * c_size, cell_y * c_size, c_size, c_size)

    update()
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
        r_state.innerHTML = rotdecode[rotation]
    }
    else if (e.key === "e")
    {
        spawnOrb()
    }
})

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, canvas.width, canvas.height)

  update()
}

init()
animate()

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