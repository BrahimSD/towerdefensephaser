//game.js
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    parent: 'gameContainer',
    backgroundColor: '#778899',
    scene: {

        preload: function() {
            this.load.image('playButton', 'assets/playButton.svg');
            this.load.image('heart', 'assets/heart.svg');
            this.load.image('noEntry', 'assets/noEntry.svg');


        },
        create: function() {
            const model = new GameModel();
            const view = new GameView(this, model.mapPath);
            const controller = new GameController(model, view);

            controller.setupControlBar();
            controller.setupInfoBar();
            controller.createInteractiveGrid();
            // controller.playGame();
            // view.createTank();




        }
    }
};

const game = new Phaser.Game(config);