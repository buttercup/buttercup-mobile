const fs = require("fs");
const path = require("path");

const jsqrPath = path.join(__dirname, "../node_modules/jsqr/dist/jsQR.js");

const htmlPath = path.join(__dirname, "./QRScanner.template.html");

const qrViewPath = path.join(__dirname, "../resources/html/OTPScanner.html");

async function buildQrView() {
    const jsqr = fs.readFileSync(jsqrPath, "utf8");
    const html = fs.readFileSync(htmlPath, "utf8");

    const qrView = html.replace("{ { jsQRScript } }", jsqr);

    fs.writeFileSync(qrViewPath, qrView);
}

buildQrView();
