HT = {}

HT.Define = {
    InitialAddress: "Parque Halfeld, Juiz de Fora, Minas Gerais, Brazil"
}

HT.Elements = {
    Map: null,
    CurrentMarker: null,
    Searchbox: null
};

HT.Store = {
    TipoEmpreendimento: [{
        Identifier: "RU",
        Nome: "Residencial - Unifamiliar",
        HasCategory: false
    },{
        Identifier: "RM",
        Nome: "Residencial - Multifamiliar",
        HasCategory: false
    },{
        Identifier: "C",
        Nome: "Comercial / Serviço",
        HasCategory: true
    },{
        Identifier: "IT",
        Nome: "Institucional",
        HasCategory: true
    },{
        Identifier: "ID",
        Nome: "Industrial",
        HasCategory: true
    }],

    CategoriaEmpreendimento: [{
        Nome: "Alfaiataria",
        GrupoCategoria: "L1"
    }, {
        Nome: " Aluguel de Roupas",
        GrupoCategoria: "L1"
    },{
        Nome: "Armarinho",
        GrupoCategoria: "L1"
    }]
}

HT.Regras = [{
    Tipo: "RU",
    Zona: "ZR1",
    Grupo: "TODOS"
}]

HT.ShowMoreInfo = function(){
    $("#more-info-tr").show();
    $("#more-info-link").hide();
}

HT.UpdateMoreInfo = function(a,b,c,d){
    $("#mi-a").html(a);
    $("#mi-b").html(b + "%");
    $("#mi-c").html(c);
    $("#mi-d").html(d);
}

HT.ProcessMoreInfo = function(){
    var area = parseInt($("input#area").val(),10);
    var testada = parseInt($("input#testada").val(),10);

    if(area < 300){
        HT.UpdateMoreInfo(1, 65, 3, 0);
    }else if(area >= 300 && area < 360){
        if(testada < 10){
            HT.UpdateMoreInfo(1.7, 65, 3, (area == 300) ? 1.5 : 0);
        }else{
            HT.UpdateMoreInfo(2.4, 65, 3, (area == 300) ? 1.5 : 0);
        }
    }else if(area >= 360 && area < 450){
        if(testada < 10){
            HT.UpdateMoreInfo(2.5, 50, 3, (area == 300) ? 1.5 : 1.5);
        }else  if(testada < 12){
            HT.UpdateMoreInfo(2.8, 50, 3, (area == 300) ? 1.5 : 1.5);
        }else{
            HT.UpdateMoreInfo(3.0, 50, 3, (area == 300) ? 1.5 : 1.5);
        }
    }else if(area >= 450 && area < 550){
        if(testada < 10){
            HT.UpdateMoreInfo(2.5, 50, 3, (area == 300) ? 1.5 : 1.5);
        }else  if(testada < 12){
            HT.UpdateMoreInfo(2.8, 50, 3, (area == 300) ? 1.5 : 1.5);
        }else{
            HT.UpdateMoreInfo(3.0, 50, 3, (area == 300) ? 1.5 : 1.5);
        }
    }else if(area >= 550 && area < 700){
        if(testada < 10){
            HT.UpdateMoreInfo(2.5, 50, 3, (area == 300) ? 1.5 : 1.5);
        }else  if(testada < 12){
            HT.UpdateMoreInfo(2.8, 50, 3, (area == 300) ? 1.5 : 1.5);
        }else{
            HT.UpdateMoreInfo(3.0, 50, 3, (area == 300) ? 1.5 : 1.5);
        }
    }else if(area >= 700 && area < 1200){
        if(testada < 10){
            HT.UpdateMoreInfo(2.5, 50, 3, (area == 300) ? 1.5 : 1.5);
        }else  if(testada < 12){
            HT.UpdateMoreInfo(2.8, 50, 3, (area == 300) ? 1.5 : 1.5);
        }else{
            HT.UpdateMoreInfo(3.0, 50, 3, (area == 300) ? 1.5 : 1.5);
        }
    }else if(area >= 1200){
        if(testada < 10){
            HT.UpdateMoreInfo(2.5, 50, 3, (area == 300) ? 1.5 : 1.5);
        }else  if(testada < 12){
            HT.UpdateMoreInfo(2.8, 50, 3, (area == 300) ? 1.5 : 1.5);
        }else{
            HT.UpdateMoreInfo(3.0, 50, 3, (area == 300) ? 1.5 : 1.5);
        }
    }
}

