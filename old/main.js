document.write(`
<canvas id="display" width="500" height="500"></canvas>
<div id="data"></div>
`);
var canvas = document.getElementById("display");
canvas.style.backgroundColor = "#000";
var ctx = canvas.getContext("2d");

r = {
    x: 250,
    y: 499,
    dx: 0,
    dy: 0,
    ddx: 0,
    ddy: 0,
    theta: 0,
    pwr: 0,
    mass: 1,
};
let states = {
    inair: false,
    alive: true,
};
function drawRocket(x, y, theta, pwr) {
    //check if rocket is above sky
    if (y < 0) return 0;
    //rocket
    ctx.beginPath();
    ctx.moveTo(x - 40 * Math.sin(theta), y - 40 * Math.cos(theta));
    ctx.lineTo(x + 10 * Math.sin(theta + Math.PI / 2), y + 10 * Math.cos(theta + Math.PI / 2));
    ctx.lineTo(x - 10 * Math.sin(theta + Math.PI / 2), y - 10 * Math.cos(theta + Math.PI / 2));
    ctx.fillStyle = "#fff";
    ctx.fill();
    //fire
    ctx.beginPath();
    ctx.moveTo(x - 5 * Math.sin(theta + Math.PI / 2), y - 5 * Math.cos(theta + Math.PI / 2));
    ctx.lineTo(x + 30 * pwr * Math.sin(theta), y + 30 * pwr * Math.cos(theta));
    ctx.lineTo(x + 5 * Math.sin(theta + Math.PI / 2), y + 5 * Math.cos(theta + Math.PI / 2));
    ctx.fillStyle = `hsl(${400 - pwr * 18},98%,50%)`;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 10 * Math.sin(theta + Math.PI / 2), y + 10 * Math.cos(theta + Math.PI / 2));
    ctx.lineTo(x + 5 * Math.sin(theta + Math.PI / 2) + 17 * pwr * Math.sin(theta), y + 17 * pwr * Math.cos(theta) + 5 * Math.cos(theta + Math.PI / 2));
    ctx.lineTo(x, y);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.moveTo(x - 10 * Math.sin(theta + Math.PI / 2), y - 10 * Math.cos(theta + Math.PI / 2));
    ctx.lineTo(x - 5 * Math.sin(theta + Math.PI / 2) + 17 * pwr * Math.sin(theta), y + 17 * pwr * Math.cos(theta) - 5 * Math.cos(theta + Math.PI / 2));
    ctx.lineTo(x, y);
    ctx.fillStyle = "orange";
    ctx.fill();
    //dot
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "#0f0";
    ctx.fill();
    ctx.stroke();
}
drawRocket();
let goal = {
    x: 250,
    y: 250,
    score: 0
};
function updategoal() {
    let dist = (r.x - goal.x) ** 2 + (r.y - goal.y) ** 2;
    ctx.beginPath();
    ctx.arc(goal.x, goal.y, 100 / (goal.score + 10), 0, 2 * Math.PI);
    ctx.fillStyle = `hsl(${460 - dist / 500}, 100%, 50%)`;
    ctx.fill();
    if (dist < 10 ** 2) {
        goal.score++;
        goal.x = Math.random() * 440 + 30;
        goal.y = Math.random() * 360 + 30;
    }
}

function update(dt) {
    if (!states.alive) {
        ctx.strokeStyle = "#0f0";
        ctx.font = "48px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.strokeText("Final Score: " + goal.score, 250, 300);
        ctx.fillStyle = "#f00";
        ctx.textBaseline = "bottom";
        ctx.font = "70px sans-serif";
        ctx.fillText("YOU LOSE", 250, 200);
        clearInterval(interval);
        return 0;
    }
    //bounds
    if (r.x < 0) states.alive = false;//r.dx=Math.abs(r.dx*0.7)
    if (r.x > 500) states.alive = false;//r.dx=-Math.abs(r.dx*0.7)
    if (r.y < 0) 1;//states.alive=true//r.dy=Math.abs(r.dy*0.7)
    if (r.y > 500) {
        if (r.dy > 5) states.alive = false;
        r.y -= 0.1;
        r.dy = 0;
        r.dx *= 0.95;
    }
    if (!states.inair && r.y < 400) states.inair = true;


    //controller
    if (r.theta > Math.PI) r.theta -= Math.PI * 2;
    if (r.theta < -Math.PI) r.theta += Math.PI * 2;
    var angle = Math.atan2(r.x - goal.x, r.y - goal.y) - r.theta;
    if (keys.w && r.pwr < 0.999) r.pwr += 0.01;
    if (keys.s && r.pwr > 0.0001) r.pwr -= 0.01;
    if (keys.a) r.theta += dt / 5;
    if (keys.d) r.theta -= dt / 5;

    //autopilot
    /* let ap=false
    if (ap) {
        if (angle>0) r.theta+=0.01
        if (angle<0) r.theta-=0.01
    } */
    //verlet
    let grav = 0.7;
    nx = r.x + r.dx * dt + r.ddx * (dt * dt * 0.5);
    ny = r.y + r.dy * dt + r.ddy * (dt * dt * 0.5);
    nddx = -r.pwr * Math.sin(r.theta) * 1.2;
    nddy = -r.pwr * Math.cos(r.theta) * 1.2 + grav;
    ndx = r.dx + (r.ddx + nddx) * (dt * 0.5);
    ndy = r.dy + (r.ddy + nddy) * (dt * 0.5);
    r.x = nx; r.y = ny; r.dy = ndy; r.dx = ndx; r.ddx = nddx; r.ddy = nddy;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#0f0";
    ctx.strokeRect(20, 20, 460, 400);
    ctx.fillStyle = "#f00";
    ctx.fillRect(-1, 0, 5, 500);
    ctx.fillRect(495, 0, 5, 500);
    updategoal();
    drawRocket(r.x, r.y, r.theta, r.pwr);
    document.getElementById("data").innerHTML = `Thruster: ${Math.round(r.pwr * 100)}%
	<br>Velocity: ${Math.round(Math.sqrt(r.dx ** 2 + r.dy ** 2) * 10) / 10}<br>Score: ${goal.score}<br>inair: ${states.inair}<br>angle to target: ${angle}`;
}

var keys = {
    w: false,
    s: false,
    a: false,
    d: false
};
window.addEventListener("keydown", (e) => {
    if (e.isComposing || e.keyCode === 229) {
        return;
    }
    let a = true;
    if (e.keyCode == 87) keys.w = a;
    if (e.keyCode == 83) keys.s = a;
    if (e.keyCode == 65) keys.a = a;
    if (e.keyCode == 68) keys.d = a;
});
window.addEventListener("keyup", (e) => {
    if (e.isComposing || e.keyCode === 229) {
        return;
    }
    let a = false;
    if (e.keyCode == 87) keys.w = a;
    if (e.keyCode == 83) keys.s = a;
    if (e.keyCode == 65) keys.a = a;
    if (e.keyCode == 68) keys.d = a;
});
let interval = setInterval(update, 10, 0.1);