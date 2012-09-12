// default session vars
Session.set('editing_entity_name', null);
Session.set('entity_id', null);
Session.set('focus_entity', null);


///////// entity list //////////

Template.entitylist.focus_entity = function() {
  return Session.get('focus_entity');
}
Template.entitylist.entities = function () {
  return activeModel().find();
};
Template.entitylist.selected = function () {
  return Session.equals('entity_id', this._id) ? 'selected' : '';
};
Template.entitylist.editing = function () {
  return Session.equals('editing_entity_name', this._id);
};
Template.entitylist.name_class = function () {
  return this.name ? '' : 'empty';
};
Template.entitylist.events({
  'mousedown .entityList': function (evt) { // select list
    Router.setEntity(this._id);
  },
  'click .entityList': function (evt) {
    // prevent clicks on <a> from refreshing the page.
    evt.preventDefault();
  },
  'click #personNav,#choreNav': function (evt) {
    Session.set('focus_entity', evt.target.innerText);
    Router.setEntity();
  },
  'dblclick .entityList': function (evt, tmpl) { // start editing list name
    Session.set('editing_entity_name', this._id);
    Meteor.flush(); // force DOM redraw, so we can focus the edit field
    activateInput(tmpl.find("#entity-name-input"));
  },
  'click .destroy': function () {
    activeModel().remove(this._id);
  },
});
Template.entitylist.events(okCancelEvents('#new-entity',
  {
    ok: function (text, evt) {
      var id = activeModel().insert({name: text});
      Router.setEntity(id);
      evt.target.value = "";
    }
  }
));
Template.entitylist.events(okCancelEvents('#entity-name-input',
  {
    ok: function (value) {
      activeModel().update(this._id, {$set: {name: value}});
      Session.set('editing_entity_name', null);
    },
    cancel: function () {
      Session.set('editing_entity_name', null);
    }
  }
));


///////// entity details //////////

// template conditionals {{#if blah}}
Template.entitydetails.chore = function() {
  return Session.equals('focus_entity', 'chore');
}
Template.entitydetails.person = function() {
  return Session.equals('focus_entity', 'person');
}

Template.entitydetails.entity = function () {
  if (Session.get('entity_id')) {
    var persons = [];
    var entity = activeModel().findOne({_id: Session.get('entity_id')});
    if (entity) {
      if ('chore' === Session.get('focus_entity')) {
        // add the person info to returned doc
        Person.find().forEach(function (person) {
          if (entity.assigned && person._id === entity.assigned) {
            person.selected = true;
          }
          persons.push(person);
        });
      }
      entity.persons = persons;
      return entity;
    }
  }
};
Template.entitydetails.events({
  'focus': function (evt) {
    Session.set('focus_field', evt.target.id);
  }
});

// generic update handlers
Template.entitydetails.events(okCancelEvents('#description', genericUpdate));
Template.entitydetails.events(okCancelEvents('#hours', genericUpdate));
Template.entitydetails.events(okCancelEvents('#frequency', genericUpdate));
Template.entitydetails.events(okCancelEvents('#email', genericUpdate));
Template.entitydetails.events(okCancelEvents('#assigned', genericUpdate));
