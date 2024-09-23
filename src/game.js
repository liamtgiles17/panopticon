const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const width = ctx.canvas.width;
const height = ctx.canvas.height;

var mousex = 0;
var mousey = 0;

const playerWidth = 32;
const playerHeight = 32;
var x = (width / 2) - (playerWidth / 2);
var y = (height / 2) - (playerHeight / 2);
const speed = 0.3;
var dx = 0;
var dy = 0;

var maxHealth = 100;
var health = maxHealth;
var wave = 1;
var kills = 0;

var cameraLocked = true;
var cameraCanLock = true;
var offsetx = x - (width / 2);
var offsety = y - (height / 2);

var drawingWeapon = false;
var canDrawWeapon = true;
var aimAngle = 0;
var shootingAuto = false;
var canShootAuto = true;

const weaponStats = {
    'pistol': {
        'timeBetweenShots': 100,
        'reloadTime': 300,
        'baseBulletDamage': 10,
        'bulletSpeed': 0.8,
        'bulletTravelDistance': 2000,
        'type': 'semiAuto',
        'width': 16,
        'height': 16,
        'drawingAngle': 62
    },
    'shotgun': {
        'timeBetweenShots': 300,
        'reloadTime': 600,
        'baseBulletDamage': 6,
        'bulletSpeed': 0.5,
        'bulletTravelDistance': 300,
        'type': 'semiAuto',
        'width': 16,
        'height': 16,
        'drawingAngle': 62
    },
    'smg': {
        'timeBetweenShots': 70,
        'reloadTime': 150,
        'baseBulletDamage': 3,
        'bulletSpeed': 0.6,
        'bulletTravelDistance': 1000,
        'type': 'auto',
        'width': 16,
        'height': 16,
        'drawingAngle': 62
    }
};
var currentWeapon = 'smg';

const enemyStats = {
    'officer': {
        'health': 60,
        'weapons': ['pistol'],
        'width': 32,
        'height': 32,
        'speed': 0.12,
        'alertDistance': 800
    },
    'juggernaut': {
        'health': 200,
        'weapons': ['shotgun'],
        'width': 32,
        'height': 32,
        'speed': 0.06,
        'alertDistance': 500
    },
    'prisoner': {
        'health': 50,
        'weapons': ['knife'],
        'width': 32,
        'height': 32,
        'speed': 0.16,
        'alertDistance': 1600
    },
    'brute': {
        'health': 150,
        'weapons': ['fists'],
        'width': 32,
        'height': 64,
        'speed': 0.1,
        'alertDistance': 1200,
    }
};

var dt = 0;
var now = 0;
var then = Date.now();
const FPS = 60;

const tileSize = 32;
const map = [
    [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0]
];

const spriteSheet = new Image();
spriteSheet.src = "./img/spritesheet.png";
var spriteSheetLoaded = false;
spriteSheet.addEventListener('load', () => { spriteSheetLoaded = true; });

const pistolImage = new Image();
pistolImage.src = "./img/pistol.png";
var pistolImageLoaded = false;
pistolImage.addEventListener('load', () => { pistolImageLoaded = true; });

const bulletImage = new Image();
bulletImage.src = "./img/bullet.png";
var bulletImageLoaded = false;
bulletImage.addEventListener('load', () => { bulletImageLoaded = true; });

const crosshairImage = new Image();
crosshairImage.src = "./img/crosshair.png";
var crosshairImageLoaded = false;
crosshairImage.addEventListener('load', () => { crosshairImageLoaded = true; });

class Bullet {
    constructor(x, y, direction, speed, damage, shotFrom, travel) {
        this.direction = direction;
        this.x = x;
        this.y = y;
        this.ox = x;
        this.oy = y;
        this.speed = speed;
        this.damage = damage;
        this.shotFrom = shotFrom;
        this.travel = travel;
    }
}
var bulletList = [];
lastBulletShot = 0;

