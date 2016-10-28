L.mapbox.accessToken = 'pk.eyJ1Ijoic29uYWxyIiwiYSI6ImI3ZGNmNTI1Mzc1NzFlYTExMGJkZTVlZDYxYWY4NzJmIn0.wxeViIZtMPq2IPoD9mB5qQ';

var year = "2011";
var mapVariable = "VOTER_TURNOUT";
var valueType = "value";
var mode = "electors"
var edpd = "ed"
var ctx = document.getElementById("myChart");
var pdFile = ""
var thisEd = ""
var chloropleth = new L.LayerGroup();



var map = L.mapbox.map('map', 'mapbox.light', {zoomControl: false})

// Function to ensure the legend matches the map
function legendToggle()
{
   
  switch(mapVariable)
  {
    case "VOTER_TURNOUT":
      
      document.getElementById('legend').innerHTML = "<h4> Voter Turnout </h4> Darker means a higher percentage or electors turned out"
      break
      
    case "REJECTED":
      document.getElementById('legend').innerHTML = "<h4> Ballots Rejected </h4> Darker means a higher percentage of ballots were illegible"
      break
     
    case "UNMARKED":
      document.getElementById('legend').innerHTML = "<h4> Unmarked Ballots </h4> Darker means a higher percentage of ballots were left blank"
      break
      
    case "WINNER":
      document.getElementById('legend').innerHTML = "<h4> Winning Parties </h4> Colors indicate the winning party"
      break
      
    case "LIBERAL":
    case "CONSERVATIVE":
    case "NDP":
      document.getElementById('legend').innerHTML = "<h4> "+titleCase(mapVariable)+" Votes </h4> Darker means a higher percentage of voters for the selected party"
      break
      
  }
  $("#legend").fadeIn()
}

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
        if(pdFile != "")
        {$(".loader").fadeOut()}
      }
  }
  xhttp.open("GET", json, true);
  xhttp.send();
}

function showPd(json, edid)
{
  if(pdFile == "")
  {
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {
        if (xhttp.readyState == 4 && xhttp.status == 200) 
        {
          pdSlice = []
          pdFile = JSON.parse(xhttp.responseText)
          console.log("PD FILE LOADED")
          $(".loader").fadeOut()

        }
    }
    xhttp.open("GET", json, true);
    xhttp.send();
  }
  else
  {
    for(i in pdFile["features"])
    {
      polygon = pdFile["features"][i]
      //console.log(polygon)
      if(parseInt(polygon['properties']['ED_ID']) == parseInt(edid))
      {
        pdSlice.push(polygon)
      }
    }
    chloropleth = L.geoJson(pdSlice,{style: style, onEachFeature: onEachFeaturePd}).addTo(map)
    
    $(".loader").fadeOut()
    edpd = "pd"
  }
}
/*
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() 
  {
      if (xhttp.readyState == 4 && xhttp.status == 200) 
      {
        pdSlice = []
        pdFile = JSON.parse(xhttp.responseText)
        //console.dir(pdFile["features"])
        for(i in pdFile["features"])
        {
          polygon = pdFile["features"][i]
          //console.log(polygon)
          if(parseInt(polygon['properties']['ED_ID']) == parseInt(edid))
          {
            pdSlice.push(polygon)
          }
        }
        chloropleth = L.geoJson(pdSlice,{style: style, onEachFeature: onEachFeaturePd}).addTo(map)
        $(".loader").fadeOut()
      }
  }
  xhttp.open("GET", json, true);
  xhttp.send();
}
*/

function style(feature) {
  if(feature.properties[year]['ELECTORS'] != undefined)
  {
    return {
        fillColor: getColor(feature.properties[year][mapVariable], feature.properties[year]['ELECTORS']['value']),
        weight: 1,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.6
    };
  }
}

function getColor(c, d) {
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
      return d >= 0.55 ? '#252525' :
             d >= 0.525 ? '#525252' :
             d >= 0.5 ? '#737373':
             d >= 0.475 ? '#969696' :
             d >= 0.45 ? '#bdbdbd' :
             d >= 0.425 ? '#d9d9d9' :
             d >= 0.4 ? '#f7f7f7':
                        '#ffffff'
      
    case 'REJECTED':
    case 'UNMARKED':

      d = c['value'] / d
      //console.log(d)
      return d >= 0.00125 ? '#252525' :
             d >= 0.001 ? '#636363' :
             d >= 0.00075 ? '#969696':
             d >= 0.0005 ? '#cccccc' :
             d >= 0.00025 ? '#f7f7f7' :
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
        return c >= 0.6 ? '#252525' :
               c >= 0.5 ? '#636363' :
               c >= 0.4 ? '#969696' :
               c >= 0.3 ? '#bdbdbd' :
               c >= 0.2 ? '#d9d9d9' :
               c >= 0.1 ? '#f7f7f7' :
               '#ffffff'
      }else{return '#ffffff'}
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
          $('#charts').prepend("<h4>" + titleCase(feature.properties.ENGLISH_NA.replace(/--/g, " - ")) + " / "+ titleCase(feature.properties.FRENCH_NAM.replace("--", " - ")) + "</h4>")
          
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
          backgroundColor.push("#595959")
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
            thisEd = feature.properties.ED_ID
            if(pdFile != "")
            {
              $(".loader").fadeIn()
              map.fitBounds(layer.getBounds());
              chloropleth.clearLayers()
              console.log("Clicked on " + feature.properties.ED_ID)
              showPd('https://raw.githubusercontent.com/mackeynichols/freetheelectorate/master/pdvotescastdata_simplified.geojson',feature.properties.ED_ID)
            }
            
          }
    });
}

