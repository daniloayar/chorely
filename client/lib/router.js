var ChorelyRouter = Backbone.Router.extend({
  routes: {
    "chore/:chore_id": "chore",
    "chore/*": "chore",
    "person/:person_id": "person",
    "person/*": "person",
    "/*": "chore"
  },
  chore: function(chore_id) {
    Session.set("focus_entity", "chore");
    Session.set("entity_id", chore_id);
  },
  person: function(person_id) {
    Session.set("focus_entity", "person");
    Session.set("entity_id", person_id);
  },
  setEntity: function(entity_id) {
    if (!entity_id) entity_id = '';
    this.navigate(Session.get("focus_entity") + "/" + entity_id, true);
  }
});

Router = new ChorelyRouter();

Meteor.startup(function() {
  Backbone.history.start({
    pushState: true
  });
});