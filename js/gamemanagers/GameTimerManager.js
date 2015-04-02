game.GameTimerManager = Object.extend({//the gameManager class kills/revives our player, gives us gold, and spawns creeps
    init: function(x, y, settings){//were initializing the function here
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();//this keeps track of the last time we had a creep
        this.paused = false;
        this.alwaysUpdate = true;//this makes sure were always updating
    },    
    update: function(){
        this.now = new Date().getTime();
        this.goldTimerCheck();//this is a timer for my getGold code
        this.creepTimerCheck();//this is a timer for my creeps                        
        
        return true;
    },    
    goldTimerCheck: function(){
        if(Math.round(this.now/1000)%20 ===0 && (this.now - this.lastCreep >= 1000)){
            game.data.gold += (game.data.exp1+1);
            console.log("Current gold: " + game.data.gold);
        }
    },    
    creepTimerCheck: function(){
        if(Math.round(this.now/1000)%10 ===0 && (this.now - this.lastCreep >= 1000)){
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000 , 0, {});//this sets our creeps
            me.game.world.addChild(creepe, 5);//this adds a creepe to the world
        }
    }
});

