const canvas = document.querySelector("canvas");
canvas.width = 900;
canvas.height = 3400;

const ctx = canvas.getContext("2d");
const cx = 200;
const cy = 100;

// make a grid of dots
const grid = [];
for (let x = 0; x < canvas.width; x += 20) {
    for (let y = 0; y < canvas.height; y += 20) {
        grid.push({ x, y });
    }
}

// draw the grid
ctx.fillStyle = "black";
grid.forEach(({ x, y }) => {
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.fill();
});

const is_occupied = [];
// a 2d array of booleans to keep track of which dots are occupied
const x_len = canvas.width / 20;
const y_len = canvas.height / 20;
for (let i = 0; i < x_len; i++) {
    is_occupied.push([]);
    for (let j = 0; j < y_len; j++) {
        is_occupied[i].push(false);
    }
}

for (let j = 0; j < 10; j++) {
    // start connecting random dots
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    let prev = grid[Math.floor(Math.random() * grid.length)];
    while (is_occupied[Math.floor(prev.x / 20.0)][Math.floor(prev.y / 20.0)]) {
        prev = grid[Math.floor(Math.random() * grid.length)];
    }
    ctx.moveTo(prev.x, prev.y);
    let last_dir = 0;
    const chance_to_turn = 0.5;
    let times_retried = 0;
    for (let i = 0; i < 100; i++) {
        if (times_retried > 10) {
            break;
        }

        let dir = last_dir;
        //connect prev to a random adjacent dot
        if (Math.random() < chance_to_turn) {
            dir = Math.floor(Math.random() * 8);
        }
        dir = (dir / 4) * Math.PI;
        let next;
        let pos;
        let mag;
        // if diagonal
        if (dir % 2 === 0) {
            mag = Math.sqrt(2) * 20;
        } else {
            mag = 20;
        }

        pos = [Math.cos(dir) * mag, Math.sin(dir) * mag];
        next = { x: prev.x + pos[0], y: prev.y + pos[1] };
        // if next is out of bounds, try again
        if (next.x < 0 || next.x > canvas.width || next.y < 0 || next.y > canvas.height) {
            i--;
            times_retried++;
            print("out of bounds");
            continue;
        }

        // if next is already occupied, try again
        if (is_occupied[Math.floor(next.x / 20.0)][Math.floor(next.y / 20.0)]) {
            i--;
            times_retried++;
            print("occupied");
            continue;
        }
        else {
            is_occupied[Math.floor(next.x / 20.0)][Math.floor(next.y / 20.0)] = true;
        }
        times_retried = 0;
        ctx.lineTo(next.x, next.y);
        prev = next;
    }
    ctx.stroke();
}