import { gsap } from 'gsap';
import { map } from './utils';

/**
 * Class representing a preview map element (.preview__map)
 */
export class HoverMap {
    // DOM elements
    DOM = {
        // Main element
        el: null,
        // Main element children (.preview__map-item)
        mapItems: null,
        // The current little dot that moves inside the map as the user moves the cursor (.dot)
        dotEl: null,
        // The Thumb that gets hovered
        thumb: null,
    }
    // Custom cursor (Cursor obj)
    cursor;
    // Size/Position of one of the map items (all the same)
    hoverMapItemBounds;
    // Size/Position of one of the dots (all the same)
    dotBounds;
    // Size/Position of the current hovered thumbs
    thumbBounds;
    // requestAnimationFrame id
    requestId;
    
    /**
     * Constructor.
     * @param {Element} DOM_el -
     * @param {Cursor} cursor -
     */
    constructor(DOM_el, cursor) {
        this.DOM = {el: DOM_el};
        this.DOM.mapItems = this.DOM.el.querySelectorAll('.preview__map-item');
        this.cursor = cursor;
    }

    /**
     * Shows the hover map element and the current map item's dot element.
     * @param {Thumb} thumb - The Thumb obj representing the .thumb element that is getting hovered at the moment.
     * @param {Number} itemPosition - The position of the thumb which aloow us to get to the right item (this.mapItems). There are as many map items as there are thumbs.
     */
    show(thumb, itemPosition) {
        this.DOM.thumb = thumb.DOM.img;
        this.DOM.dotEl = [...this.DOM.mapItems][itemPosition].querySelector('.dot');
        this.dotBounds = this.DOM.dotEl.getBoundingClientRect();
        this.hoverMapItemBounds = this.DOM.mapItems[0].getBoundingClientRect();
        this.thumbBounds = this.DOM.thumb.getBoundingClientRect();

        // Hide the cursor
        if ( this.DOM.thumb.classList.contains('thumb__img--nocursor') ) {    
            this.cursor.hide();
        }
        
        // Animation
        gsap.killTweensOf([this.DOM.el, this.DOM.dotEl]);
        gsap.to([this.DOM.el, this.DOM.dotEl], {
            duration: 1,
            ease: 'expo',
            opacity: 1
        });
        
        // Add a click feedback animation to the dot
        this.onClickDotEv = () => {
            gsap.timeline()
            .to(this.DOM.dotEl, {
                duration: 0.1,
                ease: 'power1.in',
                scale: 3
            })
            .to(this.DOM.dotEl, {
                duration: 1,
                ease: 'expo',
                scale: 1
            });
        }
        this.DOM.thumb.addEventListener('click', this.onClickDotEv);

        // Start loop
        this.loopRender();
    }

    /**
     * Hides the hover map element and the current map item's dot element.
     */
    hide() {
        // Show the cursor
        if ( this.DOM.thumb.classList.contains('thumb__img--nocursor') ) {
            this.cursor.show();
        }

        gsap.killTweensOf([this.DOM.el, this.DOM.dotEl]);
        gsap.set([this.DOM.el, this.DOM.dotEl], { opacity: 0 });

        // Remove click event
        this.DOM.thumb.removeEventListener('click', this.onClickDotEv);

        // Stop the rAF loop.
        this.stopRendering();
    }
    
    /**
     * Start the render loop animation (rAF)
     */
    loopRender() {
        if ( !this.requestId ) {
            this.requestId = requestAnimationFrame(() => this.render());
        }
    }

    /**
     * Stop the render loop animation (rAF)
     */
    stopRendering() {
        if ( this.requestId ) {
            window.cancelAnimationFrame(this.requestId);
            this.requestId = undefined;
        }
    }

    /**
     * rAF loop - move the small dot as the cursor moves hover the thumb
     */
    render() {
        this.requestId = undefined;
        
        // Set up the translation values of the current dot element.
        // These will map to the current translation values of the cursor position inside the current hovered thumb
        gsap.set(this.DOM.dotEl, {
            x: map(this.cursor.renderedStyles['tx'].previous - this.thumbBounds.left + this.cursor.bounds.width/2, 0, this.thumbBounds.width, 0, this.hoverMapItemBounds.width) - this.dotBounds.width/2 - 1,
            y: map(this.cursor.renderedStyles['ty'].previous - this.thumbBounds.top + this.cursor.bounds.height/2, 0, this.thumbBounds.height, 0, this.hoverMapItemBounds.height) - this.dotBounds.height/2 - 1
        });

        // Keep rolling
        this.loopRender();
    }
}