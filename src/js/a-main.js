//

let my = {};
window.my = my;

my.version = '?v=29';
my.lineHeight = 28;
my.footerHeight = '192px';
my.qrCodeWidth = '25%';

my.paraColorIndex = -1;
my.nextState = 0;
my.state_play_from_top_short = 'state_play_from_top_short';

my.shortStopLineNum = 5;
// on iphone window.scrollTo(0, 0) sometimes fails
// non-zero seems to help make scroll to top consistent
my.scrollYTopShort = 1;
my.scrollYTopLong = 1;
my.scrollPeriod = 0.1;

my.topRunCount = 0;
my.margin = 32;
// red, green, gold
my.overlayColors = ['rgba(255, 80, 80, 0.25)', 'rgba(60, 190, 70, 0.5)', 'rgba(255, 180, 60, 0.5)'];
// my.overlayColors = ['rgba(255, 80, 80, 0.25)', 'rgba(255, 180, 60, 0.5)', 'rgba(60, 190, 70, 0.5)'];
my.overlayColorsIndex = 0;

window.addEventListener('DOMContentLoaded', setup_main);

window.addEventListener('mouseup', function (event) {
  console.log('window mouseup event', event);
  console.log('window mouseup event.target', event.target);
  // console.log('mouseup clientX', event.clientX, 'clientY', event.clientY);
  // let zoomFactor = webFrame_getZoomFactor();
  if (event.target.nodeName !== 'BUTTON') {
    my.scrollEnabled = !my.scrollEnabled;
    console.log('window mouseup window.scrollY', window.scrollY, 'my.scrollEnabled', my.scrollEnabled);
  }
  // console.log('zoomFactor', zoomFactor);
});

