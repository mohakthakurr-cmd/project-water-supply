# Shimla Water Portal 💧

A full-stack student project that helps citizens check water-supply schedules, tank levels, maintenance alerts, tanker information, and submit complaints.

## Features

- Search water-supply schedules by ward number or area name
- Display emergency maintenance alerts
- Show tanker-supply information
- Display water-tank levels
- Classify tank status as Good, Medium, or Low using C++
- Submit complaints and feedback
- Store schedules, tank data, alerts, and complaints in an SQLite database

## Technologies Used

- HTML — website structure
- CSS — website design and responsive layout
- JavaScript — ward search and feedback request
- Python Flask — backend server
- SQLite / SQL — database
- C++ — tank water-level status calculation

## Project Structure

```text
SMARTWATER/
├── app.py
├── schema.sql
├── water_supply.cpp
├── water_status
├── water_supply.db
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js