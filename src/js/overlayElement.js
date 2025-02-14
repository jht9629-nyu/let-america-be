//

function overlayElement(elt) {
  // Create a new div element for the overlay
  if (!my.overlay) {
    my.overlay = document.createElement('div');
    my.fieldBody.appendChild(my.overlay);
    my.overlay.style.position = 'fixed';
    my.overlay.style.pointerEvents = 'none'; // Ensures the overlay doesn't block clicks
  }
  if (!my.cloned) {
    my.cloned = elt.cloneNode(true);
    my.fieldBody.appendChild(my.cloned);
    my.cloned.style.position = 'fixed';
    my.cloned.style.pointerEvents = 'none';
  }
  my.overlay.style.backgroundColor = my.overlayColors[my.overlayColorsIndex];
  my.cloned.innerHTML = elt.innerHTML;

  let { x, y, width, height } = elt.getBoundingClientRect();
  x -= my.margin;
  width += my.margin;
  // !!@ some text lines go beyond rect

  let x1 = 0;
  let w1 = window.innerWidth;
  my.overlay.style.top = `${y}px`;
  // my.overlay.style.left = `${x}px`;
  // my.overlay.style.width = `${width}px`;
  my.overlay.style.left = `${x1}px`;
  my.overlay.style.width = `${w1}px`;
  my.overlay.style.height = `${height}px`;

  my.cloned.style.top = `${y}px`;
  my.cloned.style.left = `${x}px`;
  my.cloned.style.width = `${width}px`;
  my.cloned.style.height = `${height}px`;
}
globalThis.overlayElement = overlayElement;

// https://chatgpt.com/
// create a DOM element that overlays a transparent color at a specified location on the window
// overlay a transparent color at a specified location on the window
function overlayAtPosition({ x, y, width, height }) {
  // Create a new div element for the overlay
  // ...
}

function createStatusDiv() {
  if (!my.statusDiv) {
    let w = window.innerWidth;
    let h = 32;

    let x = window.innerWidth - w;
    let y = window.innerHeight - h;
    let width = w;
    let height = h;

    my.statusDiv = document.createElement('div');
    // document.body.appendChild(my.statusDiv);
    // my.topBox.appendChild(my.statusDiv);

    // my.statusDiv.style.top = `${y}px`;
    my.statusDiv.style.left = `${x}px`;
    my.statusDiv.style.width = `${width}px`;
    my.statusDiv.style.height = `${height}px`;

    my.statusDiv.style.zIndex = 10;
    my.statusDiv.style.backgroundColor = 'black';
    my.statusDiv.style.color = 'white';
    my.statusDiv.style.fontSize = `${h}px`;
    // my.statusDiv.style.textAlign = 'right';
    my.statusDiv.textContent = 'Starting...';

    console.log('window.scrollY', window.scrollY);
    console.log('my.statusDiv', my.statusDiv);
  }
}
globalThis.createStatusDiv = createStatusDiv;
