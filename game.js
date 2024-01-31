var canvas = document.getElementById("grid")
var c = canvas.getContext("2d")
var g_size = 640
var c_size = 32

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
        letter: "H",
        color: "pink"
    },
    blue_block: {
        letter: "B",
        color: "blue"
    }
}

var inv = document.getElementById("select")

var c_block = document.createElement("div")
c_block.className = "inv"
c_block.onclick = s_c_block
inv.appendChild(c_block)

var rotation_state = document.createElement("span")
rotation_state.innerHTML = rotation
rotation_state.className = "inv"
inv.appendChild(rotation_state)

var current_block = blocks.def_block

function s_c_block() {
    console.log("clcick", current_block)
    current_block = blocks.pink_block
}

function line(x, y, x1, x2) 
{
    c.beginPath()
    c.moveTo(x, y)
    c.lineTo(x1, x2)
    c.stroke()
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

function draw_grid(grid_size, cell_size) 
{
    for (i = 0; i < grid_size ; i += cell_size) 
    {
        line(0, i, grid_size, i) // horizontal lines

        for (j = 0; j < grid_size; j += cell_size) 
        {
            line(j, 0, j, grid_size) // vertical lines
        }
    }
}

function draw_tiles(grid_size, cell_size) 
{
    let x = 0
    let y = 0

    for (i = 0; i < grid_size; i += cell_size) 
    {
        for (j = 0; j < grid_size; j += cell_size)
        {
            let cell = cells[x][y][0]
            let rot  = cells[x][y][1]

            Object.keys(blocks).forEach(key => {
                if (cell == blocks[key].letter)
                {
                    c.fillStyle = blocks[key].color
                }
            })
            
            

            c.fillRect(i, j, cell_size, cell_size)
            y += 1
        }
        y = 0
        x += 1
    }
}

function update(grid_size, cell_size) 
{
    /// INITIALIZATION
    if (cells.length == 0) 
    {
        let x = 0
        let y = 0
        let rows = grid_size / cell_size

        // init cells
        for (let i = 0; i < rows; i += 1) 
        {
            cells[i] = []
        }

        // set all cells to free
        for (let i = 0; i < grid_size; i += cell_size) 
        {
            for (let j = 0; j < grid_size; j += cell_size) 
            {
                cells[x][y] = ["F", 1]
                y += 1
            }
            y = 0
            x += 1
        }
    }
    /// UPDATING
    draw_tiles(grid_size, cell_size)
    draw_grid(grid_size, cell_size)
}

canvas.addEventListener("click", function(e)
{
    cell_x = Math.floor(e.offsetX/c_size)
    cell_y = Math.floor(e.offsetY/c_size)

    console.log(e.offsetX, e.offsetY)

    cells[cell_x][cell_y] = [current_block.letter, rotation]

    c.fillStyle = current_block.color
    c.fillRect(cell_x * c_size, cell_y * c_size, c_size, c_size)

    update(g_size, c_size)
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
    }
    rotation_state.innerHTML = rotation
})

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

setInterval(update(g_size, c_size), 10)
