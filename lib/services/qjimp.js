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

Object.assign(Jimp.prototype, {
    size() {
        return { width: this.bitmap.width, height: this.bitmap.height };
    },
    lightness() {
        let fuzzy = 0.1;
        let bitmap = this.bitmap;
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
    },
    async smartResize(width, height) {
        const size = image.size();
        if (size.height < height && size.width < width) await this.cropAndAddBackground(width, height);
        else await this.cropAndResize(width, height);
    },
    cropIfNeeded(width, height) {
        const size = image.size();
        let cropRatio = width / height;
        let imageRatio = size.width / size.height;
        if (cropRatio == imageRatio) return this
        if (cropRatio < imageRatio) {
            let resizedWidth = width / imageRatio;
            let left = (size.width - resizedWidth) / 2;
            return this.crop(left, 0, resizedWidth, size.height);  
        }
        let resizedWidth = size.height * imageRatio;
        let left = (size.width - resizedWidth) / 2;
        return this.crop(left, 0, resizedWidth, size.height); 
    },
    async cropAndResize(width, height) {
        let cropRatio = width / height;
        let imageRatio = size.width / size.height;
        if (cropRatio == imageRatio) {
            await this.resize(width, height);
            return this;
        }
        if (cropRatio < imageRatio) {
            let resizedWidth = height * imageRatio;
            const resizedImage = await this.resize(resizedWidth, height);
            const resized = resizedImage.size();
            let left = (resized.width - width) / 2;
            resizedImage.crop(left, 0, width, height);
            return resizedImage;
        }

        let resizedHeight = width / imageRatio;         
        const resizedImage = await this.resize(width, resizedHeight);
        const resized = resizedImage.size();
        let top = (resized.height - height) / 2;
        resizedImage.crop(0, top, width, height);
        return resizedImage;
    },
    async cropAndAddBackground(width, height) {
        const cropped = await this.cropIfNeeded(width, height);
        const size = cropped.size();
        const background = cropped.clone();
        let ratio = size.width / size.height;
        let bgWidth = Math.min(size.width / 2, 200);
        let bgHeight = bgWidth / ratio;
        let bgLeft = Math.max(size.width - bgWidth, 0) / 2;
        let bgTop = Math.max(size.height - bgHeight, 0) / 2;
        const background2 = background.crop(bgLeft, bgTop, bgWidth, bgHeight);
        background2.resize(width, height);
        background2.blur(50);
        background2.opacity(0.5);
        cropped.scale(0.75);
        const thSize = cropped.size();
        let x = (width - thSize.width) / 2;
        let y = (height - thSize.height) / 2;
        background2.blit(cropped, x, y);
    },
    async transform(size) {
        return await this.smartResize(size.width, size.height);
    }
})

class QJimp {
    constructor() {
    };
    
    async read(buffer) {
        return await read(buffer);
    };
};

exports = module.exports = QJimp;