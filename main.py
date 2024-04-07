import requests
import random

def get_city_coordinates(city_name):
    api_key = 'AIzaSyC6a7CH7cy_xP26mz2WCuEOc-EB2ndcJrE'
    url = f'https://maps.googleapis.com/maps/api/geocode/json?address={city_name}&key={api_key}'
    response = requests.get(url)
    data = response.json()
    if data['status'] == 'OK':
        location = data['results'][0]['geometry']['location']
        print(str(location['lat'])+" "+str(location['lng']))
        return location['lat'], location['lng']
    else:
        return None

def create_grid(city_coords, num_sections):
    lat_range = city_coords[0] + 0.5, city_coords[0] - 0.5
    lng_range = city_coords[1] - 0.5, city_coords[1] + 0.5

    lat_interval = (lat_range[1] - lat_range[0]) / num_sections
    lng_interval = (lng_range[1] - lng_range[0]) / num_sections

    grid = []
    for i in range(num_sections):
        for j in range(num_sections):
            box = {
                'lat_min': lat_range[0] + i * lat_interval,
                'lat_max': lat_range[0] + (i + 1) * lat_interval,
                'lng_min': lng_range[0] + j * lng_interval,
                'lng_max': lng_range[0] + (j + 1) * lng_interval,
            }
            grid.append(box)
    return grid


def get_restaurants_in_section(section_latitudes):
    # Here you would use the Google Places API or another restaurant API
    # to fetch restaurants within the specified section boundaries
    # Return a list of restaurants for demonstration purposes
    return ["Restaurant A", "Restaurant B", "Restaurant C", "Restaurant D"]

city_name = input("Enter the name of the city: ")
city_coords = get_city_coordinates(city_name)
if city_coords:
    num_sections = int(input("How many sections do you want to split the city into? "))
    grid = create_grid(city_coords, num_sections)
    print("Grid:", grid)
    section_choice = int(input("Select a section (1 to {}): ".format(num_sections)))
    # selected_section = section_latitudes[section_choice - 1]
    # restaurants = get_restaurants_in_section(selected_section)
    # random_restaurant = random.choice(restaurants)
    # print("Random restaurant in the selected section:", random_restaurant)
else:
    print("City not found.")
