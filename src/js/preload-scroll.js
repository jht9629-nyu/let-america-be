//
// const { webFrame } = require('electron');
// require('./setup_responder.cjs');
// require('./overlayElement.cjs');
// require('./mbase_report_status.cjs');

let my = {};
window.my = my;

my.lineHeight = 28;
my.footerHeight = '192px';
my.qrCodeWidth = '25%';

my.shortStopLineNum = 5;

// my.scrollYTopShort = 670;
// my.scrollYTopShort = 760;
// my.scrollYTopShort = 580;
// my.scrollYTopShort = 610;
my.scrollYTopShort = 0;

// my.scrollYTopLong = 616;
// my.scrollYTopLong = 460;
my.scrollYTopLong = 0;

// my.scrollPeriod = 0.1; // * 0.75;
// my.elineDelayPeriod = 30; // * 0.75;

// my.scrollPeriod = 0.1 * 0.75;
// my.elineDelayPeriod = 30 * 0.75;

my.scrollPeriod = 0.1;
my.elineDelayPeriod = 30 * 0.5;

my.zoomFactorShort = 1.0;
my.zoomFactorLong = 1.0;
// my.zoomFactorShort = 1.4;
// my.zoomFactorLong = 2.18;

my.gcCount = 0;
my.margin = 32;
my.overlayColors = ['rgba(255, 80, 80, 0.5)', 'rgba(255, 180, 60, 0.5)', 'rgba(60, 190, 70, 0.5)'];
// my.overlayColors = ['rgba(255, 80, 80, 1.0)', 'rgba(255, 180, 60, 1.0)', 'rgba(60, 190, 70, 1.0)'];
my.overlayColorsIndex = 0;

// setup_responder();

window.addEventListener('DOMContentLoaded', () => {
  // setTimeout(setup_scroll, 1000);
  // webFrame_setZoomFactor(my.zoomFactorShort);
  // // webFrame_setZoomFactor(my.zoomFactorLong);
  // let zoomFactor = webFrame_getZoomFactor();
  // console.log('zoomFactor', zoomFactor);
  // // mbase_report_status({ msg: 'Here!' });

  setup_scroll();
});

window.addEventListener('mouseup', function (event) {
  // console.log('mouseup clientX', event.clientX, 'clientY', event.clientY);
  let zoomFactor = webFrame_getZoomFactor();
  console.log('mouseup window.scrollY', window.scrollY, 'my.scrollEnabled', my.scrollEnabled);
  console.log('zoomFactor', zoomFactor);
  my.scrollEnabled = !my.scrollEnabled;
});

function setup_scroll() {
  //
  console.log('setup_scroll my', my);
  console.log('setup_scroll window.location.href', window.location.href);

  let ff = document.querySelector('.field .field--field_image');
  ff.addEventListener('mouseup', function (event) {
    console.log('ff mouseup clientX', event.clientX, 'clientY', event.clientY);
    // play_from_top_long();
    play_from_top_short();
  });

  let fi = document.querySelector('.field--field_image');
  my.authorImageDiv = fi;

  // remove more by poet block at end of page
  let mp = document.querySelector('#block-views-block-poems-more-by-poet');
  while (mp.firstChild) {
    mp.firstChild.remove();
  }

  // Duplicate image on right to bottom
  let bz = document.querySelector('#block-stanza-content');
  let bi = document.querySelector('#block-nodesidebarfields');
  bz.appendChild(bi.cloneNode(true));

  let be = document.querySelector('#block-poemadaysignupblock');
  be.remove();

  let nt = document.querySelector('.navbar-toggler');
  nt.remove();

  let pa = document.querySelector('.poem-actions--vertical');
  pa.remove();

  let pd = document.querySelector('.promo');
  pd.remove();

  let he = document.querySelector('.hero');
  he.remove();

  // let na = document.querySelector('.navbar');
  // na.remove();

  // let et = document.querySelector('.field--title');
  // let nb = document.querySelector('.navbar-brand');
  // nb.innerHTML = nb.textContent + '<br/>' + et.textContent;
  // nb.style.fontSize = 'xx-large';
  // my.topBox = nb;

  let ar = document.querySelector('article');
  let fb = ar.querySelector('.field--body');
  my.fieldBody = fb.querySelector('p');

  my.elines = ar.querySelectorAll('.long-line');

  my.elineIndex = 0;
  my.elineDelayCount = 0;

  let period = my.scrollPeriod * 1000;
  setInterval(scroll_track, period);

  window.scrollTo(0, my.scrollYTopShort);

  start_scroll_pause();

  send_current_line();
}

