/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const QJimp = require('../../lib/services/qjimp');
const fs = require("fs");
const path = require('path');

describe("qjimp", () => {

    it("toImage & toBuffer", async () => {
        const qjimp = new QJimp();
        
        let input = `${__dirname}/../data/world.png`
        let output = `${__dirname}/../data/world.out.png`;
        
        if(fs.existsSync(output)) fs.unlinkSync(output);

        fs.readFileSync(input);
        const image = await qjimp.toImage(buffer);
        const buffer = await qjimp.toBuffer(image, "image/png");
        fs.writeFileSync(output, buffer);

        expect(fs.existsSync(output)).toBe(true);
    });
    
    it("size", async () => {
        const qjimp = new QJimp();
        
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.toImage(buffer);
        const size = await qjimp.size(image);
        expect(size.width).toBe(800);
        expect(size.height).toBe(550);
    });
    
    it("clone", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.png`
            let buffer = fs.readFileSync(input);
            const image = await qjimp.toImage(buffer);
                return qjimp.size(image).then(size => {
                    return qjimp.clone(image).then(clone => {
                        return qjimp.size(clone).then(cloneSize => {
                            expect(size.width).toBe(cloneSize.width);
                            expect(size.height).toBe(cloneSize.height);
                        });
                    });
                });
            });
        }).catch(fail).then(done);
    });
    
    it("crop", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.png`
			
            let buffer = fs.readFileSync(input);
            const image = await qjimp.toImage(buffer);
                return qjimp.size(image).then(size => {
                    expect(size.width).toBe(800);
                    expect(size.height).toBe(550);
                    return image;
                });
            }).then(image => {
                return qjimp.crop(image, 0, 0, 400, 400);
            }).then(croppedImage => {
                return qjimp.size(croppedImage)
            }).then(size => {
                expect(size.width).toBe(400);
                expect(size.height).toBe(400);
            });
        }).catch(fail).then(done);
    });
    
    it("resize", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.png`
			
            let buffer = fs.readFileSync(input);
            const image = await qjimp.toImage(buffer);
                return qjimp.size(image).then(size => {
                    expect(size.width).toBe(800);
                    expect(size.height).toBe(550);
                    return image;
                });
            }).then(image => {
                return qjimp.resize(image, 400, 225);
            }).then(resizedImage => {
                return qjimp.size(resizedImage)
            }).then(size => {
                expect(size.width).toBe(400);
                expect(size.height).toBe(225);
            });
        }).catch(fail).then(done);
    });
    
    it("cropAndResize same ratio", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.png`
			
            let buffer = fs.readFileSync(input);
            const image = await qjimp.toImage(buffer);
                return qjimp.cropAndResize(image, 400, 225);
            }).then(resizedImage => {
                return qjimp.size(resizedImage)
            }).then(size => {
                expect(size.width).toBe(400);
                expect(size.height).toBe(225);
            });
        }).catch(fail).then(done);
    });
    
    it("cropAndResize great ratio", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.png`
			
            let buffer = fs.readFileSync(input);
            const image = await qjimp.toImage(buffer);
                return qjimp.cropAndResize(image, 500, 225);
            }).then(resizedImage => {
                return qjimp.size(resizedImage)
            }).then(size => {
                expect(size.width).toBe(500);
                expect(size.height).toBe(225);
            });
        }).catch(fail).then(done);
    });
    
    it("cropAndResize less ratio", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.png`
			
            let buffer = fs.readFileSync(input);
            const image = await qjimp.toImage(buffer);
                return qjimp.cropAndResize(image, 400, 300);
            }).then(resizedImage => {
                return qjimp.size(resizedImage)
            }).then(size => {
                expect(size.width).toBe(400);
                expect(size.height).toBe(300);
            });
        }).catch(fail).then(done);
    });
    
    it("scale", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.png`
			
            let buffer = fs.readFileSync(input);
            const image = await qjimp.toImage(buffer);
                return qjimp.size(image).then(size => {
                    expect(size.width).toBe(800);
                    expect(size.height).toBe(550);
                    return qjimp.scale(image, 0.5);
                });
            }).then(resizedImage => {
                return qjimp.size(resizedImage)
            }).then(size => {
                expect(size.width).toBe(400);
                expect(size.height).toBe(275);
            });
        }).catch(fail).then(done);
    });

    it("lightness", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.png`
			
            let buffer = fs.readFileSync(input);
            const image = await qjimp.toImage(buffer);
                return qjimp.lightness(image);
            }).then(result => {
                expect(result).toBe(1);
            });
        }).catch(fail).then(done);
    });
    
    it("lightness", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.dark.png`
			
            let buffer = fs.readFileSync(input);
            const image = await qjimp.toImage(buffer);
                return qjimp.lightness(image);
            }).then(result => {
                expect(result).toBe(0.75);
            });
        }).catch(fail).then(done);
    });
    
    it("greyscale", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.png`;
            let output = `${__dirname}/../data/world.out.greyscale.png`;
			
			return Promise.resolve().then(() => {
                if(fs.existsSync(output)) return fs.unlinkSync(output);
            }).then(() => {
                return fs.readFileSync(input);
            }).then(buffer => {
                return qjimp.toImage(buffer);
            }).then(image => {
                return qjimp.greyscale(image);
            }).then(image => {
                return qjimp.toBuffer(image, "image/png");
            }).then(buffer => {
                return fs.writeFileSync(output, buffer);
            }).then(() => {
                expect(fs.existsSync(output)).toBe(true);
			});
        }).catch(fail).then(done);
    });
    
    it("contrast", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.png`
            let output = `${__dirname}/../data/world.out.contrast.png`;
			
			return Promise.resolve().then(() => {
                if(fs.existsSync(output)) return fs.unlinkSync(output);
            }).then(() => {
                return fs.readFileSync(input);
            }).then(buffer => {
                return qjimp.toImage(buffer);
            }).then(image => {
                return qjimp.contrast(image, 0.75);
            }).then(image => {
                return qjimp.toBuffer(image, "image/png");
            }).then(buffer => {
                return fs.writeFileSync(output, buffer);
            }).then(() => {
                expect(fs.existsSync(output)).toBe(true);
			});
        }).catch(fail).then(done);
    });
    
    it("blur", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.png`
            let output = `${__dirname}/../data/world.out.blur.png`;
			
			return Promise.resolve().then(() => {
                if(fs.existsSync(output)) return fs.unlinkSync(output);
            }).then(() => {
                return fs.readFileSync(input);
            }).then(buffer => {
                return qjimp.toImage(buffer);
            }).then(image => {
                return qjimp.blur(image, 25);
            }).then(image => {
                return qjimp.toBuffer(image, "image/png");
            }).then(buffer => {
                return fs.writeFileSync(output, buffer);
            }).then(() => {
                expect(fs.existsSync(output)).toBe(true);
			});
        }).catch(fail).then(done);
    });
    
    it("opacity", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.png`
            let output = `${__dirname}/../data/world.out.opacity.png`;
			
			return Promise.resolve().then(() => {
                if(fs.existsSync(output)) return fs.unlinkSync(output);
            }).then(() => {
                return fs.readFileSync(input);
            }).then(buffer => {
                return qjimp.toImage(buffer);
            }).then(image => {
                return qjimp.opacity(image, 0.5);
            }).then(image => {
                return qjimp.toBuffer(image, "image/png");
            }).then(buffer => {
                return fs.writeFileSync(output, buffer);
            }).then(() => {
                expect(fs.existsSync(output)).toBe(true);
			});
        }).catch(fail).then(done);
    });
    
    it("smartResize crop", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.png`
            let output = `${__dirname}/../data/world.out.smartresize.crop.png`;
			
			return Promise.resolve().then(() => {
                if(fs.existsSync(output)) return fs.unlinkSync(output);
            }).then(() => {
                return fs.readFileSync(input);
            }).then(buffer => {
                return qjimp.toImage(buffer);
            }).then(image => {
                return qjimp.smartResize(image, 400, 200);
            }).then(image => {
                return qjimp.toBuffer(image, "image/png");
            }).then(buffer => {
                return fs.writeFileSync(output, buffer);
            }).then(() => {
                expect(fs.existsSync(output)).toBe(true);
			});
        }).catch(fail).then(done);
    });
    
    it("smartResize extend", async () => {
        
        return Promise.resolve().then(() => {
            const qjimp = new QJimp();
            
            let input = `${__dirname}/../data/world.png`
            let output = `${__dirname}/../data/world.out.smartresize.extend.png`;
			
			return Promise.resolve().then(() => {
                if(fs.existsSync(output)) return fs.unlinkSync(output);
            }).then(() => {
                return fs.readFileSync(input);
            }).then(buffer => {
                return qjimp.toImage(buffer);
            }).then(image => {
                return qjimp.smartResize(image, 1600, 800);
            }).then(image => {
                return qjimp.toBuffer(image, "image/png");
            }).then(buffer => {
                return fs.writeFileSync(output, buffer);
            }).then(() => {
                expect(fs.existsSync(output)).toBe(true);
			});
        }).catch(fail).then(done);
    });
});