class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class Enemy {
    constructor(x, y, width, height, speed, alert, type, health, weapon, lastBulletShot) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.alert = alert;
        this.type = type;
        this.health = health;
        this.weapon = weapon;
        this.lastBulletShot = lastBulletShot;
    }

    directionToPlayer() {
        let ux = (this.x + (this.width / 2)) - (x + (playerWidth / 2));
        let uy = (this.y + (this.height / 2)) - (y + (playerHeight / 2));
        let vx = 1;
        let vy = 0;
        let dot = (vx * ux) + (vy * uy);
        let unorm = Math.sqrt((ux ** 2) + (uy ** 2));
        let vnorm = Math.sqrt((vx ** 2) + (vy ** 2));
        let dirToPlayerRad = Math.acos(dot / (unorm * vnorm));
        let dirToPlayer = dirToPlayerRad * 180 / Math.PI;
        if ((this.y + (this.height / 2)) <= (y + (playerHeight / 2))) { dirToPlayer = 360 - dirToPlayer; }
        return dirToPlayer;
    }
}
var enemyList = [];

function isCollisionRects(r1, r2) {
    let c1 = r1.x < r2.x + r2.width;
    let c2 = r1.x + r1.width > r2.x;
    let c3 = r1.y < r2.y + r2.height;
    let c4 = r1.y + r1.height > r2.y;
    if (c1 && c2 && c3 && c4) { return true; }
    return false;
}

function isCollisionPointRect(x, y, r) {
    var c1 = x >= r.x && x <= r.x + r.width;
    var c2 = y >= r.y && y <= r.y + r.height;
    if (c1 && c2) { return true; }
    return false;
}

window.addEventListener('keydown', keyDownListener);
window.addEventListener('keypress', keyPressListener);
window.addEventListener('keyup', keyUpListener);
canvas.addEventListener('mousedown', mouseDownListener);
canvas.addEventListener('mousemove', mouseOverListener);
canvas.addEventListener('mouseup', mouseUpListener);

function keyDownListener(event) {
    if (event.key == 'w') { dy = -1; }
    if (event.key == 'a') { dx = -1; }
    if (event.key == 's') { dy = 1; }
    if (event.key == 'd') { dx = 1; }
}

function keyPressListener(event) {
    if (cameraCanLock && event.key == 'q') {
        if (cameraLocked) { cameraLocked = false; }
        else { cameraLocked = true; }
        cameraCanLock = false;
    }
    if (canDrawWeapon && event.key == 'e') {
        if (drawingWeapon) { drawingWeapon = false; }
        else { drawingWeapon = true; }
        canDrawWeapon = false;
    }
    switch (event.key) {
        case '1':
            currentWeapon = 'pistol';
            shootingAuto = false;
            canShootAuto = true;
            break;
        case '2':
            currentWeapon = 'shotgun';
            shootingAuto = false;
            canShootAuto = true;
            break;
        case '3':
            currentWeapon = 'smg';
            shootingAuto = false;
            canShootAuto = true;
            break;
    }
}

function keyUpListener(event) {
    if (event.key === 'w' || event.key === 's') { dy = 0; }
    if (event.key === 'a' || event.key === 'd') { dx = 0; }
    if (!cameraCanLock && event.key === 'q') { cameraCanLock = true; }
    if (!canDrawWeapon && event.key === 'e') { canDrawWeapon = true; }
}

function mouseDownListener(event) {
    if (weaponStats[currentWeapon]['type'] === 'semiAuto') { if (event.buttons === 1 && drawingWeapon) { playerAttack(); } }
    if (weaponStats[currentWeapon]['type'] === 'auto') {
        if (canShootAuto && event.buttons === 1 && drawingWeapon) {
            if (!shootingAuto) { shootingAuto = true; }
            else { shootingAuto = false; }
            canShootAuto = false;
        }
    }
}

function mouseOverListener(event) {
    var rect = canvas.getBoundingClientRect();
    var scalex = width / rect.width;
    var scaley = height / rect.height;

    mousex = (event.x - rect.left) * scalex;
    mousey = (event.y - rect.top) * scaley;
}

function mouseUpListener(event) {
    if (!canShootAuto && event.buttons === 1 && weaponStats[currentWeapon]['type'] === 'auto') { canShootAuto = true; }
}

function updateOffset() {
    if (cameraLocked) {
        offsetx = x - (width / 2);
        offsety = y - (height / 2);
    }
}

function updateAim() {
    var ux = mousex - (x + (playerWidth / 2) - offsetx);
    var uy = mousey - (y + (playerHeight / 2) - offsety);
    var vx = 1;
    var vy = 0;
    var dot = (vx * ux) + (vy * uy);
    var unorm = Math.sqrt((ux ** 2) + (uy ** 2));
    var vnorm = Math.sqrt((vx ** 2) + (vy ** 2));
    var aimAngleRad = Math.acos(dot / (unorm * vnorm));
    aimAngle = aimAngleRad * 180 / Math.PI;
    if (mousey <= y - offsety) { aimAngle = 360 - aimAngle; }
}

