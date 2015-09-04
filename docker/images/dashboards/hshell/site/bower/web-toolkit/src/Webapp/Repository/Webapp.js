'use strict';

define(function() {

    /**
     * One of the webapps in the company
     */
    return function(params) {

        /**
         * @returns {string|nullish}
         */
        this.getId = function() {
            return params.id;
        };

        /**
         * @returns {string}
         */
        this.getName = function() {
            return params.name;
        };

        /**
         * @returns {string}
         */
        this.getUrl = function() {
            return params.url;
        };

        /**
         * @returns {string}
         */
        this.getTitle = function() {
            return params.title == '' ? params.id : params.title;
        };
 
        /**
         * @returns {string}
         */
        this.getDescription = function() {
            return params.description;
        };

        /**
         * @returns {array}
         */
        this.getRoles = function() {
            return params.roles;
        };

        /**
         * @returns {array}
         */
        this.getIcons = function() {
            return params.icons;
        };

        /**
         * @param {string} size eg, 'large', 'medium'
         * @returns {string} Icon URL
         */
        this.getIcon = function(size) {
            if (size && size in params.icons) {
                return params.icons[size];
            } else if (!size && 'default' in params.icons) {
                return params.icons['default'];
            }
            return '';
        };

        /**
         * @returns {array}
         */
        this.getTags = function() {
            return params.tags;
        };
    };
});
