define([], function () {

    "use strict";

    return function (options) {

        var that = this,
            containerElement,
            overlayElement,
            mainElement,
            innerElement,
            headerElement,
            bodyElement,
            footerElement,
            width,
            heading = "",
            bodyHTML = "",
            closeButtonLabel = "Close",
            submitButtonLabel,
            submitAction;

        function initOptions(options) {
            if (options.hasOwnProperty("width")) {
                that.setWidth(options.width);
            }
            if (options.hasOwnProperty("heading")) {
                that.setHeading(options.heading);
            }
            if (options.hasOwnProperty("bodyHTML")) {
                that.setBodyHTML(options.bodyHTML);
            }
            if (options.hasOwnProperty("closeButtonLabel")) {
                that.setCloseButtonLabel(options.closeButtonLabel);
            }
            if (options.hasOwnProperty("submitButtonLabel")) {
                that.setSubmitButtonLabel(options.submitButtonLabel);
            }
            if (options.hasOwnProperty("submitAction")) {
                that.setSubmitAction(options.submitAction);
            }
        }

        function getElementWithClass(elementName, className) {
            var element = document.createElement(elementName);
            element.setAttribute("class", className);
            return element;
        }

        function getDivElementWithClass(className) {
            return getElementWithClass("div", className);
        }

        function getHeadingElement() {
            var element = getElementWithClass("h3");
            element.innerHTML = heading;
            return element;
        }

        function appendSubmitButton() {
            if (undefined !== submitButtonLabel && undefined !== submitAction) {
                var button = getElementWithClass("button", "h-button hb-enabled hb-small pull-left");
                button.innerHTML = submitButtonLabel;
                button.addEventListener("click", function () {
                    submitAction();
                }, false);
                footerElement.appendChild(button);
            }
        }

        function appendCloseButton() {
            var button = getElementWithClass("button", "h-button hb-drained hb-small pull-right");
            button.innerHTML = closeButtonLabel;
            button.addEventListener("click", function () {
                that.close();
            }, false);
            footerElement.appendChild(button);
        }

        function initContainerElement() {
            containerElement = getDivElementWithClass("h-modal-container");
            overlayElement = getDivElementWithClass("h-modal-overlay");
            mainElement = getDivElementWithClass("h-modal-main");
            innerElement = getDivElementWithClass("h-modal-inner");
            headerElement = getDivElementWithClass("h-modal-header");
            bodyElement = getDivElementWithClass("h-modal-body");
            footerElement = getDivElementWithClass("h-modal-footer h-clear-fix");

            containerElement.appendChild(overlayElement);
            containerElement.appendChild(mainElement);

            mainElement.appendChild(innerElement);

            innerElement.appendChild(headerElement);
            innerElement.appendChild(bodyElement);
            innerElement.appendChild(footerElement);

            headerElement.appendChild(getHeadingElement());
            bodyElement.innerHTML = bodyHTML;
            appendSubmitButton();
            appendCloseButton();
        }

        this.setWidth = function (theWidth) {
            width = theWidth;
        };

        this.setHeading = function (theHeading) {
            heading = theHeading;
            return this;
        };

        this.setBodyHTML = function (html) {
            bodyHTML = html;
            return this;
        };

        this.setCloseButtonLabel = function (label) {
            closeButtonLabel = label;
        };

        this.setSubmitButtonLabel = function (label) {
            submitButtonLabel = label;
        };

        this.setSubmitAction = function (fn) {
            submitAction = fn;
        };

        this.render = function () {
            var renderedWidth,
                renderedHeight;

            initContainerElement();
            document.body.appendChild(containerElement);

            if (undefined !== width) {
                mainElement.style.width = width + "px";
                renderedWidth = width;
            } else {
                renderedWidth = mainElement.offsetWidth;
            }
            renderedHeight = mainElement.offsetHeight;

            mainElement.style.marginTop = "-" + Math.round(renderedHeight / 2) + "px";
            mainElement.style.marginLeft = "-" + Math.round(renderedWidth / 2) + "px";
        };

        this.close = function () {
            containerElement.parentNode.removeChild(containerElement);
        };

        this.getContainerElement = function () {
            return containerElement;
        };

        initOptions(options);

    };

});