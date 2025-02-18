//

// code that runs every frame
// ptjs function setup semantics

function setup_animationFrame() {
  window.requestAnimationFrame(animationFrame_callback);
}

function animationFrame_callback(timeStamp) {
  let timeSecs = timeStamp / 1000;
  // console.log('step_animation timeStamp', timeStamp);
  window.requestAnimationFrame(animationFrame_callback);

  if (my.comment_update_pending) {
    my.comment_update_pending = 0;
    show_comments();
  }
  // if (my.blackfacts_player_inited) {
  //   record_startup_time(timeSecs);
  // }
  // if (my.animLoop) {
  //   my.animLoop.step({ action: stepAction, loop: my.playClip });
  //   let lapse = '';
  //   if (my.playClip) lapse = my.animLoop.lapse() + ' ' + my.stepCount;
  //   id_lapse_report.innerHTML = lapse;
  // }
  // if (my.pingLoop) {
  //   my.pingLoop.step({ loop: 1 });
  // }
}

function record_startup_time(timeSecs) {
  if (!my.blackfacts_player_startup_time) {
    // console.log('record_startup_time timeSecs', timeSecs);
    my.blackfacts_player_startup_time = timeSecs;
    dbase_update_props({ startup_time: timeSecs });
  }
}
