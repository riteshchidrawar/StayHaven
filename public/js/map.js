
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: list.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});


console.log(list.geometry.coordinates);


const marker1 = new mapboxgl.Marker({color: "red"})
.setLngLat(list.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h5>${list.title}</h5><p>Exact location provided after booking</p>`))
.addTo(map);