"use strict";

var system = require("system");
var webpage = require("webpage");
var args = system.args;

var url = args[1];
var path = args[2];

var page = webpage.create();
page.viewportSize = {
    width: 1024, height: 768
};
page.settings.userAgent = "Phantom.js bot";

page.open(url, function(status) {
    if (status !== "success") {
        console.error("Fail to open page");
        return phantom.exit();
    }

    window.setTimeout((function() {
        page.render(path);
        phantom.exit();
    }), 200);
});
