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

game.HeroDeathManager = Object.extend({
    init: function(x, y, settings){
       this.alwaysUpdate = true;//this makes sure were always updating 
    },
    
    update: function(){
        if(game.data.player.dead){
            me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(10, 0);//this is for our reset function
        }
        
        return true;
    }
});

game.ExperienceManager = Object.extend({//this code is for my player to gain experience
    init: function(x, y, settings){
        this.alwaysUpdate = true;
        this.gameover = false;
    },
    
    update: function(){//these codes arent called until a flag is set
        if(game.data.win === true && !this.gameover){
            this.gameOver(true);
        }else if(game.data.win === false && !this.gameover){
            this.gameOver(false);
        }
        
        return true;
    },
    
    gameOver: function(win){
        if (win){
            game.data.exp += 10;
        }else{
            game.data.exp += 1;
        }
        
        this.gamepver = true;
        me.save.exp = game.data.exp;//me.save.exp2 = 4;       
    }

});

game.SpendGold = Object.extend({
    init: function(x, y, settings){
        this.now = new Date().getTime();
        this.lastPaused = new Date().getTime();//lets us know how long its been since our last purchase
        this.paused = false;
        this.alwaysUpdate = true;//this makes sure were always updating
    },
    
    update: function(){
        return true;
    }
    
});

