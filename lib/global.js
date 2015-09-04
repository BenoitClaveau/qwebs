/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

function GlobalService (){
    this.config = {};
};

GlobalService.prototype.constructor = GlobalService;

GlobalService.prototype.setConfig = function(config) {
    this.config = config;
    if (this.config === null) throw new Error("Config is not defined.");
    
    if (this.config.compress == null) this.config.compress = true;
    if (this.config.verbose == null) this.config.verbose = false;
    if (this.config.folder == undefined) this.config.folder = 'public';
};

exports = module.exports = new GlobalService();