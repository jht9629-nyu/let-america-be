//

function black_my_setup() {
  console.log('my_setup_black');

  my.appTitle = 'Blackfacts';
  my.version = '?v=43';

  my.fireb_config = 'jht9629';
  // my.fireb_config = 'jht1493';
  // my.fireb_config = 'jhtitp';

  my.dbase_rootPath = 'm0-@r-@w-';
  my.mo_app = 'mo-blackfacts';
  my.mo_room = 'm1-blackfacts';
  my.mo_group = 's0';
  my.nameDevice = 'blackfacts';

  // set group for all devices to share item values
  let params = get_url_params();
  my.query = params;
  console.log('params', params);
  my.mo_group = params.group || my.mo_group;
  if (my.mo_group == 's0') {
    my.mo_room = 'm0-blackfacts';
  }

  my.qrcode_url = function () {
    return `../black-enter/qrcode/${my.mo_group}.png`;
  };
  my.showQRCode = function () {
    // qrCode is only shown for screen width greater than 800
    return window.innerWidth > 800;
  };

  my.footerHeight = '288px';
  my.qrCodeWidth = '25%';

  console.log('my_setup_black my.mo_app', my.mo_app, 'my.mo_room', my.mo_room, 'my.mo_group', my.mo_group);
}
