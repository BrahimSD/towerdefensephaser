// GameView.js
class GameView {
    constructor(game, path, model) {
        this.model = model;
        this.path = path;
        this.game = game;
    }

    isOnPath(gridX, gridY) {
        // Vérifiez que this.path est défini avant d'appeler 'some'
        if (this.path && Array.isArray(this.path)) {
            return this.path.some(point => point[0] === gridX && point[1] === gridY);
        }
        return false;
    }
    createControlBar() {
        const controlBarHeight = 40; // Hauteur de la barre de contrôle
        const topY = 0; // Position Y de la barre

        // Créer un fond pour la barre de contrôle
        const controlBarBackground = this.game.add.rectangle(0, topY, this.game.scale.width, controlBarHeight, 0x000000);
        controlBarBackground.setOrigin(0, 0); // Positionner en haut

        // Ajouter des éléments textuels pour les boutons de contrôle
        this.playButton = this.game.add.text(20, topY + 10, 'Play', { font: '16px Arial', fill: '#ffffff' }).setInteractive();
        this.playButton.on('pointerdown', () => this.game.events.emit('playGame'));

        const speeds = ['x1', 'x2', 'x3'];
        speeds.forEach((speed, index) => {
            let speedButton = this.game.add.text(100 + index * 60, topY + 10, speed, { font: '16px Arial', fill: '#ffffff' }).setInteractive();
            speedButton.on('pointerdown', () => this.game.events.emit('setSpeed', speed));
        });
    }
    createInfoBar() {
        const infoBarHeight = 40; // Hauteur de la barre d'information
        const bottomY = this.game.scale.height - infoBarHeight; // Position Y de la barre

        // Créer un fond pour la barre d'information
        const infoBarBackground = this.game.add.rectangle(0, bottomY, this.game.scale.width, infoBarHeight, 0x000000);
        infoBarBackground.setOrigin(0, 0); // Positionner en bas

        // Ajouter des éléments textuels pour les vies, l'argent, les vagues et le bouton "Send Next"
        this.livesText = this.game.add.text(20, bottomY + 10, 'Vies: 13/13', { font: '16px Arial', fill: '#ffffff' });
        this.moneyText = this.game.add.text(150, bottomY + 10, 'Argent: $500', { font: '16px Arial', fill: '#ffffff' });
        this.waveText = this.game.add.text(280, bottomY + 10, 'Vagues: 0/20', { font: '16px Arial', fill: '#ffffff' });
        this.nextWaveText = this.game.add.text(410, bottomY + 10, 'Prochaine: x V x B x J x R', { font: '16px Arial', fill: '#ffffff' });

        // Bouton pour envoyer la prochaine vague
        this.sendNextButton = this.game.add.text(700, bottomY + 10, 'Envoyer (60s)', { font: '16px Arial', fill: '#ffffff' }).setInteractive();
        this.sendNextButton.on('pointerdown', () => this.game.events.emit('sendNextWave'));
    }
    updateInfo(lives, money, wave, nextWave, timer) {
        this.livesText.setText(`Vies: ${lives}/13`);
        this.moneyText.setText(`Argent: $${money}`);
        this.waveText.setText(`Vagues: ${wave}/20`);
        this.nextWaveText.setText(`Prochaine: ${nextWave}`);
        this.sendNextButton.setText(`Envoyer (${timer}s)`);
    }
    fadeBack(tile, color, alpha, duration) {
        let elapsedTime = 0;
        const intervalTime = 30; // Durée d'un pas de l'animation, en ms
        const steps = duration / intervalTime; // Nombre total de pas
        const alphaStep = (alpha - tile.fillAlpha) / steps; // Changement d'alpha par étape

        const interval = setInterval(() => {
            elapsedTime += intervalTime;
            tile.setFillStyle(color, tile.fillAlpha + alphaStep);

            if (elapsedTime >= duration) {
                clearInterval(interval);
                tile.setFillStyle(color, alpha); // Assurez-vous que la couleur et l'opacité sont correctement réinitialisées à la fin
            }
        }, intervalTime);

        return interval;
    }
}