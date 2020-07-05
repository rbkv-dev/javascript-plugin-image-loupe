let LOUPE_ZOOM_MIN = 1;
let LOUPE_ZOOM_MAX = 5;
let LOUPE_ZOOM_DIFF = 0.5;
let LOUPE_ZOOM = 2;

let LOUPE_SIZE_MIN = 80;
let LOUPE_SIZE_MAX = 220;
let LOUPE_SIZE_DIFF = 10;
let LOUPE_SIZE = 100;

let keyCodeSize = 83;
let keyCodeZoom = 90;
let keySizePressed = false;
let keyZoomPressed = false;

var x0 = 0;
var y0 = 0;
var x = 0;
var y = 0;
var width = 0;
var height = 0;

var styleElem = document.createElement("style");

styleElem.innerHTML = `
.loupe-container {
  width: ${LOUPE_SIZE}px;
  height: ${LOUPE_SIZE}px;
  overflow: hidden;
  display: none;
  position: absolute;
  background-color: #fff;
  border: 2px solid gray;
  border-radius: 5px;
}
.loupe-img {
  position: absolute;
  margin: 0px;
  padding: 0px;
}`;

var loupeContainer = document.createElement("div");
loupeContainer.className = "loupe-container";

var loupe = document.createElement("img");
loupe.className = "loupe-img";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img[loupe]").forEach((img) => {
    img.addEventListener("mouseover", setInitialPosition);
  });
  window.addEventListener("mousemove", setCurrentPosition);
  window.addEventListener("keydown", keydownEvent);
  window.addEventListener("keyup", keyupEvent);

  loupeContainer.appendChild(loupe);
  document.body.append(loupeContainer);
  document.head.appendChild(styleElem);
});

const setInitialPosition = (e) => {
  width = e.target.clientWidth;
  height = e.target.clientHeight;
  x0 = e.target.getBoundingClientRect().x;
  y0 = e.target.getBoundingClientRect().y;

  loupe.style.left = `${LOUPE_SIZE * LOUPE_ZOOM}px`;
  loupe.style.top = `${LOUPE_SIZE * LOUPE_ZOOM}px`;
  loupe.style.width = `${width * LOUPE_ZOOM}px`;
  loupe.style.height = `${height * LOUPE_ZOOM}px`;
  loupe.setAttribute("src", `${e.target.getAttribute("src")}`);
  loupeContainer.style.display = "block";

  setLoupe(e);
};

const setCurrentPosition = (e) => {
  if (x < 0 || y < 0 || x > width || y > height) {
    enableScroll();
    loupeContainer.style.display = "none";
  } else {
    disableScroll();
    setLoupe(e);
  }
};

let changeLoupeSize = (e) => {
  if (e.deltaY < 0) {
    LOUPE_SIZE =
      LOUPE_SIZE + LOUPE_SIZE_DIFF >= LOUPE_SIZE_MIN &&
      LOUPE_SIZE + LOUPE_SIZE_DIFF <= LOUPE_SIZE_MAX
        ? LOUPE_SIZE + LOUPE_SIZE_DIFF
        : LOUPE_SIZE;
  } else if (e.deltaY > 0) {
    LOUPE_SIZE =
      LOUPE_SIZE - LOUPE_SIZE_DIFF >= LOUPE_SIZE_MIN &&
      LOUPE_SIZE - LOUPE_SIZE_DIFF <= LOUPE_SIZE_MAX
        ? LOUPE_SIZE - LOUPE_SIZE_DIFF
        : LOUPE_SIZE;
  }
  loupeContainer.style.width = `${LOUPE_SIZE}px`;
  loupeContainer.style.height = `${LOUPE_SIZE}px`;
  setLoupe(e);
};

let changeLoupeZoom = (e) => {
  if (e.deltaY < 0) {
    LOUPE_ZOOM =
      LOUPE_ZOOM + LOUPE_ZOOM_DIFF >= LOUPE_ZOOM_MIN &&
      LOUPE_ZOOM + LOUPE_ZOOM_DIFF <= LOUPE_ZOOM_MAX
        ? LOUPE_ZOOM + LOUPE_ZOOM_DIFF
        : LOUPE_ZOOM;
  } else if (e.deltaY > 0) {
    LOUPE_ZOOM =
      LOUPE_ZOOM - 0.5 >= LOUPE_ZOOM_MIN && LOUPE_ZOOM - 0.5 <= LOUPE_ZOOM_MAX
        ? LOUPE_ZOOM - 0.5
        : LOUPE_ZOOM;
  }
  loupe.style.left = `${LOUPE_SIZE * LOUPE_ZOOM}px`;
  loupe.style.top = `${LOUPE_SIZE * LOUPE_ZOOM}px`;
  loupe.style.width = `${width * LOUPE_ZOOM}px`;
  loupe.style.height = `${height * LOUPE_ZOOM}px`;
  setLoupe(e);
};

let keydownEvent = ({ keyCode }) => {
  disableScroll();
  if (keyCode == keyCodeSize && !keySizePressed) {
    keySizePressed = true;
    window.addEventListener("wheel", changeLoupeSize);
  }
  if (keyCode == keyCodeZoom && !keyZoomPressed) {
    keyZoomPressed = true;
    window.addEventListener("wheel", changeLoupeZoom);
  }
};

let keyupEvent = ({ keyCode }) => {
  enableScroll();
  if (keyCode == keyCodeSize && keySizePressed) {
    keySizePressed = false;
    window.removeEventListener("wheel", changeLoupeSize);
  }
  if (keyCode == keyCodeZoom && keyZoomPressed) {
    keyZoomPressed = false;
    window.removeEventListener("wheel", changeLoupeZoom);
  }
};

function setLoupe(e) {
  x = e.clientX - x0;
  y = e.clientY - y0;
  loupeContainer.style.left = `${e.pageX - LOUPE_SIZE / 2}px`;
  loupeContainer.style.top = `${e.pageY - LOUPE_SIZE / 2}px`;
  loupe.style.left = `${LOUPE_SIZE / 2 - x * LOUPE_ZOOM - 2}px`;
  loupe.style.top = `${LOUPE_SIZE / 2 - y * LOUPE_ZOOM - 2}px`;
}

// DISABLE SCROLLING
// https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36

var keys = { 37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1 };

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

var supportsPassive = false;
try {
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      },
    })
  );
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent =
  "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

function enableScroll() {
  window.removeEventListener("DOMMouseScroll", preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener("touchmove", preventDefault, wheelOpt);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}
