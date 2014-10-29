var path = require('path');
var fs = require('fs');

module.exports = function (dir, option) {
    dir = dir || process.cwd();
    var reactTools = option.reactTools;
    return function* (next) {
        var fileType = (this.url.match(/\.(js)$/) || []).shift();
        if (fileType) {
            var file = path.join(dir, this.url);
            var content = fs.readFileSync(file,'utf-8');
            if (!/^\/\*\*(\s)@jsx/.test(content.split('\n')[0])) {
                yield *next;
            } else {
                content = reactTools.transform(content, {});
                this.set('Content-Type', 'text/javascript');
                this.set('Content-Length', Buffer.byteLength(content));
                this.body = content;
            }
        } else {
            yield *next;
        }
    };
};