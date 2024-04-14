let map;

function initMap() {
    const cityCoords = { lat: 43.15657789999999, lng: -77.6088465 }; // Default coordinates for Rochester, change this to your city
    map = new google.maps.Map(document.getElementById("map"), {
        center: cityCoords,
        zoom: 20,
    });

    const numSections = 9; // Change this to the desired number of sections
    const grid = createGrid(cityCoords, numSections);

    drawGrid(grid);
}

function createGrid(cityCoords, numSections) {
    const gridSize = 0.1; // Total size of the grid in degrees (adjust as needed)

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

    grid.forEach((box, index) => {
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
        
        // Add click event listener to the rectangle
        rectangle.addListener('click', () => {
            performNearbySearch(box);
        });

        rectangles.push(rectangle);
        bounds.extend(rectangle.getBounds().getNorthEast());
        bounds.extend(rectangle.getBounds().getSouthWest());
    });

    map.fitBounds(bounds);
}

function performNearbySearch(box) {
    const centerLat = (box.latMax + box.latMin) / 2;
    const centerLng = (box.lngMax + box.lngMin) / 2;
    const diagonalDistance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(box.latMax, box.lngMax),
        new google.maps.LatLng(box.latMin, box.lngMin)
    );
    const radius = diagonalDistance / 2;

    const request = {
        location: { lat: centerLat, lng: centerLng },
        radius: radius,
        type: 'restaurant' // Specify type as 'restaurant'
    };

    // Construct Nearby Search API request URL
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${request.location.lat},${request.location.lng}&radius=${request.radius}&type=${request.type}&key=AIzaSyD5o7hE9sPaiAauEtmwVpuwh0It2nfLy0E`;

    // Send AJAX request or fetch API to perform the Nearby Search
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Extract the location of the first restaurant result
            if (data.results && data.results.length > 0) {
                const firstRestaurant = data.results[0];
                const restaurantLocation = {
                    lat: firstRestaurant.geometry.location.lat,
                    lng: firstRestaurant.geometry.location.lng
                };

                // Display the location of the first restaurant on the map
                const marker = new google.maps.Marker({
                    position: restaurantLocation,
                    map: map,
                    title: firstRestaurant.name
                });

                // Optionally, you can also open an info window with more details about the restaurant
                const infoWindow = new google.maps.InfoWindow({
                    content: `<div><strong>${firstRestaurant.name}</strong><br>${firstRestaurant.vicinity}</div>`
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
            } else {
                console.log('No restaurants found in this area.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


initMap();
