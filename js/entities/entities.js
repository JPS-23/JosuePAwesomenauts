game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {//we set up our functions here
        this._super(me.Entity, 'init', [x, y, {//this reaches into the constructer of entity's
                image: "player",//this includes and image and its name
                width: 64,//the width & height tell the screen what amount of space to preserve
                height: 64,
                spritewidth: "64",//sprite width and height pass the information
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();//this returns a new shape
                }
        }]);   
        this.type = "PlayerEntity";
        this.health = game.data.playerHealth;//this gives our player its health
        this.body.setVelocity(game.data.playerMoveSpeed, 20);//velocity represents our current position
        //Keeps track of which direction your charector is going
        this.facing = "right";
        this.now = new Date().getTime();//this keeps track of the time in the game
        this.lastHit = this.now;//this is a last hit variable
        this.dead = false;
        this.attack = game.data.playerAttack;
        this.lastAttack = new Date().getTime();//this is a hit delay variable
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);//this makes the screen follow the player
    
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123,124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
        
        this.renderable.setCurrentAnimation("idle");
    },
    
    update: function(delta){//if i dont update its not going to change the game
        this.now = new Date().getTime;//this updates our timer
        
        if (this.health <= 0){
            this.dead = true;
        }
        
        if(me.input.isKeyPressed("right")) {
            //adds to the position of my x by the velocity defined above in
            //setVelocity() and multiplying it by me.timer.tick.
            //me.timer.tick makes the movement look smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);//this flips the animation
        }else if(me.input.isKeyPressed("left")) {
            this.facing = "left";
            this.body.vel.x -=this.body.accel.x * me.timer.tick;
            this.flipX(false);
        }else{
            this.body.vel.x = 0;
        }
        
        if(me.input.isKeyPressed("jump") && !this.jumping && !this.falling){
            this.body.jumping = true;
            this.body.vel.y -= this.body.accel.y *me.timer.tick;
        }
        
        
        if(me.input.isKeyPressed("attack")) {//this is happening at the same time as the if statement
            if(!this.renderable.isCurrentAnimation("attack")){
                //Sets the current animation to attack and once that is over
                //goes back to idle animation
                this.renderable.setCurrentAnimation("attack", "idle");
                //Make sit so that the next time we start this sequence we begin
                //from the first animation, not wherever we left off when we
                //switched to another animation 
                this.renderable.setAnimationFrame();
            }
        }
        else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")){
            if(!this.renderable.isCurrentAnimation("walk")){
                this.renderable.setCurrentAnimation("walk");
        }
    }else if(!this.renderable.isCurrentAnimation("attack")){
        this.renderable.setCurrentAnimation("idle");
    }
        
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);//delta is the change of time that has happened
        
        

        this._super(me.Entity, "update", [delta]);//this updates the animations
        return true;
    },
    
    loseHealth: function(damage){
      this.health = this.health - damage;
    },
    
    collideHandler: function(response) {
        if(response.b.type==='EnemyBaseEntity'){//this represents the difference between the players and its base's position
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            
            if(ydif<-40 && xdif< 70 && xdif>-35){//this makes sure were within the bounds of the castle
                this.body.falling = false;
                this.body.vel.y = -1;
            }
            else if(xdif<-35 && this.facing==='right' && (xdif<0)){
               this.body.vel.x = 0;//the code above inputs our x difference
               //this.pos.x = this.pos.x -1;//this stops our player from coming in to the left
            }else if(xdif<70 && this.facing==='left' && (xdif<0)){
                this.body.vel.x = 0;
                //this.pos.x = this.pos.x +1;
            }
            //this states that if the enemy base is attacked it loses health
            if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer){
                
                this.lastHit = this.now;//this updates this.lastHit
                response.b.loseHealth(game.data.playerAttack);
            }
        }else if(response.b.type==='EnemyCreep'){
            var xdif = this.pos.x - response.b.pos.x;//these set our creeps
            var ydif = this.pos.y - response.b.pos.y;//x and y positions
            
            if(xdif>0){//this is our x difference
                //this.pos.x = this.pos.x + 1;
                if(this.facing==="left"){//this keeps track of which way we face
                    this.body.vel.x = 0;
                }
            }else{//this code keeps the creep from walking through our base
                //this.pos.x = this.pos.x - 1;
                if(this.facing==="right"){//this keeps us from walking thorugh our creep
                    this.body.vel.x = 0;
                }
            }
            if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
                    && (Math.abs(ydif) <=40) &&//this has our ydifference absolute value
                    ((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right")
                    ){//the code above stops us from going to much to the left or right
                this.lastHit = this.now;
                //if the creeps health i sless than our attack, execute code in if statement
                if(response.b.health <= game.data.playerAttack){
                    //adds one gold for every creep kill
                    game.data.gold += 1;
                    console.log("Current gold: " + game.data.gold);
                }
                
                response.b.loseHealth(game.data.playerAttack);//this code lets us hurt our enemy if were attacking it
            }   
        }
    }
});

