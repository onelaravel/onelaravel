import logger from "./services/LoggerService.js";

export class ViewState {
    constructor(view) {
        // Private properties using naming convention for browser compatibility
        this._viewRef = view;
        /**
         * @type {Array<[any, function, string]>}
         */
        this._states = [];
        this._stateIndex = 0;
        this._canUpdateStateByKey = true;
        /**
         * @type {Map<string, Array<Function>>}
         */
        this.__listeners = new Map();

        /**
         * @type {Array<string>}
         */
        this.__ownProperties = ['_states', '_stateIndex', '_canUpdateStateByKey', '_viewRef', '__listeners', '__ownProperties', '__ownMethods', '__setters__'];
        /**
         * @type {Array<string>}
         */
        this.__ownMethods = ['__commitStateChange', '__setState', '__useState', '__updateStateByKey', '__register', '__lockUpdateRealState', '__subscribe', '__toJSON', 'toJSON', 'toString'];

        this.__setters__ = {};

        Object.defineProperty(this, 'on', {
            value: (key, callback) => this.__subscribe(key, callback),
            writable: true,
            configurable: true,
            enumerable: false,
        });
        Object.defineProperty(this, 'off', {
            value: (key, callback) => this.__unsubscribe(key, callback),
            writable: true,
            configurable: true,
            enumerable: false,
        });
    }
    // Define public methods using Object.defineProperties for backward compatibility

    // Private methods using naming convention
    __commitStateChange(index, oldValue, stateKey = null) {
        // Implementation placeholder
        let key = stateKey ? stateKey : (this._states[index] ? this._states[index][2] : index);
        const listeners = this.__listeners.get(key);
        if (listeners) {
            listeners.forEach(callback => callback(this._states[index][0], oldValue));
        }
        if(this._viewRef){

        }

    }

    /**
     * set state nội bộ
     * @param {number} index index
     * @param {*} value giá trị 
     * @param {function} setValue hàm set giá trị
     * @param {string} key key của state
     * @returns {[*, function, string]}
     */
    __setState(index, value, setValue = () => { }, key = null) {
        this._states[index] = [value, setValue, key??index];
        return [value, setValue, key??index];
    }

    /**
     * tương tự useState
     * @param {*} value giá trị của state
     * @param {string} key key của state (không bắt buộc)
     * @returns {Array<[*, function, string]>}
     */
    __useState(value, key = null) {
        const index = this._stateIndex++;
        const stateKey = key ?? index;
        const setValue = (value) => {
            const oldValue = this._states[index][0];
            this._states[index][0] = value;
            this.__commitStateChange(index, oldValue, stateKey);
        };
        this.__setState(index, value, setValue, stateKey);
        
        if (!this.__ownProperties.includes(stateKey) && !this.__ownMethods.includes(stateKey)) {

            Object.defineProperty(this, stateKey, {
                get: () => {
                    return this._states[index][0];
                },
                set: (value) => {
                    logger.log("Bạn không thể thiết lập giá trị cho " + stateKey + " theo cách này");
                },
                configurable: false,
                enumerable: true,
            });

        }
        return [value, setValue, stateKey];
    }

    /**
     * cập nhật state value theo key
     * @param {string} key key của state
     * @param {*} value giá trị
     * @returns {*}
     */
    __updateStateByKey(key, value) {
        const index = this._states.findIndex(state => state[2] === key);
        logger.log(`Updating state by key: ${key} at index: ${index} with value:`, value);
        if (index !== -1) {
            if (!this._canUpdateStateByKey) {
                logger.log(`State updates are locked for key: ${key}`);
                return this._states[index][0];
            }

            const oldValue = this._states[index][0];
            this._states[index][0] = value;
            this.__commitStateChange(index, oldValue, key);
        } else {
            logger.warn(`State key not found: ${key}`);
        }
        return value;
    }

    /**
     * đăng ký key - value cho state - trả về hàm setValue cho key tương ứng
     * @param {string} key key của state
     * @param {*} value giá trị
     * @returns {function}
     */
    __register(key, value) {
        return this.__useState(value, key)[1];
    }

    __lockUpdateRealState() {
        this._canUpdateStateByKey = false;
    }

    __subscribe(key, callback) {
        if (typeof key !== 'string' || this.__ownProperties.includes(key) || this.__ownMethods.includes(key)) {
            return false
        }
        if (callback && typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        if (!this.__listeners.has(key)) {
            this.__listeners.set(key, []);
        }
        this.__listeners.get(key).push(callback);
        let index = this.__listeners.get(key).length - 1;
        return () => {
            this.__listeners.get(key).splice(index, 1);
            if (this.__listeners.get(key).length === 0) {
                this.__listeners.delete(key);
            }
        };
    }

    __unsubscribe(key, callback = null) {
        if (typeof key !== 'string' || this.__ownProperties.includes(key) || this.__ownMethods.includes(key)) {
            return;
        }
        if (callback && typeof callback !== 'function') {
            return;
        }
        if (callback) {
            let index = this.__listeners.get(key).indexOf(callback);
            if (index !== -1) {
                this.__listeners.get(key).splice(index, 1);
                if (this.__listeners.get(key).length === 0) {
                    this.__listeners.delete(key);
                }
            }
        } else {
            this.__listeners.delete(key);
        }
    }


    __reset() {
        this._stateIndex = 0;
        this._canUpdateStateByKey = true;
        this.__listeners.clear();
    }







    __toJSON() {
        const data = {};
        this._states.forEach((state, index) => {
            const key = state[2]; // state[2] is the key
            data[key] = state[0]; // state[0] is the value
        });
        return data;
    }

    // Public methods
    toJSON() {
        return this.__toJSON();
    }

    toString() {
        return JSON.stringify(this.__toJSON());
    }




}

