$(function() {
  //Create a model for the service
  var Service = Backbone.Model.extend({
    //Model will contain three attributes
    //These are the defaults
    defaults: {
      title: "my service",
      price: 420,
      checked: false
    },
    //Helper function yo toggle checked
    toggle: function() {
      this.set("checked", !this.get("checked"));
    }
  });

  //Create a collection of services
  let ServiceList = Backbone.Collection.extend({
    //This holds objects of the service model
    model: Service,

    //Return an array only with the checked services
    getChecked: function() {
      return this.where({ checked: true });
    }
  });

  //Prefill the collection with a number of services
  let services = new ServiceList([
    new Service({ title: "web development", price: 69 }),
    new Service({ title: "web design", price: 200 }),
    new Service({ title: "graphic design", price: 4000 }),
    new Service({ title: "satanic ministry ordainment", price: 666 })
  ]);

  //This turns a Service model into HTML, specifically li
  let ServiceView = Backbone.View.extend({
    tagName: "li",
    events: {
      click: "toggleService"
    },
    initialize: function() {
      //Set up event listeners, the change backbone event
      //is raised when a property changes (in this case the checked field)
      this.listenTo(this.model, "change", this.render);
    },
    render: function() {
      // Create the HTML

      this.$el.html(
        '<input type="checkbox" value="1" name="' +
          this.model.get("title") +
          '" /> ' +
          this.model.get("title") +
          "<span>$" +
          this.model.get("price") +
          "</span>"
      );
      this.$("input").prop("checked", this.model.get("checked"));

      // Returning the object is a good practice
      // that makes chaining possible
      return this;
    },

    toggleService: function() {
      this.model.toggle();
    }
  });

  //Main application view
  let App = Backbone.View.extend({
    //Base the view on an existing element
    el: $("#main"),
    initialize: function() {
      this.total = $("#total span");
      this.list = $("#services");
      // Listen for the change event on the collection.
      // This is equivalent to listening on every one of the
      // service objects in the collection
      this.listenTo(services, "change", this.render);

      // Create view for every one of the services in the
      //collection and add them to the page

      services.each(function(service) {
        let view = new ServiceView({ model: service });
        this.list.append(view.render().el);
      }, this);
    },
    render: function() {
      let total = 0;

      _.each(services.getChecked(), function(elem) {
        total += elem.get("price");
      });
      this.total.text("$" + total);

      return this;
    }
  });
  new App();
});
