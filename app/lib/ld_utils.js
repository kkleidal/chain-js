"use-strict";

function asOf(date) {
    if (! date) {
        date = new Date();
    }
    return {"@value": date.toISOString(), "@type": "https://schema.org/Date"};
}

module.exports = {
    asOf: asOf
};
