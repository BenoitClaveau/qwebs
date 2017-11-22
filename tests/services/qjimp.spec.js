/*!
 * qwebs
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
const QJimp = require("../../lib/services/qjimp");
const fs = require("fs");
const path = require("path");
const expect = require("expect.js");

describe("qjimp", () => {

    it("read & write", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let output = `${__dirname}/../data/world.out.png`;
        if(fs.existsSync(output)) fs.unlinkSync(output);
        fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const buffer = await image.getBuffer("image/png");
        fs.writeFileSync(output, buffer);
        expect(fs.existsSync(output)).to.be(true);
    });
    
    it("size", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const size = image.size(image);
        expect(size.width).to.be(800);
        expect(size.height).to.be(550);
    });
    
    it("clone", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const size = image.size(image);
        const clone = image.clone();
        const cloneSize = image.size(clone);
        expect(size.width).to.be(cloneSize.width);
        expect(size.height).to.be(cloneSize.height);
    });
    
    it("crop", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const size = image.size(image);
        expect(size.width).to.be(800);
        expect(size.height).to.be(550);
        const croppedImage = await image.crop(0, 0, 400, 400);
        const croppedSize = image.size(croppedImage);
        expect(croppedSize.width).to.be(400);
        expect(croppedSize.height).to.be(400);
    });
    
    it("resize", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const size = image.size(image);
        expect(size.width).to.be(800);
        expect(size.height).to.be(550);
        const resizedImage = await image.resize(400, 225);
        const resizedSize = image.size(resizedImage);
        expect(resizedSize.width).to.be(400);
        expect(resizedSize.height).to.be(225);
    });
    
    it("cropAndResize same ratio", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const size = image.size(image);
        expect(size.width).to.be(800);
        expect(size.height).to.be(550);
        const resizedImage = await image.cropAndResize(400, 225);
        const resizedSize = image.size(resizedImage);
        expect(resizedSize.width).to.be(400);
        expect(resizedSize.height).to.be(225);
    });
    
    it("cropAndResize great ratio", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const size = image.size(image);
        expect(size.width).to.be(800);
        expect(size.height).to.be(550);
        const resizedImage = await image.cropAndResize(500, 225);
        const resizedSize = image.size(resizedImage);
        expect(resizedSize.width).to.be(500);
        expect(resizedSize.height).to.be(225);
    });
    
    it("cropAndResize less ratio", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const size = image.size(image);
        expect(size.width).to.be(800);
        expect(size.height).to.be(550);
        const resizedImage = await image.cropAndResize(400, 300);
        const resizedSize = image.size(resizedImage);
        expect(resizedSize.width).to.be(400);
        expect(resizedSize.height).to.be(300);
    });
    
    it("scale", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const size = image.size(image);
        expect(size.width).to.be(800);
        expect(size.height).to.be(550);
        const scaledImage = await image.scale(0.5);
        const scaledSize = image.size(scaledImage);
        expect(scaledSize.width).to.be(400);
        expect(scaledSize.height).to.be(275);
    });

    it("lightness", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const lightness = await image.lightness();
        expect(lightness).to.be(1);
    });
    
    it("lightness", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.dark.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const lightness = await image.lightness();
        expect(lightness).to.be(0.75);
    });
    
    it("greyscale", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let output = `${__dirname}/../data/world.out.greyscale.png`;
        if(fs.existsSync(output)) return fs.unlinkSync(output);
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const greyImage = await image.greyscale();
        const greyBuffer = await image.getBuffer("image/png");
        fs.writeFileSync(output, buffer);
        expect(fs.existsSync(output)).to.be(true);
    });
    
    it("contrast", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let output = `${__dirname}/../data/world.out.contrast.png`;
        if(fs.existsSync(output)) return fs.unlinkSync(output);
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const greyImage = await image.contrast(0.75);
        const greyBuffer = await image.getBuffer("image/png");
        fs.writeFileSync(output, buffer);
        expect(fs.existsSync(output)).to.be(true);
    });
    
    it("blur", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let output = `${__dirname}/../data/world.out.blur.png`;
        if(fs.existsSync(output)) return fs.unlinkSync(output);
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const greyImage = await image.blur(25);
        const greyBuffer = await image.getBuffer("image/png");
        fs.writeFileSync(output, buffer);
        expect(fs.existsSync(output)).to.be(true);
    });
    
    it("opacity", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let output = `${__dirname}/../data/world.out.opacity.png`;
        if(fs.existsSync(output)) return fs.unlinkSync(output);
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const greyImage = await image.opacity(0.5);
        const greyBuffer = await image.getBuffer("image/png");
        fs.writeFileSync(output, buffer);
        expect(fs.existsSync(output)).to.be(true);
    });
    
    it("smartResize crop", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let output = `${__dirname}/../data/world.out.smartresize.crop.png`;
        if(fs.existsSync(output)) return fs.unlinkSync(output);
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const greyImage = await image.smartResize(400, 200);
        const greyBuffer = await image.getBuffer("image/png");
        fs.writeFileSync(output, buffer);
        expect(fs.existsSync(output)).to.be(true);
    });
    
    it("smartResize extend", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let output = `${__dirname}/../data/world.out.smartresize.extend.png`;
        if(fs.existsSync(output)) return fs.unlinkSync(output);
        let buffer = fs.readFileSync(input);
        const image = await qjimp.readFile(input);
        const greyImage = await image.smartResize(1600, 800);
        const greyBuffer = await image.getBuffer("image/png");
        fs.writeFileSync(output, buffer);
        expect(fs.existsSync(output)).to.be(true);
    });
});