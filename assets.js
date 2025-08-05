// remember to put type='module' in the html tag for both the export (this) and import (target) files
// also use: import filename; to import this file... normally it would be: import './assets.js';
/* // #y documentation:
$(val) : scans the dom list for the first matching element
    - val : an html selector tag to find match a matching element
$$(val) : scans the dom list for all matching elements
    - val : an html selector tag to find match a matching element
#P Proxy
    - all : an inaccessible, scoped weakset that only Proxy and Proxy² can access.
    - links : an inaccessible, scoped weakmap that only Proxy and Proxy² can access.
    - has(trg) : returns a boolean stating of the target (trg) is a proxy or not
    - targetOf(proxy) : returns a reference to a proxies target or undefined if the object is not a proxy 
Proxy² : a proxy placed on the proxy object for recording all existing proxies and checking if something is a proxy
    - construct : calls the standard proxy constructor and records all new proxies & their targets
#p Object
checkGroup(sign,func) : runs the function (of checks) with the default check value being the inputted sign
    -- tip : because sign acts as the default, there is no need to input a sign to each check function
    - sigh : the temporary value of check's default
    - func : a function containing check function(s)

#p Object.prototype
entrify(name,func) : merges fromEntries and entries together
entrify() : converts an object into a plain object
    - this : object to run function on
    - name : the name of the function being executed, ex. filter or map
    - func : the function contents
replaceThis(obj) : replaces the object while keeping the reference
    - this : object to replace
    - obj : object used to replace
$(...path) : scans through an object using an array, returning the point leading from the path
    - this : object to scan
    - ...path : the path used to find a (nested) item within this
check(sign,b,c) : evaluates a == b returning c if true, otherwise A
check(b,c) : uses default sign
    -- tip: when assigning to a variable, wrap it in an array: [a] = a.check(1,2); otherwise the value is not unwrapped
    - this (a) : the value/variable(s) to check
    - sign : the conditional sign to use, ex. ===, >, <=, !=
    - b : the value(s) checking to this
    - c : the result(s) if true
#p Array
new(length,map) : creates a new array using a map and length
    - length : the length of the new array
    - map(index) : the function used to determine each individual items value
        - index : the index of the current item being mapped
#p Array.prototype
clearHoles() : removes empty slots in an array
    - this : the array (with empty slots) needing to be cleaned
keySegregation() : creates an object containing the indexes and normal properties of an array
addNext(length,map) : adds new items to an Array using a function
    - length : the amount of items
    - map(last) : the function used to determine each new items value
        - last : the value of the item before
#p Number.prototype
range(min,max,mode) : determines if this is within the range
    - this : the value being checked to see if its within the range
    - min : the minimum point in the range (can swap with max)
    - max : the maximum point in the range (can swap with min)
    - mode['on','within'] : determines if this can be on the edge or the range
        - 'on' : this can be on the edge of the range 
        - 'within' : this cannot be on the edge of the range
centerRange(mid,range,mode) : determines if this is within a range
    - this : the value being check to see if its within the range
    - mid : the middle of the range
    - range : the size/radius of the range
    - mode['on','within'] : determines if this can be on the edge or the range
        - 'on' : this can be on the edge of the range 
        - 'within' : this cannot be on the edge of the range
*/

//#p global 
/**
 * @param {string} val an html selector
 * @returns {Node} the first matching html element
 */
function $(val) { return document.querySelector(val); }
/**
 * @param {string} val an html selector
 * @returns {NodeList} a node list of all matching html elements
 */
function $$(val) { return document.querySelectorAll(val) }

/* *
 * @description A powerful reclusive function to handle all the reclusiveness for you and allow you to focus on what really matters. ___Like Touching grass!___
 * @param {object} iterable The inputted iterable object (Array or PlainObject)
 * @param {function} func The function to run on every element within (nested too)
 * @param {function} smartScan determines if an item should be scanned or not
 * @functionality Can delete, add, and modify items within __iterable__.
 * @warning __\_splice\___ or __splice__ cannot be properties within __iterable__ as those are reserved words
 * @returns {object} the now modified __iterable__ object
 */
// #o PATHFINDER GOES HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// needs refining
function pathFunker(iterable,func) {
    const n = [0];
    let run = true;
    while (run) {
        if (Object.hasOwn(iterable.$(n.slice(0,-1)),n.at(-1))) {
            print(iterable.$(n))
            if (typeof iterable.$(n) == 'object')
                n.push(-1);
        } else {
            n.pop(); 
            if (n.length == 0)
                run = false;
        }
        n[n.length - 1]++;
    }
}

//#p Proxy
!function(){
    const all = new WeakSet;
    const links = new WeakMap;
    Object.defineProperties(Proxy,{
        has: {
            value(trg) {
                return all.has(trg);
            }
        },
        targetOf: {
            value(proxy) {
                return links.get(proxy);
            }
        }
    });
    // Proxy²
    Proxy = new Proxy(Proxy, {
        construct(obj,args,trg) {
            const proxy = Reflect.construct(obj,args,trg);
            all.add(proxy);
            links.set(proxy,args[0])
            // console.log(args[0]);
            return proxy;
        }
    });
}()

prox = new Proxy({},{});

console.log(Proxy.has(prox));
prox.a = 1;
console.log(Proxy.targetOf(prox));

