game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {//we set up our functions here
        this.setSuper();
        this.setPlayerTimers();
        this.setAttributes();    
        this.type = "PlayerEntity";
        this.setFlags();//these are things that are either one way or another                        
        
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);//this makes the screen follow the player
        
        this.addAnimation();
                    
        this.renderable.setCurrentAnimation("idle");
    },
    //its good to try and keep functions under 20 lines
    setSuper: function(){//this is the setSuper function that sets the setSuper class
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
    },
    
    addAnimation: function(){
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123,124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
      
    },
    
    update: function(delta){//if i dont update its not going to change the game
        this.now = new Date().getTime;//this updates our timer
        
        this.dead = checkIfDead();
        
        this.checkKeyPressesAndMove();
                    
        
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
    
    jump: function(){
        this.body.jumping = true;
        this.body.vel.y -= this.body.accel.y *me.timer.tick;
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
