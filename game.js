//game.js
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    parent: 'gameContainer',
    backgroundColor: '#D0D3D4',
    scene: {

        preload: function() {
            this.load.image('playButton', 'assets/playButton.svg');
            this.load.image('heart', 'assets/heart.svg');
            this.load.image('noEntry', 'assets/noEntry.svg');

        },
        create: function() {
            const model = GameModel.getInstance(); //Singleton Pattern
            const view = GameView.getInstance(this, model); //Singleton Pattern
            GameController.getInstance(view); //Singleton Pattern
        }
    }
};

const game = new Phaser.Game(config);