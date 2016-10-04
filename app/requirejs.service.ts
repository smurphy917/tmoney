import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class RequirejsService implements OnInit{
    requirejs : any;
    ngOnInit(){
        this.requirejs = require("node_modules/requirejs/bin/r.js");
        this.requirejs.config({
            nodeRequire: require
        })
    }
}