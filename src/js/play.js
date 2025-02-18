//

// my.currentState
// my.nextState
//  my.state_play_from_top_short
//
//  state_intro_pause : 3 sec wait
//  state_intro_step : next line every 2 sec until end of intro
//    ... state_intro_step
//  state_intro_end_pause : 3 sec wait
//    --> state_intro_pause
//  state_full_pause : sec wait
//    --> state_full_step
//  state_full_step : next line every 2 sec until end of poem
//    ... state_full_step
//  state_full_end_pause : 3 sec wait until
//    --> state_intro_step
//

function state_init() {
  //
  my.state_intro_pause = 'state_intro_pause';
  my.state_intro_step = 'state_intro_step';
  my.state_intro_end_pause = 'state_intro_end_pause';
  my.state_full_pause = 'state_full_pause';
  my.state_full_step = 'state_full_step';
  my.state_full_end_pause = 'state_full_end_pause';
  //
  let period = -1;
  my.state_timer = new PeriodTimer({ period, timer_event: state_next_event });
  state_next_event(my.state_intro_pause);
}

function state_next_event(newState) {
  console.log('state_next_event my.nextState', my.nextState, 'my.currentState', my.currentState);
  console.log('state_next_event lapse', my.state_timer.lapse());
  if (newState) {
    my.nextState = newState;
  }
  let nextState = my.nextState;
  let period;
  switch (my.nextState) {
    case my.state_intro_pause:
      period = 3.0;
      start_intro_pause();
      nextState = my.state_intro_step;
      break;
    case my.state_intro_step:
      period = -1;
      nextState = my.state_intro_end_pause;
      break;
    case my.state_intro_end_pause:
      period = 3.0;
      nextState = my.state_intro_pause;
      break;
    case my.state_full_pause:
      period = 3.0;
      nextState = my.state_full_step;
      start_full_pause();
      break;
    case my.state_full_step:
      period = -1;
      nextState = my.state_full_end_pause;
      break;
    case my.state_full_end_pause:
      period = 3.0;
      nextState = my.state_intro_pause;
      break;
  }
  my.currentState = my.nextState;
  my.nextState = nextState;
  my.state_timer.period = period;
  my.state_timer.restart();
}

function state_isStepping() {
  switch (my.currentState) {
    case my.state_intro_step:
    case my.state_full_step:
      return true;
  }
  return false;
}

function start_intro_pause() {
  clear_word_styles();
  // play_from_top_short();
  play_from_top(my.scrollYTopShort);
}

function start_full_pause() {
  clear_word_styles();
  play_from_top(my.scrollYTopLong);
}

function play_from_top_toggle() {
  if (my.isFullRead) {
    play_from_top_short();
  } else {
    play_from_top_long();
  }
}

function play_from_top_short() {
  console.log('play_from_top_short ', my.isFullRead);

  my.isFullRead = 0;

  state_next_event(my.state_intro_pause);
}

function play_from_top_long() {
  console.log('play_from_top_long ', my.isFullRead);

  my.isFullRead = 1;

  state_next_event(my.state_full_pause);
}

function play_from_top(ytop) {
  // gc();
  my.topRunCount++;
  console.log(
    'play_from_top my.topRunCount',
    my.topRunCount,
    'my.elineIndex',
    my.elineIndex,
    'eline_timer lapse',
    my.eline_timer.lapse(),
    'state_timer.lapse',
    my.state_timer.lapse()
  );
  console.log('play_from_top my.scrollEnabled', my.scrollEnabled);
  // Jump to very top if first line is not already on screen
  let rt = clientRect_elineIndex(0).rt;
  if (rt.y < 0 || rt.y + rt.height > window.innerHeight) {
    window.scrollTo(0, ytop);
    console.log('ytop', ytop, 'window.scrollY', window.scrollY);
  }

  // start_scroll_pause();

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
  console.log('advance_next_line elineIndex', my.elineIndex);
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
