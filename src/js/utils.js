const imagesLoaded = require('imagesloaded');

/**
 * Preload images
 * @param {String} selector - Selector/scope from where images need to be preloaded. Default is 'img'
 */
const preloadImages = (selector = 'img') => {
    return new Promise((resolve) => {
        imagesLoaded(document.querySelectorAll(selector), {background: true}, resolve);
    });
};

/**
 * Linear interpolation
 * @param {Number} a
 * @param {Number} b
 * @param {Number} n
 */
const lerp = (a, b, n) => (1 - n) * a + n * b;

/**
 * Map number x from range [a, b] to [c, d] 
 */
const map = (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c;

/**
 * Gets the cursor position
 * @param {Event} ev - event
 */
const getCursorPos = ev => {
    return { 
        x : ev.clientX, 
        y : ev.clientY 
    };
};

/**
 * Wraps the elements of an array.
 * @param {Array} arr - the array of elements to be wrapped
 * @param {String} wrapType - the type of the wrap element ('div', 'span' etc)
 * @param {String} wrapClass - the wrap class(es)
 */
const wrapLines = (arr, wrapType, wrapClass) => {
    arr.forEach(el => {
        const wrapEl = document.createElement(wrapType);
        wrapEl.classList = wrapClass;
        el.parentNode.appendChild(wrapEl);
        wrapEl.appendChild(el);
    });
}

export {
    preloadImages,
    lerp, 
    map,
    getCursorPos,
    wrapLines
};