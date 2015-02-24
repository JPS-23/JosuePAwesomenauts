game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {//the code below is to load the title image	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('title-screen')), -10); // TODO
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		; // TODO
	}
});
