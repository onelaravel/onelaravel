import { uniqId } from "../helpers/utils.js";
import OneMarkup, { OneMarkupModel } from "./OneMarkup.js";
import OneDOM from "./OneDOM.js";
import { ViewState } from "./ViewState.js";


export class FollowingBlock {
    constructor({ App, engine, stateKeys = [], renderBlock = () => '', scanMode = false, renderID = '' }) {
        /**
         * @type {Application}
         */
        this.App = App;
        /**
         * @type {ViewEngine}
         */
        this.engine = engine;
        /**
         * @type {ViewState}
         */
        this.states = engine.states;
        /**
         * @type {Array}
         */
        this.stateKeys = stateKeys;
        /**
         * @type {function}
         */
        this.renderBlock = renderBlock;
        /**
         * @type {boolean}
         */
        this.scanMode = scanMode;
        /**
         * @type {string}
         */
        this.id = renderID || uniqId();
        /**
         * @type {boolean}
         */
        this.isRendered = false;

        this.openTag = null;
        this.closeTag = null;
        this.refElements = [];
        this.subscribes = [];
        this.isMounted = false;
        this.isScanned = false;
        /**
         * @type {OneMarkupModel|null}
         */
        this.markup = null;
    }
    mounted() {
        if (this.isMounted) return;
        this.isMounted = true;
        this.scan();
        if (this.stateKeys.length > 0) {
            this.stateKeys.forEach(stateKey => {
                const unsubscribe = this.states.__subscribe(stateKey, () => {
                    console.log(`FollowingBlock [id=${this.id}] detected change in state "${stateKey}", renewing...`);
                    this.renew();
                });
                this.subscribes.push(unsubscribe);
            });
        }
    }
    unmounted() {
        this.isMounted = false;
        if (this.subscribes.length > 0) {
            this.subscribes.forEach(unsubscribe => {
                unsubscribe();
            });
            this.subscribes = [];
        }
    }

    placeholder() {
        return `<!-- [one:placeholder ref="following" id="${this.id}"] --><!-- [/one:placeholder] -->`;
    }

    render() {
        
        return `<!-- [one:follow type="state" id="${this.id}" following="${this.stateKeys.join(',')}"] viewid="${this.id}" -->${this.renderBlock()}<!-- [/one:follow] -->`;
    }
    rerender() {
        return this.renderBlock();
    }
    renew() {
        this.engine.onFollowUpdating();
        try {
            this.unmounted();
            this.clear();
            if (this.closeTag && this.closeTag.parentNode) {
                OneDOM.before(this.closeTag, this.rerender());
                this.mounted();
            }
        } catch (e) {
            console.error('FollowingBlock renew error:', e);
        }
        this.engine.onFollowUpdated();
    }

    destroy() {
        this.unmounted();
        this.clear();
    }


    scan() {
        console.log(`FollowingBlock [id=${this.id}] scanning...`);
        if(!this.markup){
            this.markup = OneMarkup.first('follow', { id: this.id }, {}, false);
            this.openTag = this.markup.openTag;
            this.closeTag = this.markup.closeTag;
            this.refElements = this.markup.nodes.slice();
        }else{
            this.refElements = [];
            this.markup.__scan();
            this.refElements = this.markup.nodes.slice();
        }
        this.isScanned = true;
    }
    clear() {
        this.refElements.forEach(node => {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        });
        this.refElements = [];
    }

}