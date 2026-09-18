
# 🌍 PlanetPulse

PlanetPulse is a simple carbon footprint tracker that helps users record everyday activities and estimate their CO₂ impact.

## 🚀 Features

- Add daily activities
- Calculate estimated CO₂ emissions
- View total carbon footprint
- Set a weekly CO₂ target
- Track weekly progress
- Get a nudge when the weekly target is exceeded
- View activity history
- Filter activities by type
- Delete activities
- Data is saved in the browser

## 📊 Emission Factors

| Activity | Emission Factor |
|---|---:|
| Flight | 0.20 kg/km |
| Bus | 0.06 kg/km |
| Plant | 0.25 kg/plant |
| Electricity | 0.80 kg/kWh |
| Veg Meal | 0.50 kg/meal |
| Non-Veg Meal | 2.00 kg/meal |

## 🧮 CO₂ Calculation

CO₂ emission is calculated as:

**Emission = Activity Quantity × Emission Factor**

## 🎯 Decision Points

### DP1 — Nudges
When the weekly target is exceeded, PlanetPulse displays a warning message suggesting the user choose a lower-carbon option for their next activity.

### DP2 — Absurd Input
Obviously unrealistic quantities above 10,000 are rejected and the user is asked to enter a realistic value.

### DP3 — The Week
The weekly progress calculation uses Monday as the start of the week.

## 🛠️ Technologies

- HTML
- CSS
- JavaScript
- Browser Local Storage
- GitHub Pages

## 🌐 Live Demo

https://piyushkumar1307-h.github.io/PlanetPulse/

## 🤖 AI Use

AI assistance was used during development for guidance, debugging, feature implementation, and improving the project structure and documentation.
