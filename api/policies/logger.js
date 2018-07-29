const fs = require('fs');
const path = require('path');

module.exports = async function (req, res, proceed) {
    const now = new Date();
    const date = now.getFullYear() + '/' + (now.getMonth()+1) + '/' + now.getDate() + '-' + `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`;
    const text = `${date} | Host: ${req.headers.hostname} | Url: ${req.url} | Body: ${JSON.stringify(req.body)}\n`;

    fs.appendFile('logs.txt', text, (err) => {  
        if (err) throw err;
        proceed();
    });
}