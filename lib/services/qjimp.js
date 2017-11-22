/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */

"use strict";

const { Error } = require("oups");
const Jimp = require("jimp");
const { promisify } = require("util");

const read = promisify(Jimp.read);

class QJimp {
    constructor() {
    };
    
    async toImage(buffer) {
        return await read(buffer);
    };

    async clone(image) {
        return Promise.resolve().then(() => {
            if (!image) throw new Error("Image is not defined.");
            return image.clone();
        });
    };

    async toBuffer(image, contentType) {
        return new Promise((resolve, reject) => {
            if (!contentType) reject(new Error("ContentType is not defined."));
            image.getBuffer(contentType, (err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        });
    };

    async size(image) {
        return Promise.resolve().then(() => {  
            if (!image) throw new Error("Image is not defined.");
            return { width: image.bitmap.width, height: image.bitmap.height };
        });
    };

    async resize(image, width, height) {
        return Promise.resolve().then(() => {  
            if (!image) throw new Error("Image is not defined.");
            if (!width) throw new Error("Width is not defined.");
            if (!height) throw new Error("Height is not defined.");
            return image.resize(width, height);
        });
    };

    async crop(image, left, top, width, height) {
        return Promise.resolve().then(() => {  
            if (!image) throw new Error("Image is not defined.");
            if (left == null) throw new Error("Left is not defined.");
            if (top == null) throw new Error("Top is not defined.");
            if (width == null) throw new Error("Width is not defined.");
            if (height == null) throw new Error("Height is not defined.");
            return image.crop(left, top, width, height);
        });
    };

    async cropAndResize(image, width, height) {
        return this.size(image).then(size => {
            if (!image) throw new Error("Image is not defined.");
            if (!size) throw new Error("Size is not defined.");
            if (!width) throw new Error("Width is not defined.");
            if (!height) throw new Error("Height is not defined.");

            let cropRatio = width / height;
            let imageRatio = size.width / size.height;
            if (cropRatio == imageRatio) {
                return this.resize(image, width, height);
            }
            if (cropRatio < imageRatio) {
                let resizedWidth = height * imageRatio;
                return this.resize(image, resizedWidth, height).then(resizedImage => {
                    return this.size(resizedImage).then(resized => {
                        let left = (resized.width - width) / 2;
                        return this.crop(resizedImage, left, 0, width, height);  
                    });
                });
            }
            else {
                let resizedHeight = width / imageRatio;         
                return this.resize(image, width, resizedHeight).then(resizedImage => {
                    return this.size(resizedImage).then(resized => {
                        let top = (resized.height - height) / 2;
                        return this.crop(resizedImage, 0, top, width, height);  
                    });
                });
            }
        });
    };

    async cropIfNeeded(image, width, height) {
        return this.size(image).then(size => {
            if (!image) throw new Error("Image is not defined.");
            if (!size) throw new Error("Size is not defined.");
            if (!width) throw new Error("Width is not defined.");
            if (!height) throw new Error("Height is not defined.");

            let cropRatio = width / height;
            let imageRatio = size.width / size.height;

            if (cropRatio == imageRatio) {
                return image; //no crop needed
            }

            if (cropRatio < imageRatio) {
                let resizedWidth = width / imageRatio;
                let left = (size.width - resizedWidth) / 2;
                return this.crop(image, left, 0, resizedWidth, size.height);  
            }
            else {
                let resizedWidth = size.height * imageRatio;
                let left = (size.width - resizedWidth) / 2;
                return this.crop(image, left, 0, resizedWidth, size.height); 
            }
        });
    };

    async cropAndAddBackground(image, width, height) {
        return this.size(image).then(size => {
            if (!image) throw new Error("Image is not defined.");
            if (!size) throw new Error("Size is not defined.");
            if (!width) throw new Error("Width is not defined.");
            if (!height) throw new Error("Height is not defined.");
            
            return this.cropIfNeeded(image, width, height).then(cropped => {
                return this.size(cropped).then(size => {
                    return this.clone(cropped).then(background => {

                        let ratio = size.width / size.height;
                        let bgWidth = Math.min(size.width / 2, 200);
                        let bgHeight = bgWidth / ratio;
                        let bgLeft = Math.max(size.width - bgWidth, 0) / 2;
                        let bgTop = Math.max(size.height - bgHeight, 0) / 2;

                        return this.crop(background, bgLeft, bgTop, bgWidth, bgHeight).then(background => {                    
                            return this.resize(background, width, height).then(background => {
                                return this.blur(background, 50).then(background => {
                                    return this.opacity(background, 0.5);
                                });
                            });
                        }).then(background => {

                            return this.scale(cropped, 0.75).then(cropped => {

                                return this.size(cropped).then(thSize => {
                                    let x = (width - thSize.width) / 2;
                                    let y = (height - thSize.height) / 2;

                                    return this.blit(background, cropped, x, y);
                                });
                            });
                        });
                    });
                });
            });
        });
    };

    async smartResize(image, width, height) {
        return Promise.resolve().then(() => {  
            if (!image) throw new Error("Image is not defined.");
            if (!width) throw new Error("Width is not defined.");
            if (!height) throw new Error("Height is not defined.");

            return this.size(image).then(size => {
                if (size.height < height && size.width < width) return this.cropAndAddBackground(image, width, height);
                else return this.cropAndResize(image, width, height);
            });
        });
    };

    transform(image, size) {
        return this.smartResize(image, size.width, size.height);
    };

    greyscale(image) {
        return Promise.resolve().then(() => { 
            if (!image) throw new Error("Image is not defined.");
            return image.greyscale();
        });
    };

    contrast(image, val) {
        return Promise.resolve().then(() => { 
            if (!image) throw new Error("Image is not defined.");
            return image.contrast(val);
        });
    };

    blur(image, r) {
        return Promise.resolve().then(() => { 
            if (!image) throw new Error("Image is not defined.");
            return image.blur(r);
        });
    };

    opacity(image, f) {
        return Promise.resolve().then(() => { 
            if (!image) throw new Error("Image is not defined.");
            return image.opacity(f);
        });
    };

    scale(image, f) {
        return Promise.resolve().then(() => { 
            if (!image) throw new Error("Image is not defined.");
            return image.scale(f);
        });
    };

    blit(background, image, x, y, srcx, srcy, srcw, srch) {
        return Promise.resolve().then(() => { 
            if (!image) throw new Error("Image is not defined.");
            return background.blit(image, x, y, srcx, srcy, srcw, srch);
        });
    };

    lightness(image) {
        return Promise.resolve().then(() => { 
            if (!image) throw new Error("Image is not defined.");

            let fuzzy = 0.1;
            let bitmap = image.bitmap;
            let data = bitmap.data;
            let r,g,b, max_rgb;
            let light = 0;
            let len = data.length;
            
            for(let x = 0; x < len; x+=4) {
                r = data[x];
                g = data[x+1];
                b = data[x+2];

                max_rgb = Math.max(Math.max(r, g), b);
                if (max_rgb >= 128)
                    light++;
            }

            let lightness = light / (len / 4);
            
            return +lightness.toFixed(2);
        });
    };
};

exports = module.exports = QJimp;