const config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 560,
    parent: 'gameContainer',
    backgroundColor: '#778899',
    scene: {
        preload: function () {
            this.load.image('playButton', 'assets/playButton.svg');
            this.load.image('heart', 'assets/heart.svg');
            this.load.image('noEntry', 'assets/noEntry.svg');
        },
        create: function ()  {
            new GameController(new GameModel(), new GameView(this)).createGame()
        
    }}
};
const game = new Phaser.Game(config);
