const net = require("net");

class Request {
    //method, url = host + port + path
    //body: key/value
    //headers
    constructor(options) {
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || "/";
        this.body = options.body || {};
        this.headers = options.headers || {};
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }

        if (this.headers["Content-Type"] === "application/json") {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
        }
        this.headers["Content-Lenght"] = this.bodyText.length;

    }

    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
    }

    send(connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser();
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                })
            }
            connection.on('data', (data) => {
                parser.receive(data.toString());
                console.log(parser.statusLine);
                console.log(parser.headers);
                // resolve(data.toString());
                connection.end();
            });
            connection.on('error', (error) => {
                reject(err);
                connection.end()
            });
        });
    }
}

class Response {

}

class ResponseParser {
    constructor() {
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_STATUS_LINE_END = 5;
        this.WAITING_STATUS_BLOCK_END = 6;
        this.WAITING_BODY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
    }
    receive(string) {
        for (let i = 0; i < string.lenght; i++) {
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char) {
        if (this.current === this.WAITING_STATUS_LINE) {
            console.log(char.charCodeAT(0));
            if (char === "\r") {
                this.current = this.WAITING_STATUS_LINE_END;
            } else if (char === "\n") {
                this.current = this.WAITING_HEADER_NAME;
            } else {
                this.statusLine += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === "\n") {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_NAME) {
            console.log(char);
            if (char === ":") {
                this.current = this.WAITING_HEADER_SPACE;
            } else if (char === "\r") {
                this.current = this.WAITING_STATUS_BLOCK_END;
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new TrunkedBodyParser();
                }
            } else {
                this.headerName += char;
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) {
            if (char === " ") {
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === "\r") {
                this.current = this.WAITING_STATUS_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            } else {
                this.headerValue += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === "\n") {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_BODY) {
            this.bodyParser.receiveChar(char);
        }
    }
}

class TrunkedBodyParser {
    constructor() {

    }
    receive(string) {

    }
}

void async function () {
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8088",
        path: "/",
        headers: {
            ["X-Foo2"]: "customed"
        },
        body: {
            neme: "zhl"
        }
    });

    let response = await request.send();
    console.log(response);
}();