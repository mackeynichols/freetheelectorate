L.mapbox.accessToken = 'pk.eyJ1Ijoic29uYWxyIiwiYSI6ImI3ZGNmNTI1Mzc1NzFlYTExMGJkZTVlZDYxYWY4NzJmIn0.wxeViIZtMPq2IPoD9mB5qQ';

var year = "2011";
var mapVariable = "VOTER_TURNOUT";
var valueType = "value";
var mode = "electors"
var ctx = document.getElementById("myChart");


var map = L.mapbox.map('map', 'mapbox.streets', {zoomControl: false})


// Convert strings to 'Uppercase First Letter For Each Word In String' format
function titleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function showEd(json)
{
  $('.loader').show()
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() 
  {
      if (xhttp.readyState == 4 && xhttp.status == 200) 
      {
        chloropleth = L.geoJson(JSON.parse(xhttp.responseText),{style: style, onEachFeature: onEachFeature}).addTo(map)
        $(".loader").fadeOut()
      }
  }
  xhttp.open("GET", json, true);
  xhttp.send();
}

function showPd(json, edid)
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() 
  {
      if (xhttp.readyState == 4 && xhttp.status == 200) 
      {
        pdSlice = []
        pdFile = JSON.parse(xhttp.responseText)
        for(polygon in pdFile)
        {
          console.log(polygon)
          if(parseInt(polygon['properties']['ED_ID']) == parseInt(edid))
          {
            pdSlice.push(polygon)
          }
        }
        chloropleth = L.geoJson(pdSlice,{style: style, onEachFeature: onEachFeature}).addTo(map)
        $(".loader").fadeOut()
      }
  }
  xhttp.open("GET", json, true);
  xhttp.send();
}

function style(feature) {
  
    return {
        fillColor: getColor(feature.properties[year][mapVariable], feature.properties[year]['ELECTORS']['value']),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6
    };
}

function getColor(c, d) {
  console.log(mapVariable)
  switch(mapVariable)
  {
    case 'VOTER_TURNOUT':
      d = c['value'] / d
      /*d = c / div;
      var diff = maxVal - minVal;
      return d > minVal+ (7*diff/8) ? '#800026' :
             d > minVal+ (6*diff/8)  ? '#BD0026' :
             d > minVal+ (5*diff/8)  ? '#E31A1C' :
             d > minVal+ (4*diff/8)  ? '#FC4E2A' :
             d > minVal+ (3*diff/8)   ? '#FD8D3C' :
             d > minVal+ (2*diff/8)  ? '#FEB24C' :
             d > minVal+ (1*diff/8)   ? '#FED976' :
                                        '#FFEDA0';*/
      return d >= 0.55 ? '#8c2d04' :
             d >= 0.525 ? '#d94801' :
             d >= 0.5 ? '#f16913':
             d >= 0.475 ? '#fd8d3c' :
             d >= 0.45 ? '#fdae6b' :
             d >= 0.425 ? '#fdd0a2' :
             d >= 0.4 ? '#feedde':
                        '#ffffff'
      
    case 'REJECTED':
    case 'UNMARKED':

      d = c['value'] / d
      console.log(d)
      return d >= 0.00125 ? '#8c2d04' :
             d >= 0.001 ? '#d94801' :
             d >= 0.00075 ? '#f16913':
             d >= 0.0005 ? '#fd8d3c' :
             d >= 0.00025 ? '#fdae6b' :
                        '#ffffff'
      
    case 'WINNER':
      
      if(c['party'] !== undefined){c = c['party']}
        
      return  c ==    "LIBERAL" || c == "ONTARIO LIBERAL PARTY"  ?   "#B0304B"  :
              c ==    "PROGRESSIVE CONSERVATIVE" || c == "PROGRESSIVE CONSERVATIVE PARTY OF ONTARIO" || c=="CONSERVATIVE"      ?   "#458BBE"  :
              c ==    "NEW DEMOCRATIC" || c == "NEW DEMOCRATIC PARTY OF ONTARIO"   || c == "NDP"            ?   "#D37F36"  :
              c ==    "GREEN"                           ?   "#038543"  :
              c ==    "FAMILY COALITION PARTY OF ONTARIO"   ?   "#64C42B"  :
              c ==    "ONTARIO LIBERTARIAN PARTY"   ?   "#C96BD1"  :
              c ==    "INDEPENDENT" ?   "#725DFB"  :
              c ==    "ONTARIO PROVINCIAL CONFEDERATION OF REGIONS PARTY"   ?   "#5F7CCD"  :
              c ==    "FREEDOM"                         ?   "#9E2E71"  :
              c ==    "COMMUNIST"                      ?   "#C6DF76"  :
              c ==    "REFORM PARTY OF ONTARIO" ?   "#02EF6B"  :
              c ==    "NO AFFILIATION"  ?   "#F307A2"  :
              c ==    "REPUBLICAN PARTY OF ONTARIO" ?   "#27B8AE"  :
              c ==    "PARTY FOR PEOPLE WITH SPECIAL NEEDS" ?   "#3D5A8F"  :
              c ==    "THE ONLY PARTY"  ?   "#F7FF73"  :
              c ==    "PROGRESSIVE CONSERVATIVE PARTY OF ONTARIO"  ?   "#D06BF3"  :
              c ==    "PATRON"                          ?   "#B164F3"  :
              c ==    "PARTY FOR HUMAN RIGHTS IN ONTARIO"   ?   "#068DAA"  :
              c ==    "VEGAN ENVIRONMENTAL PARTY"   ?   "#666B35"  :
              c ==    "SOCIALIST PARTY OF ONTARIO"  ?   "#80A0C6"  :
              c ==    "NORTHERN ONTARIO HERITAGE"       ?   "#70C4F3"  :
              c ==    "PEOPLE FIRST REPUBLIC PARTY OF ONTARIO"  ?   "#DD9CD0"  :
              c ==    "CHRISTIAN CREDIT"                ?   "#A2A6A5"  :
              c ==    "THE GREEN PARTY OF ONTARIO"  ?   "#70DDB5"  :
              c ==    "ONTARIO LIBERAL PARTY"   ?   "#4AC394"  :
              c ==    "NEW DEMOCRATIC PARTY OF ONTARIO" ?   "#C85245"  :
              c ==    "PAUPER PARTY OF ONTARIO" ?   "#746D96"  :
              c ==    "THE PEOPLES POLITICAL PARTY" ?   "#64CF16"  :
              c ==    "ONTARIO MODERATE PARTY"  ?   "#1FC7B0"  :
              c ==    "EQUAL PARENTING PARTY"   ?   "#9A74A3"  :
              c ==    "NONE OF THE ABOVE PARTY OF ONTARIO"  ?   "#D21A60"  :
              c ==    "CANADIANS' CHOICE PARTY" ?   "#B7144F"  :
              c ==    "TRILLIUM PARTY OF ONTARIO"   ?   "#E1397D"  :
                                                      "#E1397D";
                                                      
    default:
      if(c !== undefined)
      {
        c = c['value'] / d
        return c >= 0.6 ? '#8c2d04' :
               c >= 0.5 ? '#d94801' :
               c >= 0.4 ? '#f16913':
               c >= 0.3 ? '#fd8d3c' :
               c >= 0.2 ? '#fdae6b' :
               c >= 0.1 ? '#fdd0a2' :
               '#feedde'
      }else{return '#feedde'}
      
      

  }
}



