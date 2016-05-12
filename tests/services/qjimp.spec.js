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
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
			let output = path.join(__dirname, "./images/world.out.png");
			
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
        }).then(() => {
            done();
        });
    });
    
    it("size", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(image => {
                return $qjimp.size(image);
            }).then(size => {
                expect(size.width).toBe(800);
                expect(size.height).toBe(550);
            });

        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("clone", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(image => {
                return $qjimp.size(image).then(size => {
                    return $qjimp.clone(image).then(clone => {
                        return $qjimp.size(clone).then(cloneSize => {
                            expect(size.width).toBe(cloneSize.width);
                            expect(size.height).toBe(cloneSize.height);
                        });
                    });
                });
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("crop", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
			
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
        }).then(() => {
            done();
        });
    });
    
    it("resize", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
			
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
        }).then(() => {
            done();
        });
    });
    
    it("cropAndResize same ratio", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
			
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(image => {
                return $qjimp.cropAndResize(image, 400, 225);
            }).then(resizedImage => {
                return $qjimp.size(resizedImage)
            }).then(size => {
                expect(size.width).toBe(400);
                expect(size.height).toBe(225);
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("cropAndResize great ratio", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
			
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(image => {
                return $qjimp.cropAndResize(image, 500, 225);
            }).then(resizedImage => {
                return $qjimp.size(resizedImage)
            }).then(size => {
                expect(size.width).toBe(500);
                expect(size.height).toBe(225);
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("cropAndResize less ratio", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
			
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(image => {
                return $qjimp.cropAndResize(image, 400, 300);
            }).then(resizedImage => {
                return $qjimp.size(resizedImage)
            }).then(size => {
                expect(size.width).toBe(400);
                expect(size.height).toBe(300);
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("scale", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
			
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(image => {
                return $qjimp.size(image).then(size => {
                    expect(size.width).toBe(800);
                    expect(size.height).toBe(550);
                    return $qjimp.scale(image, 0.5);
                });
            }).then(resizedImage => {
                return $qjimp.size(resizedImage)
            }).then(size => {
                expect(size.width).toBe(400);
                expect(size.height).toBe(275);
            });
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });

    it("lightness", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
			
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(image => {
                return $qjimp.lightness(image);
            }).then(result => {
                expect(result).toBe(1);
            });

        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("lightness", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.dark.png");
			
            let buffer = fs.readFileSync(input);
            return $qjimp.toImage(buffer).then(image => {
                return $qjimp.lightness(image);
            }).then(result => {
                expect(result).toBe(0.75);
            });

        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("greyscale", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
			let output = path.join(__dirname, "./images/world.out.greyscale.png");
			
			return Promise.resolve().then(() => {
                if(fs.existsSync(output)) return fs.unlinkSync(output);
            }).then(() => {
                return fs.readFileSync(input);
            }).then(buffer => {
                return $qjimp.toImage(buffer);
            }).then(image => {
                return $qjimp.greyscale(image);
            }).then(image => {
                return $qjimp.toBuffer(image, "image/png");
            }).then(buffer => {
                return fs.writeFileSync(output, buffer);
            }).then(() => {
                expect(fs.existsSync(output)).toBe(true);
			});
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("contrast", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
			let output = path.join(__dirname, "./images/world.out.contrast.png");
			
			return Promise.resolve().then(() => {
                if(fs.existsSync(output)) return fs.unlinkSync(output);
            }).then(() => {
                return fs.readFileSync(input);
            }).then(buffer => {
                return $qjimp.toImage(buffer);
            }).then(image => {
                return $qjimp.contrast(image, 0.75);
            }).then(image => {
                return $qjimp.toBuffer(image, "image/png");
            }).then(buffer => {
                return fs.writeFileSync(output, buffer);
            }).then(() => {
                expect(fs.existsSync(output)).toBe(true);
			});
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("blur", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
			let output = path.join(__dirname, "./images/world.out.blur.png");
			
			return Promise.resolve().then(() => {
                if(fs.existsSync(output)) return fs.unlinkSync(output);
            }).then(() => {
                return fs.readFileSync(input);
            }).then(buffer => {
                return $qjimp.toImage(buffer);
            }).then(image => {
                return $qjimp.blur(image, 25);
            }).then(image => {
                return $qjimp.toBuffer(image, "image/png");
            }).then(buffer => {
                return fs.writeFileSync(output, buffer);
            }).then(() => {
                expect(fs.existsSync(output)).toBe(true);
			});
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("opacity", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
			let output = path.join(__dirname, "./images/world.out.opacity.png");
			
			return Promise.resolve().then(() => {
                if(fs.existsSync(output)) return fs.unlinkSync(output);
            }).then(() => {
                return fs.readFileSync(input);
            }).then(buffer => {
                return $qjimp.toImage(buffer);
            }).then(image => {
                return $qjimp.opacity(image, 0.5);
            }).then(image => {
                return $qjimp.toBuffer(image, "image/png");
            }).then(buffer => {
                return fs.writeFileSync(output, buffer);
            }).then(() => {
                expect(fs.existsSync(output)).toBe(true);
			});
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("smartResize crop", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
			let output = path.join(__dirname, "./images/world.out.smartresize.crop.png");
			
			return Promise.resolve().then(() => {
                if(fs.existsSync(output)) return fs.unlinkSync(output);
            }).then(() => {
                return fs.readFileSync(input);
            }).then(buffer => {
                return $qjimp.toImage(buffer);
            }).then(image => {
                return $qjimp.smartResize(image, 400, 200);
            }).then(image => {
                return $qjimp.toBuffer(image, "image/png");
            }).then(buffer => {
                return fs.writeFileSync(output, buffer);
            }).then(() => {
                expect(fs.existsSync(output)).toBe(true);
			});
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
    
    it("smartResize extend", done => {
        
        return Promise.resolve().then(() => {
            let $qjimp = new QJimp();
            
            let input = path.join(__dirname, "./images/world.png");
			let output = path.join(__dirname, "./images/world.out.smartresize.extend.png");
			
			return Promise.resolve().then(() => {
                if(fs.existsSync(output)) return fs.unlinkSync(output);
            }).then(() => {
                return fs.readFileSync(input);
            }).then(buffer => {
                return $qjimp.toImage(buffer);
            }).then(image => {
                return $qjimp.smartResize(image, 1600, 800);
            }).then(image => {
                return $qjimp.toBuffer(image, "image/png");
            }).then(buffer => {
                return fs.writeFileSync(output, buffer);
            }).then(() => {
                expect(fs.existsSync(output)).toBe(true);
			});
        }).catch(error => {
            expect(error.stack).toBeNull();
        }).then(() => {
            done();
        });
    });
});