function updatePlayer(dt) {
    let nx = 0;
    let ny = 0;
    if (dx == 0 || dy == 0) {
        nx = (speed * dx * dt);
        ny = (speed * dy * dt);
    } else {
        ny = (speed * dy * 0.71 * dt);
        nx = (speed * dx * 0.71 * dt);
    }
    let xRect = new Rectangle(x + nx, y, playerWidth, playerHeight);
    let yRect = new Rectangle(x, y + ny, playerWidth, playerHeight);
    for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 18; j++) {
            if (map[j][i] === 0 || map[j][i] === 2) {
                let wallRect = new Rectangle(i * tileSize, j * tileSize, tileSize, tileSize);
                if (isCollisionRects(xRect, wallRect)) { nx = 0; }
                if (isCollisionRects(yRect, wallRect)) { ny = 0; }
            }
        }
    }
    // for (let i = 0; i < enemyList.length; i++) {
    //     let enemyRect = new Rectangle(enemyList[i].x, enemyList[i].y, enemyList[i].width, enemyList[i].height);
    //     if (isCollisionRects(xRect, enemyRect)) {nx = 0;}
    //     if (isCollisionRects(yRect, enemyRect)) {ny = 0;}
    // }
    x += nx;
    y += ny;
    x = Math.round(x);
    y = Math.round(y);
}

function playerAttack() {
    if (Date.now() >= lastBulletShot + weaponStats[currentWeapon]['timeBetweenShots']) {
        let alpha = (aimAngle + 90) * Math.PI / 180;
        let ox = x + (playerWidth / 2) - 1 + (Math.sin(alpha) * (playerWidth / 2));
        let oy = y + (playerHeight / 2) - 1 - (Math.cos(alpha) * (playerHeight / 2));
        if (currentWeapon === 'pistol') {
            bulletList.push(new Bullet(ox, oy, aimAngle % 360, weaponStats[currentWeapon]['bulletSpeed'], weaponStats[currentWeapon]['baseBulletDamage'], 'player', weaponStats[currentWeapon]['bulletTravelDistance']));
        }
        if (currentWeapon === 'shotgun') {
            for (let i = 0; i < 6; i++) {
                bulletList.push(new Bullet(ox, oy, (aimAngle + (Math.random() * 30) - 15) % 360, weaponStats[currentWeapon]['bulletSpeed'], weaponStats[currentWeapon]['baseBulletDamage'], 'player', weaponStats[currentWeapon]['bulletTravelDistance']));
            }
        }
        if (currentWeapon === 'smg') {
            bulletList.push(new Bullet(ox, oy, aimAngle % 360, weaponStats[currentWeapon]['bulletSpeed'], weaponStats[currentWeapon]['baseBulletDamage'], 'player', weaponStats[currentWeapon]['bulletTravelDistance']));
        }
        lastBulletShot = Date.now();
    }
}

function spawnEnemies() {
    if (enemyList.length === 0) {
        outer: for (let i = 0; i < 32; i++) {
            for (let j = 0; j < 18; j++) {
                if (map[j][i] === 2) {
                    if (Math.random() > 0.25) {
                        enemyList.push(new Enemy(i * tileSize, j * tileSize, 32, 32, 0.1, true, 'officer', 30, 'shotgun', 0));
                        break outer;
                    }
                }
            }
        }
    }
}

function updateEnemies(dt) {
    for (let i = 0; i < enemyList.length; i++) {
        let nx = -(enemyList[i].speed * dt * Math.sin((enemyList[i].directionToPlayer() + 90) * Math.PI / 180));
        let ny = enemyList[i].speed * dt * Math.cos((enemyList[i].directionToPlayer() + 90) * Math.PI / 180);
        let xRect = new Rectangle(enemyList[i].x + nx, enemyList[i].y, enemyList[i].width, enemyList[i].height);
        let yRect = new Rectangle(enemyList[i].x, enemyList[i].y + ny, enemyList[i].width, enemyList[i].height);
        for (let j = 0; j < 32; j++) {
            for (let k = 0; k < 18; k++) {
                if (map[k][j] === 0) {
                    let wallRect = new Rectangle(j * tileSize, k * tileSize, tileSize, tileSize);
                    if (isCollisionRects(xRect, wallRect)) { nx = 0; }
                    if (isCollisionRects(yRect, wallRect)) { ny = 0; }
                }
            }
        }
        let playerRect = new Rectangle(x - (playerWidth * 4), y - (playerWidth * 4), playerWidth * 9, playerHeight * 9);
        if (isCollisionRects(xRect, playerRect)) { nx = 0; }
        if (isCollisionRects(yRect, playerRect)) { ny = 0; }
        enemyList[i].x += nx;
        enemyList[i].y += ny;
    }

    for (let i = 0; i < enemyList.length; i++) {
        if (enemyList[i].health <= 0) {
            delete enemyList[i];
            enemyList = enemyList.filter(item => item !== undefined);
            kills += 1;
            break;
        }
    }
}

