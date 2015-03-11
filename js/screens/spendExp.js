game.SpendExp = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {//the code below is to load the title image	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('exp-screen')), -10); // TODO
                //the line below adds a key to send us to our play screen
                    
                me.game.world.addChild(new (me.Renderable.extend({
                    init: function(){//this is a generic function/the inilization of the text
                        this._super(me.Renderable, 'init', [510, 30, me.game.viewport.width, me.game.viewport.height]);
                        this.font = new me.Font("Arial", 46, "white");//this gives us a font to use
                    },
                    
                    draw: function(renderer){//this adds text on the screen
                        this.font.draw(renderer.getContext(), "SPEND", this.pos.x, this.pos.y);                        
                    }
                    
                })));
        
        },
	        
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {//this unbinds the ENTER KEY so that it doesnt make start all over during the game
		me.input.unbindKey(me.input.KEY.ENTER); // TODO
                me.event.unsubscribe(this.handler);
        }
});
