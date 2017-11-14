class AnnotationParser {

    static parse(dataString) {
        let macth;
        let matches = [];
        while (match = /\*([^*]|[\s]|(\*+([^*/]|[\s])))*\*+/g.exec(dataString)) {
            console.log(match[0])
            matches.push(match[0].replace(/(\*|[\s])/g, ''));
        }

        var comments = this.parseComments(matches);
        return comments;
    }

    static parseComments(comments) {
        let annotations = [];

        for (let comment of comments) {
            const match = /^@(\w)/.exec(comment);
            if (match) {
                const name = match[2];
            }
        }

        return annotations;
    }
}

module.exports = new AnnotationParser();