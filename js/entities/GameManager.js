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



