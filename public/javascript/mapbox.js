//map inside each showIdPage

mapboxgl.accessToken = mapToken;

console.log('########### it will be shown in the Chrome console #########');
console.log(campgrounds);


const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campgrounds.geometry.coordinates, // starting position [lng, lat]
    zoom: 11 // starting zoom
});

// Create a new marker.
const marker = new mapboxgl.Marker()
    .setLngLat(campgrounds.geometry.coordinates)
    .setPopup(new mapboxgl.Popup().setHTML(
        `${campgrounds.title} / ${campgrounds.location}`
        )) // add popup
    .addTo(map);
