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
        const image = await qjimp.read(buffer);
        const buffer = await qjimp.image.getBuffer(, "image/png");
        fs.writeFileSync(output, buffer);
        expect(fs.existsSync(output)).toBe(true);
    });
    
    it("size", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const size = await qjimp.size(image);
        expect(size.width).toBe(800);
        expect(size.height).toBe(550);
    });
    
    it("clone", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const size = await qjimp.size(image);
        const clone = await qjimp.clone(image);
        const cloneSize = await qjimp.size(clone);
        expect(size.width).toBe(cloneSize.width);
        expect(size.height).toBe(cloneSize.height);
    });
    
    it("crop", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const size = await qjimp.size(image);
        expect(size.width).toBe(800);
        expect(size.height).toBe(550);
        const croppedImage = await qjimp.crop(image, 0, 0, 400, 400);
        const croppedSize = await qjimp.size(croppedImage);
        expect(croppedSize.width).toBe(400);
        expect(croppedSize.height).toBe(400);
    });
    
    it("resize", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const size = await qjimp.size(image);
        expect(size.width).toBe(800);
        expect(size.height).toBe(550);
        const resizedImage = await qjimp.resize(image, 400, 225);
        const resizedSize = await qjimp.size(resizedImage);
        expect(resizedSize.width).toBe(400);
        expect(resizedSize.height).toBe(225);
    });
    
    it("cropAndResize same ratio", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const size = await qjimp.size(image);
        expect(size.width).toBe(800);
        expect(size.height).toBe(550);
        const resizedImage = await qjimp.cropAndResize(image, 400, 225);
        const resizedSize = await qjimp.size(resizedImage);
        expect(resizedSize.width).toBe(400);
        expect(resizedSize.height).toBe(225);
    });
    
    it("cropAndResize great ratio", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const size = await qjimp.size(image);
        expect(size.width).toBe(800);
        expect(size.height).toBe(550);
        const resizedImage = await qjimp.cropAndResize(image, 500, 225);
        const resizedSize = await qjimp.size(resizedImage);
        expect(resizedSize.width).toBe(500);
        expect(resizedSize.height).toBe(225);
    });
    
    it("cropAndResize less ratio", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const size = await qjimp.size(image);
        expect(size.width).toBe(800);
        expect(size.height).toBe(550);
        const resizedImage = await qjimp.cropAndResize(image, 400, 300);
        const resizedSize = await qjimp.size(resizedImage);
        expect(resizedSize.width).toBe(400);
        expect(resizedSize.height).toBe(300);
    });
    
    it("scale", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const size = await qjimp.size(image);
        expect(size.width).toBe(800);
        expect(size.height).toBe(550);
        const scaledImage = await qjimp.scale(image, 0.5);
        const scaledSize = await qjimp.size(scaledImage);
        expect(scaledSize.width).toBe(400);
        expect(scaledSize.height).toBe(275);
    });

    it("lightness", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const lightness = await qjimp.lightness(image);
        expect(lightness).toBe(1);
    });
    
    it("lightness", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.dark.png`
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const lightness = await qjimp.lightness(image);
        expect(lightness).toBe(0.75);
    });
    
    it("greyscale", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let output = `${__dirname}/../data/world.out.greyscale.png`;
        if(fs.existsSync(output)) return fs.unlinkSync(output);
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const greyImage = await qjimp.greyscale(image);
        const greyBuffer = await qjimp.image.getBuffer(, "image/png");
        fs.writeFileSync(output, buffer);
        expect(fs.existsSync(output)).toBe(true);
    });
    
    it("contrast", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let output = `${__dirname}/../data/world.out.contrast.png`;
        if(fs.existsSync(output)) return fs.unlinkSync(output);
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const greyImage = await qjimp.contrast(image, 0.75);
        const greyBuffer = await qjimp.image.getBuffer(, "image/png");
        fs.writeFileSync(output, buffer);
        expect(fs.existsSync(output)).toBe(true);
    });
    
    it("blur", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let output = `${__dirname}/../data/world.out.blur.png`;
        if(fs.existsSync(output)) return fs.unlinkSync(output);
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const greyImage = await qjimp.blur(image, 25);
        const greyBuffer = await qjimp.image.getBuffer(, "image/png");
        fs.writeFileSync(output, buffer);
        expect(fs.existsSync(output)).toBe(true);
    });
    
    it("opacity", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let output = `${__dirname}/../data/world.out.opacity.png`;
        if(fs.existsSync(output)) return fs.unlinkSync(output);
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const greyImage = await qjimp.opacity(image, 0.5);
        const greyBuffer = await qjimp.image.getBuffer(, "image/png");
        fs.writeFileSync(output, buffer);
        expect(fs.existsSync(output)).toBe(true);
    });
    
    it("smartResize crop", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let output = `${__dirname}/../data/world.out.smartresize.crop.png`;
        if(fs.existsSync(output)) return fs.unlinkSync(output);
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const greyImage = await qjimp.smartResize(image, 400, 200);
        const greyBuffer = await qjimp.image.getBuffer(, "image/png");
        fs.writeFileSync(output, buffer);
        expect(fs.existsSync(output)).toBe(true);
    });
    
    it("smartResize extend", async () => {
        const qjimp = new QJimp();
        let input = `${__dirname}/../data/world.png`
        let output = `${__dirname}/../data/world.out.smartresize.extend.png`;
        if(fs.existsSync(output)) return fs.unlinkSync(output);
        let buffer = fs.readFileSync(input);
        const image = await qjimp.read(buffer);
        const greyImage = await qjimp.smartResize(image, 1600, 800);
        const greyBuffer = await qjimp.image.getBuffer(, "image/png");
        fs.writeFileSync(output, buffer);
        expect(fs.existsSync(output)).toBe(true);
    });
});