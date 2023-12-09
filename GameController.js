class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.setupSelectionMenu();
        this.view.game.textures.generate('chickTexture', { data: this.model.chick, pixelWidth: 2.5, pixelHeight: 2.5, palette: this.model.chickColors });

    }

    createGame() {
        this.view.createGrid(this.model.mapPath); // Dessiner la grille
    }
    setupSelectionMenu() {
        this.view.game.events.on('tankSelected', this.placeTank, this);
    }


    placeTank(color) {
        // Implémentez la logique de placement du tank ici
        // Cette méthode sera appelée avec la couleur du tank sélectionné
        console.log('Tank de couleur sélectionnée: ', color);
    }
    setupControlBar() {
        this.view.createControlBar();

        // Écouter les événements des boutons de contrôle
        this.view.game.events.on('playGame', this.playGame, this);
        this.view.game.events.on('setSpeed', this.setGameSpeed, this);
    }

    playGame() {

        this.view.createTanks(3);

    }

    setGameSpeed(speed) {
        // Logique pour régler la vitesse du jeu (x1, x2, x3)
    }
    setupInfoBar() {
        this.view.createInfoBar();

        // Exemple d'utilisation : mettre à jour la barre d'information
        // Vous devrez appeler cette méthode en fonction des changements dans le jeu
        this.updateInfoBar(13, 500, 0, 'x V x B x J x R', 60);

        // Écouter le bouton "Envoyer la prochaine vague"
        this.view.game.events.on('sendNextWave', this.sendNextWave, this);
    }

    updateInfoBar(lives, money, wave, nextWave, timer) {
        this.view.updateInfo(lives, money, wave, nextWave, timer);
    }

    sendNextWave() {
        // Logique pour envoyer la prochaine vague d'ennemis
        // Mettez à jour le modèle du jeu et la vue en conséquence
    }
    createInteractiveGrid() {
        const tileWidth = 40;
        const tileHeight = 40;
        const mapWidth = this.view.game.scale.width;
        const mapHeight = this.view.game.scale.height - 40; // ajusté pour la hauteur
        const hoverColor = 0x595959; // Couleur pour l'effet de survol

        for (let y = 40; y < mapHeight; y += tileHeight) {
            for (let x = 0; x < mapWidth; x += tileWidth) {
                let isPathTile = this.model.mapPath.some(pair => pair[0] === x / tileWidth && pair[1] === y / tileHeight);
                let fillColor = isPathTile ? 0x423e3a : 0x75726e; // Marron foncé et gris foncé en hexadécimal converti en RGB


                let tile = this.view.game.add.rectangle(x + tileWidth / 2, y + tileHeight / 2, tileWidth, tileHeight, fillColor, 40)
                    .setInteractive();

                if (!isPathTile) {
                    tile.on('pointerover', () => {
                        tile.setFillStyle(hoverColor, 1); // Change la couleur lors du survol
                        clearTimeout(tile.hoverTimeout); // Annule tout timeout précédent
                    });

                    tile.on('pointerout', () => {
                        tile.isHovered = false;
                        tile.hoverTimeout = this.view.fadeBack(tile, fillColor, 40, 300);
                    });
                }

                tile.on('pointerdown', (pointer) => {
                    console.log(`Clicked tile at grid position (${x / tileWidth}, ${y / tileHeight})`);
                });
            }
        }
    }
}