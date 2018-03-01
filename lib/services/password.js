/*!
 * qwebs
 * Copyright(c) 2018 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { Error, UndefinedError } = require("oups");

class PasswordService {
    constructor($crypto) {
        this.crypto = $crypto;
    };

    generatePassword() {
        let keylist="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let keylist2 = keylist + "_-+&*."

        let value = keylist.charAt(Math.floor(Math.random() * keylist.length));
        for (let i = 0; i < 4; i++)
            value += keylist2.charAt(Math.floor(Math.random() * keylist2.length));
        value += keylist.charAt(Math.floor(Math.random() * keylist.length));

        if (/\d/.test(value) == false) return this.generatePassword();

        return value;
    };

    generate(clear = this.generatePassword(), salt = this.crypto.iv) {
		const password = this.crypto.pbkdf2(clear, salt);
		const s = salt.toString("base64");
		const p = password.toString("base64");
        return {
            password: p,
            salt: s,
            clear
        }
    }

};

exports = module.exports = PasswordService;
