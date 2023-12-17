class Tank2 {
    constructor(game, model, index, startX, startY) {
        this.index = index;
        this.model = model;
        this.game = game;
        const colors = ['#00ff00', '#0000ff', '#ffff00', '#ff0000'];
        const textureKey = 'tankTexture' + Date.now() + Math.random().toString(16);
        const tankDataWithColor = this.model.squareTank.map(row => {
            return row.replace(/2/g, 'C'); // Remplacer '2' par 'C' pour utiliser la couleur aléatoire
        });

        // Générer la texture
        this.game.textures.generate(textureKey, {
            data: tankDataWithColor,
            pixelWidth: 2,
            pixelHeight: 2,
            palette: {
                '1': '#000000', // Noir pour les chenilles
                'C': colors[this.index] // Couleur aléatoire pour le corps du tank
            }
        });

        // Créer le sprite du tank
        this.sprite = this.game.add.sprite(startX, startY, textureKey);
        this.currentPathIndex = 0;
    }

    destroy() {
        if (this.sprite) {
            let textureKey = this.sprite.texture.key;
            this.game.textures.remove(textureKey); // Supprimer la texture du cache
            this.sprite.destroy();
            if (this.onDestroyed) {
                this.onDestroyed(); // Notifie GameView de la destruction
            }
        }
    }

}