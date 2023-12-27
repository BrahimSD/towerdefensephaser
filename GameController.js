class GameController {
    constructor(model, view) {
        this.tanks = view.tanks;
        this.tanks2 = [];
        this.model = model;
        this.view = view;
        this.isGamePlaying = false;
        this.gamePaused = false;
        this.money = 500;
        this.lives = 13;
        this.numberOfTanks = 3; // Commencer avec 3 tanks
        this.currentWave = 0;
        this.maxWaves = 20;
        this.selectionMenu = null;
        this.setOnDestroyedCallback = 0;
        this.setupDamageEffect();
        //this.setupSelectionMenu();

    }

    setupDamageEffect() {
        if (this.view && this.view.game) {
            this.damageEffect = this.view.game.add.rectangle(0, 0, this.view.game.scale.width, this.view.game.scale.height, 0xff0000).setOrigin(0, 0).setAlpha(0);
            this.view.game.add.existing(this.damageEffect);
        }
    }

    triggerDamageEffect() {
        if (this.damageEffect) {
            this.damageEffect.setAlpha(0.5);
            this.view.game.time.delayedCall(500, () => {
                this.damageEffect.setAlpha(0);
            });
        }
    }


    createTanks() {
        if ((this.currentWave >= this.maxWaves) || (this.lives <= 0)) {
            console.log("Jeu terminé !");
            // Ajoutez ici la logique pour arrêter ou terminer le jeu
            return;
        }
        this.numberOfTanks = Math.min(this.numberOfTanks, 20);
        this.currentWave++;

        this.view.updateInfo(this.lives, this.money, this.currentWave, this.nextWave, this.timer);
        for (let i = 0; i < this.numberOfTanks; i++) {
            this.model.mapPath.unshift(
                [(-(i + 4)), 2]

            );
        }

        let j = 0;
        for (let i = 0; i < this.numberOfTanks; i++) {
            // Calculer la position en X pour chaque tank
            let tank = new Tank(this.view.game, this.model, ((this.model.mapPath[0][0]) * 40), ((this.model.mapPath[0][1]) * 40) + 20, 1000);

            tank.move(j, this.tanks2);
            j += 2;
            tank.setOnDestroyedCallback(() => {
                this.setOnDestroyedCallback++;
                this.onTankDestroyed(tank);
            });
            this.tanks.push(tank);
            //console.log(this.tanks);

        }

    }


    onTankDestroyed(destroyedTank) {
        // Retirer le tank détruit de la liste
        if (destroyedTank.resistance <= 0)
           { 
         switch (destroyedTank.index) { 
            case 0:
                this.money += 25;
                break;  
            case 1:
                this.money += 50;
                break;
            case 2:
                this.money += 75;
                break;
            case 3:
                this.money += 100;
                break;

         }
        }
        else if (destroyedTank.resistance > 0)
            {
                switch (destroyedTank.index) { 
                    case 0:
                        this.money -= 100;
                        break;  
                    case 1:
                        this.money -= 75;
                        break;
                    case 2:
                        this.money -= 50;
                        break;
                    case 3:
                        this.money -= 25;
                        break;
        
                }
                this.triggerDamageEffect();
                this.lives--;}

        this.tanks = this.tanks.filter(tank => tank !== destroyedTank);
        this.view.updateInfo(this.lives, this.money, this.currentWave, this.nextWave, this.timer);
        // Vérifier si tous les tanks ont été détruits
        if (this.tanks.length === 0) {
            // Augmenter le nombre pour la prochaine vague
            this.numberOfTanks += 2;
            this.createTanks();
        }
    }
    createSelectionMenu(selected,a, b) {
             let x = a/40;
               let y = b/40;

        let X = x < 12 ? x : x-6;
        if (!this.view.isOnPath(x, y) && !this.view.selectionMenu) {
            
            if (!this.view.dimBackground) {
                this.view.dimBackground = this.view.game.add.rectangle(0, 0, 800, 640, 0x000000, 0.5).setOrigin(0, 0);
                this.view.dimBackground.setDepth(0.9); 
                this.view.dimBackground.setVisible(false); 
            }
            if (!selected) 
            this.menuWidth = 280; 
        else this.menuWidth = 140;

        
            const menuHeight = 80; 
            const menuXOffset = 40; 

            this.view.background = this.view.game.add.rectangle(0, 0, this.menuWidth + menuXOffset, menuHeight, 0x282828);
            this.view.dimBackground.setVisible(true);
            this.view.selectionMenu = this.view.game.add.container((40 * X)-20, (40 * y)-20).setDepth(1);
            this.view.background.setOrigin(0, 0); 
            this.view.selectionMenu.add(this.view.background);
            const colors = [0x00ff00, 0x0000ff, 0xffff00, 0xff0000]; // Vert, Bleu, Jaune, Rouge
             if(!selected){
            const costs = [100, 150, 200, 250];
            let i = x < 12 ? 1 : 0; 
            let k =x < 12 ? 40 : 280;
        
            const dottedSquare = this.view.game.add.rectangle(k, menuHeight / 2, 32, 32);
            dottedSquare.setStrokeStyle(2, 0xffffff);
            dottedSquare.setOrigin(0.5, 0.5);
            this.view.selectionMenu.add(dottedSquare);

            // Add animation to dottedSquare
            this.view.game.tweens.add({
                targets: dottedSquare,
                scaleX: 1.2,
                scaleY: 1.2,
                alpha: 0.5,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });

            
            colors.forEach((color, index) => {
                const colorSquare = this.view.game.add.rectangle(menuXOffset + (index+i) * (20 + menuXOffset), menuHeight / 2, 32, 32, color).setInteractive();
                colorSquare.setOrigin(0.5, 0.5); 

                const border = this.view.game.add.rectangle(colorSquare.x, colorSquare.y, 40, 40);
                border.setStrokeStyle(2, 0xffffff); 
                border.setOrigin(0.5, 0.5);
                border.alpha = 0; 

                colorSquare.on('pointerover', () => {
                    border.alpha = 1; 
                });

                colorSquare.on('pointerout', () => {
                    border.alpha = 0; 
                });

                const costText = this.view.game.add.text(colorSquare.x, colorSquare.y + 25, `$${costs[index]}`, { font: '14px Arial', fill: '#ffffff' });
                costText.setOrigin(0.5, 0);
                colorSquare.on('pointerdown', () => {
                    const cost = 100 + 50 * index;
                    if (this.money >= cost) {
                        if (!selected) {
                            let tank2 = new Tank2(this.view.game, this.view.model, index, (x * 40) + 20, (y * 40) + 20, this.tanks);
                            this.tanks2.push(tank2);
                            this.money -= cost;
                            this.view.updateInfo(this.lives, this.money, this.currentWave, this.nextWave, this.timer);
                            this.pointerDownHappened = true;
                        }
                    } else {
                        console.log('pas assez d argent');
                    }
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
             else{
                this.color =colors[this.positionTankColor((x*40)+20,(y*40)+20)];
                const colorSquare = this.view.game.add.rectangle( 40 ,40, 32, 32, this.color).setInteractive();
                colorSquare.setOrigin(0.5, 0.5); 

                this.view.selectionMenu.add(colorSquare); 
             }
        }
        else if (this.view.selectionMenu != null && this.view.background != null) {
            console.log(a);
            if (((!((x)  <= (((this.view.selectionMenu.getBounds().x + 320) / 40) -0.5) && (x) >= ((this.view.selectionMenu.getBounds().x / 40) )) || !(y < ((this.view.selectionMenu.getBounds().y + 80) / 40) && y >= (this.view.selectionMenu.getBounds().y / 40))) && this.menuWidth == 280)
               
            
            
            
            
            
            || ((!(x < ((this.view.background.getBounds().x + 180) / 40) && x >= ((this.view.background.getBounds().x -20) / 40)) || !(y < ((this.view.background.getBounds().y + 80) / 40) && y >= (this.view.background.getBounds().y / 40))) && this.menuWidth != 280)) {
                this.view.selectionMenu.setVisible(false);
                this.view.selectionMenu = null;
                this.view.dimBackground.setVisible(false);
                
            }
            
        }
 
    }
    existepositiontank(x, y) {
        let i = 0;
        let existe = false;
        while (i < this.tanks2.length && !existe) {
            if (this.tanks2[i].startX == x && this.tanks2[i].startY == y) {
                existe = true;
            }
            i++;
        }
        return existe;

    }
    positionTankColor(x, y) {
        let i = 0;
        while (i < this.tanks2.length ) {
            if (this.tanks2[i].startX == x && this.tanks2[i].startY == y) {
                return this.tanks2[i].index;
            }
            i++;
        }
        return null;

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
                tank.move(tank.currentPathIndex, this.tanks2, newDuration);

                //console.log('vitesse = ' + tank.getVitesse());

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
                        if (!this.view.selectionMenu) {
                            tile.setFillStyle(hoverColor, 1); // Change la couleur lors du survol
                            clearTimeout(tile.hoverTimeout);
                        }

                    });

                    tile.on('pointerout', () => {
                        tile.isHovered = false;
                        tile.hoverTimeout = this.view.fadeBack(tile, fillColor, 40, 300);
                    });
                }

                tile.on('pointerdown', () => {
                    let selected = (this.tanks2 != null && this.existepositiontank((x  + 20), (y  + 20)));
                    this.createSelectionMenu(selected,x , y );
                    this.pointerDownHappened = false;
                    console.log(`Clicked tile at grid position (${(x / tileWidth) + 1}, ${y / tileHeight})`);
                });
            }
        }
    }
}