//

let my = {};
window.my = my;

my.version = '?v=16';
my.lineHeight = 28;
my.footerHeight = '192px';
my.qrCodeWidth = '25%';

my.shortStopLineNum = 5;
my.scrollYTopShort = 1;
my.scrollYTopLong = 1;
my.scrollPeriod = 0.1;
my.elineDelayPeriod = 30 * 0.5;

my.topRunCount = 0;
my.margin = 32;
my.overlayColors = ['rgba(255, 80, 80, 0.5)', 'rgba(255, 180, 60, 0.5)', 'rgba(60, 190, 70, 0.5)'];
// my.overlayColors = ['rgba(255, 80, 80, 1.0)', 'rgba(255, 180, 60, 1.0)', 'rgba(60, 190, 70, 1.0)'];
my.overlayColorsIndex = 0;

window.addEventListener('DOMContentLoaded', setup_main);

window.addEventListener('mouseup', function (event) {
  // console.log('mouseup clientX', event.clientX, 'clientY', event.clientY);
  // let zoomFactor = webFrame_getZoomFactor();
  console.log('mouseup window.scrollY', window.scrollY, 'my.scrollEnabled', my.scrollEnabled);
  // console.log('zoomFactor', zoomFactor);
  my.scrollEnabled = !my.scrollEnabled;
});

function setup_main() {
  // console.log('setup_scroll my', my);
  console.log('setup_scroll window.location.href', window.location.href);

  setup_dbase();

  // {
  //   ab = document.querySelector('.navbar-brand');
  //   aa = ab.querySelector('a');
  //   aa.innerHTML += ' ' + my.version;
  // }

  // click on navbar at top of page -> play_from_top_long
  let nv = document.querySelector('.navbar');
  nv.addEventListener('mouseup', function (event) {
    console.log('nv mouseup clientX', event.clientX, 'clientY', event.clientY);
    play_from_top_long();
  });
  my.navbar_div = nv;

  // remove all a links, except for poets.org
  rns = document.querySelectorAll('a');
  for (let index = 0; index < rns.length; index++) {
    let ent = rns[index];
    // console.log(index, ent.href);
    if (ent.href.endsWith('/index.html')) {
      // direct poets.org link in header to real site
      ent.href = 'https://poets.org/poem/let-america-be-america-again';
    } else {
      ent.remove();
    }
  }

  // click on langston's image -> play_from_top_toggle
  let ff = document.querySelector('.field .field--field_image');
  ff.addEventListener('mouseup', function (event) {
    console.log('ff mouseup clientX', event.clientX, 'clientY', event.clientY);
    // play_from_top_long();
    // play_from_top_short();
    play_from_top_toggle();
  });

  // click on "Let America Be Ameria" title at top of page -> play_from_top_short
  let pt = document.querySelector('.poem__title');
  pt.addEventListener('mouseup', function (event) {
    console.log('pt mouseup clientX', event.clientX, 'clientY', event.clientY);
    play_from_top_short();
  });

  let fi = document.querySelector('.field--field_image');
  my.authorImageDiv = fi;

  // remove "more by poet" block at end of page
  let mp = document.querySelector('#block-views-block-poems-more-by-poet');
  while (mp.firstChild) {
    mp.firstChild.remove();
  }

  // Duplicate image on right to bottom of page
  let bz = document.querySelector('#block-stanza-content');
  let bi = document.querySelector('#block-nodesidebarfields');
  bz.appendChild(bi.cloneNode(true));

  // remove some elements
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

  // my.fieldBody is used to attach overlay hilighting current line
  let ar = document.querySelector('article');
  let fb = ar.querySelector('.field--body');
  my.fieldBody = fb.querySelector('p');

  // array of the line elements -> my.elines
  my.elines = ar.querySelectorAll('.long-line');

  my.elineIndex = 0;
  {
    // let period = 2.0;
    let period = 1.75;
    my.eline_timer = new PeriodTimer({ period });
  }
  {
    let period = my.scrollPeriod;
    my.scroll_timer = new PeriodTimer({ period, timer_event: scroll_event });
  }

  window.scrollTo(0, my.scrollYTopShort);

  start_scroll_pause();

  send_current_line();
}

