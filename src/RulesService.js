var LocalRulesService = function() {
    this.get = function() {
        if (localStorage["rules"]) {
            return JSON.parse(localStorage["rules"])
        } else {
            return [];
        }
    };
    this.set = function(data) {
        localStorage["rules"] = JSON.stringify(data)
    }
};
var RulesServiceFactory = {
    getRulesService: function() {
        return new LocalRulesService
    }
};
