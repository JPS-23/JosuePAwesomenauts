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
           game.data.win = false;
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