function onEachFeaturePd(feature, layer) {
  
  
  /*layer.bindPopup("<h5>" + feature.properties.ENGLISH_NA.replace("--", " - ") + " / "+feature.properties.FRENCH_NAM.replace("--", " - ") + "</h5><hr>"
                  + "<b>Number of Electors in "+year+": </b>" +  feature.properties[year]["ELECTORS"]["value"]+"<br>"
                  + "<b>Voter Turnout in "+year+": </b>" + feature.properties[year]["VOTER_TURNOUT"]["value"] + " (" + Math.round(feature.properties[year]["VOTER_TURNOUT"]["value"]/feature.properties[year]["ELECTORS"]["value"]*100) + "%)<br>"
                  + "<b>Winning Party in "+year+": </b>" + feature.properties[year]["WINNER"]["party"]
                  )*/
  
    layer.on({
        mouseover: function()
        {
          // Add textual info for polygon on top of doughnut chart
          $('#charts').prepend("<h5> Polling Division #" + feature.properties.POLL_DIVIS +"</h5>")
          
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
                    //label: feature.properties.ENGLISH_NA + " / "+feature.properties.FRENCH_NAM,
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
                                                      '<input type="radio" name="Turnout" value="UNMARKED"> Percent Unmarked<br>'
      
    }
    
    // ELECTORS VIEW RADIO BUTTON CHLOROPLETH TOGGLE
      document.getElementById("Options").onchange = function()
      {
        if(mode == "electors")
        {
          chloropleth.clearLayers()
          mapVariable = document.querySelector('input[name=Turnout]:checked').value;
          valueType = 'value';
          
          switch(edpd)
          {
            case 'ed':
              showEd('https://raw.githubusercontent.com/CivicTechTO/freetheelectorate/master/edvotescastdata.geojson')
              break
            
            case 'pd':
              showPd('https://raw.githubusercontent.com/mackeynichols/freetheelectorate/master/pdvotescastdata_simplified.geojson', thisEd)
              break
          }
            
            
        }
        legendToggle()
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
          switch(edpd)
          {
            case 'ed':
              showEd('https://raw.githubusercontent.com/CivicTechTO/freetheelectorate/master/edvotescastdata.geojson')
              break
            
            case 'pd':
              showPd('https://raw.githubusercontent.com/mackeynichols/freetheelectorate/master/pdvotescastdata_simplified.geojson', thisEd)
              break
          }
        }
        legendToggle()
      }
    }
    
    // YEAR TOGGLE
    document.getElementById('yearToggle').onchange = function()
    {
        console.log("Year changed to " + document.querySelector('input[name="year"]:checked').value)
        chloropleth.clearLayers();
        year = document.querySelector('input[name="year"]:checked').value;  
        switch(edpd)
          {
            case 'ed':
              showEd('https://raw.githubusercontent.com/CivicTechTO/freetheelectorate/master/edvotescastdata.geojson')
              break
            
            case 'pd':
              showPd('https://raw.githubusercontent.com/mackeynichols/freetheelectorate/master/pdvotescastdata_simplified.geojson', thisEd)
              break
          }
        
    }
    

      document.getElementById('backToEdView').onclick = function()
      {
        if(edpd == "pd"){
          chloropleth.clearLayers();
          showEd('https://raw.githubusercontent.com/CivicTechTO/freetheelectorate/master/edvotescastdata.geojson')
          map.setZoom(5)
          edpd = "ed"
        }

      }
   
    // FIRST FUNCTIONS
    
    showEd('https://raw.githubusercontent.com/CivicTechTO/freetheelectorate/master/edvotescastdata.geojson')
    showPd('https://raw.githubusercontent.com/mackeynichols/freetheelectorate/master/pdvotescastdata_simplified.geojson',"")
    $("#sidebar").toggle(500)
    $("#charts").toggle(500)
    $("#sidebar-toggle").toggle(500)
    

});    
    



