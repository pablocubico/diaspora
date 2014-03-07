
describe("app.views.AspectMembership", function(){
  var resp_success = {status: 200, responseText: '{}'};
  var resp_fail = {status: 400};

  beforeEach(function() {
    // mock a dummy aspect dropdown
    this.person = factory.author({name: "My Name"});
    Diaspora.I18n.loadLocale({
      aspect_dropdown: {
        started_sharing_with: 'you started sharing with <%= name %>',
        stopped_sharing_with: 'you stopped sharing with <%= name %>',
        error: 'unable to add <%= name %>',
        error_remove: 'unable to remove <%= name %>'
      }
    });
    spec.content().html(
      '<div class="aspect_membership dropdown">'+
      '  <div class="button toggle">The Button</div>'+
      '  <ul class="dropdown_list" data-person-short-name="'+this.person.name+'" data-person_id="'+this.person.id+'">'+
      '    <li data-aspect_id="10">Aspect 10</li>'+
      '    <li data-membership_id="99" data-aspect_id="11" class="selected">Aspect 11</li>'+
      '    <li data-aspect_id="12">Aspect 12</li>'+
      '    <li data-membership_id="100" data-aspect_id="13" class="selected">Aspect 13</li>'+
      '  </ul>'+
      '</div>'
    );

    this.view = new app.views.AspectMembership();
  });

  context('adding to aspects', function() {
    beforeEach(function() {
      this.newAspect = spec.content().find('li:eq(0)');
      this.newAspectId = 10;
    });

    it('marks the aspect as selected', function() {
      this.newAspect.trigger('click');
      jasmine.Ajax.requests.mostRecent().response(resp_success);

      expect(this.newAspect.attr('class')).toContain('selected');
    });

    it('displays flash message when added to first aspect', function() {
      spec.content().find('li').removeClass('selected');
      this.newAspect.trigger('click');
      jasmine.Ajax.requests.mostRecent().response(resp_success);

      expect($('[id^="flash"]')).toBeSuccessFlashMessage(
        Diaspora.I18n.t('aspect_dropdown.started_sharing_with', {name: this.person.name})
      );
    });

    it('displays an error when it fails', function() {
      this.newAspect.trigger('click');
      jasmine.Ajax.requests.mostRecent().response(resp_fail);

      expect($('[id^="flash"]')).toBeErrorFlashMessage(
        Diaspora.I18n.t('aspect_dropdown.error', {name: this.person.name})
      );
    });
  });

  context('removing from aspects', function(){
    beforeEach(function() {
      this.oldAspect = spec.content().find('li:eq(1)');
      this.oldMembershipId = 99;
    });

    it('marks the aspect as unselected', function(){
      this.oldAspect.trigger('click');
      jasmine.Ajax.requests.mostRecent().response(resp_success);

      expect(this.oldAspect.attr('class')).not.toContain('selected');
    });

    it('displays a flash message when removed from last aspect', function() {
      spec.content().find('li.selected:last').removeClass('selected');
      this.oldAspect.trigger('click');
      jasmine.Ajax.requests.mostRecent().response(resp_success);

      expect($('[id^="flash"]')).toBeSuccessFlashMessage(
        Diaspora.I18n.t('aspect_dropdown.stopped_sharing_with', {name: this.person.name})
      );
    });

    it('displays an error when it fails', function() {
      this.oldAspect.trigger('click');
      jasmine.Ajax.requests.mostRecent().response(resp_fail);

      expect($('[id^="flash"]')).toBeErrorFlashMessage(
        Diaspora.I18n.t('aspect_dropdown.error_remove', {name: this.person.name})
      );
    });
  });

  context('summary text in the button', function() {
    beforeEach(function() {
      this.btn = spec.content().find('div.button.toggle');
      this.btn.text(""); // reset
      this.view.dropdown = spec.content().find('ul.dropdown_list');
    });

    it('shows "no aspects" when nothing is selected', function() {
      spec.content().find('li[data-aspect_id]').removeClass('selected');
      this.view.updateSummary();

      expect(this.btn.text()).toContain(Diaspora.I18n.t('aspect_dropdown.toggle.zero'));
    });

    it('shows "all aspects" when everything is selected', function() {
      spec.content().find('li[data-aspect_id]').addClass('selected');
      this.view.updateSummary();

      expect(this.btn.text()).toContain(Diaspora.I18n.t('aspect_dropdown.all_aspects'));
    });

    it('shows the name of the selected aspect ( == 1 )', function() {
      var list = spec.content().find('li[data-aspect_id]');
      list.removeClass('selected'); // reset
      list.eq(1).addClass('selected');
      this.view.updateSummary();

      expect(this.btn.text()).toContain(list.eq(1).text());
    });

    it('shows the number of selected aspects ( > 1)', function() {
      var list = spec.content().find('li[data-aspect_id]');
      list.removeClass('selected'); // reset
      $([list.eq(1), list.eq(2)]).addClass('selected');
      this.view.updateSummary();

      expect(this.btn.text()).toContain(Diaspora.I18n.t('aspect_dropdown.toggle', { 'count':2 }));
    });
  });
});
