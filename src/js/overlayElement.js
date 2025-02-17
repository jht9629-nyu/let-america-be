//

function overlay_element(elt) {
  // Create a new div element for the overlay
  if (!my.overlayBack) {
    my.overlayBack = document.createElement('div');
    my.fieldBody.prepend(my.overlayBack);
    // my.fieldBody.appendChild(my.overlayBack);
    my.overlayBack.style.position = 'fixed';
    my.overlayBack.style.pointerEvents = 'none'; // Ensures the overlay doesn't block clicks
    my.overlayBack.style.backgroundColor = 'white';
  }
  if (!my.overlay) {
    my.overlay = document.createElement('div');
    // my.fieldBody.appendChild(my.overlay);
    my.overlayBack.appendChild(my.overlay);
    my.overlay.style.position = 'fixed';
    my.overlay.style.pointerEvents = 'none'; // Ensures the overlay doesn't block clicks
  }
  if (!my.cloned) {
    my.cloned = elt.cloneNode(true);
    // my.fieldBody.appendChild(my.cloned);
    my.overlayBack.appendChild(my.cloned);
    my.cloned.style.position = 'fixed';
    my.cloned.style.pointerEvents = 'none';
  }
  my.overlay.style.backgroundColor = overlay_element_color();

  // create_word_spans(elt);

  my.cloned.innerHTML = elt.innerHTML;

  let { x, y, width, height } = elt.getBoundingClientRect();
  x -= my.margin;
  width += my.margin;
  // !!@ some text lines go beyond rect

  let x1 = 0;
  let w1 = window.innerWidth;

  my.overlayBack.style.top = `${y}px`;
  // my.overlayBack.style.left = `${x}px`;
  // my.overlayBack.style.width = `${width}px`;
  my.overlayBack.style.left = `${x1}px`;
  my.overlayBack.style.width = `${w1}px`;
  my.overlayBack.style.height = `${height}px`;

  my.overlay.style.top = `${y}px`;
  my.overlay.style.left = `${x1}px`;
  my.overlay.style.width = `${w1}px`;
  my.overlay.style.height = `${height}px`;

  my.cloned.style.top = `${y}px`;
  my.cloned.style.left = `${x}px`;
  my.cloned.style.width = `${width}px`;
  my.cloned.style.height = `${height}px`;
}

// Expand the words on the current line with individual color background
function create_word_spans() {
  if (!my.full_read_enabled) {
    return;
  }
  if (!my.spans_expanded) {
    my.spans_expanded = {};
    my.spanColorIndex = 0;
    my.paraColorIndex = 0;
  }
  color_para();
  let index = my.elineIndex;
  let spec = my.spans_expanded[index];
  let { el, rt } = clientRect_elineIndex(index);
  let spans = el.querySelectorAll('span');
  if (spans.length > 0) {
    // words already expanded into spans - adjust background color
    let spanColorIndex = spec.colorIndex;
    for (let sindex = 0; sindex < spans.length; sindex++) {
      let span = spans[sindex];
      span.style.backgroundColor = overlay_element_color(spanColorIndex);
      spanColorIndex++;
    }
    return;
  }
  // Expand words at current line into spans and background color
  let spanColorIndex = my.spanColorIndex;
  let firstColorIndex = spanColorIndex;
  words = el.innerHTML.split(' ');
  el.innerHTML = '';
  for (let index = 0; index < words.length; index++) {
    let nn = document.createElement('span');
    nn.innerHTML = words[index] + ' ';
    nn.style.backgroundColor = overlay_element_color(spanColorIndex);
    el.appendChild(nn);
    spanColorIndex++;
  }
  my.spanColorIndex++;
  my.spans_expanded[index] = { colorIndex: firstColorIndex };
}

function color_para() {
  let index = my.elineIndex;
  let { el, rt } = clientRect_elineIndex(index);
  let parent = el.parentNode;
  if (parent.style.backgroundColor) return;
  parent.style.backgroundColor = overlay_element_color(my.paraColorIndex);
  my.paraColorIndex++;
}

function clear_word_styles() {
  for (let index = 0; index < my.elines.length; index++) {
    let { el, rt } = clientRect_elineIndex(index);
    let spans = el.querySelectorAll('span');
    if (spans.length <= 0) continue;
    for (let sindex = 0; sindex < spans.length; sindex++) {
      let span = spans[sindex];
      span.style.backgroundColor = '';
    }
    let parent = el.parentNode;
    parent.style.backgroundColor = '';
  }
}

function overlay_element_color(index) {
  if (index == undefined) index = my.overlayColorsIndex;
  let n = my.overlayColors.length;
  return my.overlayColors[index % n];
}

function overlay_element_nextColor(delta) {
  if (!delta) delta = 0;
  let no = my.overlayColors.length;
  my.overlayColorsIndex = (my.overlayColorsIndex + delta + no) % no;
}

// https://chatgpt.com/
// create a DOM element that overlays a transparent color at a specified location on the window
// overlay a transparent color at a specified location on the window
function overlayAtPosition({ x, y, width, height }) {
  // Create a new div element for the overlay
  // ...
}
