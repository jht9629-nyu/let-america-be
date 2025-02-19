//

let dbase;

async function setup_dbase() {
  // console.log('setup_dbase Enter ');
  // my.fireb_config = 'jht9629';
  my.fireb_config = 'jhtitp';
  my.mo_app = my.mo_app || 'mo-america-be';
  my.mo_room = my.mo_room || 'm1-america';
  my.mo_group = my.mo_group || 's0';
  my.nameDevice = 'america';
  my.appTitle = 'let america be';

  // set group for all devices to share item values
  let params = get_url_params();
  my.query = params;
  console.log('params', params);
  my.mo_group = params.group || my.mo_group;

  if (my.mo_group == 's0') {
    // m0-america
    my.mo_room = 'm0-' + my.mo_room.substring(3);
  }
  // console.log(`setup_dbase my.mo_app=${my.mo_app} my.mo_room=${my.mo_room} my.mo_group=${my.mo_group}`);
  // console.log('setup_dbase my.mo_app', my.mo_app, 'my.mo_room', my.mo_room, 'my.mo_group', my.mo_group);

  // src/poem/poem/let-america-be-america-again.html
  my.qrcode_url = function () {
    return `../../qrcode/${my.mo_group}.png?v=30`;
  };
  my.showQRCode = function () {
    // qrCode is only shown for screen width greater than 800
    return window.innerWidth > 800;
  };
  my.qrCodeClickAction = qrcode_click_action;

  my.isRemote = !my.showQRCode();

  my.report_status_formatter = report_status_formatter;

  dbase = await mo_dbase_init(my);

  observe_item();

  if (my.isRemote) {
    issue_action_full_read();
  }
}

function report_status_formatter({ version, muid, nvisit, ndevice, uid }) {
  return `${my.mo_group} ${version} ${muid} (ndevice=${ndevice}) (nvisit=${nvisit})`;
}

function observe_item() {
  console.log('observe_item ');
  dbase.observe('item', { observed_item });
  function observed_item(item) {
    // console.log('observe_item observed_item', item);
    dbase.if_action({ item, prop: 'action_full_read', actionFunc: full_read_action });
    dbase.if_action({ item, prop: 'action_rewind', actionFunc: rewind_action });
    dbase.if_action({ item, prop: 'action_next', actionFunc: next_action });
    dbase.if_action({ item, prop: 'action_previous', actionFunc: previous_action });
    dbase.if_action({ item, prop: 'action_continue', actionFunc: continue_action });
  }
}

function issue_action_full_read() {
  console.log('issue_action_full_read');
  dbase.issue_action('item', 'action_full_read');
}

function full_read_action() {
  console.log('full_read_action');
  play_from_top_long();
}

function rewind_action() {
  console.log('rewind_action');
  play_from_top_short();
}

function next_action() {
  console.log('next_action');
  line_next();
}

function previous_action() {
  console.log('previous_action');
  line_previous();
}

function continue_action() {
  console.log('continue_action');
  line_continue();
}

function ui_log(...args) {
  console.log(...args);
}
globalThis.ui_log = ui_log;

function ui_verbose(...args) {
  // console.log(...args);
}
globalThis.ui_verbose = ui_verbose;

function dbase_update_line(line) {
  dbase?.update_item('item', { line });
}
