//

function mo_my_setup() {
  my.version = '?v=39';
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

  my.report_status_formatter = report_status_formatter;
}

function report_status_formatter({ version, muid, nvisit, ndevice, uid }) {
  return `${my.mo_group} ${version} ${muid} (ndevice=${ndevice}) (nvisit=${nvisit})`;
}
