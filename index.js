const fs = require('fs');
const path = require('path');
const express = require('express');

const PORT = 80;

const app = express();

function buildPage(filePath, args, callback) {
    fs.readFile(filePath, (error, data) => {
        let content;
        if (error) content = `<code style="color:red;">[${error.code}: ${error.errno}]</code>`;
        else content = data.toString();
        const variableRegex = /(?<!\\)\{(>?[A-z0-9.]+)\}/g;
        const matches = [...content.matchAll(variableRegex)]
        const replaceText = (text, index, length, replacement) => {
            start = text.substr(0, index);
            end = text.substr(index + length, text.length);
            return start + replacement + end;
        };
        const replaceMatch = (matchIndex, content) => {
            if (matchIndex >= 0) {
                let match = matches[matchIndex];
                let key = match[1].trim();
                let isPage = key.startsWith('>');
                if (isPage) {
                    let newFilePath = path.join(path.dirname(filePath), key.substr(1).trim());
                    buildPage(newFilePath, args, (newContent) => {
                        content = replaceText(content, match.index, match[0].length, newContent);
                        replaceMatch(matchIndex - 1, content);
                    });
                } else {
                    let replacement;
                    if (key in args) replacement = args[key];
                    else replacement = `<code style="color:red;">[${key}: ${args[key]}]</code>`;
                    content = replaceText(content, match.index, match[0].length, replacement);
                    replaceMatch(matchIndex - 1, content);
                }
            } else {
                callback(content);
            }
        };
        replaceMatch(matches.length - 1, content);
    });
}

app.set('views', `${__dirname}/public`);
app.engine('html', (filePath, args, callback) => buildPage(filePath, args, (content) => callback(null, content)));
app.set('view engine', 'html');

app.use(express.static('public'));

app.get('*', (req, res) => {
    const indexPath = `${__dirname}/public/index.html`
    fs.exists(indexPath, indexExists => {
        if (indexExists) {
            const requestPath = path.join(__dirname, 'public', `${req.originalUrl}.html`);
            fs.exists(requestPath, requestExists => {
                if (requestExists) {
                    buildPage(requestPath, {}, (page) => {
                        res.render(indexPath, { main: page });
                    });
                } else {
                    res.render(indexPath, { main: "404. Page not found." });
                }
            });
        } else res.end();
    });
});

app.listen(PORT, () => {
    console.log(`Server now listening on port ${PORT}.`);
});