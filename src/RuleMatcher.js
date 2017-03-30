
var url = require('url');

var RuleMatcher = function(rules) {
    function has(string, regex) {
        var re = regex;
        return re.test(string) ? true : false
    }

    var cachebust = function(url) {
        if (has(url, /\?/gim)) {
            return url + "&_cb=" + Math.random().toFixed(16).substring(2, 18)
        } else {
            return url + "?_cb=" + Math.random().toFixed(16).substring(2, 18)
        }
    };
    
    var lastRequestId;
    
    this.rules = rules;
    
    this.redirectOnMatch = function(request) {
        var rule = _.find(rules, function(rule) {
            return rule.isActive && request.url.indexOf(rule.from) > -1 && request.requestId !== lastRequestId
        });
        
        if (rule) {
            lastRequestId = request.requestId;

            if (rule.isCachebusted) {
                if (url.parse(rule.to).path === url.parse(rule.from).path)  {return {redirectUrl: request.url.replace(rule.from, cachebust(rule.from))}}
                else if (rule.to === "@dev") {return {redirectUrl: request.url.replace(rule.from, cachebust(rule.from.replace('/prod/', '/dev/')))}}
                else if (rule.to === "@qa") {return {redirectUrl: request.url.replace(rule.from, cachebust(rule.from.replace('/prod/', '/qa/')))}}
                else {return {redirectUrl: request.url.replace(rule.from, cachebust(rule.to))}}
            }

            else {
                if (url.parse(rule.to).path === url.parse(rule.from).path)  {return {redirectUrl: request.url.replace(rule.from, rule.from)}}
                else if (rule.to === "@dev") {return {redirectUrl: request.url.replace(rule.from, rule.from.replace('/prod/', '/dev/'))}}
                else if (rule.to === "@qa") {return {redirectUrl: request.url.replace(rule.from, rule.from.replace('/prod/', '/qa/'))}}
                else {return {redirectUrl: request.url.replace(rule.from, rule.to)}}
            }
        }
    }
};
