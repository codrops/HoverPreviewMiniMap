import { preloadImages } from './utils';
import { Cursor } from './cursor';
import { Thumb } from './thumb';
import { Preview } from './preview';
import { HoverMap } from './hoverMap';

// Thumb instances array
let arrThumb = [];

// Preview instances array
let arrPreview = [];

// Initialize custom cursor
const cursor = new Cursor(document.querySelector('.cursor'), 'a, .thumb');

// HoverMap instance. This map will show a little dot moving as the user moves the cursor while hovering on the images, thus giving feedback to where the cursor is at the moment.
const hoverMap = new HoverMap(document.querySelector('.preview__map'), cursor);

// Initialize the Preview instances
[...document.querySelectorAll('.preview__item')].forEach(el => {
    arrPreview.push(new Preview(el));
});

// Initialize the Thumb instances
[...document.querySelectorAll('.thumb')].forEach((el, position) => {
    arrThumb.push(new Thumb(el, arrPreview[position]));
});

// Events
for (const thumb of arrThumb) {
    thumb.DOM.img.addEventListener('mouseenter', () => {
        // Unreveal all the thumbs
        hideThumbs();
        // Reveal this Thumb's preview elements
        thumb.showPreview();
        // Show preview hover map
        showHoverMap(thumb);
    });
    thumb.DOM.img.addEventListener('mouseleave', () => {
        // Unreveal this Thumb's preview elements
        thumb.hidePreview();
        // Reveal all the thumbs
        showThumbs();
        // Hide preview hover map
        hideHoverMap();
    });
}

/**
 * Reveals all the thumbs
 */
const showThumbs = () => {
    for (const thumb of arrThumb) {
        thumb.show(false);
    }
};

/**
 * Unreveals all the thumbs
 */
const hideThumbs = () => {
    for (const thumb of arrThumb) {
        thumb.hide();
    }
};

/**
 * Shows the hover map
 */
const showHoverMap = thumb => {
    hoverMap.show(thumb, arrThumb.indexOf(thumb));
};

/**
 * Hides the hover map
 */
const hideHoverMap = () => {
    hoverMap.hide();
};

// Preload images
preloadImages('.preview__img-inner, .thumb__img-inner').then(() => document.body.classList.remove('loading'));