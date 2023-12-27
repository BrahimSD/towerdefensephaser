class Tank2 {
    constructor(game, model, index, startX, startY, tanks) {
        this.occupe = null;
        this.i = 0;
        this.tanks = tanks;
        this.startX = startX;
        this.startY = startY;
        this.index = index;
        this.model = model;
        this.game = game;
        this.bullets = [];
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
    a(tank) {

        setTimeout(() => {
            let bullet = new Bullet(this.game, this.model, this.startX - 40, this.startY, 5);

            // Prédire la position future du tank
            let futurePosition = this.predictTankPosition(tank, this.i, this.model.mapPath);

            let distanceToFuturePosition = this.calculateDistance(this.startX - 40, this.startY, futurePosition[0], futurePosition[1]);
            bullet.moveTo(futurePosition[0], futurePosition[1], 4 * distanceToFuturePosition);
            //console.log('resistance = ' + tank.resistance);
            if (tank.resistance <= 0 && tank.life) {
                console.log('det' + tank.id)
                tank.life = false;
                tank.destroy();


            }
        }, this.i);
        this.i++;
    }
    predictTankPosition(tank, timeAhead, mapPath) {
        let tankSpeed = tank.getVitesse(); // Vitesse du tank
        let currentTankPosition = [parseFloat(tank.getX()) / 40, parseFloat(tank.getY()) / 40];
        let distanceToTravel = tankSpeed * timeAhead; // Distance que le tank parcourra dans 'timeAhead' secondes

        // Trouver l'index du point le plus proche sur le chemin
        let closestPointIndex = this.findClosestPointIndex(currentTankPosition, mapPath);
        let futurePosition = this.calculateFuturePosition(closestPointIndex, distanceToTravel, mapPath);
        futurePosition[0] = (futurePosition[0] * 40) + 20;
        futurePosition[1] = (futurePosition[1] * 40) + 20;
        // futurePosition[0] = parseFloat (futurePosition[0] )* 40;
        // futurePosition[1] =parseFloat( futurePosition[1] )* 40;
        return futurePosition;
    }

    findClosestPointIndex(currentPosition, path) {
        let closestIndex = 0;
        let minDistance = Number.MAX_VALUE;

        for (let i = 0; i < path.length; i++) {
            let point = path[i];
            let distance = this.calculateDistance(currentPosition[0], currentPosition[1], point[0], point[1]);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        }
        //console.log('closestIndex'+closestIndex);
        return closestIndex;
    }

    calculateFuturePosition(startIndex, distance, path) {
        let remainingDistance = distance;
        let currentIndex = startIndex;
        let nextIndex = currentIndex + 1;

        while (remainingDistance > 0 && nextIndex < path.length) {
            let currentPoint = path[currentIndex];
            let nextPoint = path[nextIndex];
            let segmentDistance = this.calculateDistance(currentPoint[0], currentPoint[1], nextPoint[0], nextPoint[1]);
            if (segmentDistance < remainingDistance) {
                remainingDistance -= segmentDistance;
                currentIndex++;
                nextIndex++;
            } else {
                let ratio = remainingDistance / segmentDistance;

                return [
                    currentPoint[0] + ratio * (nextPoint[0] - currentPoint[0]),
                    currentPoint[1] + ratio * (nextPoint[1] - currentPoint[1])
                ];
            }
        }

        if (currentIndex < path.length) {
            return path[currentIndex];
        } else {
            return path[path.length - 1];
        }
    }




    calculateDistance(x1, y1, x2, y2) {


        let deltaX = parseInt(x2) - parseInt(x1);
        let deltaY = parseInt(y2) - parseInt(y1);

        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
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