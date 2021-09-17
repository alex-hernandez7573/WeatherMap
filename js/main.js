// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-98.4936, 29.421], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

// creation of marker
var marker = new mapboxgl.Marker ( {
    draggable: true,
    color:"blue"
})
    .setLngLat([-98.4936, 29.421])
    .addTo(map)

/// cords using lng lat now then write to pages
var coordinates = [marker.getLngLat().lat, marker.getLngLat().lng];
marker.on("dragend",function (){
    coordinates = [marker.getLngLat().lat, marker.getLngLat().lng];
    console.log(coordinates)
    writeToPage()
})

function writeToPage () {
    $.ajax("https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&exclude=minutely,hourly&appid=" + WEATHER_MAP_TOKEN)
        .done (function (respAPI) { $("#spawnInfo").html("");

            //// running through the
            for (var i = 0; i < respAPI.daily.length; i++) {
                var today = respAPI.daily[i];
                var dateToday = new Date(today.dt*1000);
                dateToday = dateToday.toDateString();



                ///creating HTML
                var html ="";
                //show current then everything else
                if (i === 0){
                    html = "<div style='background: lightgreen;' class='card col -" + (i + 1) + "'>";
                    html += "<div class='card-title'><h9>" + dateToday + "</h9></div>"
                    html += "<p class='card-text'>Desc: "+respAPI.current.weather[0].main +"</p>";
                    html += "<p class='card-text'>Temp: "+(respAPI.current.temp)+"</p>";
                    html += "<p class='card-text'>Press: "+(respAPI.current.pressure)+"</p>";
                    html += "<p class='card-text'>Wind: "+(respAPI.current.wind_speed)+" mph</p>";
                    html += "<p class='card-text'>Humidity: "+(respAPI.current.humidity)+"</p>";
                } else {
                    html = "<div style='background: lightgreen;' class='card col -" + (i + 1) + "'>";
                    html += "<div class='card-title'><h9>" + dateToday + "</h9></div>"
                    html += "<p class='card-text' >Desc: "+respAPI.daily[i].weather[0].main+"</p>";
                    html += "<p class='card-text' >Temp: "+(respAPI.daily[i].temp.day)+"</p>";
                    html += "<p class='card-text' >Press: "+(respAPI.daily[i].pressure)+"</p>";
                    html += "<p class='card-text' >Wind: "+(respAPI.daily[i].wind_speed)+" mph</p>";
                    html += "<p class='card-text'>Humidity: "+(respAPI.daily[i].humidity)+"</p>";
                }
                $("#spawnInfo").append(html);
            }
            console.log(respAPI)
        });

    // search button for moveMarker

    $("#search-button").click(function (){
        searchInput = $ ("#search-input").val();
        moveMarkerWithSearch()
    })
    // moving marker and using writeToPage
    function moveMarkerWithSearch () {
        geocode(searchInput, MAPBOX_ACCESS_TOKEN).then (function (here) {
            marker.setLngLat(here)
            coordinates = [marker.getLngLat().lat,marker.getLngLat().lat];
            map.flyTo({ center: here, zoom: 5, speed: 12});
            writeToPage();
        })
    }
}
writeToPage();