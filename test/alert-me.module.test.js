describe('Angular Notify: Run method', () => {

  let AlertMe;
  let $templateCache;

  beforeEach( () => {

    module('alert-me', ($provide) => {

      $provide.value('AlertMe', {
        defaults: { desktop: false },
        $$init: jasmine.createSpy('$$init')
      });

    });

    inject((_AlertMe_, _$templateCache_) => {
      AlertMe = _AlertMe_;
      $templateCache = _$templateCache_;
    });

  });

  it('should create the notify container template cache', () => {
    console.log( $templateCache.get('alert-me/container-template.html') );
    expect($templateCache.get('alert-me/container-template.html')).toBeDefined();
  });

  it('should create the notify template cache', () => {
    expect($templateCache.get('alert-me/message-template.html')).toBeDefined();
  });

  it('should call the AlertMe.$$init method', () => expect(AlertMe.$$init).toHaveBeenCalled());

});