function enemyAttack() {
    if (Math.random() > 0.99) {
        for (let i = 0; i < enemyList.length; i++) {
            if (Math.sqrt(((enemyList[i].x - x) ** 2) + ((enemyList[i].y - y) ** 2)) <= weaponStats[enemyList[i].weapon]['bulletTravelDistance']) {
                if (Date.now() >= enemyList[i].lastBulletShot + weaponStats[enemyList[i].weapon]['timeBetweenShots']) {
                    let alpha = (enemyList[i].directionToPlayer() + 270) * Math.PI / 180;
                    let ox = enemyList[i].x + (enemyList[i].width / 2) - 1 + (Math.sin(alpha) * (enemyList[i].width / 2));
                    let oy = enemyList[i].y + (enemyList[i].height / 2) - 1 - (Math.cos(alpha) * (enemyList[i].height / 2));
                    if (enemyList[i].weapon === 'pistol') {
                        bulletList.push(new Bullet(ox, oy, (enemyList[i].directionToPlayer() + 180) % 360, weaponStats[enemyList[i].weapon]['bulletSpeed'], weaponStats[enemyList[i].weapon]['baseBulletDamage'], 'enemy', weaponStats['pistol']['bulletTravelDistance']));
                    }
                    if (enemyList[i].weapon === 'shotgun') {
                        for (let j = 0; j < 6; j++) {
                            bulletList.push(new Bullet(ox, oy, ((enemyList[i].directionToPlayer() + 180) + (Math.random() * 30) - 15) % 360, weaponStats['shotgun']['bulletSpeed'], weaponStats['shotgun']['baseBulletDamage'], 'enemy', weaponStats['shotgun']['bulletTravelDistance']));
                        }
                    }
                    enemyList[i].lastBulletShot = Date.now();
                }
            }
        }
    }
}

function updateBullets(dt) {
    for (var i = 0; i < bulletList.length; i++) {
        bulletList[i].x += bulletList[i].speed * dt * Math.sin((bulletList[i].direction + 90) * Math.PI / 180);
        bulletList[i].y -= bulletList[i].speed * dt * Math.cos((bulletList[i].direction + 90) * Math.PI / 180);
    }

    outer: for (var i = 0; i < bulletList.length; i++) {
        let bulletRect = new Rectangle(bulletList[i].x, bulletList[i].y, 3, 3);
        for (let j = 0; j < enemyList.length; j++) {
            let enemyRect = new Rectangle(enemyList[j].x + (enemyList[j].width / 4), enemyList[j].y, enemyList[j].width / 2, enemyList[j].height);
            if (isCollisionRects(bulletRect, enemyRect)) {
                if (bulletList[i].shotFrom === 'player') { enemyList[j].health -= bulletList[i].damage; }
                delete bulletList[i];
                bulletList = bulletList.filter(item => item !== undefined);
                break outer;
            }
        }

        let playerRect = new Rectangle(x + (playerWidth / 4), y, playerWidth / 2, playerHeight)
        if (bulletList[i].shotFrom === 'enemy' && isCollisionRects(bulletRect, playerRect)) {
            health -= bulletList[i].damage;
            delete bulletList[i];
            bulletList = bulletList.filter(item => item !== undefined);
            break;
        }
    }

    for (var i = 0; i < bulletList.length; i++) {
        if (Math.sqrt(((bulletList[i].x - bulletList[i].ox) ** 2) + ((bulletList[i].y - bulletList[i].oy) ** 2)) >= bulletList[i].travel) {
            delete bulletList[i];
            bulletList = bulletList.filter(item => item !== undefined);
            break;
        }
    }
}

