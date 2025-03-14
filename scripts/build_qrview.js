const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "./QRScanner.template.html");

const qrViewPath = path.join(__dirname, "../resources/html/OTPScanner.html");

async function buildQrView() {
    const jsqr = fs.readFileSync(require.resolve("jsqr/dist/jsQr.js"));
    const html = fs.readFileSync(htmlPath, "utf8");

    const qrView = html.replace("{ { jsQRScript } }", jsqr);

    fs.writeFileSync(qrViewPath, qrView);
}

buildQrView();
