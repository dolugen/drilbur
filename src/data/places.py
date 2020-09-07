import json
"""
Combine the places JSONs into 1 format
Output to stdout

Usage:
    python3 places.py > places.json

Record format:
{
    "id": "...",
    "name": "...",
    "type": "country | city | location",
    "city": "...",
    "country": "..."
}

city, and country fields are only present for certain types.
e.g.
- location will have city, and country.
- city will have country.
- country will have none.
"""

def main():
    places = {
        "places": []
    }
    # handle country file
    with open('countries.json') as f:
        countries_data = json.load(f)
        for country in countries_data['results']:
            if country.get("name"):
                places["places"].append({
                    "id": country["code"],
                    "name": country["name"],
                    "type": "country"
                })
    
    # handle city file
    with open('cities.json') as f:
        cities_data = json.load(f)
        for city in cities_data["data"]["cities"]:
            places["places"].append({
                # no id!
                "name": city["name"],
                "type": "city",
                "country": city["country"]
            })

    # handle locations file
    with open('locations.json') as f:
        locations_data = json.load(f)
        for location in locations_data["data"]["locations"]:
            places["places"].append({
                "id": location["id"],
                "name": location["location"],
                "type": "location",
                "city": location["city"],
                "country": location["country"]
            })

    places["count"] = len(places["places"])
    print(json.dumps(places))

if __name__  == "__main__":
    main()
