// get model from session
var activeModel = function() {
  if (Session.equals('focus_entity', 'chore')) {
    return Chore;
  } else if (Session.equals('focus_entity', 'person')) {
    return Person;
  } else {
    return Chore;
  }
}

// get model and field to update from session
var genericUpdate = { 
  ok: function (value) {
    var focus_field = Session.get('focus_field');
    if (focus_field) {
      var updateKeyVals = {};
      updateKeyVals[focus_field] = value;
      activeModel().update(this._id, {$set: updateKeyVals});
    }
  }
};

// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);

      } else if (evt.type === "keyup" && evt.which === 13 ||
                 evt.type === "focusout") {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };
  return events;
};

var activateInput = function (input) {
  input.focus();
  input.select();
};