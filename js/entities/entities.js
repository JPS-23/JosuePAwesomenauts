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
    
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123,124, 125], 80);
    
        this.renderable.setCurrentAnimation("idle");
    },
    
    update: function(delta){//if i dont update its not going to change the game
        if(me.input.isKeyPressed("right")) {
            //adds to the position of my x by the velocity defined above in
            //setVelocity() and multiplying it by me.timer.tick.
            //me.timer.tick makes the movement look smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.flipX(true);//this flips the animation
        }else{
            this.body.vel.x = 0;
        }
        
        if(this.body.vel.x !== 0){
            if(!this.renderable.isCurrentAnimation("walk")){
                this.renderable.setCurrentAnimation("walk");
        }
    }else{
        this.renderable.setCurrentAnimation("idle");
    }
        
 
        
        this.body.update(delta);//delta is the change of time that has happened

        this._super(me.Entity, "update", [delta]);//this updates the animations
        return true;
    }
});