/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const QJimp = require('../../lib/services/qjimp');
const fs = require("fs");
const path = require('path');

describe("qjimp", function () {

    it("toImage & toBuffer", function (done) {
        
        return Promise.resolve().then(() => {
            var $qjimp = new QJimp();
            
            var input = path.join(__dirname, "./images/world.png");
			var output = path.join(__dirname, "./images/world.out.png");
			
			return Promise.resolve().then(() => {
                if(fs.existsSync(output)) return fs.unlinkSync(output);
            }).then(function() {
                return fs.readFileSync(input);
            }).then(function(buffer) {
                return $qjimp.toImage(buffer);
            }).then(function(image) {
                return $qjimp.toBuffer(image, "image/png");
            }).then(function(buffer) {
                return fs.writeFileSync(output, buffer);
            }).then(function() {
                expect(fs.existsSync(output)).toBe(true);
			});
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("size", function (done) {
        
        return Promise.resolve().then(() => {
            var $qjimp = new QJimp();
            
            var input = path.join(__dirname, "./images/world.png");
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(function(image) {
                return $qjimp.size(image);
            }).then(function(size) {
                expect(size.width).toBe(800);
                expect(size.height).toBe(550);
            });

        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("crop", function (done) {
        
        return Promise.resolve().then(() => {
            var $qjimp = new QJimp();
            
            var input = path.join(__dirname, "./images/world.png");
			
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(function(image) {
                return $qjimp.size(image).then(function(size) {
                    expect(size.width).toBe(800);
                    expect(size.height).toBe(550);
                    return image;
                });
            }).then(function(image) {
                return $qjimp.crop(image, 0, 0, 400, 400);
            }).then(function(croppedImage) {
                return $qjimp.size(croppedImage)
            }).then(function(size) {
                expect(size.width).toBe(400);
                expect(size.height).toBe(400);
            });
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("resize", function (done) {
        
        return Promise.resolve().then(() => {
            var $qjimp = new QJimp();
            
            var input = path.join(__dirname, "./images/world.png");
			
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(function(image) {
                return $qjimp.size(image).then(function(size) {
                    expect(size.width).toBe(800);
                    expect(size.height).toBe(550);
                    return image;
                });
            }).then(function(image) {
                return $qjimp.resize(image, 400, 225);
            }).then(function(resizedImage) {
                return $qjimp.size(resizedImage)
            }).then(function(size) {
                expect(size.width).toBe(400);
                expect(size.height).toBe(225);
            });
        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("lightness", function (done) {
        
        return Promise.resolve().then(() => {
            var $qjimp = new QJimp();
            
            var input = path.join(__dirname, "./images/world.png");
			
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(function(image) {
                return $qjimp.lightness(image);
            }).then(function(result) {
                expect(result).toBe(1);
            });

        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("lightness", function (done) {
        
        return Promise.resolve().then(() => {
            var $qjimp = new QJimp();
            
            var input = path.join(__dirname, "./images/world.dark.png");
			
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(function(image) {
                return $qjimp.lightness(image);
            }).then(function(result) {
                expect(result).toBe(0.75);
            });

        }).catch(function (error) {
            expect(error.stack).toBeNull();
        }).then(done);
    });
});