function scroll_track() {
  //
  my.lastScrollY = window.scrollY;

  check_scroll_pause();

  if (my.focusEnabled) {
    focus_line();
    return;
  } else {
    check_line_hilite();
  }

  if (!my.scrollEnabled) return;
  window.scrollBy(0, 1);

  let stopped = !my.full_read_enabled && my.elineIndex == my.shortStopLineNum - 1;
  if (stopped) {
    console.log('scroll_track stopped', stopped);
    // play_from_top();
    pause_at_bottom();
  }

  // the author image moving off top of screen triggers play from top
  // in short read, when view is two column,
  // For Langstons' "America..." this is line 8 of poem
  // in full read the image is below the last line of poem

  // let rt = my.authorImageDiv.getBoundingClientRect();
  // if (rt.y < 0 || stopped) {
  //   console.log('pause_at_bottom rt.y < 0', my.paused_at_bottom);
  //   // play_from_top();
  //   pause_at_bottom();
  // }
}

// pause at bottom of screen before playing from top
//
function pause_at_bottom() {
  console.log('pause_at_bottom my.paused_at_bottom', my.paused_at_bottom);
  if (my.paused_at_bottom) {
    check_scroll_pause();
    if (my.scrollEnabled) {
      play_from_top_short();
      my.paused_at_bottom = 0;
    }
    return;
  }
  my.paused_at_bottom = 1;
  start_scroll_pause();
}

function check_line_hilite() {
  //
  // Keep up last hilite until starting from the top
  if (my.last_elineIndex == my.elines.length - 1) {
    let rt = my.elines[0].getBoundingClientRect();
    if (rt.y < 0) {
      my.elineIndex = my.last_elineIndex;
    }
  }
  let el = my.elines[my.elineIndex];
  let rt = el.getBoundingClientRect();
  overlayElement(el);
  // when on last line, keep client updated
  if (my.elineIndex == my.last_elineIndex) {
    send_current_line();
  }
  my.elineDelayCount = (my.elineDelayCount + 1) % my.elineDelayPeriod;
  if (my.elineDelayCount != 1) return;
  // delay new hilite until line is in upper half of window
  let midWindow = window.innerHeight / 2;
  if (rt.y > midWindow) {
    // console.log('delayed my.elineIndex', my.elineIndex);
    my.elineDelayCount = 0;
    return;
  }
  // if line is off top screen
  // search down for line that's on at mid window point
  if (rt.y < 0) {
    console.log('check_line_hilite rt.y < 0', rt.y < 0, 'my.elineIndex', my.elineIndex);
    // Hilite scroll off top of screen
    let lastLine = my.elineIndex;
    my.offscreen = 1;
    let fullScan = 0;
    let wrapScan = 0;
    let n = my.elines.length;
    while (rt.y < midWindow) {
      my.elineIndex = (my.elineIndex + 1) % my.elines.length;
      // console.log('check_line_hilite next my.elineIndex', my.elineIndex);
      el = my.elines[my.elineIndex];
      rt = el.getBoundingClientRect();
      if (lastLine > my.elineIndex) {
        wrapScan = 1;
        break;
      }
      n--;
      if (n < 0) {
        fullScan = 1;
        break;
      }
    }
    console.log('check_line_hilite while end my.elineIndex', my.elineIndex);
    console.log('check_line_hilite fullScan', fullScan, 'wrapScan', wrapScan);
    if (wrapScan) {
      play_from_top();
    }
  } else {
    my.offscreen = 0;
  }
  if (!my.scrollEnabled) {
    return;
  }
  advance_next_line();
}

