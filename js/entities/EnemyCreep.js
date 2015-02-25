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