function onEachFeature(feature, layer) {
  
  
  /*layer.bindPopup("<h5>" + feature.properties.ENGLISH_NA.replace("--", " - ") + " / "+feature.properties.FRENCH_NAM.replace("--", " - ") + "</h5><hr>"
                  + "<b>Number of Electors in "+year+": </b>" +  feature.properties[year]["ELECTORS"]["value"]+"<br>"
                  + "<b>Voter Turnout in "+year+": </b>" + feature.properties[year]["VOTER_TURNOUT"]["value"] + " (" + Math.round(feature.properties[year]["VOTER_TURNOUT"]["value"]/feature.properties[year]["ELECTORS"]["value"]*100) + "%)<br>"
                  + "<b>Winning Party in "+year+": </b>" + feature.properties[year]["WINNER"]["party"]
                  )*/
  
    layer.on({
        mouseover: function()
        {
          // Add textual info for polygon on top of doughnut chart
          $('#charts').prepend("<h5>" + titleCase(feature.properties.ENGLISH_NA.replace("--", " - ")) + " / "+ titleCase(feature.properties.FRENCH_NAM.replace("--", " - ")) + "</h5>")
          
          data = []
          labels = []
          backgroundColor = []
          
          // Only read party names, not voter stats
          for(variable in feature.properties[year])
          {
            if(variable != "DECLINED" &variable != "ELECTORS" &variable != "REJECTED" &variable != "UNMARKED" &variable != "VOTER_TURNOUT" &variable != "WINNER" &variable != "")
            {
              // Push data, party names, party colors into chart.js arrays
              data.push(feature.properties[year][variable]["value"])
              if(variable == "NDP"){labels.push(variable)}else{labels.push(titleCase(variable.substr(0,30)))}
              oldMapVariable = mapVariable
              mapVariable = "WINNER"
              backgroundColor.push(getColor(variable, ""))
              mapVariable = oldMapVariable
            }
          }
          // Create a "didnt vote" data, label, and color
          data.push(parseInt(feature.properties[year]['ELECTORS'].value) - parseInt(feature.properties[year]['VOTER_TURNOUT'].value))
          labels.push("Didn't Vote")
          backgroundColor.push("#ffffff")
          layer.setStyle({fillOpacity: 0.9, weight:3})
          
          // Create dynamic chart
          var data = {
            labels: labels,
            datasets: [
                {
                    backgroundColor: backgroundColor,
                    label: feature.properties.ENGLISH_NA + " / "+feature.properties.FRENCH_NAM,
                    borderWidth: 1,
                    data: data,
                }
            ]
            
          };
          var myBarChart = new Chart(ctx, 
          {
            type: 'doughnut',
            data: data,
            options: {
              legend: {
                position: 'right',
                labels: {
                  fontSize: 12
                }
              }
            }
            
          });
        },
        
        // Delete chart when mouse leaves polygon
        mouseout: function()
        {
          layer.setStyle({fillOpacity: 0.6, weight:1})
          $('#myChart').remove();
          $('#charts').empty()
          $('#charts').append('<canvas id="myChart"><canvas>');
          ctx = document.getElementById("myChart");
        },
        click: function()
          {
            $(".loader").fadeIn()
            map.fitBounds(layer.getBounds());
            chloropleth.clearLayers()
            console.log("Clicked on " + feature.properties.ED_ID)
            showPd('pdvotescastdata.geojson',feature.properties.ED_ID)
          }
    });
}



