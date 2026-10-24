---
# PLACEHOLDER: everything below is a first draft to edit.
title: TrainTime
primary: "#ffcf7a"
secondary: "#2b2724"
secondary_text: "#f3ece2"
description: "An battery-powered e-ink display that shows information about Seattle's light rail and buses (with a live train map), traffic, and weather."
image: /images/og/traintime.jpg

# Used for this project's tile on the home page
cover: traintime
caption: E-ink display that shows info about trains, traffic, and weather.

links:
  - label: Source on GitHub
    url: https://github.com/blu25/transit-display

tiles:
  - text: A battery-powered e-ink display for quick, digestible travel information. Designed to answer the most common questions when leaving the house (When's the next train coming? How bad is traffic? do I need an umbrella?).

  - photo: tt-happy
    size: w2
    alt: "TrainTime's e-ink screen showing light rail arrivals, the weather and a map of trains"

  - icon: esp32.svg
    text: Powered by an ESP32-S3 and built off of the Seeed Studio DIY E-Ink kit
    link: https://www.seeedstudio.com/TRMNL-7-5-Inch-OG-DIY-Kit-p-6481.html

  - photo: tt-map
    size: h2
    alt: "TrainTime's e-ink screen showing light rail arrivals, the weather and a map of trains"

  - icon: battery.svg
    text: 17-day battery life through API and screen update optimizations

  - icon: paint.svg
    text: Targeted partial refreshes only affect changed pixels and reduce E-ink flicker

  - icon: seattle.svg
    text: Vignelli-inspired map shows the live location of all trains on the Seattle Link Light Rail system
    link: https://www.nytransitmuseum.org/vignelli/

---
