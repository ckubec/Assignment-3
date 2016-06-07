
// GameBoard code below

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Circle(game) {
    this.player = 1;
    this.radius = 10;
    this.visualRadius = 500;
    this.colors = ["White", "Red", "Green", "Blue", "Black", "Purple"];
    this.setNotIt();
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.setIt = function (level) {
    if(level === 1) {
        this.color = this.color + level;
    } else {
        this.it = true;
        this.color = 1;
        this.visualRadius = 500;
    }

    /*if(this.color === 4) {
        this.setNotIt();
    }*/

};

Circle.prototype.setNotIt = function () {
    this.it = false;
    this.color = 0;
    this.visualRadius = 200;
};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);
   //console.log(this.velocity);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;
            if (this.it) {
                //this.setNotIt();
                //this.velocity
                ent.setIt();
                //this.setIt(1);
            }
            else if (ent.it) {
                this.setIt();
                //ent.setIt(1);
               // ent.setNotIt();
            }
        }

        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
            var dist = distance(this, ent);
            if (this.it && dist > this.radius + ent.radius + 10) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration / (dist*dist);
                this.velocity.y += difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
            if (ent.it && dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x -= difX * acceleration / (dist * dist);
                this.velocity.y -= difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
        }
        if(this.game.entities[i].it === true) {
            count++;
        }
    }

    if(count === this.game.entities.length) {
        cycles += 1;
        //console.log("everyone died: " + cycles);
        deathUpdate(cycles);
        
        for(i = 0; i<this.game.entities.length; i++) {
            this.game.entities[i].setNotIt();
        }
        this.game.entities[Math.floor(Math.random() * (this.game.entities.length-1))].setIt();
    }
    count = 0;
    


    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;

};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};



// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 200;
var cycles = 0;
var count = 0;

//Connection
var socket = io.connect("http://76.28.150.193:8888");

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    var gameEngine = new GameEngine();
    var circle = new Circle(gameEngine);
    circle.setIt();
    gameEngine.addEntity(circle);
    for (var i = 0; i < 25; i++) {
        circle = new Circle(gameEngine);
        gameEngine.addEntity(circle);
    }
    gameEngine.init(ctx);
    gameEngine.start();

    var STUDENT_NAME ="Chris Kubec";
    var STATE_NAME= "savedState";

    //Saving Circles using Sockets
    document.getElementById("save").onclick = function (e) {
        e.preventDefault();
        var ents = gameEngine.entities;
        var stateToSave = {studentName: STUDENT_NAME, stateName:STATE_NAME, gameState: []};

        //Getting All Circles
        for(var i = 0; i< ents.length; i++){
            var ent = ents[i];
            if(ent instanceof Circle){
                stateToSave.gameState.push({type:"circle", x: ent.x, y:ent.y, color: ent.color,
                    velocityX : ent.velocity.x, velocityY: ent.velocity.y, it: ent.it});
            }
        }

        //Getting Death Count
        stateToSave.gameState.push({type:"deaths", death: cycles});

        //Saving State
        socket.emit("save", stateToSave);
    };

    //Loading Circles with Sockets
    document.getElementById("load").onclick = function (e) {
        e.preventDefault();
        socket.emit("load", {studentName: STUDENT_NAME, stateName: STATE_NAME});
    };

    socket.on("load", function (data) {
        gameEngine.entities = [];
        var ents = data.gameState;
        for(var i = 0; i<ents.length; i++){
            var savedTemp = ents[i];
            if(savedTemp.type==="circle"){
                var circle = new Circle(gameEngine);
                circle.x = savedTemp.x;
                circle.y = savedTemp.y;
                circle.velocity.x = savedTemp.velocityX;
                circle.velocity.y = savedTemp.velocityY;
                circle.color = savedTemp.color;
                circle.it = savedTemp.it;
                gameEngine.entities.push(circle);
            }
            if(savedTemp.type === "deaths"){
                cycles = savedTemp.death;
                deathUpdate(cycles);
            }
        }
    });
    
});
