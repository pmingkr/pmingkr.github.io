document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('game-map');
    const MAP_WIDTH = 20;
    const MAP_HEIGHT = 20;

    // Game state
    const unit = {
        x: 5,
        y: 5,
        element: null
    };

    function createMap() {
        mapElement.innerHTML = '';
        // The CSS grid handles the layout, so we just create the tiles
        for (let i = 0; i < MAP_HEIGHT * MAP_WIDTH; i++) {
            const tile = document.createElement('div');
            tile.classList.add('map-tile');
            // Store coordinates on each tile for click handling later
            tile.dataset.row = Math.floor(i / MAP_WIDTH);
            tile.dataset.col = i % MAP_WIDTH;
            mapElement.appendChild(tile);
        }
    }

    function renderUnit() {
        // Simple rendering by placing a unit div on the correct grid cell.
        // CSS Grid will position it correctly.
        if (unit.element) {
            // No need to remove, just update position via grid-column/row
            unit.element.style.gridColumnStart = unit.x + 1;
            unit.element.style.gridRowStart = unit.y + 1;
        } else {
            const unitElement = document.createElement('div');
            unitElement.classList.add('unit');
            unitElement.style.gridColumnStart = unit.x + 1;
            unitElement.style.gridRowStart = unit.y + 1;
            unit.element = unitElement;
            mapElement.appendChild(unitElement);
        }
    }

    let target = { x: 5, y: 5 };

    function initializeGame() {
        createMap();
        renderUnit();
        // Add click listener after map is created
        mapElement.addEventListener('click', (e) => {
            const tile = e.target.closest('.map-tile');
            if (tile) {
                target.x = parseInt(tile.dataset.col);
                target.y = parseInt(tile.dataset.row);
            }
        });

        // Start the game loop
        setInterval(gameLoop, 200); // Move every 200ms
    }

    function gameLoop() {
        // Simple movement logic: move one step towards the target
        if (unit.x < target.x) {
            unit.x++;
        } else if (unit.x > target.x) {
            unit.x--;
        }

        if (unit.y < target.y) {
            unit.y++;
        } else if (unit.y > target.y) {
            unit.y--;
        }

        renderUnit();
    }

    initializeGame();
});
