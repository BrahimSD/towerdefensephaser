class Tank {
    constructor(game, model, startX, startY, initialDuration = 200) {
        this.model = model;
        this.game = game;
        this.game.textures.generate('chickTexture', { data: this.model.chick, pixelWidth: 2.5, pixelHeight: 2.5, palette: this.model.chickColors });
        this.sprite = game.add.sprite(startX, startY, this.game.textures);
        this.initialDuration = initialDuration;
        this.currentPathIndex = 0;
    }
  
    move(index, duration = this.initialDuration) {
        let tween;
        this.currentPathIndex = index;
        if (index < this.model.mapPath.length) {
            // Mouvement normal le long du chemin
            tween = this.game.tweens.add({
                targets: this.sprite,
                x: (this.model.mapPath[index][0] * 40) + 20,
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