HT = {}

HT.Define = {
    InitialAddress: "Rua Batista de Oliveira, Centro, Juiz de Fora, Minas Gerais, Brazil"
}

HT.Elements = {
    Map: null,
    CurrentMarker: null,
    Searchbox: null
};

HT.StartMap = function () {
    HT.Elements.Searchbox = document.getElementById('searchbox');
     HT.Elements.Searchbox.value = HT.Define.InitialAddress;

    HT.GetDefaultAddressCoordinates(function (response) {
        if (response.Success) {
            var position = response.Result.results[0].geometry.location;

            HT.Elements.Map = new google.maps.Map(document.getElementById('map'), {
                center: position,
                zoom: 14
            });

            HT.Elements.CurrentMarker = new google.maps.Marker({
                position: position,
                map: HT.Elements.Map,
                draggable: true,
                animation: google.maps.Animation.DROP,
            });

            google.maps.event.addListener(HT.Elements.CurrentMarker,'dragend',function(event) {
                (new google.maps.Geocoder()).geocode({
                    'latLng': this.position
                 }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                      if (results.length > 1) {
                        HT.Elements.Searchbox.value = results[0].formatted_address
                      } else {
                        alert('No results found');
                      }
                    } else {
                      alert('Geocoder failed due to: ' + status);
                    }
                  });
            });

            var autocomplete = new google.maps.places.Autocomplete(HT.Elements.Searchbox);
            autocomplete.bindTo('bounds', HT.Elements.Map);

            autocomplete.addListener('place_changed', function() {
                var place = autocomplete.getPlace();
                HT.Elements.Map.setCenter(place.geometry.location);
                HT.Elements.CurrentMarker.setPosition(place.geometry.location);
                HT.Elements.Map.setZoom(17);
            });


        } else {
            alert("Ocorreu um erro ao buscar os dados da coordenada");
        }
    });
}

HT.RenderPolygonToMap = function (coords, map, cfg) {
    var triangleCoords = [
        { lat: 25.774, lng: -80.190 },
        { lat: 18.466, lng: -66.118 },
        { lat: 32.321, lng: -64.757 },
        { lat: 25.774, lng: -80.190 }
    ];

    var polygon = new google.maps.Polygon({
        paths: triangleCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });
    polygon.setMap(map);
}

HT.GetDefaultAddressCoordinates = function (callback) {
    $.ajax({
        dataType: "json",
        url: "http://maps.google.com/maps/api/geocode/json?address=" + HT.Define.InitialAddress,
        success: function (response) {
            if (response.results.length > 0) {
                callback({
                    Success: true,
                    Result: response
                });
            } else {
                callback({
                    Success: false,
                    Result: response
                });
            }
        },
        failure: function () {
            callback({
                Success: false,
                Result: response
            });
        }
    });
}