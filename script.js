// Initialize map
var map = L.map('map').setView([22.9734, 78.6569], 5); // Center of India

// Add base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Prepare heat layer
var heatLayer = L.heatLayer([], { radius: 25 }).addTo(map);

// Load CSV data
Papa.parse("data.csv", {
  download: true,
  header: true,
  complete: function(results) {
    const data = results.data;

    const heatData = [];

    data.forEach(row => {
      const lat = parseFloat(row.latitude || row.Lat || row.lat);
      const lng = parseFloat(row.longitude || row.Lon || row.lng);
      const intensity = parseFloat(row.intensity || 0.5);

      if (!isNaN(lat) && !isNaN(lng)) {
        heatData.push([lat, lng, intensity]);
      }
    });

    heatLayer.setLatLngs(heatData);
  }
});
