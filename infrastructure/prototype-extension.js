Date.prototype.toUtcSqlString = function()  {
    return this.toISOString().slice(0, 19).replace('T', ' ');
};

Object.isEmpty = function(obj) {
    let isEmpty = true;
    for(let key in obj) {
        if(obj[key] !== undefined) {
            isEmpty = false;
            break;
        }
    }
    return isEmpty;
};

String.empty = "";

String.prototype.toTitleCase = function() {
    const str = this;
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}