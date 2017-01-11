if (rule) {
    lastRequestId = request.requestId;

    if (rule.isCachebusted) {
        if (url.parse(rule.to).path === url.parse(rule.from).path) {
            return {
                redirectUrl: request.url.replace(rule.from, cachebust(rule.from))
            }
        }
        else if (rule.to === "@dev") {
            return {
                redirectUrl: request.url.replace(rule.from, cachebust(rule.from.replace('/prod/', '/dev/')))
            }
        }
        else if (rule.to === "@qa") {
            return {
                redirectUrl: request.url.replace(rule.from, cachebust(rule.from.replace('/prod/', '/qa/')))
            }
        }
        else {
            return {
                redirectUrl: request.url.replace(rule.from, cachebust(rule.to))
            }
        }
    }

    else {
        if (url.parse(rule.to).path === url.parse(rule.from).path)  {return {redirectUrl: request.url.replace(rule.from, rule.from)}}
        else if (rule.to === "@dev") {return {redirectUrl: request.url.replace(rule.from, rule.from.replace('/prod/', '/dev/'))}}
        else if (rule.to === "@qa") {return {redirectUrl: request.url.replace(rule.from, rule.from.replace('/prod/', '/qa/'))}}
        else {return {redirectUrl: request.url.replace(rule.from, rule.to)}}
    }
}
