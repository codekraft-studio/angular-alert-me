describe('Notification service', function() {

  var AlertMe;
  var $rootScope;
  var $document;

  beforeEach(module('alert-me'));

  beforeEach(inject(function (_AlertMe_, _$document_, _$rootScope_) {
    AlertMe = _AlertMe_;
    $document = _$document_;
    $rootScope = _$rootScope_;
  }));

  it('should have default global properties', function() {
    expect(AlertMe.defaults).toBeDefined();
  });

  it('should have a $$init method', function() {
    expect(AlertMe.$$init).toBeDefined();
  });

  describe('create method', function() {

    it('should have a create method', function() {
      expect(AlertMe.create).toBeDefined();
    });

    it('should create a new notify', function() {
      var response;
      AlertMe.create().then(function(res) { response = res; });
      $rootScope.$apply();
      expect(response).toBeDefined();
    });

    it('should call a onCreate method if provided', function() {

      var onCreate = jasmine.createSpy('onCreate');
      AlertMe.create({ onAfterCreate: onCreate });
      $rootScope.$apply();
      expect(onCreate).toHaveBeenCalled();

    });

  });

  describe('info method', function() {

    it('should have a info method', function() {
      expect(AlertMe.info).toBeDefined();
    });

    it('should call the create function', function() {
      spyOn(AlertMe, 'create');
      AlertMe.info('test');
      expect(AlertMe.create).toHaveBeenCalled();
    });

    it('should use the default method class', function() {
      var response;
      AlertMe.info({className: 'test'}).then(function(res) { response = res; });
      $rootScope.$apply();
      expect(response.className).toBe('info');
    });

  });

});