HT.ProcessaLocation = function(loc){
    var zonaResult = null;
    HT.Store.Zonas.features.forEach(function(zona, zonaIndex){
        if(HT.PolygonContainsLocation(zona.geometry.coordinates[0][0], loc)){
            zonaResult = zona;
            return;
        }
    });
    return zonaResult;
}

HT.TranslateZona = function(zona){
    return "ZR1";
}

HT.ShowResult = function(type){
    $("#empty-result").hide();
    $("#success-result").hide();
    $("#failure-result").hide();

    $("#" + type+ "-result").show();
}

HT.ProcessaRegra = function(tipo, zona, grupo){ 
    var result = false;
    HT.Regras.forEach(function(regra){
        if(regra.Tipo == tipo && regra.Zona == zona && (regra.Grupo == "TODOS" || regra.Grupo == grupo)){
            result = true;
            return;
        }
    });

    return result;
}

HT.ProcessSearch = function(){
   var zona = HT.ProcessaLocation(HT.Elements.CurrentMarker.position);
   if(zona != null){
        var tipo = HT.Store.TipoEmpreendimento[parseInt($("#typebox").select2("val"), 10)];
        if(tipo == null){
            HT.ShowResult("empty");
            return
        }

        var categoria = null;
        if(tipo.HasCategory){
            categoria = HT.Store.CategoriaEmpreendimento[parseInt($("#categorybox").select2("val"), 10)];
            if(categoria == null){
                HT.ShowResult("empty");
                return
            }
            else
                categoria = categoria.GrupoCategoria;
        }
        var result = HT.ProcessaRegra(tipo.Identifier, HT.TranslateZona(zona) ,categoria );
        if(result){
            HT.ShowResult("success");
        }else{
            HT.ShowResult("failure");
        }
   }else{
        HT.ShowResult("empty");
   }
}

HT.PolygonContainsLocation = function(pol, loc){
    var x = loc.lng(), y = loc.lat();
    
    var inside = false;
    for (var i = 0, j = pol.length - 1; i < pol.length; j = i++) {
        var xi = pol[i][0], yi = pol[i][1];
        var xj = pol[j][0], yj = pol[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

HT.LoadCategoryCombobox = function(type){
    var index = parseInt(type.id,10);
    var tipo = HT.Store.TipoEmpreendimento[index];
    if(tipo.HasCategory){
        HT.ShowResult("empty");
        $('#categorybox').html("");
        HT.Store.CategoriaEmpreendimento.forEach(function(item, itemIndex){
            $('#categorybox').append("<option value='"+itemIndex+"'>"+item.Nome+"</option>");
        });

        $('#categorybox').select2({
            placeholder: $('#categorybox').attr("placeholder"),
            allowClear: false,
        }).on('select2:select', function (e) {
            HT.ProcessSearch();
        });
        $("#categorybox").select2("val", "-1");

        $("#panel-top").css("height", "180px");
        $('#categorybox-frame').show();
    }else{
        $('#categorybox-frame').hide();
        $("#panel-top").css("height", "120px");
        HT.ProcessSearch();
    }
}

HT.StartMap = function () {
    $("#btnContinue").click(function(){
        $("#modal-inicial").hide(0);
    })

    $("#more-info-link").click(function(){
        HT.ShowMoreInfo();
    })

    HT.Elements.Searchbox = document.getElementById('searchbox');
    HT.Elements.Searchbox.value = HT.Define.InitialAddress;

    HT.Store.TipoEmpreendimento.forEach(function(item, itemIndex){
        $('#typebox').append("<option value='"+itemIndex+"'>"+item.Nome+"</option>");
    });

    $('#typebox').select2({
        placeholder: $('#typebox').attr("placeholder"),
        allowClear: false,
    }).on('select2:select', function (e) {
        HT.LoadCategoryCombobox(e.params.data)
    });
    $("#typebox").select2("val", "-1");

    $('#categorybox-frame').hide();

    $("input#area").keyup(function(){
        HT.ProcessMoreInfo()
    })

    $("input#testada").keyup(function(){
        HT.ProcessMoreInfo()
    })

    HT.GetDefaultAddressCoordinates(function (response) {
        if (response.Success) {
            var position = response.Result.results[0].geometry.location;

            HT.Elements.Map = new google.maps.Map(document.getElementById('map'), {
                center: position,
                zoom: 14,
                streetViewControl: false,
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
                            HT.Elements.Searchbox.value = results[0].formatted_address;
                            HT.ProcessSearch();
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
                HT.ProcessSearch();
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