// Advance to the next line
function advance_next_line() {
  delta_next_line(1);
}

function line_next() {
  delta_next_line(1);
  my.scrollEnabled = 0;
  my.focusEnabled = 1;
}
globalThis.line_next = line_next;

function line_previous() {
  delta_next_line(-1);
  my.scrollEnabled = 0;
  my.focusEnabled = 1;
}

function line_continue() {
  my.scrollEnabled = 1;
  my.focusEnabled = 0;
  my.elineDelayCount = 0;
}

function focus_line() {
  //
  let el = my.elines[my.elineIndex];
  let rt = el.getBoundingClientRect();
  overlayElement(el);

  let midWindow = window.innerHeight / 2;
  if (rt.y < midWindow || rt.y > midWindow + my.lineHeight) {
    let diff = rt.y - midWindow;
    window.scrollBy(0, diff * 0.1);
  }

  send_current_line();
}

function delta_next_line(delta) {
  //
  my.last_elineIndex = my.elineIndex;
  my.elineIndex = (my.elineIndex + delta + my.elines.length) % my.elines.length;
  my.overlayColorsIndex = (my.overlayColorsIndex + delta + my.overlayColors.length) % my.overlayColors.length;

  if (my.elineIndex) {
    send_current_line();
  }
}

function check_scroll_pause() {
  if (!my.scrollPauseStart) return;
  //
  let now = Date.now();
  let nowDiff = now - my.scrollPauseStart;
  if (nowDiff > my.scrollPausePeriod) {
    my.scrollEnabled = 1;
    my.scrollPauseStart = 0;
  }
}

// my.overlayColors = ['rgba(255, 205, 50, 1.0)', 'red', 'green'];
// my.overlayColors = ['rgba(255, 205, 50, 1.0)', 'rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)'];
// Apple Finder window close-hide-max
// let my.scrollYTop = 465;
// let my.scrollYTop = 635;
// window.innerWidth 520
// my.lastScrollY;

function webFrame_setZoomFactor(n) {
  document.body.style.zoom = n;
}

function webFrame_getZoomFactor() {
  return parseFloat(document.body.style.zoom);
}

function start_scroll_pause() {
  my.scrollEnabled = 0;
  my.scrollPausePeriod = 5000;
  my.scrollPauseStart = Date.now();
}

function send_current_line() {
  // console.log('send_current_line');
  if (!my.elines) return;
  let eln = my.elines[my.elineIndex];
  let num = my.elineIndex + 1;
  let text = eln.textContent;
  let color = my.overlayColors[my.overlayColorsIndex];
  if (!my.offscreen) {
    send_lineInfo({ num, text, color });
  }
}

// lineInfo = { num, text }
function send_lineInfo(lineInfo) {
  // console.log('send_lineInfo lineInfo', lineInfo);
  // ipcRenderer.send('set-line-info', lineInfo);
}

function play_from_top_short() {
  console.log('play_from_top_short ', my.full_read_enabled);
  if (my.full_read_enabled) {
    webFrame_setZoomFactor(my.zoomFactorShort);
  }
  play_from_top(my.scrollYTopShort);
  my.full_read_enabled = 0;
}

function play_from_top_long() {
  console.log('play_from_top_long ', my.full_read_enabled);
  if (!my.full_read_enabled) {
    webFrame_setZoomFactor(my.zoomFactorLong);
  }
  play_from_top(my.scrollYTopLong);
  my.full_read_enabled = 1;
}

function play_from_top(ytop) {
  //
  // gc();
  my.gcCount++;
  console.log('my.gcCount', my.gcCount);

  window.scrollTo(0, ytop);

  start_scroll_pause();

  my.elineIndex = 0;
  my.elineDelayCount = 0;
  my.overlayColorsIndex = (my.overlayColorsIndex + 1) % my.overlayColors.length;

  send_current_line();
}
