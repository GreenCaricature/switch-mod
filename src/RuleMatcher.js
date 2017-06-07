var parseURI = function parse_uri(str) {
		if (str === '@dev' || str === '@qa' || str === '@prod') return {path:str}
		var o = {
			strictMode: false,
			key: ["src", "protocol", "auth", "usr_info", "usr", "pass", "host", "port", "relative", "path", "dir", "file", "query", "anchor"],
			q: {
				name: "query_keys",
				parser: /(?:^|&)([^&=]*)=?([^&]*)/g
			},
			parser: {
				strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
				loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
			}
		}
		m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i = 14;
		while (i--) uri[o.key[i]] = m[i] || "";
		uri[o.q.name] = {};
		uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
			if ($1) uri[o.q.name][$1] = $2
		});
		return uri
	}


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
			let regex = /\?_cb=\d{16}/
			let path = {
				to: parseURI(rule.to).path,
				from: parseURI(rule.from).path
			}

			lastRequestId = request.requestId;

			if (rule.isCachebusted) {
				if (path.to === path.from) {
					return {
						redirectUrl: request.url.replace(rule.from, cachebust(rule.from))
					}
				} else if (rule.to === "@dev") {
					return {
						redirectUrl: request.url.replace(rule.from, cachebust(rule.from.replace('/prod/', '/dev/')))
					}
				} else if (rule.to === "@qa") {
					return {
						redirectUrl: request.url.replace(rule.from, cachebust(rule.from.replace('/prod/', '/qa/')))
					}
				} else {
					return {
						redirectUrl: request.url.replace(rule.from, cachebust(rule.to))
					}
				}
			}

			else {
				if (path.to === path.from) {
					return {
						redirectUrl: request.url.replace(rule.from, rule.from)
					}
				} else if (rule.to === "@dev") {
					return {
						redirectUrl: request.url.replace(rule.from, rule.from.replace('/prod/', '/dev/'))
					}
				} else if (rule.to === "@qa") {
					return {
						redirectUrl: request.url.replace(rule.from, rule.from.replace('/prod/', '/qa/'))
					}
				} else {
					return {
						redirectUrl: request.url.replace(rule.from, rule.to)
					}
				}
			}
		}
	}
};
