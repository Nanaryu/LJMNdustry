var canvas = document.getElementById("grid")
var c = canvas.getContext("2d")
var g_size = 640
var c_size = 32

canvas.style.width = g_size + "px"
canvas.style.height = g_size + "px"

function line(x, y, x1, x2) {
    c.beginPath()
    c.moveTo(x, y)
    c.lineTo(x1, x2)
    c.stroke()
}

var cells = []
/* cells = [
    [state, state, state], row 1
    [state, state, state], row 2
    [state, state, state]  row 3
] */

var colors = {
    free: "darkgreen",
    blocked: "darkred",
    hover: "blue"
}

function draw_grid(grid_size, cell_size) {
    for (i = 0; i < grid_size ; i += cell_size) {
        line(0, i, grid_size, i) // horizontal lines

        for (j = 0; j < grid_size; j += cell_size) {
            line(j, 0, j, grid_size) // vertical lines
        }
    }
}

function draw_tiles(grid_size, cell_size) {
    let x = 0
    let y = 0

    for (i = 0; i < grid_size; i += cell_size) {
        for (j = 0; j < grid_size; j += cell_size)
        {
            let cell = cells[x][y]

            if (cell == "F") 
            {
                c.fillStyle = colors.free
            } 
            else if (cell == "B") 
            {
                c.fillStyle = colors.blocked
            }
            else if (cell == "H")
            {
                c.fillStyle = colors.hover
            }

            c.fillRect(i, j, cell_size, cell_size)
            y += 1
        }
        y = 0
        x += 1
    }
}

function update(grid_size, cell_size) {
    /// INITIALIZATION
    if (cells.length == 0) {
        let x = 0
        let y = 0
        let rows = grid_size / cell_size

        // init cells
        for (let i = 0; i < rows; i += 1) {
            cells[i] = []
        }

        // set all cells to free
        for (let i = 0; i < grid_size; i += cell_size) {
            for (let j = 0; j < grid_size; j += cell_size) {
                cells[x][y] = `F`
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

canvas.addEventListener("click", function(e){
    cell_x = Math.floor(e.x/c_size)
    cell_y = Math.floor(e.y/c_size)

    cells[cell_x][cell_y] = `B`

    c.fillStyle = colors.blocked
    c.fillRect(cell_x * c_size, cell_y * c_size, c_size, c_size)

    draw_grid(g_size, c_size)
})

var last_x = 99
var last_y = 99

canvas.addEventListener("mousemove", function(e) {
    cell_x = Math.floor(e.offsetX/c_size)
    cell_y = Math.floor(e.offsetY/c_size)
    
    console.log(last_x, last_y, cell_x, cell_y)

    if ((cell_x != last_x) || (cell_y != last_y)) {
        cells[cell_x][cell_y] = `H`

        last_x = cell_x
        last_y = cell_y

        c.fillStyle = colors.hover
        c.fillRect(cell_x * c_size, cell_y * c_size, c_size, c_size)

        draw_grid(g_size, c_size)
    } 
})

setInterval(() => {
    update(g_size, c_size)
}, 10)