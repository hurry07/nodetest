this.block = this.block || {};
(function () {
    /**
     * json protocal, send and receive json
     *
     * @param url
     * @param data
     * @param fn
     */
    block.send = function (url, data, fn) {
        if (typeOf(data) != 'string') {
            data = JSON.encode(data);
        }
        d3.xhr(url, "application/json")
            .header('Content-Type', 'application/json')
            .send('POST', data, fn)
            .response(function (request) {
                return JSON.parse(request.responseText);
            });
    }
})();