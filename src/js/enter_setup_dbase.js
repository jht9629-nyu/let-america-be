//

let dbase;

async function enter_setup_dbase() {
  //
  mo_my_setup();

  my.comment_count = 0;

  dbase = await mo_dbase_init(my);

  observe_item();

  observe_comment_store();
}

function observe_item() {
  dbase.observe('item', { observed_item });
  function observed_item(item) {
    console.log('observed_item item', item);
    if (item.comment_count != undefined) {
      my.comment_count = item.comment_count;
    }
    my.item_update_pending = 1;
  }
}

function observe_comment_store() {
  my.comment_store = {};
  dbase.observe('comment_store', { event_update, event_remove });
  function event_update(key, item, event) {
    console.log('event_update key', key, 'item', item, 'event', event);
    // event = add | change -- optional
    my.comment_store[key] = item;
    my.comment_update_pending = 1;
  }
  function event_remove(key, item) {
    console.log('event_remove', key, item);
    delete my.comment_store[key];
    my.comment_update_pending = 1;
  }
}

function new_entry() {
  let name = id_name.value;
  let comment = id_comment.value;
  let createdAt = new Date().toISOString();
  let index = my.comment_count + 1;
  let uid = my.uid;
  return { name, comment, createdAt, index, uid };
}

async function add_action() {
  console.log('add_action ');
  let entry = new_entry();
  console.log('add_action entry', entry);
  if (!entry.name && !entry.comment) {
    console.log('add_action empty');
    return;
  }
  let key = await dbase.add_key('comment_store', entry);
  console.log('add_action key', key);
  entry.key = key;
  try {
    dbase.update_item('item', { comment_count: dbase.increment(1) });
  } catch (err) {
    console.log('take_action err', err);
  }
}

async function remove_action() {
  let response = confirm('remove my comment');
  if (response) {
    remove_action_confirmed();
  }
}

async function remove_action_confirmed() {
  //
  for (let key in my.comment_store) {
    let entry = my.comment_store[key];
    if (entry.uid != my.uid) {
      console.log('remove skipping', entry.uid);
      continue;
    }
    await dbase.remove_key('comment_store', key);
    break;
  }
}

function ui_log(...args) {
  // enter blackfacts ui_log
  console.log(...args);
}

function ui_verbose(...args) {
  // enter blackfacts ui_logv
  // console.log(...args);
}

function ui_error(...args) {
  // enter blackfacts ui_error
  ui_log(...args);
  alert(...args);
}
