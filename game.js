const container = document.querySelector(".grid");
const titreH3 = document.querySelector("h3");
const overlayStart = document.querySelector(".overlay-start");
const buttonStart = document.querySelector(".btn-start");
const btnLeft = document.querySelector(".btn-left");
const btnRight = document.querySelector(".btn-right");
const btnShoot = document.querySelector(".btn-shoot");

const numberOfDivsX = container.scrollWidth / 25; //25px is the size of a div
const numberOfDivsY = container.scrollHeight / 25;
let gameOver = false;
let allDivs = [];
const invaders = [];
const projectiles = [];
let score = 0;
titreH3.textContent = "Protégez la Terre !";


//CREATE GRID
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


//CONTROL THE LAUNCH OF THE GAME WITH START BUTTON
buttonStart.addEventListener("click", () => {
    startGame();
    buttonStart.style.display = "none";
    overlayStart.style.display = "none";
    btnLeft.style.display = "initial";
    btnRight.style.display = "initial";
    btnShoot.style.display = "initial";
    titreH3.textContent = `Score : ${score}`;
});


//THE LOGIC OF THE GAME
const startGame = () => {
    //CLASS INVADER
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


    //HANDLE INVADERS MOVEMENTS
    let moveRight = true;
    let moveLeft = false;
    let movementDirection = 1;

    const handleInvadersMovements = () => {
        invaders.forEach(invader => {
            if (invader.position === player.position || invader.position >= 340) {
                handleGameOver();
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

    //SetInterval to animate invaders
    const moveInvaderInterval = setInterval(handleInvadersMovements, 100);


    //CREATE INVADERS AT START
    const createInvaders = () => {
        //32 is the total of invaders
        //8 is the number of invaders per row

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


    //CLASS PLAYER
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


    //CLASS PROJECTILE
    class Projectile {
        constructor(position) {
            this.position = position;
            this.img = "laser";
            this.idInterval = setInterval(() => { //SetInterval to animate the projectile
                this.updatePosition(this.position - 17);
            }, 100);
        }

        //Handle projectiles and collisions with invaders
        updatePosition(newPosition) {
            allDivs[this.position].classList.remove("laser");
            this.position = newPosition;
            if (this.position <= allDivs.length && this.position >= 0) {
                // console.log("tir")
                if (invaders.length > 0) {
                    invaders.forEach((invader, index) => {
                        if (invader.position !== this.position) {
                            allDivs[this.position].classList.add("laser");
                        } else {
                            setTimeout(() => {
                                score += 1;
                                titreH3.textContent = `Score : ${score}`;
                                allDivs[invader.position].classList.remove("alien");
                                clearInterval(this.idInterval);
                                projectiles.splice(projectiles.indexOf(this), 1);
                                invaders.splice(index, 1);
                                allDivs[this.position].classList.remove("laser");
                                // console.log("cleared")
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
                // console.log("cleared")
            }
        }
    }


    //HANDLE GAME OVER, CLEAN ALL EVENTS AND RESET THE DATA
    const handleGameOver = () => {
        gameOver = true;
        btnLeft.removeEventListener("touchstart", handleLeftBtnDown);
        btnRight.removeEventListener("touchstart", handleRightBtnDown);
        btnShoot.removeEventListener("touchstart", handleShootBtnDown);
        btnLeft.removeEventListener("touchend", handleLeftBtnUp);
        btnRight.removeEventListener("touchend", handleRightBtnUp);
        btnShoot.removeEventListener("touchend", handleShootBtnUp);
        document.removeEventListener("keydown", handleKeydown);
        document.removeEventListener("keyup", handleKeyup);
        clearInterval(moveInvaderInterval);
        projectiles.forEach(projectile => {
            clearInterval(projectile.idInterval);
        });
        setTimeout(() => {
            allDivs[player.position].classList.remove("player", "alien");
            allDivs[player.position].classList.add("boom");
        }, 0);
        setTimeout(() => {
            allDivs.forEach(div => {
                div.classList.remove("alien", "player", "boom", "laser");
            });
            gameOver = false;
            allDivs.length = 0;
            invaders.length = 0;
            projectiles.length = 0;
            score = 0;
            btnLeft.style.display = "none";
            btnRight.style.display = "none";
            btnShoot.style.display = "none";
            buttonStart.style.display = "initial";
            overlayStart.style.display = "flex";
        }, 500);
    }


    //HANDLE PLAYER ACTIONS
    const keys = {
        q: {
            number: 81,
            pressed: false
        },
        d: {
            number: 68,
            pressed: false
        },
        space: {
            number: 32,
            pressed: false
        }
    };

    let laserReload = false;

    //Triggered functions by keyboard and buttons events listeners
    const handleKeydown = e => {
        // console.log("down")
        if (e.keyCode === 81 || keys.q.pressed) {
            keys.q.pressed = true;
            if (!(allDivs[player.position].getAttribute("container-limits") === "left") && !keys.d.pressed && !gameOver) player.updatePosition(player.position - 1);
        };
        if (e.keyCode === 68 || keys.d.pressed) {
            keys.d.pressed = true;
            if (!(allDivs[player.position].getAttribute("container-limits") === "right") && !keys.q.pressed && !gameOver) player.updatePosition(player.position + 1);
        };
        if (e.keyCode === 32 || keys.space.pressed) {
            keys.space.pressed = true;
            if (!laserReload && !gameOver) {
                projectiles.push(new Projectile(player.position));
                laserReload = true;
                // console.log("SHOOT");
                setTimeout(() => {
                    laserReload = false;
                }, 300);
            }
        };
    }

    const handleKeyup = e => {
        // console.log("up")
        if (e.keyCode === 81) {
            keys.q.pressed = false;
        };
        if (e.keyCode === 68) {
            keys.d.pressed = false;
        };
        if (e.keyCode === 32) {
            keys.space.pressed = false;
        };
    }

    //Events listeners for keyboard and buttons
    const handleLeftBtnDown = () => {handleKeydown({keyCode: 81})};
    const handleRightBtnDown = () => {handleKeydown({keyCode: 68})};
    const handleShootBtnDown = () => {handleKeydown({keyCode: 32});};
    const handleLeftBtnUp = () => {handleKeyup({keyCode: 81})};
    const handleRightBtnUp = () => {handleKeyup({keyCode: 68})};
    const handleShootBtnUp = () => {handleKeyup({keyCode: 32});};

    btnLeft.addEventListener("touchstart", handleLeftBtnDown);
    btnRight.addEventListener("touchstart", handleRightBtnDown);
    btnShoot.addEventListener("touchstart", handleShootBtnDown);

    btnLeft.addEventListener("touchend", handleLeftBtnUp);
    btnRight.addEventListener("touchend", handleRightBtnUp);
    btnShoot.addEventListener("touchend", handleShootBtnUp);

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyup);
    
}