//
function play_from_top_toggle() {
  if (my.full_read_enabled) {
    play_from_top_short();
  } else {
    play_from_top_long();
  }
}

function play_from_top_short() {
  console.log('play_from_top_short ', my.full_read_enabled);
  play_from_top(my.scrollYTopShort);
  my.full_read_enabled = 0;
}

function play_from_top_long() {
  console.log('play_from_top_long ', my.full_read_enabled);
  play_from_top(my.scrollYTopLong);
  my.full_read_enabled = 1;
}

function play_from_top(ytop) {
  // gc();
  my.topRunCount++;
  console.log(
    'my.topRunCount',
    my.topRunCount,
    'my.elineIndex',
    my.elineIndex,
    'eline_timer lapse',
    my.eline_timer.lapse(),
    'scroll_pause_timer.lapse',
    my.scroll_pause_timer.lapse()
  );

  // Jump to very top if first line is not already on screen
  let rt = clientRect_elineIndex(0).rt;
  if (rt.y < 0 || rt.y + rt.height > window.innerHeight) {
    window.scrollTo(0, ytop);
    console.log('ytop', ytop, 'window.scrollY', window.scrollY);
  }

  start_scroll_pause();

  set_elineIndex(0);

  overlay_element_nextColor();

  my.eline_timer.restart();

  send_current_line();
}

function set_elineIndex(index) {
  my.last_elineIndex = index;
  my.elineIndex = index;
}

// Advance to the next line
function advance_next_line() {
  delta_next_line(1);
}

function focus_line() {
  // let el = my.elines[my.elineIndex];
  // let rt = el.getBoundingClientRect();
  let { el, rt } = clientRect_elineIndex(my.elineIndex);
  overlay_element(el);
  let midWindow = window.innerHeight / 2;
  if (rt.y < midWindow || rt.y > midWindow + my.lineHeight) {
    let diff = rt.y - midWindow;
    window.scrollBy(0, diff * 0.1);
  }
  send_current_line();
}

function delta_next_line(delta) {
  let diff = my.last_elineIndex != my.elineIndex;
  // next index is +/- current line
  let ne = my.elines.length;
  let index = (my.elineIndex + delta + ne) % ne;
  set_elineIndex(index);

  overlay_element_nextColor(delta);

  if (my.elineIndex && diff) {
    send_current_line();
  }
}

function start_scroll_pause(nextState) {
  if (!my.scroll_pause_timer) {
    let period = 5.0;
    function timer_event() {
      console.log('start_scroll_pause timer_event my.nextState', my.nextState);
      my.scrollEnabled = 1;
      if (my.nextState) {
        if (my.nextState == my.nextState_play_from_top_short) {
          play_from_top_short();
        }
        my.nextState = 0;
      }
    }
    my.scroll_pause_timer = new PeriodTimer({ period, timer_event });
  }
  if (nextState) {
    console.log('start_scroll_pause nextState', my.nextState);
    my.nextState = nextState;
  }
  my.scroll_pause_timer.restart();
  my.scrollEnabled = 0;
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
  dbase_update_line(lineInfo);
}

function line_next() {
  delta_next_line(1);
  my.scrollEnabled = 0;
  my.focusEnabled = 1;
}

function line_previous() {
  delta_next_line(-1);
  my.scrollEnabled = 0;
  my.focusEnabled = 1;
}

function line_continue() {
  my.scrollEnabled = 1;
  my.focusEnabled = 0;
  my.eline_timer.restart();
}
