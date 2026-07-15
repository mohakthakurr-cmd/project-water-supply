CREATE TABLE IF NOT EXISTS wards (
    ward_id INTEGER PRIMARY KEY,
    area_name TEXT NOT NULL,
    zone TEXT NOT NULL,
    supply_days TEXT NOT NULL,
    supply_time TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS complaints (
    complaint_id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_name TEXT NOT NULL,
    ward_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    submitted_on TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tanks (
    tank_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tank_name TEXT NOT NULL,
    ward_id INTEGER NOT NULL,
    water_level INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS alerts (
    alert_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ward_id INTEGER NOT NULL,
    alert_message TEXT NOT NULL
);