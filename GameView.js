// GameView.js
class GameView {
    constructor(game) {
        this.game = game;
        this.hoverIndicator = this.game.add.graphics({ fillStyle: { color: 0xffffff } });
        this.hoverIndicator.fillRect(0, 0, 40, 40);
        this.hoverIndicator.setVisible(false);
    }

    createGrid(path) {
        let graphics = this.game.add.graphics();
        const gridSize = 40; 
        // const gridWidth = Math.ceil(this.game.scale.width / gridSize);
        // const gridHeight = Math.ceil(this.game.scale.height / gridSize);

        // Colorer les carreaux du chemin
        path.forEach(point => {
            let x = point[0] * gridSize;
            let y = point[1] * gridSize;
            graphics.fillStyle(0x000000, 1); 
            graphics.fillRect(x, y, gridSize, gridSize);
        });

        // Dessiner les lignes de la grille
        // graphics.lineStyle(1, 0x000000, 1); // Lignes noires pour la grille
        // for (let i = 0; i <= gridWidth; i++) {
        //     graphics.moveTo(i * gridSize, 0);
        //     graphics.lineTo(i * gridSize, this.game.scale.height);
        // }
        // for (let j = 0; j <= gridHeight; j++) {
        //     graphics.moveTo(0, j * gridSize);
        //     graphics.lineTo(this.game.scale.width, j * gridSize);
        // }

        graphics.strokePath();
    }
    
}



//aa 
// Écouteur d'événements pour le mouvement de la souris
        // this.game.input.on('pointermove', pointer => {
        //     // Vérifier si le pointeur est sur un des rectangles du chemin
        //     let isOnPath = this.pathRects.some(rect => rect.contains(pointer.x, pointer.y));
        //     this.hoverIndicator.setVisible(!isOnPath); // Afficher le carré seulement si on n'est pas sur le chemin

        //     if (!isOnPath) {
        //         // Mettre à jour la position du carré pour suivre la souris
        //         this.hoverIndicator.clear(); // Effacez l'ancien carré
        //         this.hoverIndicator.fillStyle(0xffffff, 1); // Couleur blanche pour le carré de survol
        //         this.hoverIndicator.fillRect(pointer.x - 20, pointer.y - 20, 40, 40); // Dessinez un nouveau carré centré sur la souris
        //     }
        // });

//aa