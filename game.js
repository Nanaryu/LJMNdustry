var canvas = document.getElementById("grid")
var c = canvas.getContext("2d")

function line(x, y, x1, x2) {
    c.beginPath()
    c.moveTo(x, y)
    c.lineTo(x1, x2)
    c.stroke()
}
var cells = []

for (i=0;i<1000;i+=100) {
    for (j=0;j<1000;j+=100) {
        line(j, 0, j, 1000)
    }
    line(0, i, 1000, i)
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
