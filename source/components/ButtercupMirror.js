import React, { Component } from "react";
import {
    AppRegistry,
    View,
    WebView
} from "react-native";

let __currentMirror = null;

export default class ButtercupMirror extends Component {

    constructor(...args) {
        super(...args);
        console.log("SET MIRROR");
        __currentMirror = this;
        this._jobs = {};
    }

    handleDeferredDecode(content, credentials) {
        const jobID = `job${Math.random() * 10000}`;
        this._jobs[jobID] = [];
        this._jobs[jobID][0] = new Promise(resolve => {
            this._jobs[jobID][1] = resolve;
        });
        setTimeout(() => {
            console.log("send message", this.webView);
            console.time("hooray");
            this.webView.postMessage(JSON.stringify({
                command: "decode",
                content,
                credentials: credentials.toInsecureString(),
                jobID
            }));
        }, 2025);
        return this._jobs[jobID][0];
    }

    handleDeferredEncode(historyArr, credentials) {

    }

    onMessage(event) {
        const data = event.nativeEvent.data;
        const msg = JSON.parse(data);
        if (msg && msg.command) {
            switch(msg.command) {
                case "decodeComplete": {
                    console.timeEnd("hooray");
                    const jobID = msg.jobID
                    const cb = this._jobs[jobID][1];
                    delete this._jobs[jobID];
                    // alert("History: " + msg.history.length);
                    cb(msg.history);
                    break;
                }
            }
        }
        // console.log("REC!!!");
        // const data = event.nativeEvent.data;
        // console.log("RECV", data);
        // const msg = JSON.parse(data);
        // if (typeof msg === "object") {
        //     console.log("RECV", msg);
            // switch(msg.command) {
            //     case "echo": {

            //     }
            // }
        // }
    }

    // postMessage = () => {
        // if (this.webView) {
            // this.webView.postMessage("Hai");
            // this.webView.postMessage(JSON.stringify({
            //     command: "echo",
            //     message: "test123"
            // }));
        // }
    // }

    render() {
        return (
            <WebView
                ref={webview => { this.webView = webview; }}
                onMessage={evt => this.onMessage(evt)}
                source={require("./buttercup.html")}
                style={{ width: 600, height: 200 }}
                automaticallyAdjustContentInsets={false}
                scrollEnabled={true}
                />
        );
    }
}

ButtercupMirror.getCurrentMirror = () => __currentMirror;

AppRegistry.registerComponent("ButtercupMirror", () => ButtercupMirror);
