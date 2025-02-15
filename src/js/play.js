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
  console.log('my.topRunCount', my.topRunCount);
  window.scrollTo(0, ytop);
  start_scroll_pause();
  my.elineIndex = 0;
  my.elineDelayCount = 0;
  my.overlayColorsIndex = (my.overlayColorsIndex + 1) % my.overlayColors.length;
  send_current_line();
}

// Advance to the next line
function advance_next_line() {
  delta_next_line(1);
}

function focus_line() {
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
  let diff = my.last_elineIndex != my.elineIndex;
  my.last_elineIndex = my.elineIndex;
  let ne = my.elines.length;
  my.elineIndex = (my.elineIndex + delta + ne) % ne;
  let no = my.overlayColors.length;
  my.overlayColorsIndex = (my.overlayColorsIndex + delta + no) % no;
  if (my.elineIndex && diff) {
    send_current_line();
  }
}

function check_scroll_pause() {
  if (!my.scrollPauseStart) {
    return;
  }
  let now = Date.now();
  let nowDiff = now - my.scrollPauseStart;
  if (nowDiff > my.scrollPausePeriod) {
    my.scrollEnabled = 1;
    my.scrollPauseStart = 0;
  }
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
  my.elineDelayCount = 0;
}
