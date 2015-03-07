game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {//the code below is to load the title image	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('title-screen')), -10); // TODO
                
                //the code below adds text to the game
                me.game.world.addChild(new (me.Renderable.extend({
                    init: function(){//this is a generic function/the inilization of the text
                        this._super(me.Renderable, 'init', [270, 240, 300, 50]);
                        this.font = new me.Font("Arial", 46, "white");//this gives us a font to use
                        me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
                    },//the line above lets us use our pointer to start the game
                    
                    draw: function(renderer){//this adds text on the screen
                        this.font.draw(renderer.getContext(), "START A NEW GAME", this.pos.x, this.pos.y);
                    },
                    
                    update: function(dt){
                        return true;
                    },
                    
                    newGame: function(){
                        me.input.releasePointerEvent('pointerdown', this);
                        me.save.remove('exp');//here we are
                        me.save.remove('exp1');//removing
                        me.save.remove('exp2');//the 
                        me.save.remove('exp3');//five
                        me.save.remove('exp4');//variables
                        me.state.change(me.state.PLAY);//this states the changes we just made
                    }
                })));
                
                me.game.world.addChild(new (me.Renderable.extend({
                    init: function(){//this is a generic function/the inilization of the text
                        this._super(me.Renderable, 'init', [380, 340, 250, 50]);
                        this.font = new me.Font("Arial", 46, "white");//this gives us a font to use
                        me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
                    },//the line above lets us use our pointer to start the game
                    
                    draw: function(renderer){//this adds text on the screen
                        this.font.draw(renderer.getContext(), "CONTINUE", this.pos.x, this.pos.y);
                    },
                    
                    update: function(dt){
                        return true;
                    },
                    
                    newGame: function(){
                        me.input.releasePointerEvent('pointerdown', this);                        
                        me.state.change(me.state.PLAY);//this states the changes we just made
                    }
                })));
        
        },
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {//this unbinds the ENTER KEY so that it doesnt make start all over during the game

        }
});
