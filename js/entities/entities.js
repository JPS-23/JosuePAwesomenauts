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
        this.body.setVelocity(5, 20);//velocity represents our current position
        //Keeps track of which direction your charector is going
        this.facing = "right";
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);//this makes the screen follow the player
    
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123,124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
        
        this.renderable.setCurrentAnimation("idle");
    },
    
    update: function(delta){//if i dont update its not going to change the game
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
            this.jumping = true;
            this.body.vel.y -= this.body.accel.y *me.timer.tick;
        }
        
        
        if(me.input.isKeyPressed("attack")) {//this is happening at the same time as the if statement
            if(!this.renderable.isCurrentAnimation("attack")){
                console.log(!this.renderable.isCurrentAnimation("attack"));
                //Sets the current animation to attack and once that is over
                //goes back to idle animation
                this.renderable.setCurrentAnimation("attack", "idle");
                //Make sit so that the next time we start this sequence we begin
                //from the first animation, not wherever we left off when we
                //switched to another animation 
                this.renderable.setAnimationFrame();
            }
        }
        else if(this.body.vel.x !== 0){
            if(!this.renderable.isCurrentAnimation("walk")){
                this.renderable.setCurrentAnimation("walk");
        }
    }else{
        this.renderable.setCurrentAnimation("idle");
    }
    
    if(me.input.isKeyPressed("attack")) {//this is happening at the same time as the if statement
            if(!this.renderable.isCurrentAnimation("attack")){
                console.log(!this.renderable.isCurrentAnimation("attack"));
                //Sets the current animation to attack and once that is over
                //goes back to idle animation
                this.renderable.setCurrentAnimation("attack", "idle");
                //Make sit so that the next time we start this sequence we begin
                //from the first animation, not wherever we left off when we
                //switched to another animation 
                this.renderable.setAnimationFrame();
            }
        }
        
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);//delta is the change of time that has happened
        
        

        this._super(me.Entity, "update", [delta]);//this updates the animations
        return true;
    },
    
    collideHandler: function(response) {
        if(response.b.type==='EnemyBaseEntity'){//this represents the difference between the players and its base's position
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            
            console.log("xdif" + xdif + "ydif" + ydif);
            
            if(xdif<-35 && this.facing==='right' && (xdif<0)){
               this.body.vel.x = 0;
               this.pos.x = this.pos.x -1;//this stops our player from coming in to the left
            }else if(xdif<61 && this.facing==='left' && (xdif<0)){
                this.body.vel.x = 0;
                this.pos.x = this.pos.x +1;
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
        this.health = 10;//this is the towers health
        this.alwaysUpdate = true;//even if we are not on the screen it still updates
        this.body.onCollision = this.onCollision.bind(this);//this is a on collision call
        console.log("init");
        this.type = "PlayerBaseEntity";//this checks what were running into
        
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
        this.health = 10;
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
        
    }

});