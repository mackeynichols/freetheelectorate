#! python3
# ftejsonmaker.py

import json, csv

print("ok")

def initGeojson(file):
    # load json, return it in a python dictionary
    dat = open(file)
    output = json.load(dat)
    print("loaded " + file)
    return output

def initCsv(file):
    # load a csv, return it in a list of rows (each row is also a list)
    dat = open(file)
    output = csv.reader(dat)
    output = list(output)
    print("loaded " + file)
    return output

def smush(polygon, table, delineation):
    '''
    For either Electoral Divisions or Polling Divisions in an input geojson...
    ... assign each each polygon its candidates, their parties, and number of votes
    ... assign each polygon a winner
    ... assign each polygon its other metrics, such as total electors, elector turnout, rejeccted ballots etc...
    ...... and finally return a geojson
    '''
    
    print("starting to smush data")

    # FOR ELECTORAL DIVISIONS
    if delineation == "ed":
        edid = 1
        year = 4
        variable = 2
        party = 5
        value = 3

        for candrow in table:
            for partyrow in partycsv:
                if not candrow[party]:
                    candrow[party] = candrow[variable]
                if candrow[variable].strip() == partyrow[2].strip() and candrow[edid] == partyrow[1]:
                    candrow[party] = partyrow[5].strip()
                    
        
        for feature in polygon["features"]:
            feature["properties"]['2011'] = {"WINNER" : {"value" : 0}}
            feature["properties"]['2014'] = {"WINNER" : {"value" : 0}}
            
            for row in table:
                #print(row) 
                if str(feature["properties"]["ED_ID"]) == str(row[edid]):
                    feature["properties"][row[year]][row[party].strip()] = {"variable" : row[variable].strip(), "value" : row[value]}
                                           
                    if int(feature["properties"][row[year]][row[party]]["value"]) > int(feature["properties"][row[year]]["WINNER"]["value"]) and row[variable] not in ['ELECTORS', 'VOTER_TURNOUT']:
                        feature["properties"][row[year]]["WINNER"] = {"variable" : row[variable].strip(), "value" : row[value], "party" : row[party].strip()}
                    #print(feature["properties"][row[year]])
                    
        output = open("edvotescastdata.geojson", 'w')
        polygon = json.dumps(polygon)
        output.write(polygon)
        output.close()

    # FOR POLLING DIVISIONS
    if delineation == "pd":
        edid = 1
        pdid = 2
        variable = 3
        value = 4
        year = 5
        party = 6

        for candrow in table:
            for partyrow in partycsv:
                if not candrow[party]:
                    candrow[party] = candrow[variable]
                if candrow[variable].strip() == partyrow[2].strip() and candrow[edid] == partyrow[1]:
                    candrow[party] = partyrow[5].strip()
                    

        for feature in polygon["features"]:
            feature["properties"]['2011'] = {"WINNER" : {"value" : 0}}
            feature["properties"]['2014'] = {"WINNER" : {"value" : 0}}

            for row in table:
                if str(feature["properties"]["ED_ID"]) == str(row[edid]) and str(feature["properties"]["POLL_DIV_1"]) == str(row[pdid]):            
                    feature["properties"][row[year]][row[party].strip()] = {"variable" : row[variable].strip(), "value" : row[value]}
                        
                    if int(feature["properties"][row[year]][row[party]]["value"]) > int(feature["properties"][row[year]]["WINNER"]["value"]) and row[variable] not in ['ELECTORS', 'VOTER_TURNOUT']:
                        feature["properties"][row[year]]["WINNER"] = {"variable" : row[variable].strip(), "value" : row[value], "party" : row[party].strip()}
                    #print(feature["properties"][row[year]])
        
        output = open("pdvotescastdata.geojson", 'w')
        polygon = json.dumps(polygon)
        output.write(polygon)
        output.close()     
    print("done smushing with " + delineation)
    
edpoly = initGeojson(r"ED_ON_2014.geojson")
pdpoly = initGeojson(r"PD_ON_2014.geojson")

partycsv = initCsv(r"Results Extract - 2007-2014GE.csv")
edcsv = initCsv(r"edtotal.csv")
pdcsv = initCsv(r"pdtotal.csv")

smush(edpoly, edcsv, "ed")
smush(pdpoly, pdcsv, "pd")

#print(pdpoly["features"][1]['properties'])
#print(edcsv[:6])