function setup_main() {
  // console.log('setup_scroll my', my);
  console.log('setup_scroll window.location.href', window.location.href);

  setup_dbase();

  {
    let ab = document.querySelector('.navbar-brand');
    let bb = document.createElement('button');
    bb.innerHTML = 'Comment';
    bb.addEventListener(
      'mouseup',
      function (event) {
        event.preventDefault();
        console.log('Comment mouseup  ');
      },
      { capture: true }
    );
    ab.prepend(bb);

    bb = document.createElement('button');
    bb.innerHTML = 'Read';
    bb.addEventListener(
      'mouseup',
      function (event) {
        event.preventDefault();
        console.log('Read mouseup  ');
        issue_action_full_read();
        // dbase.issue_action('action_full_read', 'item');
      },
      { capture: true }
    );
    ab.prepend(bb);
  }
  // click on navbar at top of page -> play_from_top_long
  // let nv = document.querySelector('.navbar');
  // nv.addEventListener('mouseup', function (event) {
  //   console.log('nv mouseup clientX', event.clientX, 'clientY', event.clientY);
  //   play_from_top_long();
  // });
  // my.navbar_div = nv;

  // remove most a links, re-direct for poets.org and langston-hughes to source
  rns = document.querySelectorAll('a');
  for (let index = 0; index < rns.length; index++) {
    let ent = rns[index];
    // console.log(index, ent.href);
    if (ent.href.endsWith('/index.html')) {
      // direct poets.org link in header to real site
      ent.href = 'https://poets.org/poem/let-america-be-america-again';
    } else if (ent.href.endsWith('/langston-hughes.html')) {
      ent.href = 'https://poets.org/poet/langston-hughes';
    } else {
      ent.remove();
    }
  }

  // click on langston's image -> play_from_top_toggle
  let ff = document.querySelector('.field .field--field_image');
  ff.addEventListener('mouseup', function (event) {
    console.log('ff mouseup clientX', event.clientX, 'clientY', event.clientY);
    // play_from_top_long();
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

  // start_scroll_pause(my.state_play_from_top_short);
  state_init();

  send_current_line();
}

function scroll_event() {
  my.lastScrollY = window.scrollY;

  create_word_spans();

  if (my.focusEnabled) {
    focus_line();
  } else {
    check_line_hilite();
    if (state_isStepping()) {
      scroll_event_step();
    }
  }
}
function scroll_event_step() {
  // Dont scroll for first n lines
  if (my.elineIndex < my.shortStopLineNum) {
    my.resumeScrollLineNum = my.shortStopLineNum;
  }
  if (my.elineIndex >= my.resumeScrollLineNum) {
    // Scroll to keep the current line moving toward midWindow
    let { el, rt } = clientRect_elineIndex(my.elineIndex);
    let midWindow = window.innerHeight / 2;
    let diff = rt.y - midWindow;
    if (diff > 0) {
      window.scrollBy(0, 1);
    } else if (my.elineIndex <= my.elines.length - 3) {
      // If we have to pause scroll to keep in middle
      // pause for at least n lines
      my.resumeScrollLineNum = my.elineIndex + 3;
    }
  }
  if (my.currentState == my.state_intro_step) {
    let shortStop = my.elineIndex == my.shortStopLineNum - 1;
    // console.log('scroll_event shortStop', shortStop, my.state_timer.lapse());
    if (shortStop) {
      console.log('scroll_event shortStop', shortStop, my.state_timer.lapse());
      // pause_short_read();
      state_next_event();
    }
  }
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
      let index = my.last_elineIndex;
      set_elineIndex(index);
    }
  }
  // let diff = my.last_elineIndex != my.elineIndex;
  // if (!diff) {
  //   console.log( '!diff last_elineIndex',  my.last_elineIndex,  'elineIndex', my.elineIndex, 'lapse', my.eline_timer.lapse() );
  // }
  let { el, rt } = clientRect_elineIndex(my.elineIndex);
  overlay_element(el);
  // when on last line, keep client updated
  if (my.elineIndex == my.last_elineIndex) {
    send_current_line();
  }
  if (!my.eline_timer.check()) {
    // console.log('check_line_hilite !my.eline_timer.check()', my.eline_timer.lapse());
    return;
  }
  if (!my.hword || my.hword.active) {
    // console.log('!my.hword || my.hword.active', !my.hword, my.hword.active);
    // Waiting for word hilight on current line to finish
    return;
  }
  // console.log('check_line_hilite my.eline_timer.check() lapse', my.eline_timer.lapse());
  // delay new hilite until line is in upper half of window
  let midWindow = window.innerHeight / 2;
  // take off 10 pixels for bottom status area
  let bottomWindow = window.innerHeight - 10;

  // if line is off top screen
  // search down for line that's on at mid window point
  my.offscreen = 1;
  if (rt.y < 0) {
    console.log('check_line_hilite rt.y < 0 find_line_down ---- ', my.elineIndex);
    find_line_down(rt, midWindow);
  } else if (rt.y > bottomWindow) {
    find_line_up(rt, midWindow);
  } else {
    my.offscreen = 0;
  }
  if (state_isStepping()) {
    advance_next_line();
  }
}

// current line is off the top of screen
// search down to first line just above the screen mid point
//
function find_line_down(rt, midWindow) {
  console.log('find_line_down rt', rt.y, 'midWindow', midWindow, 'my.elineIndex', my.elineIndex);
  let index = my.elineIndex;
  while (rt.y < midWindow && index < my.elines.length) {
    rt = clientRect_elineIndex(index).rt;
    index++;
  }
  // console.log('find_line_down while end my.elineIndex', my.elineIndex);
  if (index >= my.elines.length) {
    index = my.elines.length - 1;
  }
  let onlast = index == my.elines.length - 1;
  set_elineIndex(index);
  if (onlast && state_isStepping()) {
    console.log('find_line_down onlast && my.scrollEnabled ---- rt.y', rt.y, 'elineIndex', my.elineIndex);
    state_next_event();
  }
}

// current line is off the bottom of the screen
// search up to first line above the screen min point
//
function find_line_up(rt, midWindow) {
  let index = my.elineIndex;
  while (rt.y > midWindow && index > 0) {
    rt = clientRect_elineIndex(index).rt;
    index--;
  }
  // console.log('check_line_hilite while end my.elineIndex', my.elineIndex);
  set_elineIndex(index);
}

function clientRect_elineIndex(index) {
  let el = my.elines[index];
  let rt = el.getBoundingClientRect();
  return { el, rt };
}
