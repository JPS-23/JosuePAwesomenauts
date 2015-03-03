game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {//we set up our functions here
        this.setSuper(x, y);
        this.setPlayerTimers();
        this.setAttributes();    
        this.type = "PlayerEntity";
        this.setFlags();//these are things that are either one way or another                        
        
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);//this makes the screen follow the player
        
        this.addAnimation();
                    
        this.renderable.setCurrentAnimation("idle");
    },
    //its good to try and keep functions under 20 lines
    setSuper: function(x, y){//this is the setSuper function that sets the setSuper class
       this._super(me.Entity, 'init', [x, y, {
               image: "player",
               width: 64,
               height: 64,
               spritewidth: "64",
               spriteheight: "64",
               getShape: function(){
                   return(new me.Rect(0, 0, 64, 64)).toPolygon();
               }
       }]);
    },
    
    setPlayerTimers: function(){
        this.now = new Date().getTime();//this keeps track of the time in the game
        this.lastHit = this.now;//this is a last hit variable
        this.lastAttack = new Date().getTime();//this is a hit delay variable
    },
    
    setAttributes: function(){
        this.health = game.data.playerHealth;//this gives our player its health
        this.body.setVelocity(game.data.playerMoveSpeed, 20);//velocity represents our current position
        this.attack = game.data.playerAttack;
    },
    
    setFlags: function(){
        //Keeps track of which direction your character is going
        this.facing = "right";       
        this.dead = false;
        this.attacking = false;
    },
    
    addAnimation: function(){
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123,124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
      
    },
    
    update: function(delta){//if i dont update its not going to change the game
        this.now = new Date().getTime;//this updates our timer        
        this.dead = this.checkIfDead();        
        this.checkKeyPressesAndMove();     
        this.setAnimation();        
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);//delta is the change of time that has happened                
        this._super(me.Entity, "update", [delta]);//this updates the animations
        return true;
    },
    
    checkIfDead: function(){
      if (this.health <= 0){
          return true;//we are not setting the flag here
        }
        return false;
    },
    
    checkKeyPressesAndMove: function(){
        if(me.input.isKeyPressed("right")) {
            this.moveRight();
        }else if(me.input.isKeyPressed("left")) {
            this.moveLeft();
        }else{
            this.body.vel.x = 0;
        }
        
        if(me.input.isKeyPressed("jump") && !this.jumping && !this.falling){
            this.jump();
        }
        
        this.attacking = me.input.isKeyPressed("attack");
    },
    //this is a function for my move right code
    moveRight: function(){
        //adds to the position of my x by the velocity defined above in
            //setVelocity() and multiplying it by me.timer.tick.
            //me.timer.tick makes the movement look smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);//this flips the animation
    },
      //this is a function for my move left code
    moveLeft: function(){
        this.facing = "left";
            this.body.vel.x -=this.body.accel.x * me.timer.tick;
            this.flipX(false);
    },
    //this is a function for my jump code
    jump: function(){
        this.body.jumping = true;
        this.body.vel.y -= this.body.accel.y *me.timer.tick;
    },
    
    setAnimation: function(){
        if(this.attacking) {//this is happening at the same time as the if statement
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
    }   else if(!this.renderable.isCurrentAnimation("attack")){
        this.renderable.setCurrentAnimation("idle");
    } 
    },
    
    loseHealth: function(damage){
      this.health = this.health - damage;
    },
    
    collideHandler: function(response) {
        if(response.b.type==='EnemyBaseEntity'){//this represents the difference between the players and its base's position
            this.collideWithEnemyBase(response);
        }else if(response.b.type==='EnemyCreep'){
            this.collideWithEnemyCreep(response);
        }
    },
    
    collideWithEnemyBase: function(response){
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            
            if(ydif<-40 && xdif< 70 && xdif>-35){//this makes sure were within the bounds of the castle
                this.body.falling = false;
                this.body.vel.y = -1;
            }
            else if(xdif<-35 && this.facing==='right' && (xdif<0)){
               this.body.vel.x = 0;
            }else if(xdif<70 && this.facing==='left' && (xdif<0)){
                this.body.vel.x = 0;
            }            
            if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer){                
                this.lastHit = this.now;//this updates this.lastHit
                response.b.loseHealth(game.data.playerAttack);
            }
        },
           
    collideWithEnemyCreep: function(response){        
            var xdif = this.pos.x - response.b.pos.x;//these set our creeps
            var ydif = this.pos.y - response.b.pos.y;//x and y positions
            
            this.stopMovement(xdif);
            
            if(this.checkAttack(xdif, ydif)){
                this.hitCreep(response);
            };
            
    },
    
    stopMovement: function(xdif){
    if(xdif>0){
        if(this.facing==="left"){
            this.body.vel.x = 0;
        }
    }else{
        if(this.facing==="right"){
            this.body.vel.x = 0;
        }
    }
    },
    
    checkAttack: function(xdif, ydif){
        if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
                    && (Math.abs(ydif) <=40) &&//this has our ydifference absolute value
                    ((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right")
                    ){//the code above stops us from going to much to the left or right
                this.lastHit = this.now;
                //creeps health = less than value creep dies
                return true;//this executes the code in collideWithEnemyCreep
        }
        return false;
    },
    
    hitCreep: function(response){
        if(response.b.health <= game.data.playerAttack){
                    
                    game.data.gold += 1;//adds one gold for every creep kill
                    console.log("Current gold: " + game.data.gold);
                }
                
                response.b.loseHealth(game.data.playerAttack);//this code hurts the enemy when attacked
    }
});
