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
        this.updateWhenPaused = true;
        this.buying = false;//this is false because when the game begins we will not be buying
    },
    
    update: function(){
        this.now = new Date().getTime();
        
        if(me.input.isKeyPressed("buy") && this.now-this.lastBuy >=1000){
            this.lastBuy = this.now;
            if(!this.buying){
                this.startBuying();
            }else{
                this.startBuying();
            }
            
        }
        
        return true;
    },
    
    startBuying: function(){
        this.buying = true;//this keeps track of when to open it
        me.state.pause(me.state.PLAY);//this pauses the game so we can buy something
        game.data.pausePos = me.game.viewport.localToWorld(0, 0);
        game.data.buyscreen = new me.Sprite(game.data.pausePos.X, game.data.pausePos.y, me.loader.getImage('gold-screen'));
        game.data.buyscreen.updateWhenPaused = true;
        game.data.buyscreen.setOpacity(0.8);//this lets us see whats going on behind the pause screen
        me.game.world.addChild(game.data.buyscreen, 34);
        game.data.player.body.setVelocity(0, 0);
        me.input.bindKey(me.input.KEY.F1, "F1", true);
        me.input.bindKey(me.input.KEY.F2, "F2", true);
        me.input.bindKey(me.input.KEY.F3, "F3", true);
        me.input.bindKey(me.input.KEY.F4, "F4", true);
        me.input.bindKey(me.input.KEY.F5, "F5", true);
        me.input.bindKey(me.input.KEY.F6, "F6", true);
        this.setBuyText();
    },
    
    setBuyText: function(){
      game.data.buytext = new (me.Renderable.extend({
        init: function(){//this is a generic function/the inilization of the text
            this._super(me.Renderable, 'init', [game.data.pausePos.x, game.data.pausePos.y, 300, 50]);
            this.font = new me.Font("Arial", 26, "white");//this gives us a font to use                       
            this.updateWhenPaused = true;
            this.alwaysUpdate = true;
        },
        //These lines of code are for the spendExp screen
            draw: function(renderer){//this adds text on the screen
            this.font.draw(renderer.getContext(), "PRESS F1-F4 TO BUY, B TO EXIT. Current Gold: " + game.data.gold, this.pos.x, this.pos.y);
            this.font.draw(renderer.getContext(), "Skill 1: Increase Damage. Current Level: " + game.data.exp1 + " Cost: " + ((game.data.exp1+1)*10),this.pos.x, this.pos.y + 40);
            this.font.draw(renderer.getContext(), "Skill 2: Run Faster! Current Level: " + game.data.exp2 + " Cost: " + ((game.data.exp2+1)*10), this.pos.x, this.pos.y + 80);
            this.font.draw(renderer.getContext(), "Skill 3: Increase Health. Current Level: " + game.data.exp3 + " Cost: " + ((game.data.exp3+1)*10), this.pos.x, this.pos.y + 120);
            this.font.draw(renderer.getContext(), "Q Ability: Speed Burst. Current Level: " + game.data.exp4 + " Cost: " + ((game.data.exp4+1)*10), this.pos.x, this.pos.y + 160);
            this.font.draw(renderer.getContext(), "W Ability: Eat Your Creep For Health: " + game.data.exp5 + " Cost: " + ((game.data.exp5+1)*10), this.pos.x, this.pos.y + 200);
            this.font.draw(renderer.getContext(), "E Ability: Throw Your Spear: " + game.data.exp6 + " Cost: " + ((game.data.exp6+1)*10), this.pos.x, this.pos.y + 240);
        }

        }));
      me.game.world.addChild(game.data.buytext, 35);
    },
    
    stopBuying: function(){
        this.buying = false;//this keeeps track of when to open it
        me.state.resume(me.state.PLAY);//this resumes the games
        game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
        me.game.world.removeChild(game.data.buyscreen);
        me.input.unbindKey(me.input.KEY.F1, "F1", true);//this unbinds
        me.input.unbindKey(me.input.KEY.F2, "F2", true);//all these
        me.input.unbindKey(me.input.KEY.F3, "F3", true);//keys
        me.input.unbindKey(me.input.KEY.F4, "F4", true);
        me.input.unbindKey(me.input.KEY.F5, "F5", true);
        me.input.unbindKey(me.input.KEY.F6, "F6", true);
        me.game.world.removeChild(game.data.buytext);
    }
    
});

