/* --- datamap.js --- */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Initialize Map (Centered on Sri Lanka)
    // Coordinates: [Latitude, Longitude], Zoom Level
    var map = L.map('map').setView([7.8731, 80.7718], 7);

    // 2. Add the Tile Layer (The visual map background - OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // --- 3. DEFINE COLORED ICONS ---
    
    // Green Icon (Contributor)
    var greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });

    // Blue Icon (Distributor)
    var blueIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });

    // Red Icon (Victim)
    var redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });

    // --- 4. DUMMY DATA (Later this will come from your Database) ---
    
    // Contributor Data (Green)
    const contributors = [
        { lat: 6.9271, lng: 79.8612, items: "Rice, Water", qty: "50 Packs" }, // Colombo
        { lat: 7.2906, lng: 80.6337, items: "Clothes", qty: "20 Bundles" }    // Kandy
    ];

    // Distributor Data (Blue)
    const distributors = [
        { lat: 6.0535, lng: 80.2210, status: "Collecting", vehicle: "Lorry (WP-1234)" } // Galle
    ];

    // Victim Data (Red)
    const victims = [
        { lat: 6.7056, lng: 80.3847, people: 4, needs: "Medicine, Baby Food" }, // Horana
        { lat: 8.3114, lng: 80.4037, people: 12, needs: "Dry Rations, Tents" }  // Anuradhapura
    ];

    // --- 5. ADD MARKERS TO MAP ---

    // Add Contributors (Green)
    contributors.forEach(c => {
        L.marker([c.lat, c.lng], {icon: greenIcon}).addTo(map)
            .bindPopup(`<b>Contributor</b><br>Items: ${c.items}<br>Qty: ${c.qty}`);
    });

    // Add Distributors (Blue)
    distributors.forEach(d => {
        L.marker([d.lat, d.lng], {icon: blueIcon}).addTo(map)
            .bindPopup(`<b>Distributor</b><br>Status: ${d.status}<br>Vehicle: ${d.vehicle}`);
    });

    // Add Victims (Red)
    victims.forEach(v => {
        L.marker([v.lat, v.lng], {icon: redIcon}).addTo(map)
            .bindPopup(`<b>Victim (SOS)</b><br>Affected: ${v.people} People<br>Needs: ${v.needs}`);
    });

});