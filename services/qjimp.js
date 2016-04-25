/*!
 * qwebs
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */

"use strict";

const Q = require("q");
const Jimp = require("jimp");
const DataError = require("./../dataerror");

class QJimp {
        
    toImage(buffer) {
        var deferred = Q.defer();
        new Jimp(buffer, function() {
            deferred.resolve(this);
        });
        return deferred.promise;
    };

    clone(image) {
        if (!image) throw new DataError({ message: "image is not defined." });

        return Q.ninvoke(image, "clone");
    };

    toBuffer(image, contentType) {
        if (!contentType) throw new DataError({ message: "contentType is not defined." });

        return Q.ninvoke(image, "getBuffer", contentType);
    };

    size(image) {
        if (!image) throw new DataError({ message: "image is not defined." });

        return Q.try(function() {
            var size = { width: image.bitmap.width, height: image.bitmap.height };
            return size;
        });
    };

    resize(image, width, height) {
        if (!image) throw new DataError({ message: "image is not defined." });
        if (!width) throw new DataError({ message: "width is not defined." });
        if (!height) throw new DataError({ message: "height is not defined." });

        return Q.ninvoke(image, "resize", width, height);
    };

    crop(image, left, top, width, height) {
        if (!image) throw new DataError({ message: "image is not defined." });
        if (left == null) throw new DataError({ message: "left is not defined." });
        if (top == null) throw new DataError({ message: "top is not defined." });
        if (width == null) throw new DataError({ message: "width is not defined." });
        if (height == null) throw new DataError({ message: "height is not defined." });

        return Q.ninvoke(image, "crop", left, top, width, height);
    };

    cropAndResize(image, size, width, height) {
        if (!image) throw new DataError({ message: "image is not defined." });
        if (!size) throw new DataError({ message: "size is not defined." });
        if (!width) throw new DataError({ message: "width is not defined." });
        if (!height) throw new DataError({ message: "height is not defined." });
        var self = this;

        return Q.try(function() {
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

    cropIfNeeded(image, size, width, height) {
        if (!image) throw new DataError({ message: "image is not defined." });
        if (!size) throw new DataError({ message: "size is not defined." });
        if (!width) throw new DataError({ message: "width is not defined." });
        if (!height) throw new DataError({ message: "height is not defined." });
        var self = this;

        return Q.try(function() {
            var cropRatio = width / height;
            var imageRatio = size.width / size.height;

            console.log("cropRatio", cropRatio, width, height)
            console.log("imageRatio", imageRatio, size.width, size.height)
            if (cropRatio == imageRatio) {
                return image; //no crop needed
            }

            if (cropRatio < imageRatio) {
                var resizedWidth = width / imageRatio;
                var left = (size.width - resizedWidth) / 2;
                return self.crop(image, left, 0, resizedWidth, size.height);  
            }
            else {
                var resizedWidth = size.height * imageRatio;
                var left = (size.width - resizedWidth) / 2;

                console.log("crop", left, 0, resizedWidth, size.height)
                return self.crop(image, left, 0, resizedWidth, size.height); 
            }
        });
    };

    cropAndAddBackground(image, size, width, height) {
        if (!image) throw new DataError({ message: "image is not defined." });
        if (!size) throw new DataError({ message: "size is not defined." });
        if (!width) throw new DataError({ message: "width is not defined." });
        if (!height) throw new DataError({ message: "height is not defined." });
        var self = this;

        return self.cropIfNeeded(image, size, width, height).then(function(cropped) {
            return self.size(cropped).then(function(size) {

                return self.clone(cropped).then(function(background) {

                    var ratio = size.width / size.height;
                    var bgWidth = Math.min(size.width / 2, 200);
                    var bgHeight = bgWidth / ratio;
                    var bgLeft = Math.max(size.width - bgWidth, 0) / 2;
                    var bgTop = Math.max(size.height - bgHeight, 0) / 2;

                    return self.crop(background, bgLeft, bgTop, bgWidth, bgHeight).then(function(background) {                    
                        return self.resize(background, width, height).then(function(background) {
                            return self.blur(background, 100).then(function(background) {
                                return self.opacity(background, 0.3);
                            });
                        });
                    }).then(function(background) {

                        return self.scale(cropped, 0.75).then(function(cropped) {

                            return self.size(cropped).then(function(thSize) {
                                var x = (width - thSize.width) / 2;
                                var y = (height - thSize.height) / 2;

                                return self.blit(background, cropped, x, y);
                            });
                        });
                    });
                });
            });
        });
    };


    smartResize(image, width, height) {
        if (!image) throw new DataError({ message: "image is not defined." });
        if (!width) throw new DataError({ message: "width is not defined." });
        if (!height) throw new DataError({ message: "height is not defined." });
        var self = this;

        return self.size(image).then(function(size) {
            if (size.height < height && size.width < width) return self.cropAndAddBackground(image, size, width, height);
            else return self.cropAndResize(image, size, width, height);
        });
    };

    transform(image, size) {
        return this.smartResize(image, size.width, size.height);
    };

    greyscale(image) {
        if (!image) throw new DataError({ message: "image is not defined." });

        return Q.ninvoke(image, "greyscale");
    };

    contrast(image, val) {
        if (!image) throw new DataError({ message: "image is not defined." });

        return Q.ninvoke(image, "contrast", val);
    };

    blur(image, r) {
        if (!image) throw new DataError({ message: "image is not defined." });

        return Q.ninvoke(image, "blur", r);
    };

    opacity(image, f) {
        if (!image) throw new DataError({ message: "image is not defined." });

        return Q.ninvoke(image, "opacity", f);
    };

    scale(image, f) {
        if (!image) throw new DataError({ message: "image is not defined." });

        return Q.ninvoke(image, "scale", f);
    };

    blit(background, image, x, y, srcx, srcy, srcw, srch) {
        if (!image) throw new DataError({ message: "image is not defined." });

        return Q.ninvoke(background, "blit", image, x, y, srcx, srcy, srcw, srch);
    };

    lightness(image) {
        if (!image) throw new DataError({ message: "image is not defined." });
        
        return Q.try(function() {
            var fuzzy = 0.1;
            var bitmap = image.bitmap;
            var data = bitmap.data;
            var r,g,b, max_rgb;
            var light = 0;
            var len = data.length;
            
            for(var x = 0; x < len; x+=4) {
                r = data[x];
                g = data[x+1];
                b = data[x+2];

                max_rgb = Math.max(Math.max(r, g), b);
                if (max_rgb >= 128)
                    light++;
            }

            var lightness = light / (len / 4);
            
            return +lightness.toFixed(2);
        });
    };
};

exports = module.exports = QJimp;