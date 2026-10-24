---
title: iColtrane
primary: "#ff5ccf"
secondary: "#8fe3e0"
description: "A MIDI instrument for exploring John Coltrane's circle of fifths, built with Arduino, Max/MSP and Reason."
image: /images/og/icoltrane.jpg

# Used for this project's tile on the home page
cover: icoltrane
caption: MIDI instrument for exploring John Coltrane's circle of fifths diagram

tiles:
  - text: A digital musical instrument that can play John Coltrane's circle of fifths tone circle and allow musicians to physically explore an otherwise purely theoretical concept. Each of the curved silicone buttons corresponds to a different note in the tone circle.

  - photo: ic-lights
    size: w2
    alt: "A hand pressing iColtrane's glowing silicone keys in the dark"

  - youtube: n71PW6OKUXw
    size: w2 h2

  - icon: coltrane.png
    alt: "John Coltrane's hand-drawn circle of fifths diagram"
    text: Coltrane's circle is a way to show how notes and scales relate to each other
    link: https://roelhollander.eu/en/blog-saxophone/Coltrane-Tone-Circle/

  - photo: ic-sensors
    alt: "Inside iColtrane: pressure sensors on the underside of the lid, wired to an Arduino in a wooden box"

  - icon: touch.svg
    text: 15 pressure sensors measure how hard the player presses down

  - icon: synth.svg
    text: Max/MSP reads the raw sensor data and converts it to a MIDI signal

  - icon: audio.svg
    text: A Reason patch turns that signal into actual sound output

  - photo: ic-assembly
    size: w2
    alt: "The finished iColtrane: a white box with a curved row of keys and three blue buttons"

  - icon: piano.svg
    text: Build chords for the large keys using three blue buttons at the top
---
