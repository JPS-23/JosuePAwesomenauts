game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {//the code below is to load the title image			
                me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('title-screen')), -10); // TODO                               
                //me.input.bindKey(me.input.KEY.ENTER, "start");
                game.data.option1 = new (me.Renderable.extend({
                    init: function(){//this is a generic function/the inilization of the text
                        this._super(me.Renderable, 'init', [510, 30, me.game.viewport.width, me.game.viewport.height]);
                        this.font = new me.Font("Arial", 46, "white");//this gives us a font to use
                        me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
                    },
                   
                    draw: function(renderer){//this adds text on the screen
                    //    this.font.draw(renderer.getContext(), "Awesomenauts!", 450, 130);
                    //    give the x coordinate of 350, y coordinate of 130
                          this.font.draw(renderer.getContext(), "START A NEW GAME", this.pos.x, this.pos.y);                          
                    },
                    
                    update: function(dt){
                        return true;
                    },
                    
                    newGame: function(){
                        me.input.releasePointerEvent('pointerdown', this);                        
                        me.state.change(me.state.NEW);
                    }
                    
                }));
                
                //****************CONTINUE FUNCTION****************************************************************
                   me.game.world.addChild( new (me.Renderable.extend({
                    init: function(){
                        this._super(me.Renderable, 'init', [380, 440, 250, 50]);
                        //font to use for this text
                        this.font = new me.Font("Ariel", 45, "White");
                        me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
                    },
                    //draw whats on the screen
                    draw: function(renderer){
                        //passing the context or screen were drawing in
                        //give the x coordinate of 350, y coordinate of 130
                        this.font.draw(renderer.getContext(), "CONTINUE!", this.pos.x, this.pos.y);
                    },
                    
                    update: function(dt){
                        return true;
                    },
                    
                    newGame: function(){
                        me.input.releasePointerEvent('pointerdown', this);
                        me.state.change(me.state.LOAD);
                    }
                    
                })));
            
        },                                                                                                                                
                /*this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge){
                   if(action === "start"){
                       me.state.change(me.state.PLAY);
                   } 
                });
                */        
        
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {//this unbinds the ENTER KEY so that it doesnt make start all over during the game
	//	me.input.unbindKey(me.input.KEY.ENTER); // TODO
        //        me.event.unsubscribe(this.handler);
        }
});
