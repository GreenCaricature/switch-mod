angular.module("switcheroo").controller("RulesController", ["$scope", "RulesService", function($scope, rulesService) {
  $scope.rules = chrome.extension.getBackgroundPage().rules;
  if (!$scope.rules) {
    $scope.rules = []
  }
  $scope.isEditing = false;
  $scope.isCachebusted = false;
  $scope.enableCachebust = function() {
    $scope.isCachebusted = true
  };
  $scope.disableCachebust = function() {
    $scope.isCachebusted = false
  };
  $scope.add = function() {
    if ($scope.isCachebusted) {
      $scope.rules.push({
        from: $scope.from,
        to: $scope.to,
        isActive: true,
        isCachebusted: true
      })
    } else {
      $scope.rules.push({
        from: $scope.from,
        to: $scope.to,
        isActive: true,
        isCachebusted: false
      })
    }
    $scope.from = "";
    $scope.to = ""
  };
  $scope.remove = function(index) {
    $scope.rules.splice(index, 1)
  };
  $scope.clear = function() {
    $scope.rules = []
  };
  $scope.enableEditing = function() {
    $scope.isEditing = true
  };
  $scope.disableEditing = function() {
    $scope.isEditing = false
  };
  $scope.shortenText = function(text) {
    return text
  };
  $scope.$watch("rules", function(oldValue, newValue) {
    rulesService.set(newValue)
  }, true)
}]);
