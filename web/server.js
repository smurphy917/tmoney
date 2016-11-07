"use strict";

let express = require("express");
let app = express();

const isDev = process.env.NODE_ENV !== "production";

if(isDev){
    let webpack = require("webpack");
    let webpackMiddleware = require("webpack-dev-middleware");
    let webpackHotMiddleware = require("webpack-hot-middleware");
    let config = require("./webpack.config.js");
    let compiler = webpack(config); 
    app.use(webpackMiddleware(compiler));
    app.use(webpackHotMiddleware(compiler));
}else{
    //use nginx
    //TODO: implement
    //...may not need to actually do anything, just serve files from publicPath in nginx server
    //      actually may be able to run both DEV and PROD versions simultaneously. 
}

app.listen(8080,function(){
    console.log("tmoney live on 8080");
});

