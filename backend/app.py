from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
import os
from dotenv import load_dotenv

# Initialize FastAPI application
app = FastAPI()

# Configure CORS to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables from .env file - OpenWeather API configuration
load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "http://api.openweathermap.org/data/2.5/weather"
DATA_FILE = "data.json"


def load_history():
    """
    Load weather search history from a JSON file.

    Returns:
        list: A list of weather data dictionaries, or an empty list if file does not exist or is invalid.
    """
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []


def save_history(history):
    """
    Save weather search history to a JSON file.

    Args:
        history (list): List of weather data dictionaries to be saved.
    """
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2, ensure_ascii=False)


@app.get("/weather/{city}")
def get_weather(city: str):
    """
    Fetch current weather data for a given city using the OpenWeather API.

    Args:
        city (str): Name of the city to fetch weather for.

    Returns:
        dict: Weather data including city name, temperature, description, and icon.
              If an error occurs, returns a dictionary with an 'error' key.
    """
    params = {"q": city, "appid": API_KEY, "units": "metric", "lang": "en"}
    response = requests.get(BASE_URL, params=params)
    data = response.json()

    if response.status_code != 200:
        return {"error": data.get("message", "Unknown error")}

    # Format reponse containing the relevant weather data
    weather_data = {
        "city": data["name"],
        "temp": data["main"]["temp"],
        "desc": data["weather"][0]["description"],
        "icon": data["weather"][0]["icon"],
    }

    # Append new weather data to history and save
    history = load_history()
    history.append(weather_data)
    save_history(history)

    return weather_data


@app.get("/history")
def get_history():
    """
    Retrieve the history of weather searches.

    Returns:
        list: List of weather data dictionaries previously fetched.
    """
    return load_history()
