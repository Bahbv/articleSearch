/**
 * articleSearch.js
 * 
 * Filters children in a container for matching text on keyup event
 * It uses all the text in the child element and all alt attributes.
 * 
 * usage:
 * 	// Init articleSearch
 *	articleSearch.init({
 *		container: document.getElementById('js-articles'),
 *		searchInput: document.getElementById('js-articles-search'),
 *	});
 * 
 * @author Bob Vrijland <b.vrijland@esens.nl>
 * @version 1.0.0
 */
(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root.articleSearch = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    'use strict';

    //
    // Variables
    //

    var articleSearch = {}; // Object for public APIs
    var supports = !!document.querySelector && !!root.addEventListener; // Feature test
    var settings, eventTimeout;

    // Default settings
    var defaults = {
        container: null,
        searchInput: null,
    };

    //
    // Methods
    //

    /**
     * A simple forEach() implementation for Arrays, Objects and NodeLists
     * @private
     * @param {Array|Object|NodeList} collection Collection of items to iterate
     * @param {Function} callback Callback function for each iteration
     * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
     */
    var forEach = function (collection, callback, scope) {
        if (Object.prototype.toString.call(collection) === '[object Object]') {
            for (var prop in collection) {
                if (Object.prototype.hasOwnProperty.call(collection, prop)) {
                    callback.call(scope, collection[prop], prop, collection);
                }
            }
        } else {
            for (var i = 0, len = collection.length; i < len; i++) {
                callback.call(scope, collection[i], i, collection);
            }
        }
    };

    /**
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    var extend = function ( defaults, options ) {
        var extended = {};
        forEach(defaults, function (value, prop) {
            extended[prop] = defaults[prop];
        });
        forEach(options, function (value, prop) {
            extended[prop] = options[prop];
        });
        return extended;
    };
    
    /**
     * Check if the settings are valid
     * @private
     * @returns {Boolean} 
     */
    var checkSettings = function() {
        var valid = true;
        // Check if not null
        if ( settings.searchInput == null || settings.container == null ){
            console.warn("searchInput and/or container are undefined.")
            valid = false;
        } else {
            // Check for valid nodes
            if ( !settings.searchInput.nodeType ){
                console.warn("searchInput isn't a valid node.")
                valid = false;
            }
            if ( !settings.container.nodeType ){
                console.warn("container isn't a valid node.")
                valid = false;
            }
        }
        return valid;
    }

    /**
     * Handles the keyup event
     * @private
     * @param {Object} The event
     */
    var keyupHandler = function ( event ){
        var value = settings.searchInput.value.toLowerCase();
        search(value);
    }
    
    /**
     * Search every child node for the given string,
     * hide every parent if it doesnt contain the string in their text.
     * @private 
     * @param { String } lowercase string to search for
     */
    var search = function ( string ) {
        var articles = settings.container.children;
        forEach(articles, function (value, prop) {
            var data = getData(value);
            if (data.indexOf(string) > -1) {
              value.classList.remove('is-hidden');
            } else {
              value.classList.add('is-hidden');
            }
        });
    }
    
    /**
     * Remove all (duplicate) whitespace and tabs
     * @private
     * @return {String} Trimmed string
     */
    String.prototype.trim = function () {
        var str = this.replace(/^\s*|\s*$/,"");
        return str.replace(/\s+/g," ");
    }
    
    /**
     * Get all the text and Alt tags from a given wrapper element
     * @private
     * @param {Node} The wrapper element to search in
     * @return {String} A lowercase string with all text data en alt tags
     */ 
    var getData = function( element ){
        var content = "";
        // Get text
        var allText = element.textContent;
        content += allText;
        // Get alts
        var images = element.querySelectorAll('img');
        forEach(images, function(value){
            content += " "+ value.alt;
        });
        return content.trim().toLowerCase();
    }

    /**
     * Destroy the current initialization.
     * @public
     */
    articleSearch.destroy = function () {
        // If plugin isn't already initialized, stop
        if ( !settings ) return;
        // Undo eventlistener
        settings.searchInput.removeEventListener('keyup', keyupHandler);
        // Reset variables
        settings = null;
        eventTimeout = null;
    };

    /**
     * Initialize Plugin
     * @public
     * @param {Object} options User settings
     */
    articleSearch.init = function ( options ) {
        // feature test
        if ( !supports ) return;
        // Destroy any existing initializations
        articleSearch.destroy();
        // Merge user options with defaults
        settings = extend( defaults, options || {} );
        // Give error and return early when container and searcInput aren't defined
        if (!checkSettings()){
            articleSearch.destroy();
            console.error("Couldn't load articleSearch");
            return;
        }
        // Add eventlistener to searchInput
        settings.searchInput.addEventListener('keyup', keyupHandler);
    };
    
    //
    return articleSearch;
});