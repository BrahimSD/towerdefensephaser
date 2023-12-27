class Tank {
    constructor(game, model, startX, startY, initialDuration) {
        this.startX = startX;
        this.startY = startY;
        this.model = model;
        this.game = game;
        this.initialDuration = initialDuration;
        this.duration = initialDuration;
        this.destroyedCallFunc = false;
        this.life = true;
        const colors = ['#00ff00', '#0000ff', '#ffff00', '#ff0000'];
        this.index = parseInt(Math.random() * colors.length);
        this.resistance = 7 + (3 * (this.index + 1));
        this.id ='Tank[' +parseInt(Math.random() * 100) + ']';

        this.randomColor = colors[this.index];

        // Générer une clé de texture unique pour chaque tank
        const textureKey = 'tankTexture' + Date.now() + Math.random().toString(16);

        // Générer la texture en utilisant la couleur aléatoire pour tous les pixels '2'
        const tankDataWithColor = this.model.squareTank.map(row => {
            return row.replace(/2/g, 'C'); // Remplacer '2' par 'C' pour utiliser la couleur aléatoire
        });

        // Générer la texture
        this.game.textures.generate(textureKey, {
            data: tankDataWithColor,
            pixelWidth: 1.5,
            pixelHeight: 1.5,
            palette: {
                '1': '#000000', // Noir pour les chenilles
                'C': this.randomColor // Couleur aléatoire pour le corps du tank
            }
        });

        

        // Créer le sprite du tank
        this.sprite = this.game.add.sprite(startX, startY, textureKey);
        this.sprite.setRotation(Math.PI / 4);
        this.border = this.createHalfDiamondBorder(game, startX, startY);

        this.currentPathIndex = 0;
    }

    createHalfDiamondBorder(game, x, y) {
        const graphics = game.add.graphics();
        graphics.lineStyle(2, 0xffffff, 1); // Largeur de ligne, couleur et opacité
        graphics.beginPath();

        // Dessiner seulement la moitié de la bordure du losange
        graphics.moveTo(x , y - 20);
        graphics.lineTo(x + 20, y);
        graphics.lineTo(x, y + 20);
        // Ne pas dessiner l'autre moitié
        graphics.strokePath();
        return graphics;
    }

    getVitesse() {
        return Math.sqrt(40) / this.duration;
    }
    getX() {
        return this.startX;
    }
    getY() {
        return this.startY;
    }
    move(index, tanks2, duration = this.initialDuration) {
        this.duration = duration;
        let tween;
        this.currentPathIndex = index;
        if (index < this.model.mapPath.length && this.resistance > 0) {
            const nextX = (this.model.mapPath[index][0] * 40) + 20;
            const nextY = (this.model.mapPath[index][1] * 40) + 20;
            this.updateBorderDirection(this.startX, this.startY, nextX, nextY);

            // Mouvement normal le long du chemin
            tween = this.game.tweens.add({
                targets: this.sprite,
                x: (this.model.mapPath[index][0] * 40) + 20,
                y: (this.model.mapPath[index][1] * 40) + 20,
                ease: 'Linear',
                duration: duration,
                onComplete: () => {
                    this.move(index + 1, tanks2, duration);

                }
            });
            this.startX = (this.model.mapPath[index][0] * 40) + 20;
            this.startY = (this.model.mapPath[index][1] * 40) + 20;
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
            this.startX = (this.model.mapPath[index - 1][0] * 40) + 20;
            this.startY = (this.model.mapPath[index - 1][1] * 40) + 40;

        }

        this.tween = tween;
        if (tanks2 && this.resistance > 0) {
            tanks2.forEach((tank2, index) => {
                const distance = tank2.calculateDistance(tank2.startX, tank2.startY, this.getX(), this.getY());
                const isCloser = distance < 120;
                const isTank2Free = tank2.occupe === null || tank2.occupe === this;

                let isOccupierFarther = false;
                if (tank2.occupe && tank2.occupe !== this) {
                    isOccupierFarther = distance < tank2.calculateDistance(tank2.startX, tank2.startY, tank2.occupe.getX(), tank2.occupe.getY());
                }

                const isOccupierDead = tank2.occupe && tank2.occupe.life === false;

                if (isCloser) {
                    if (isTank2Free || isOccupierFarther || isOccupierDead) {
                        tank2.a(this);
                        tank2.occupe = this;
                        switch (tank2.index) {
                            case 0:
                                this.resistance -= 1;
                                break;
                            case 1:
                                this.resistance -= 1.5;
                                break;
                            case 2:
                                this.resistance -= 2;
                                break;
                            case 3:
                                this.resistance -= 2.5;
                                break;
                        }
                        console.log(this.id+'resistance = ' + this.resistance);


                    }
                } else if (tank2.occupe === this) {
                    tank2.occupe = null;
                }
            });
        }
    }

    updateBorderDirection(currentX, currentY, nextX, nextY) {
        const angle = Math.atan2(nextY - currentY, nextX - currentX);

        this.border.clear();
        this.border.lineStyle(2, 0xffffff, 1);
        this.border.beginPath();

        // Calculer les points de la bordure en fonction de l'angle
        this.border.moveTo(currentX + 20 * Math.cos(angle), currentY + 20 * Math.sin(angle));
        this.border.lineTo(currentX, currentY);
        this.border.lineTo(currentX - 20 * Math.cos(angle), currentY - 20 * Math.sin(angle));
        
        this.border.strokePath();
    }

    destroy() {
        if (this.sprite && !this.destroyedCallFunc) {
            this.destroyedCallFunc = true;
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