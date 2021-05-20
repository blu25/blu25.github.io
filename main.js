hasLoaded = false;

function doLoad() {
  if (hasLoaded) {
    return;
  }
  document.getElementById("spinner").style.opacity = 0;
  [...document.getElementsByClassName("box")].forEach(x => x.style.opacity = 1);
  hasLoaded = true;
}

function doTransition(url) {
  [...document.getElementsByClassName("box")].forEach(x => x.style.opacity = 0);
  setTimeout(function(){window.location.replace(url);}, 1300);
  // setTimeout(function(){window.location.href = url;}, 1300);
}

// If things are taking too long, just load the page anyway. Better to have content
// that doesn't look great than nothing at all.
setTimeout(doLoad, 2000);