//#p Object
Object.defineProperties(Object, {
    checkGroup: {
        value: function(sign,func) {
            const save = Object.prototype.check.default
            Object.prototype.check.default = sign;
            func();
            Object.prototype.check.default = save;
        },
        enumerable:false,
        configurable:true
    }
})

//#p Object.prototype
Object.defineProperties(Object.prototype,{
    entrify: { 
        value: function(name,func) {
            if (arguments.length > 0)
                return Object.fromEntries(Object.entries(this)[name](func))
            else return Object.fromEntries(Object.entries(this))
        },
        enumerable:false,
        configurable:true
    },

    replaceThis: { 
        value: function(obj) {
            if (this === obj)
                throw Error(`cannot replace object with itself`)
            if (Array.isArray(this))
                this.length = obj.length || 0;
            for (let i of Object.keys(this))
                delete this[i];
            return Object.assign(this,obj)
        },
        enumerable:false,
        configurable:true
    },

    $: { 
        value: function(...path) {
            //  initial path validation
            if ( path.length == 1 && typeof path[0] == 'object' )
                path = path[0]
            if (!Array.isArray(path))
                throw Error(`path must be an array '[]' or a spread array '...[]'`)
            // scan through path
            let iterable = this;
            for (let i in path)
                if (Object.hasOwn(iterable,path[i]))
                    iterable = iterable[path[i]];
                else throw Error(`path leads to a nonexistent point at ${i}:${path[i]}... ${JSON.stringify(iterable)} does not contain property ${i}`)
            return iterable;
        },
        enumerable:false,
        configurable:true
    },

    check: { 
        value: (function() {
            const signs = {
                '===': (e,b) => e === b,
                '==': (e,b) => e == b,
                '!==': (e,b) => e !== b,
                '!=': (e,b) => e != b,
                '>': (e,b) => e > b,
                '>=': (e,b) => e >= b,
                '<': (e,b) => e < b,
                '<=': (e,b) => e <= b,
            }

            var def = '===';

            function innerCheck(sign,b,c) {
                if (arguments.length == 2 && !Object.hasOwn(signs,sign)) {
                    c = b;
                    b = sign;
                    sign = def;
                }
                if (!Object.hasOwn(signs,sign))
                    throw Error(`${sign} is not a valid sign: ${Object.keys(signs)}`)

                let a = this instanceof Array ? this : [this];
                b = b instanceof Array? b : [b];
                c = c instanceof Array? c : [c];
                let result = [...a];
                if (!(b.length == c.length) && c.length > 1) throw Error('b & c must be the same length, or c must be only 1 item');
                for (const i in b) {
                    let x = -1;
                    a.forEach( e => { result[++x] = signs[sign](e.valueOf(),b[i]) ? c[i] || c[0] : result[x] })
                }
                return result;
            }

            Object.defineProperty(innerCheck,'default', {
                get: function() { return def },
                set: function(value) {
                    if (!Object.hasOwn(signs,value))
                        throw Error(`cannot reassign Object.prototype.check.default's value to ${value}`);
                    def = value
                },
                enumerable:false,
                configurable:true
            })

            return innerCheck;
        }()),
        enumerable:false,
        configurable:true
    },
});

//#p array
Object.defineProperties(Array, {
    new: {
        value: function(length,map) { 
            return Array.from({length}, (_,i) => map(i))
        },
        enumerable:false,
        configurable:true
    }
});

//#p array.prototype
Object.defineProperties(Array.prototype, {
    clearHoles: {
        value: function(replace = true) {
            const trg = Proxy.targetOf(this) || this;
            const temp = structuredClone(trg);
            temp.length = 0;
            Object.assign(temp,trg.filter( () => true ))
            if (replace) {
                for (i in trg)
                    delete trg[i];
                trg.length = 0;
                Object.assign(trg,temp);
                return this // so you see the correct object reference (the insides are the same though)
            }
            return temp;
        },
        enumerable:false,
        configurable:true
    },
    keySeg: {
        // Don't question the name, question the method.
        value: function(preKeyed = true) {
            if (preKeyed) keys = this;
            else keys = Object.keys(this);
            const numeric = keys.filter( val => val >= 0 && !val.toString().includes('.') );
            const props = keys.filter( val => !numeric.includes(val));
            return {numeric,props};
        },
        enumerable:false,
        configurable:true
    },
    addNext: {
        value: function(length,map) {
            for (var i = 0; i < length; i++)
                this.push(map(this.at(-1)))
        },
        enumerable:false,
        configurable:true
    }
})

//#p number.prototype 
!function(){
    function rangeHelper(min,max) {
        const save = [min,max];
        min = Math.min(...save);
        max = Math.max(...save);
        return ({min,max});
    }

    Object.defineProperties(Number.prototype,{
        range: {
            value: function(min,max,mode = 'on') {
                var {min,max} = rangeHelper(min,max);
                if (mode == 'on')
                    return this >= min && this <= max
                if (mode == 'within')
                    return this > min && this < max
            },
            enumerable:false,
            configurable:true
        },
        centerRange: {
            value: function centerRange(mid,range,mode = 'on') {
                var {min,max} = rangeHelper(min,max);
                if (mode == 'on')
                    return this >= mid - range && this <= mid + range
                if (mode == 'within')
                    return this > mid - range && this < mid + range
            },
            enumerable:false,
            configurable:true
        },
        clamp: {
            value: function(min,max) {
                var {min,max} = rangeHelper(min,max);
                return Math.max(Math.min(this,max),min)
            },
            configurable:true,
            enumerable:false
        }
    })
}()