function scroll_event() {
  my.lastScrollY = window.scrollY;
  if (my.focusEnabled) {
    focus_line();
    return;
  } else {
    check_line_hilite();
  }
  if (!my.scrollEnabled) {
    // console.log('scroll_event !my.scrollEnabled', my.scroll_pause_timer.lapse());
    return;
  }
  window.scrollBy(0, 1);
  let shortStop = !my.full_read_enabled && my.elineIndex == my.shortStopLineNum - 1;
  // console.log('scroll_event shortStop', shortStop, my.scroll_pause_timer.lapse());
  if (shortStop) {
    console.log('scroll_event shortStop', shortStop, my.scroll_pause_timer.lapse());
    pause_short_read();
  }
}

// pause at bottom of screen before playing from top
function pause_short_read() {
  console.log('pause_short_read my.paused_at_bottom', my.paused_at_bottom);
  if (my.paused_at_bottom) {
    // my.scrollEnabled is 1 after 5 sec delay
    if (my.scrollEnabled) {
      play_from_top_short();
      my.paused_at_bottom = 0;
    }
    return;
  }
  my.paused_at_bottom = 1;
  // sets my.scrollEnabled = 0, and start 5 sec delay
  start_scroll_pause();
}

// Keep up last hilite until starting from the top
function check_line_hilite() {
  // when we are on the last line
  // and it is off the top of screen
  // then stay on the last line
  if (my.last_elineIndex == my.elines.length - 1) {
    // let rt = my.elines[0].getBoundingClientRect();
    let { rt } = clientRect_elineIndex(0);
    if (rt.y < 0) {
      my.elineIndex = my.last_elineIndex;
    }
  }
  let diff = my.last_elineIndex != my.elineIndex;
  if (!diff) {
    console.log(
      '!diff last_elineIndex',
      my.last_elineIndex,
      'elineIndex',
      my.elineIndex,
      'lapse',
      my.eline_timer.lapse()
    );
  }
  // let el = my.elines[my.elineIndex];
  // let rt = el.getBoundingClientRect();
  let { el, rt } = clientRect_elineIndex(my.elineIndex);
  overlayElement(el);
  // when on last line, keep client updated
  if (my.elineIndex == my.last_elineIndex) {
    send_current_line();
  }
  if (!my.eline_timer.check()) {
    // console.log('check_line_hilite !my.eline_timer.check()', my.eline_timer.lapse());
    return;
  }
  // delay new hilite until line is in upper half of window
  let midWindow = window.innerHeight / 2;
  // take off 10 pixels for bottom status area
  let bottomWindow = window.innerHeight - 10;
  if (rt.y > midWindow) {
    // console.log('delayed my.elineIndex', my.elineIndex);
    my.eline_timer.restart();
    return;
  }
  // if line is off top screen
  // search down for line that's on at mid window point
  if (rt.y < 0) {
    // console.log('check_line_hilite rt.y < 0', rt.y < 0, 'my.elineIndex', my.elineIndex);
    // Hilite scroll off top of screen
    let lastLine = my.elineIndex;
    my.offscreen = 1;
    let fullScan = 0;
    let wrapScan = 0;
    let n = my.elines.length;
    // Find the first line in the center of the window
    while (rt.y < midWindow) {
      my.elineIndex = (my.elineIndex + 1) % my.elines.length;
      // console.log('check_line_hilite next my.elineIndex', my.elineIndex);
      // el = my.elines[my.elineIndex];
      // rt = el.getBoundingClientRect();
      rt = clientRect_elineIndex(my.elineIndex).rt;
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
    // console.log('check_line_hilite while end my.elineIndex', my.elineIndex);
    // console.log('check_line_hilite fullScan', fullScan, 'wrapScan', wrapScan);
    if (wrapScan && my.scrollEnabled) {
      play_from_top_short();
      start_scroll_pause();
      // my.scrollEnabled now 0
    }
  } else {
    my.offscreen = 0;
  }
  if (!my.scrollEnabled) {
    return;
  }
  advance_next_line();
}

function clientRect_elineIndex(index) {
  let el = my.elines[index];
  let rt = el.getBoundingClientRect();
  return { el, rt };
}