game.PlayerBaseEntity = me.Entity.extend({//this is my player base entity
    init : function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
        }]);
        this.broken = false;//these are varibales i can use
        this.health = game.data.playerBaseHealth;//this is the towers health
        this.alwaysUpdate = true;//even if we are not on the screen it still updates
        this.body.onCollision = this.onCollision.bind(this);//this is a on collision call
        this.type = "PlayerBase";//this checks what were running into
        
        this.renderable.addAnimation("idle", [0]);//this fixes the tower image
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
    },
    
    update:function(delta) {
       if(this.health<=0) {//this says that if my health is 0 then were dead
           this.broken = true;
           this.renderable.setCurrentAnimation("broken");//this makes the tower image look normal
       }
       this.body.update(delta);//this makes sure the game updates
       
       this._super(me.Entity, "update", [delta]);//this has the last update time
       return true;
    },
    
    loseHealth: function(damage){
        this.health = this.health - damage;
    },
    
    onCollision: function() {
        
    }

});

game.EnemyBaseEntity = me.Entity.extend({
    init : function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
        }]);
        this.broken = false;
        this.health = game.data.enemyBaseHealth;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        
        this.type = "EnemyBaseEntity";
        
        this.renderable.addAnimation("idle", [0]);//this makes the tower image normal
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
    },
    
    update:function(delta) {
       if(this.health<=0) {
           this.broken = true;
           this.renderable.setCurrentAnimation("broken");//this fixes the tower image
       }
       this.body.update(delta);
       
       this._super(me.Entity, "update", [delta]);
       return true;
    },
    
    onCollision: function() {
        
    },
    //we are adding a lose health function
    loseHealth: function(){
        this.health--;
    }

});

game.EnemyCreep = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
            image: "creep1",
            width: 32,
            height: 64,
            spritewidth: "32",
            spriteheight: "64",
            getShape: function() {
                return (new me.Rect(0, 0, 32, 64)).toPolygon();
            }//we need this code for our entities
        }]);
        this.health = game.data.enemyCreepHealth;//this is the enemys health
        this.alwaysUpdate = true;//this updates the function
        //this.attacking lets us know if the enemy is currently attaking
        this.attacking = false;
        //keeps track of when our creep last attacked anything
        this.lastAttacking = new Date().getTime();
        //keeps track of the last time our creep hit anything
        this.lastHit = new Date().getTime();
        this.now = new Date().getTime();
        this.body.setVelocity(3, 20);//this gives th enemy its velocity
        
        this.type = "EnemyCreep";
        
        this.renderable.addAnimation("walk", [3, 4, 5], 80);//this lets our enemy walk
        this.renderable.setCurrentAnimation("walk");
    
    },
    
    loseHealth: function(damage){
        this.health = this.health - damage;  
    },
    
    update: function(delta){
        if(this.health<= 0){//this lets us kill our enemy creep
            me.game.world.removeChild(this);
        }
        
        this.now = new Date().getTime();
        
        this.body.vel.x -= this.body.accel.x * me.timer.tick;//this gives the enemy a velocity
        
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        
        
        this.body.update(delta);//delta is the change of time that has happened
        
        

        this._super(me.Entity, "update", [delta]);//this updates the animations       
        return true;
    },
    
    collideHandler: function(response){//this gives a parameter response
        if(response.b.type==='PlayerBase'){
            this.attacking=true;//this says were attacking
            //this.lastAttacking=this.now;//this says the last time i attacked
            this.body.vel.x = 0;//this sets our velocity
            //keeps moving the creep to the right to maintain its position
            this.pos.x = this.pos.x + 1;
            //checls that it has been at least 1 second since this creep hit a base
            if((this.now-this.lastHit >= 1000)){
                //updates the lastHit timer
                this.lastHit = this.now;
                //makes the playerBase call its loseHealth functionand pases it as 
                //as a damge of 1
                response.b.loseHealth(game.data.enemyCreepAttack);//this takes away health from our player
            }
        }else if(response.b.type==='PlayerEntity'){//this makes the creep hit only 1 object at a time
            var xdif = this.pos.x - response.b.pos.x;//this checks our x position
            
            this.attacking=true;//this says were attacking
            //this.lastAttacking=this.now;//this says the last time i attacked
            
            
            if(xdif>0){
                //keeps moving the creep to the right to maintain its position
                this.pos.x = this.pos.x + 1;
                this.body.vel.x = 0;//this sets our velocity
            }
            //checls that it has been at least 1 second since this creep hit something
            if((this.now-this.lastHit >= 1000) && xdif>0){
                //updates the lastHit timer
                this.lastHit = this.now;
                //makes the playerBase call its loseHealth function and pases it as 
                //as a damge of 1
                response.b.loseHealth(game.data.enemyCreepAttack);//this takes away health from our player
            }
        }
    }
    
});

game.GameManager = Object.extend({
    init: function(x, y, settings){//were initializing the function here
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();//this keeps track of the last time we had a creep
        this.paused = false;
        this.alwaysUpdate = true;//this makes sure were always updating
    },
    
    update: function(){
        this.now = new Date().getTime();
        
        if(game.data.player.dead){
            me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(10, 0);//this is for our reset function
        }
        
        if(Math.round(this.now/1000)%20 ===0 && (this.now - this.lastCreep >= 1000)){
            game.data.gold += 1;
            console.log("Current gold: " + game.data.gold);
        }
        //these lines of code are for every creep we kill we get gold
        if(Math.round(this.now/1000)%10 ===0 && (this.now - this.lastCreep >= 1000)){
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000 , 0, {});//this sets our creeps
            me.game.world.addChild(creepe, 5);//this adds a creepe to the world
        }
        
        return true;
    }
});

