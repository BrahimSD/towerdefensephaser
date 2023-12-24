class Bullet {
    constructor(game, model,x, y, angle) {
        this.index = 2;
        this.model = model;
        this.game = game;
        this.x = x;
        this.y = y;
        this.angle = angle;
        const colors = ['#00ff00', '#0000ff', '#ffff00', '#ff0000'];
        const textureKey = 'tankTexturee' + Date.now() + Math.random().toString(16);
        const tankDataWithColor = this.model.squareTank.map(row => {return row.replace(/2/g, 'C'); }); // Remplacer '2' par 'C' pour utiliser la couleur aléatoire
            this.game.textures.generate(textureKey, {
                data: tankDataWithColor,
                pixelWidth: 0.5,
                pixelHeight: 0.5,
                palette: {
                    '1': '#000000', // Noir pour les chenilles
                    'C': colors[this.index] // Couleur aléatoire pour le corps du tank
                }
            });
    
            // Créer le sprite du tank
            this.sprite = this.game.add.sprite(this.x +40, this.y, textureKey);
            this.currentPathIndex = 0;
    }
    
    moveTo(x, y, duration) {
        this.game.tweens.add({
            targets: this.sprite,
            x: x,
            y: y,
            ease: 'Linear',
            duration: duration,
            onComplete: () => {
                this.destroy();
            }
        });
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