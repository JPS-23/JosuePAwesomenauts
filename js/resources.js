game.resources = [

	/* Graphics. 
	 * @example
	 * {name: "example", type:"image", src: "data/img/example.png"},
	 */
        {name: "background-tiles", type:"image", src: "data/img/background-tiles.png"},//this adds the background images and the meta tiles
        {name: "meta-tiles", type:"image", src: "data/img/meta-tiles.png"},
        {name: "player", type:"image", src: "data/img/orcSpear.png"},//this is to load the player 
        {name: "tower", type:"image", src: "data/img/tower_round.svg.png"},//this is to load our tower image
        {name: "creep1", type:"image", src: "data/img/brainmonster.png"},
        
	/* Atlases 
	 * @example
	 * {name: "example_tps", type: "tps", src: "data/img/example_tps.json"},
	 */
		
	/* Maps. 
	 * @example
	 * {name: "example01", type: "tmx", src: "data/map/example01.tmx"},
	 * {name: "example01", type: "tmx", src: "data/map/example01.json"},
 	 */
        {name: "level01", type: "tmx", src: "data/map/test.tmx"}//this is code to add the level

	/* Background music. 
	 * @example
	 * {name: "example_bgm", type: "audio", src: "data/bgm/"},
	 */	

	/* Sound effects. 
	 * @example
	 * {name: "example_sfx", type: "audio", src: "data/sfx/"}
	 */
];
