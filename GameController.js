class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    createGame() {
        this.view.createGrid(this.model.mapPath); // Dessiner la grille
       // this.view.createMap(this.model.mapPath); // Dessiner le chemin
    }
}