map.on('load', function() {
    map.setView([50,-90], 5)
    map.setMaxBounds([[60,-115],[38,-65]])
    
    // SIDEBAR TOGGLE
    document.getElementById("sidebar-toggle").onclick = function()
    {
      
      $("#sidebar").toggle(250)
      $("#charts").toggle(250)
      $("#sidebar-toggle").toggleClass("glyphicon-arrow-right glyphicon-arrow-le")
    }
    
    // SET ELECTORS VIEW MODE
    document.getElementById("Turnout").onclick = function()
    {
      mode = "electors"
      document.getElementById("Options").innerHTML = '<input type="radio" name="Turnout" value="VOTER_TURNOUT"> Percent Turnout<br>'+
                                                      '<input type="radio" name="Turnout" value="REJECTED"> Percent Rejected<br>'+
                                                      '<input type="radio" name="Turnout" value="UNMARKED"> Percent Unmarked<br><br>'
      
    }
    
    // ELECTORS VIEW RADIO BUTTON CHLOROPLETH TOGGLE
      document.getElementById("Options").onchange = function()
      {
        if(mode == "electors")
        {
            chloropleth.clearLayers()
            mapVariable = document.querySelector('input[name=Turnout]:checked').value;
            valueType = 'value';
            showEd('https://raw.githubusercontent.com/CivicTechTO/freetheelectorate/master/edvotescastdata.geojson')
        }
      }

    // SET ELECTEES VIEW MODE
    document.getElementById("Results").onclick = function()
    {
      mode = "electees"
      document.getElementById("Options").innerHTML = "<select id = 'party-picker' class = 'form-control'>"+
                                                      "<option value = '' default>Select </option>"+
                                                      "<option value = 'WINNER' >All Parties </option>"+
                                                      "<option value = 'CONSERVATIVE' >Conservative </option>"+
                                                      "<option value = 'LIBERAL' >Liberal </option>"+
                                                      "<option value = 'NDP' >NDP </option>"+
                                                      "</select>";
      
      // ELECTEES VIEW DROPDOWN MENU CHLOROPLETH TOGGLE
      document.getElementById("party-picker").onchange = function()
      {
        if(mode == "electees")
        {
          mapVariable = document.getElementById("party-picker").value
          chloropleth.clearLayers()
          showEd('https://raw.githubusercontent.com/CivicTechTO/freetheelectorate/master/edvotescastdata.geojson')
        }
      }
    }
    
    // YEAR TOGGLE
    document.getElementById('yearToggle').onchange = function()
    {
        console.log("Year changed to " + document.querySelector('input[name="year"]:checked').value)
        chloropleth.clearLayers();
        
        year = document.querySelector('input[name="year"]:checked').value;  
        showEd('https://raw.githubusercontent.com/CivicTechTO/freetheelectorate/master/edvotescastdata.geojson')
        
    }
    
    
    // FIRST FUNCTIONS
    
    showEd('https://raw.githubusercontent.com/CivicTechTO/freetheelectorate/master/edvotescastdata.geojson')
    $("#sidebar").toggle(500)
    $("#charts").toggle(500)
    $("#sidebar-toggle").toggle(500)
    

});    
    



