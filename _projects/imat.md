---
title: iMat
primary: "#4d8dff"
secondary: "#ffd166"
description: "An interactive floor projection that tracks people with a Kinect and reacts to brain activity."
image: /images/og/imat.jpg

# Used for this project's tile on the home page
cover: imat
caption: Interactive floor projection that adapts to brain activity

tiles:
  - text: An interactive floor projection built as a NuVu Studio project. It tracks people's locations and displays their "shadows" on the ground, where they can play with the various toys the iMat has to offer.

  - vimeo: 35295607
    size: w2 h2

  - icon: code.svg
    text: Written in Processing

  - photo: im-play
    size: w2
    alt: "People walking across iMat's colorful floor projection in a studio"

  - icon: camera.svg
    text: A Kinect generates a depth map of the people in the iMat's space

  - icon: target.svg
    text: OpenCV converts the map into blobs, which is used to track position

  - icon: brain.svg
    text: An EEG brain wave reader is used to change how toys behave

  - icon: paint.svg
    text: The paint toy's color is modulated by the amount of brain activity
---