function drawMap() {
    if (spriteSheetLoaded) {
        for (var i = 0; i < 32; i++) {
            for (var j = 0; j < 18; j++) {
                if (map[j][i] == 0) {
                    ctx.drawImage(spriteSheet, 32, 0, 32, 32, (i * tileSize) - offsetx, (j * tileSize) - offsety, tileSize, tileSize);
                }
                if (map[j][i] == 1) {
                    ctx.drawImage(spriteSheet, 0, 0, 32, 32, (i * tileSize) - offsetx, (j * tileSize) - offsety, tileSize, tileSize);
                }
                if (map[j][i] == 2) {
                    ctx.drawImage(spriteSheet, 32, 32, 32, 32, (i * tileSize) - offsetx, (j * tileSize) - offsety, tileSize, tileSize);
                }
            }
        }
    }
}

function drawPlayer() {
    if (spriteSheetLoaded) { ctx.drawImage(spriteSheet, 64, 0, 32, 32, x - offsetx, y - offsety, playerWidth, playerHeight); }
}

function drawWeapon() {
    if (pistolImageLoaded) {
        if (drawingWeapon) {
            let rads = (aimAngle) * Math.PI / 180;
            let alpha = (aimAngle + weaponStats[currentWeapon]['drawingAngle']) * Math.PI / 180;
            let ox = x + (playerWidth / 2) + (Math.sin(alpha) * (playerWidth / 2)) - offsetx;
            let oy = y + (playerHeight / 2) - (Math.cos(alpha) * (playerHeight / 2)) - offsety;
            ctx.save();
            ctx.translate(ox, oy);
            ctx.rotate(rads);
            ctx.translate(-ox, -oy);
            ctx.drawImage(pistolImage, ox, oy);
            ctx.restore();
        }
        for (let i = 0; i < enemyList.length; i++) {
            let rads = (enemyList[i].directionToPlayer() + 180) * Math.PI / 180;
            let alpha = (enemyList[i].directionToPlayer() + 180 + weaponStats[enemyList[i].weapon]['drawingAngle']) * Math.PI / 180;
            let ox = enemyList[i].x + (enemyList[i].width / 2) - 1 + (Math.sin(alpha) * (enemyList[i].width / 2)) - offsetx;
            let oy = enemyList[i].y + (enemyList[i].height / 2) - 1 - (Math.cos(alpha) * (enemyList[i].height / 2)) - offsety;
            ctx.save();
            ctx.translate(ox, oy);
            ctx.rotate(rads);
            ctx.translate(-ox, -oy);
            ctx.drawImage(pistolImage, ox, oy);
            ctx.restore();
        }
    }
}

function drawEnemies() {
    if (spriteSheetLoaded) {
        for (let i = 0; i < enemyList.length; i++) {
            ctx.drawImage(spriteSheet, 96, 0, 32, 32, enemyList[i].x - offsetx, enemyList[i].y - offsety, enemyList[i].width, enemyList[i].height);
        }
    }
}

function drawBullets() {
    if (bulletImageLoaded) {
        for (var i = 0; i < bulletList.length; i++) {
            ctx.drawImage(bulletImage, bulletList[i].x - offsetx, bulletList[i].y - offsety);
        }
    }
}

function drawCrosshair() {
    if (crosshairImageLoaded && drawingWeapon) { ctx.drawImage(crosshairImage, mousex - 6, mousey - 6); }
}

var frameCount = 0;
function main() {
    now = Date.now();
    dt = now - then;
    if (dt >= 200) { dt = 1000 / FPS; }

    updatePlayer(dt);
    if (drawingWeapon && shootingAuto && weaponStats[currentWeapon]['type'] === 'auto') { playerAttack(); }
    spawnEnemies();
    updateEnemies(dt);
    enemyAttack();
    updateOffset();
    updateAim();
    updateBullets(dt);

    ctx.clearRect(0, 0, width, height);
    drawMap();
    drawPlayer();
    drawBullets();
    if (drawingWeapon) { drawWeapon(); }
    drawEnemies();
    drawCrosshair();

    then = now;

    ctx.font = "12px Serif";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText(`Health: ${health}/${maxHealth}`, 2, 10);
    ctx.fillText(`Weapon: ${currentWeapon}`, 2, 24);
    ctx.fillText(`Wave: ${wave}`, 2, 38);
    ctx.fillText(`Kills: ${kills}`, 2, 52);

    frameCount += 1;
    window.requestAnimationFrame(main);
}

main();