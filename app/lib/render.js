"use-strict";

module.exports = function(req, res, code, template, data) {
    if (req.accepts("html")) {
        if (code !== 200) {
            res.status(code);
        }
        res.render(template, data);
        return;
    }
    if (req.accepts("json")) {
        res.status(code);
        res.send(JSON.stringify(data));
        return;
    }
    res.status(406);
    res.render('error', {
        message: "Unsupported 'accepts' format.",
        status: 406,
        error: new Error("Unsupported 'accepts' format.")
    });
}
