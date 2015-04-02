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

