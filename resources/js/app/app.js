/**
 * App Core Module
 * ES6 Module for Blade Compiler
 */

import { HttpService } from "./core/services/HttpService.js";
import { Router } from "./core/Router.js";
import { View } from "./core/View.js";
import { API } from "./core/API.js";
import { Helper } from "./core/Helper.js";
import initApp from "./init.js";

export class Application {
    constructor() {
        this.name = 'OneApp';
        this.Helper = new Helper(this);
        this.View = new View(this);
        this.Router = new Router(this);
        this.HttpService = HttpService;
        this.http = new HttpService();
        this.API = API;
        this.mode = 'development';
        this.isInitialized = false;
        this.env = {
            mode: 'web',
            debug: false,
            base_url: '/',
            csrf_token: '',
            router_mode: 'history',
        }
        
    }
    init() {
        if(this.isInitialized) {
            return;
        }
        initApp(this);
        this.isInitialized = true;
    }
}

export const App = new Application();

export default App;
