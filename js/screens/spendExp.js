game.SpendExp = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {//the code below is to load the title image	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('exp-screen')), -10); // TODO
                //the line below adds a key to send us to our play screen
               // me.input.bindKey(me.input.KEY.ENTER, "start");           
                me.game.world.addChild(new (me.Renderable.extend({
                    init: function(){//this is a generic function/the inilization of the text
                        this._super(me.Renderable, 'init', [10, 10, 300, 50]);
                        this.font = new me.Font("Arial", 46, "white");//this gives us a font to use                       
                    },
                    //These lines of code are for the spendExp screen
                    draw: function(renderer){//this adds text on the screen
                        this.font.draw(renderer.getContext(), "PRESS F1-F4 TO BUY, F5 TO SKIP", this.pos.x, this.pos.y);
                        this.font.draw(renderer.getContext(), "CURRENT EXP: " + game.data.exp.toString(), this.pos.x + 100, this.pos.y + 50);
                        this.font.draw(renderer.getContext(), "F1: INCREASE GOLD PRODUCTION " + game.data.exp.toString(), this.pos.x + 200, this.pos.y + 100);
                        this.font.draw(renderer.getContext(), "F2: ADD STARTING GOLD " + game.data.exp.toString(), this.pos.x + 200, this.pos.y + 150);
                        this.font.draw(renderer.getContext(), "F3: INCREASE ATTACK DAMAGE " + game.data.exp.toString(), this.pos.x + 200, this.pos.y + 200);
                        this.font.draw(renderer.getContext(), "F4: INCREASE STARTING HEALTH " + game.data.exp.toString(), this.pos.x + 200, this.pos.y + 250);
                    }                              
                   
                })));
         
        },
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {//this unbinds the ENTER KEY so that it doesnt make start all over during the game
	//	me.input.unbindKey(me.input.KEY.ENTER); // TODO
        //        me.event.unsubscribe(this.handler);
        }
});
