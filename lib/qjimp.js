/*!
 * qwebs
 * Copyright (c) 2015 beny78
 * MIT Licensed
 */

"use strict";

var Q = require("q"),
    Jimp = require("jimp"),
    DataError = require("./dataerror");

function QJimp() {
};

QJimp.prototype.constructor = QJimp;

QJimp.prototype.toImage = function(buffer) {
    var deferred = Q.defer();
    new Jimp(buffer, function() {
        deferred.resolve(this);
    });
    return deferred.promise;
};

QJimp.prototype.toBuffer = function(image, contentType) {
    if (!contentType) throw new DataError({ message: "contentType is not defined." });

    return Q.ninvoke(image, "getBuffer", contentType);
};

QJimp.prototype.size = function(image) {
    return Q.try(function() {
        var size = { width: image.bitmap.width, height: image.bitmap.height };
        return size;
    });
};

QJimp.prototype.resize = function(image, width, height) {
    if (!width) throw new DataError({ message: "width is not defined." });
    if (!height) throw new DataError({ message: "height is not defined." });
    
    return Q.ninvoke(image, "resize", width, height);
};

QJimp.prototype.crop = function(image, left, top, width, height) {
    if (left == null) throw new DataError({ message: "left is not defined." });
    if (top == null) throw new DataError({ message: "top is not defined." });
    if (width == null) throw new DataError({ message: "width is not defined." });
    if (height == null) throw new DataError({ message: "height is not defined." });

    return Q.ninvoke(image, "crop", left, top, width, height);
};

QJimp.prototype.smartResize = function(image, width, height) {
    if (!image) throw new DataError({ message: "image is not defined." });
    if (!width) throw new DataError({ message: "width is not defined." });
    if (!height) throw new DataError({ message: "height is not defined." });
    var self = this;
    return self.size(image).then(function(size) {
        var cropRatio = width / height;
        var imageRatio = size.width / size.height;
        if (cropRatio == imageRatio) {
            return self.resize(image, width, height);
        }
        if (cropRatio < imageRatio) {
            var resizedWidth = height * imageRatio;
            return self.resize(image, resizedWidth, height).then(function(resizedImage) {
                return self.size(resizedImage).then(function(resized) {
                    var left = (resized.width - width) / 2;
                    return self.crop(resizedImage, left, 0, width, height);  
                });
            });
        }
        else {
            var resizedHeight = width / imageRatio;         
            return self.resize(image, width, resizedHeight).then(function(resizedImage) {
                return self.size(resizedImage).then(function(resized) {
                    var top = (resized.height - height) / 2;
                    return self.crop(resizedImage, 0, top, width, height);  
                });
            });
        }
    });
};

QJimp.prototype.transform = function(image, size) {
    return this.smartResize(image, size.width, size.height);
};

exports = module.exports = new QJimp();