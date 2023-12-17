class Tank {
    constructor(game, model, startX, startY, initialDuration) {
        this.model = model;
        this.game = game;
        this.initialDuration = initialDuration;

        // Choisir une couleur aléatoire pour le tank
        const colors = ['#ff0000', '#00FF00', '#0000FF']; // Rouge, Vert, Bleu
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Générer une clé de texture unique pour chaque tank
        const textureKey = 'tankTexture' + Date.now() + Math.random().toString(16);

        // Générer la texture en utilisant la couleur aléatoire pour tous les pixels '2'
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
                'C': randomColor // Couleur aléatoire pour le corps du tank
            }
        });

        // Créer le sprite du tank
        this.sprite = this.game.add.sprite(startX, startY, textureKey);
        this.currentPathIndex = 0;
    }
    
  
    move(index, duration = this.initialDuration) {
        let tween;
        this.currentPathIndex = index;
        if (index < this.model.mapPath.length) {
            // Mouvement normal le long du chemin
            tween = this.game.tweens.add({
                targets: this.sprite,
                x: (this.model.mapPath[index][0] * 40) + 20 ,
                y: (this.model.mapPath[index][1] * 40) + 20,
                ease: 'Linear',
                duration: duration,
                onComplete: () => {
                    this.move(index + 1, duration);
                }
            });
        } else if (index == this.model.mapPath.length) {
            // Effet de "rentrée" à la fin du chemin
            tween = this.game.tweens.add({
                targets: this.sprite,
                x: (this.model.mapPath[index - 1][0] * 40) + 20,
                y: (this.model.mapPath[index - 1][1] * 40) + 40,
                scaleY: 0,
                ease: 'Linear',
                duration: duration,
                onComplete: () => {
                    this.destroy();
                }
            });
        }

        // Stocker la référence au tween dans l'objet tank
        this.tween = tween;
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

    setOnDestroyedCallback(callback) {
        this.onDestroyed = callback;
    }
}