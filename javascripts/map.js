var map = L.map('map').setView([59.88, 10.75], 11);

L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2graatone&zoom={z}&x={x}&y={y}').addTo(map);



L.marker([59.88, 10.75]).addTo(map)
.bindPopup("<b>Hello earth!</b><br />I am just a popup.").openPopup();

L.circle([59.88, 10.75], 1000, {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5
}).addTo(map).bindPopup("Hello earth! I am a circle.");

L.polygon([
  [59.80, 10.65],
  [59.80, 10.85],
  [59.85, 10.75]
]).addTo(map).bindPopup("Hello earth! I am a pyramid.");


var popup = L.popup();

function onMapClick(e) {
  popup
  .setLatLng(e.latlng)
  .setContent("You clicked the map at " + e.latlng.toString())
  .openOn(map);
}

map.on('click', onMapClick);
