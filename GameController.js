class GameController {
    constructor(model, view) {
        this.tanks = view.tanks;
        this.model = model;
        this.view = view;
        this.isGamePlaying = false;
        this.gamePaused = false;
        this.money = 500;
        this.lives = 13;
        this.tanks = [];
        this.numberOfTanks = 3; // Commencer avec 3 tanks
        this.currentWave = 0;
        this.maxWaves = 20;
        this.selectionMenu = null;
        this.setOnDestroyedCallback = 0;
        //this.setupSelectionMenu();

    }
    createTanks() {
        console.log(this.setOnDestroyedCallback);
        if ((this.currentWave >= this.maxWaves) || (this.setOnDestroyedCallback > 2)) {
            console.log("Jeu terminé !");
            // Ajoutez ici la logique pour arrêter ou terminer le jeu
            return;
        }
        this.numberOfTanks = Math.min(this.numberOfTanks, 20);
        this.currentWave++;

        this.view.updateInfo(this.lives, this.money, this.currentWave, this.nextWave, this.timer);
        for (let i = 0; i < this.numberOfTanks; i++) {
            this.model.mapPath.unshift([
                [(-(i + 4)), 2],
                [(-(i + 4)), 2]
            ]);
        }

        let j = 0;
        for (let i = 0; i < this.numberOfTanks; i++) {
            // Calculer la position en X pour chaque tank
            let tank = new Tank(this.view.game, this.model, ((this.model.mapPath[0][0]) * 40), ((this.model.mapPath[0][1]) * 40) + 20, 600);
            tank.move(j);
            j += 2;
            tank.setOnDestroyedCallback(() => {
                this.setOnDestroyedCallback++;
                console.log(this.setOnDestroyedCallback);
                this.onTankDestroyed(tank);
            });
            this.tanks.push(tank);
        }
    }
    onTankDestroyed(destroyedTank) {
        // Retirer le tank détruit de la liste
        this.tanks = this.tanks.filter(tank => tank !== destroyedTank);
        this.lives--;
        this.view.updateInfo(this.lives, this.money, this.currentWave, this.nextWave, this.timer);
        // Vérifier si tous les tanks ont été détruits
        if (this.tanks.length === 0) {
            // Augmenter le nombre pour la prochaine vague
            this.numberOfTanks += 2;
            this.createTanks();
        }
    }
    createSelectionMenu(x, y) {
        let X = x < 11 ? x : 12;
        if (!this.view.isOnPath(x, y) && !this.view.selectionMenu) {
            // Créer un rectangle de filtre pour toute la scène s'il n'existe pas déjà
        if (!this.view.dimBackground) {
            this.view.dimBackground = this.view.game.add.rectangle(0, 0, 800, 640, 0x000000, 0.5).setOrigin(0, 0);
            this.view.dimBackground.setDepth(0.9); // Assurez-vous qu'il est en arrière-plan
            this.view.dimBackground.setVisible(false); // Initialement invisible
        }
        this.view.dimBackground.setVisible(true);

            // Définissez la largeur et la hauteur du menu de sélection en fonction du nombre de carrés et de leur taille
            const menuWidth = 70 * 4; // 4 carrés de large
            const menuHeight = 80; // 1 carré de hauteur
            const menuXOffset = 40; // Espace entre les carrés

            // Créez un conteneur pour le menu de sélection qui est initialement masqué
            //x = (x / 40)<=11 ? x : 440; 
            this.view.selectionMenu = this.view.game.add.container(40 * X, 40 * y).setDepth(1);

            // Créez un rectangle pour le fond du menu de sélection
            this.view.background = this.view.game.add.rectangle(0, 0, menuWidth + menuXOffset, menuHeight, 0x282828);
            this.view.background.setOrigin(0, 0); // Assurez-vous que l'origine est en haut à gauche
            this.view.selectionMenu.add(this.view.background);

            // Créez les carrés de couleurs à l'intérieur du menu de sélection
            const colors = [0x00ff00, 0x0000ff, 0xffff00, 0xff0000]; // Vert, Bleu, Jaune, Rouge
            const costs = [100, 150, 200, 250];
            colors.forEach((color, index) => {
                const colorSquare = this.view.game.add.rectangle(menuXOffset + index * (40 + menuXOffset), menuHeight / 2, 40, 40, color).setInteractive();
                colorSquare.setOrigin(0.5, 0.5); // Centre l'origine du carré
                // Créer une bordure pour le carré
                const border = this.view.game.add.rectangle(colorSquare.x, colorSquare.y, 40, 40);
                border.setStrokeStyle(2, 0xffffff); // Définir la bordure blanche
                border.setOrigin(0.5, 0.5);
                border.alpha = 0; // Rendre la bordure invisible initialement

                // Gestionnaire d'événements pour le survol du carré
                colorSquare.on('pointerover', () => {
                    border.alpha = 1; // Augmenter l'opacité de la bordure au survol
                });

                // Gestionnaire d'événements pour le retrait du curseur du carré
                colorSquare.on('pointerout', () => {
                    border.alpha = 0; // Réduire l'opacité de la bordure
                });

                
                // Ajouter un texte indiquant le coût sous le carré
                const costText = this.view.game.add.text(colorSquare.x, colorSquare.y + 25, `$${costs[index]}`, { font: '14px Arial', fill: '#ffffff' });
                costText.setOrigin(0.5, 0);
                colorSquare.on('pointerdown', () => {
                    const cost = 100 + 50 * index;
                    if (this.money >= cost) {
                        new Tank2(this.view.game, this.view.model, index, (x * 40) + 20, (y * 40) + 20);
                        this.money -= cost;
                        this.view.updateInfo(this.lives, this.money, this.currentWave, this.nextWave, this.timer);
                    }
                    console.log(this.money);
                    if (this.view.selectionMenu) {
                        this.view.selectionMenu.setVisible(false);
                        this.view.selectionMenu = null;
                    }

                    if (this.view.dimBackground) {
                        this.view.dimBackground.setVisible(false);
                    }
                });
                this.view.selectionMenu.add(colorSquare);
                this.view.selectionMenu.add(costText);
                this.view.selectionMenu.add(border);
            });

        }
        //ajouter une condition pour backgroud et selectionMenu
        else if (this.view.selectionMenu != null && this.view.background != null) {
            if (!(x < ((this.view.background.getBounds().x + 320) / 40) && x >= (this.view.background.getBounds().x / 40)) || !(y < ((this.view.background.getBounds().y + 80) / 40) && y >= (this.view.background.getBounds().y / 40))) {
                this.view.selectionMenu.setVisible(false);
                this.view.selectionMenu = null;
                // Cacher également le rectangle de filtre
                this.view.dimBackground.setVisible(false);
            }
            //this.view.dimBackground.setVisible(false);
        }

        
    }
    createGame() {
        this.view.createGrid(this.model.mapPath); // Dessiner la grille
    }
    // setupSelectionMenu() {
    //     this.view.game.events.on('tankSelected', this.placeTank, this);
    // }


    // placeTank(color) {
    //     // Implémentez la logique de placement du tank ici
    //     // Cette méthode sera appelée avec la couleur du tank sélectionné
    //     console.log('Tank de couleur sélectionnée: ', color);
    // }
    setupControlBar() {
        this.view.createControlBar();

        // Écouter les événements des boutons de contrôle
        this.view.game.events.on('playGame', this.playGame, this);
        this.view.game.events.on('setSpeed', this.setGameSpeed, this);
    }
    start() {
        if (!this.isGamePlaying) {
            this.createTanks();
            this.isGamePlaying = true;
        }
    }
    playGame() {
        if (!this.isGamePlaying) {
            // Si le jeu n'est pas en cours, lancez les tanks
            this.start();

        } else {
            // Si le jeu est déjà en cours, activez/désactivez la pause
            this.togglePause();
        }
    }
    togglePause() {
        const currentTanks = this.tanks; // Obtenir la liste actuelle des tanks
        currentTanks.forEach(tank => {
            if (tank.tween) {
                if (this.gamePaused) {
                    tank.tween.resume(); // Reprendre le mouvement
                } else {
                    tank.tween.pause(); // Mettre en pause le mouvement
                }
            }
        });
        this.gamePaused = !this.gamePaused;
    }



    setGameSpeed(speedLabel) {
        // Mapper les labels de vitesse en facteurs de durée
        const speedMapping = { 'x1': 1, 'x2': 0.5, 'x3': 0.25 };
        const speedFactor = speedMapping[speedLabel];

        const currentTanks = this.tanks; // Obtenir la liste actuelle des tanks
        currentTanks.forEach(tank => {
            if (tank.tween) {
                // Arrêter le tween en cours
                tank.tween.stop();

                // Calculer la nouvelle durée
                const newDuration = tank.initialDuration * speedFactor;

                // Redémarrer le tween avec la nouvelle durée
                tank.move(tank.currentPathIndex, newDuration);
            }
        });
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
        const hoverColor = 0xD0D3D4; // Couleur pour l'effet de survol

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

                    this.createSelectionMenu(x / tileWidth, y / tileHeight);
                    console.log(`Clicked tile at grid position (${(x / tileWidth) + 1}, ${y / tileHeight})`);
                });
            }
        }
    }
}