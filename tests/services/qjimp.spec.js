/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau
 * MIT Licensed
 */
"use strict";

const QJimp = require('../../lib/services/qjimp');
const fs = require("fs");
const path = require('path');

describe("qjimp", () => {

    it("toImage & toBuffer", done => {
        
        return Promise.resolve().then(() => {
            var $qjimp = new QJimp();
            
            var input = path.join(__dirname, "./images/world.png");
			var output = path.join(__dirname, "./images/world.out.png");
			
			return Promise.resolve().then(() => {
                if(fs.existsSync(output)) return fs.unlinkSync(output);
            }).then(() => {
                return fs.readFileSync(input);
            }).then(buffer => {
                return $qjimp.toImage(buffer);
            }).then(image => {
                return $qjimp.toBuffer(image, "image/png");
            }).then(buffer => {
                return fs.writeFileSync(output, buffer);
            }).then(() => {
                expect(fs.existsSync(output)).toBe(true);
			});
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("size", done => {
        
        return Promise.resolve().then(() => {
            var $qjimp = new QJimp();
            
            var input = path.join(__dirname, "./images/world.png");
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(image => {
                return $qjimp.size(image);
            }).then(size => {
                expect(size.width).toBe(800);
                expect(size.height).toBe(550);
            });

        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("crop", done => {
        
        return Promise.resolve().then(() => {
            var $qjimp = new QJimp();
            
            var input = path.join(__dirname, "./images/world.png");
			
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(image => {
                return $qjimp.size(image).then(size => {
                    expect(size.width).toBe(800);
                    expect(size.height).toBe(550);
                    return image;
                });
            }).then(image => {
                return $qjimp.crop(image, 0, 0, 400, 400);
            }).then(croppedImage => {
                return $qjimp.size(croppedImage)
            }).then(size => {
                expect(size.width).toBe(400);
                expect(size.height).toBe(400);
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("resize", done => {
        
        return Promise.resolve().then(() => {
            var $qjimp = new QJimp();
            
            var input = path.join(__dirname, "./images/world.png");
			
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(image => {
                return $qjimp.size(image).then(size => {
                    expect(size.width).toBe(800);
                    expect(size.height).toBe(550);
                    return image;
                });
            }).then(image => {
                return $qjimp.resize(image, 400, 225);
            }).then(resizedImage => {
                return $qjimp.size(resizedImage)
            }).then(size => {
                expect(size.width).toBe(400);
                expect(size.height).toBe(225);
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("lightness", done => {
        
        return Promise.resolve().then(() => {
            var $qjimp = new QJimp();
            
            var input = path.join(__dirname, "./images/world.png");
			
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(image => {
                return $qjimp.lightness(image);
            }).then(result => {
                expect(result).toBe(1);
            });

        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(done);
    });
    
    it("lightness", done => {
        
        return Promise.resolve().then(() => {
            var $qjimp = new QJimp();
            
            var input = path.join(__dirname, "./images/world.dark.png");
			
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(image => {
                return $qjimp.lightness(image);
            }).then(result => {
                expect(result).toBe(0.75);
            });

        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(done);
    });
});