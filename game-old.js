const container = document.querySelector(".grid");
const titreH3 = document.querySelector("h3");
const numberOfDivsX = container.scrollWidth / 25; //25px is the size of a div
const numberOfDivsY = container.scrollHeight / 25;
let gameOver = false;
let allDivs = [];
const invaders = [];
const projectiles = [];
let scoreActuel = 0;
titreH3.textContent = `Score : ${scoreActuel}`;


// CREATE GRID
const createGrid = () => {
    let indexBorderLimit = 0;

    for (let i = 0 ; i < (numberOfDivsX * numberOfDivsY) ; i++) {
        if (indexBorderLimit === 0) {
            const bloc = document.createElement("div");
            bloc.setAttribute("container-limits", "left");
            container.appendChild(bloc);
            indexBorderLimit++;
        } else if (indexBorderLimit === 16) {
            const bloc = document.createElement("div");
            bloc.setAttribute("container-limits", "right");
            container.appendChild(bloc);
            indexBorderLimit = 0;
        } else {
            const bloc = document.createElement("div");
            container.appendChild(bloc);
            indexBorderLimit++;
        };
    };

    allDivs = document.querySelectorAll(".grid div");
}
createGrid();


// CLASS INVADER
class Invader {
    constructor(position) {
        this.position = position;
        this.imgAlive = "alien";
        this.imgDead = "boom";
    }

    updatePosition = (newPosition) => {
        allDivs[this.position].classList.remove("alien");
        this.position = newPosition;
        allDivs[this.position].classList.add("alien");
    }
}

let moveRight = true;
let moveLeft = false;
let movementDirection = 1;

const moveInvaders = () => {
    invaders.forEach(invader => {
        if (invader.position === player.position || invader.position >= 340) {
            gameOver = true;
            document.removeEventListener("keyup", handlePlayer);
            clearInterval(moveInvaderInterval);
            projectiles.forEach(projectile => {
                clearInterval(projectile.idInterval);
            });
            setTimeout(() => {
                allDivs[player.position].classList.remove("player", "alien");
                allDivs[player.position].classList.add("boom");
            }, 0);
        }
    });

    for (let i = 0 ; i < invaders.length ; i++) {
        if (allDivs[invaders[i].position].getAttribute("container-limits") === "right") {
            if (moveRight) {
                moveLeft = true;
                movementDirection = 17;
                setTimeout(() => {
                    moveRight = false;
                }, 0);
            } else if (moveRight === false) {
                movementDirection = -1;
            }
        } else if (allDivs[invaders[i].position].getAttribute("container-limits") === "left") {
            if (moveLeft) {
                moveRight = true;
                movementDirection = 17;
                setTimeout(() => {
                    moveLeft = false;
                }, 0);
            } else if (moveLeft === false) {
                movementDirection = 1;
            }
        }
    };

    for (let i = 0 ; i < invaders.length ; i++) {
        allDivs[invaders[i].position].classList.remove("alien");
    };
    for (let i = 0 ; i < invaders.length ; i++) {
        invaders[i].position += movementDirection;
    };
    for (let i = 0 ; i < invaders.length ; i++) {
        allDivs[invaders[i].position].classList.add("alien");
    };
}

const moveInvaderInterval = setInterval(moveInvaders, 100);


// CREATE INVADERS
const createInvaders = () => {
    // 32 is the total of invaders
    // 8 is the number of invaders per row

    for (let i = 1 ; i <= 32 ; i++) {
        if (i <= 8) {
            invaders.push(new Invader(i));
        } else if (i <= 16) {
            invaders.push(new Invader(i + 9));
        } else if (i <= 24) {
            invaders.push(new Invader(i + 18));
        } else if (i <= 32) {
            invaders.push(new Invader(i + 27));
        }
    }

    invaders.forEach(invader => {
        allDivs[invader.position].classList.add(invader.imgAlive);
    });
}

createInvaders();


// CLASS PLAYER
class Player {
    constructor(position) {
        this.position = position;
        this.imgAlive = "player";
        this.imgDead = "boom";
    }

    updatePosition(newPosition) {
        allDivs[this.position].classList.remove("player");
        this.position = newPosition;
        allDivs[this.position].classList.add("player");
    }
}

const player = new Player(314);
allDivs[player.position].classList.add(player.imgAlive);


// PROJECTILES
class Projectile {
    constructor(position) {
        this.position = position;
        this.img = "laser";
        this.idInterval = setInterval(() => {
            this.updatePosition(this.position - 17);
        }, 100);
    }

    updatePosition(newPosition) {
        allDivs[this.position].classList.remove("laser");
        this.position = newPosition;
        if (this.position <= allDivs.length && this.position >= 0) {
            console.log("tir")
            if (invaders.length > 0) {
                invaders.forEach((invader, index) => {
                    if (invader.position !== this.position) {
                        allDivs[this.position].classList.add("laser");
                    } else {
                        setTimeout(() => {
                            scoreActuel += 1;
                            titreH3.textContent = `Score : ${scoreActuel}`;
                            allDivs[invader.position].classList.remove("alien");
                            clearInterval(this.idInterval);
                            projectiles.splice(projectiles.indexOf(this), 1);
                            invaders.splice(index, 1);
                            allDivs[this.position].classList.remove("laser");
                            console.log("cleared")
                            allDivs[this.position].classList.add("boom");
                            setTimeout(() => {
                                allDivs[this.position].classList.remove("boom");
                            }, 100);
                        }, 0);
                    }
                });
            } else {
                if (moveInvaderInterval) clearInterval(moveInvaderInterval);
                titreH3.textContent = "Vous avez gagné :D !";
                allDivs[this.position].classList.add("laser");
            }
        }
        else {
            clearInterval(this.idInterval);
            console.log("cleared")
        }
    }
}


// HANDLE PLAYER MOVEMENTS
let laserReload = false;
const handlePlayer = e => {
        switch (e.keyCode) {
            case 81:
                console.log("q")
                if (!(allDivs[player.position].getAttribute("container-limits") === "left") && !gameOver) player.updatePosition(player.position - 1);
                else console.log("nope left")
            break;
            case 68:
                console.log("d")
                if (!(allDivs[player.position].getAttribute("container-limits") === "right") && !gameOver) player.updatePosition(player.position + 1);
                else console.log("nope right")
            break;
            case 32:
                if (!laserReload && !gameOver) {
                    projectiles.push(new Projectile(player.position));
                    laserReload = true;
                    console.log("SHOOT");
                    setTimeout(() => {
                        laserReload = false;
                    }, 100);
                }
                // console.log("space");
                // console.log(projectiles);
            break;
            default:
            break;
        }
}

document.addEventListener("keyup", handlePlayer);