
const map = L.map("map", {
  minZoom: 9.3,
  maxZoom: 18,
  maxBounds: [
    [7.5, 76],
    [13.8, 81]
  ]
}).setView([10.8505, 78.2711], 7);

const openStreet = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Store boundary layers globally
let districtLayerGroup = null;
let districtMarker = null;
let districtLabel = null;

// Coordinates for marker placement (center of districts)
const tnDistricts = {
  "Chennai": [13.0827, 80.2707],
  "Coimbatore": [11.0168, 76.9558],
  "Madurai": [9.9252, 78.1198],
  "Tiruchirappalli": [10.7905, 78.7047],
  "Salem": [11.6643, 78.1460],
  "Tirunelveli": [8.7139, 77.7567],
  "Thanjavur": [10.7867, 79.1378],
  "Erode": [11.3410, 77.7172],
  "Vellore": [12.9165, 79.1325],
  "Dindigul": [10.3673, 77.9803],
  "Tiruvallur": [13.1217, 79.9085],
  "Tiruppur": [11.1085, 77.3411],
  "Nagapattinam": [10.7630, 79.8424],
  "Kanchipuram": [12.8342, 79.7036],
  "Namakkal": [11.2196, 78.1670],
  "Karur": [10.9601, 78.0766],
  "Virudhunagar": [9.5851, 77.9579],
  "Sivaganga": [9.8470, 78.4836],
  "Ramanathapuram": [9.3716, 78.8308],
  "Theni": [10.0104, 77.4777],
  "Dharmapuri": [12.1277, 78.1580],
  "Krishnagiri": [12.5186, 78.2137],
  "Perambalur": [11.2348, 78.8697],
  "Villupuram": [11.9393, 79.4871],
  "Cuddalore": [11.7480, 79.7714],
  "Nilgiris": [11.4102, 76.6950],
  "Pudukkottai": [10.3813, 78.8214],
  "Tenkasi": [8.9599, 77.3150],
  "Ariyalur": [11.1390, 79.0756],
  "Tirupattur": [12.5000, 78.5667],
  "Ranipet": [12.9446, 79.3214],
  "Chengalpattu": [12.6920, 79.9830],
  "Kallakurichi": [11.7380, 78.9623],
  "Mayiladuthurai": [11.1044, 79.6527]
};

fetch("tn-boundary.geojson")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    districtLayerGroup = L.geoJSON(data, {
      style: {
        color: "#000080",
        weight: 1.5,
        fill: false
      }
    }).addTo(map);
  })
  .catch(error => {
    console.error("Error loading GeoJSON:", error);
  });

function searchDistrict() {
  const selected = document.getElementById("districtSearch").value;

  if (districtMarker) {
    map.removeLayer(districtMarker);
    districtMarker = null;
  }
  if (districtLabel) {
    map.removeLayer(districtLabel);
    districtLabel = null;
  }

  if (!selected || !tnDistricts[selected]) {
    map.setView([10.8505, 78.2711], 7);
    return;
  }

  const center = tnDistricts[selected];

  const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [50, 82],
    iconAnchor: [25, 82],
    popupAnchor: [0, -70]
  });

  districtMarker = L.marker(center, { icon: customIcon }).addTo(map);

  districtLabel = L.marker([center[0] + 0.15, center[1]], {
    icon: L.divIcon({
      className: 'district-label',
      html: `<div style="font-size: 1px; font-weight: bold; color:red; text-align: center;">${selected}</div>`,
      iconAnchor: [50, 0]
    }),
    interactive: false
  }).addTo(map);

  let fitDone = false;
  if (districtLayerGroup) {
    districtLayerGroup.eachLayer(layer => {
      const districtName = layer.feature.properties?.DISTRICT?.toLowerCase().trim();
      const selectedLower = selected.toLowerCase().trim();

      if (districtName && districtName.includes(selectedLower)) {
        const bounds = layer.getBounds();
        map.fitBounds(bounds, { padding: [40, 40] });
        map.panTo(center);
        fitDone = true;
        layer.setStyle({ color: "blue", weight: 3 });
      } else {
        layer.setStyle({ color: "#000000", weight: 1.5 });
      }
    });
  }

  if (!fitDone) {
    map.setView(center, 11);
  }
}

// --- Heatmap Layer ---
const heatData = [
  [13.0631, 80.2296, 640],
  [11.6512, 78.1575, 450],
  [10.7905, 78.7047, 390],
  [9.919, 78.1198, 370],
  [12.925, 79.1333, 300],
  [11.25, 77.0167, 280],
  [9.25, 79.1167, 240],
  [10.3667, 77.9667, 230],
  [12.8333, 79.7167, 200],
  [11.0667, 77.0333, 190],
  [11.25, 78.25, 170],
  [11.75, 79.75, 150],
  [9.5167, 78.0833, 140],
  [10.6167, 76.9667, 130],
  [12.1167, 78.15, 110],
  [12.3167, 78.4333, 100],
  [11.9, 78.0667, 90],
  [10.9333, 79.8333, 80],
  [10.95, 79.3833, 70],
  [10.6333, 77.9667, 60],
  [11.0667, 78.15, 50],
  [12.8333, 80.2333, 40],
  [12.9167, 80.1167, 30],
  [12.7, 79.5, 30],
  [12.3, 79.1, 25],
  [9.75, 77.8167, 20],
  [8.7333, 77.7, 18],
  [10.1, 77.95, 16],
  [9.1667, 77.25, 14],
  [10.25, 78.25, 13],
  [10.7833, 79.1167, 12],
  [11.6, 79.5, 11],
  [12.9, 78.8, 10],
  [11.1, 77.35, 9],
  [12.5, 79.3, 8],
  [10.8, 79.3, 7],
  [13.1, 79.9333, 6],
  [9.5, 78.6, 5]
];

const heat = L.heatLayer(heatData, {
  radius: 30,
  blur: 20,
  maxZoom: 12,
  gradient: {
    0.1: 'blue',
    0.3: 'lime',
    0.5: 'orange',
    0.7: 'red',
    1.0: 'maroon'
  }
}).addTo(map);

const toggle = document.createElement("label");
toggle.innerHTML = `
  <input type="checkbox" id="toggleHeat" checked style="width: 75px; height: 75px; vertical-align: middle;">
  <span style="font-size: 60px; margin-left: 12px;">Show Heatmap</span>
`;
toggle.style = `
  position: absolute;
  top: 35px;
  right: 1250px;
  background: white;
  padding: 20px 30px;
  z-index: 1000;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
`;
document.body.appendChild(toggle);

document.getElementById("toggleHeat").addEventListener("change", (e) => {
  if (e.target.checked) {
    map.addLayer(heat);
  } else {
    map.removeLayer(heat);
  }
});




// Heatmap legend styled like the gradient image
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += `
    <h4 style="margin: 4px 0 6px;">Case Intensity</h4>
    <div style="width: 160px; height: 12px; border: 1px solid #888; background: linear-gradient(to right, blue, lime, orange, red, maroon); margin-bottom: 6px;"></div>
    <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold;">
      <span>Low</span><span>High</span>
    </div>
  `;
  return div;
};
legend.addTo(map);


