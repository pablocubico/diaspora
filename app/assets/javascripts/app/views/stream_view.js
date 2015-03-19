// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-v3-or-Later

//= require ./stream/shortcuts

app.views.Stream = app.views.InfScroll.extend(_.extend(
  app.views.StreamShortcuts, {
  	
  initialize: function() {
    this.stream = this.model;
    this.collection = this.stream.items;

    this.postViews = [];

    this.setupNSFW();
    this.setupLightbox();
    this.setupInfiniteScroll();
    this.setupShortcuts();
    this.markNavSelected();

    $(".theme").on("click", function(e) {
      e.preventDefault();
      $("body").css("background-image", $(this).css("background-image"));
      $("body").css("background-attachment", "fixed");
    })

  },

  postClass : app.views.StreamPost,

  setupLightbox : function(){
    this.lightbox = Diaspora.BaseWidget.instantiate("Lightbox");
    this.$el.delegate("a.stream-photo-link", "click", this.lightbox.lightboxImageClicked);
  },

  setupNSFW : function(){
    function reRenderPostViews() {
      _.map(this.postViews, function(view){ view.render() });
    }
    app.currentUser.bind("nsfwChanged", reRenderPostViews, this);
  },

  markNavSelected : function() {
    var activeStream = Backbone.history.fragment;
    var streamSelection = $("#stream_selection");
    streamSelection.find("[data-stream]").removeClass("selected");
    streamSelection.find("[data-stream='" + activeStream + "']").addClass("selected");
  }
}));
// @license-end
