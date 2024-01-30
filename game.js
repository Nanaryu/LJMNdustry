var canvas = document.getElementById("grid")
var c = canvas.getContext("2d")

function line(x, y, x1, x2) {
    c.beginPath()
    c.moveTo(x, y)
    c.lineTo(x1, x2)
    c.stroke()
}
var cells = [[]]

/* cells = [
    [state, state, state], row 1
    [state, state, state], row 2
    [state, state, state]  row 3
] */

function draw_grid(grid_size, cell_size) {
    let x = 0
    let y = 0
    let rows = grid_size / cell_size
    for (i = 0; i < rows; i += 1) {
        cells[i] = []
    }

    for (i = 0; i < grid_size ; i += cell_size) {
        line(0, i, grid_size, i) // horizontal lines

        for (j = 0; j < grid_size; j += cell_size) {
            line(j, 0, j, grid_size) // vertical lines
            cells[x][y] = "cell_state"
            y += 1
        }
        //cells += ["cell_one"]
        x += 1
    }
    console.log(JSON.stringify(cells))
}

canvas.addEventListener("click", function(e){
    cell_x = Math.floor(e.x/100)
    cell_y = Math.floor(e.y/100)
    console.log("CELL ->", cell_x, cell_y)
    c.fillStyle = "blue"
    c.fillRect(cell_x*100,cell_y*100,100, 100)
    c.fillStyle = "blueviolet"
})

canvas.addEventListener("mousemove", (e) => {
    cell_x = Math.floor(e.x/100)
    cell_y = Math.floor(e.y/100)
    c.fillStyle = "blue"
    c.fillRect(cell_x*100,cell_y*100,100, 100)
    c.fillStyle = "blueviolet"
})
/* 
setInterval(() => {
    draw_grid(1000, 100)
    //console.log(cells)
}, 10) */

draw_grid(1000, 100)