//

// code that runs every frame
// p5js function setup semantics

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
}

function record_startup_time(timeSecs) {
  if (!my.blackfacts_player_startup_time) {
    // console.log('record_startup_time timeSecs', timeSecs);
    my.blackfacts_player_startup_time = timeSecs;
    dbase_update_props({ startup_time: timeSecs });
  }
}
