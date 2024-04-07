let map;

function initMap() {
    const cityCoords = { lat: 43.15657789999999, lng: -77.6088465 }; // Default coordinates for Rochester, change this to your city
    map = new google.maps.Map(document.getElementById("map"), {
        center: cityCoords,
        zoom: 12,
    });

    const numSections = 4; // Change this to the desired number of sections
    const grid = createGrid(cityCoords, numSections);

    drawGrid(grid);
}

function createGrid(cityCoords, numSections) {
    const gridSize = 1.0; // Total size of the grid in degrees (adjust as needed)

    const latInterval = gridSize / numSections;
    const lngInterval = gridSize / numSections;

    const grid = [];
    const latStart = cityCoords.lat - (gridSize / 2);
    const lngStart = cityCoords.lng - (gridSize / 2);

    for (let i = 0; i < numSections; i++) {
        for (let j = 0; j < numSections; j++) {
            const box = {
                latMin: latStart + i * latInterval,
                latMax: latStart + (i + 1) * latInterval,
                lngMin: lngStart + j * lngInterval,
                lngMax: lngStart + (j + 1) * lngInterval,
            };
            grid.push(box);
        }
    }
    return grid;
}

function drawGrid(grid) {
    const bounds = new google.maps.LatLngBounds();
    const rectangles = [];

    grid.forEach((box) => {
        const rectangle = new google.maps.Rectangle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map: map,
            bounds: {
                north: box.latMax,
                south: box.latMin,
                east: box.lngMax,
                west: box.lngMin,
            },
        });
        rectangles.push(rectangle);
        bounds.extend(rectangle.getBounds().getNorthEast());
        bounds.extend(rectangle.getBounds().getSouthWest());
    });

    map.fitBounds(bounds);
}

initMap();
