import { gsap } from 'gsap';
import { lerp, getCursorPos } from './utils';

// Track the cursor position
let cursor = {x: 0, y: 0};
window.addEventListener('mousemove', ev => cursor = getCursorPos(ev));

/**
 * Class representing a custom Cursor.
 * The cursor has the following HTML syntax:
 * 
 *  <svg class="cursor" width="20" height="20" viewBox="0 0 20 20">
 *      <circle class="cursor__inner" cx="10" cy="10" r="5"/>
 *  </svg>
 */
export class Cursor {
    // DOM elements
    DOM = {
        // Main element (.cursor)
        el: null,
    }
    // Properties that will change
    renderedStyles = {
        // With interpolation, we can achieve a smooth animation effect when moving the cursor. 
        // The "previous" and "current" values are the values that will interpolate. 
        // The returned value will be one between these two (previous and current) at a specific increment. 
        // The "amt" is the amount to interpolate. 
        // As an example, the following formula calculates the returned translationX value to apply:
        // this.renderedStyles.tx.previous = lerp(this.renderedStyles.tx.previous, this.renderedStyles.tx.current, this.renderedStyles.tx.amt);
        
        // Cursor translation in the x-axis
        tx: {previous: 0, current: 0, amt: 0.4},
        // Cursor translation in the y-axis
        ty: {previous: 0, current: 0, amt: 0.4},
        // Scale up the cursor
        scale: {previous: 1, current: 1, amt: 0.2},
        // Fade out the cursor
        opacity: {previous: 1, current: 1, amt: 0.3}
    };
    // Size and position
    bounds;

    /**
     * Constructor.
     * @param {Element} DOM_el - The .cursor element
     * @param {String} triggerSelector - Selector for all the elements that when hovered trigger the cursor enter/leave methods. Default is all <a>.
     */
    constructor(DOM_el, triggerSelector = 'a') {
        this.DOM = {el: DOM_el};
        
        // Hide initially
        this.DOM.el.style.opacity = 0;
        // Calculate size and position
        this.bounds = this.DOM.el.getBoundingClientRect();
        
        // Mousemove event:
        // Start tracking the cursor position as soon as the user moves the cursor and fede in the cursor element.
        this.onMouseMoveEv = () => {
            // Set up the initial values to be the same
            this.renderedStyles.tx.previous = this.renderedStyles.tx.current = cursor.x - this.bounds.width/2;
            this.renderedStyles.ty.previous = this.renderedStyles.ty.previous = cursor.y - this.bounds.height/2;
            // Fade in
            gsap.to(this.DOM.el, {duration: 0.9, ease: 'Power3.easeOut', opacity: 1});
            // Start loop
            requestAnimationFrame(() => this.render());
            // Remove the mousemove event
            window.removeEventListener('mousemove', this.onMouseMoveEv);
        };
        window.addEventListener('mousemove', this.onMouseMoveEv);

        [...document.querySelectorAll(triggerSelector)].forEach(link => {
            link.addEventListener('mouseenter', () => this.enter());
            link.addEventListener('mouseleave', () => this.leave());
        });
    }

    /**
     * Mouseenter event
     * Scale up and fade out.
     */
    enter() {
        this.renderedStyles['scale'].current = 2;
        this.renderedStyles['opacity'].current = 0.8;
    }

    /**
     * Mouseleave event
     * Reset scale and opacity.
     */
    leave() {
        this.renderedStyles['scale'].current = 1;
        this.renderedStyles['opacity'].current = 1;
    }

    /**
     * Shows the cursor
     */
    show() {
        this.renderedStyles['opacity'].current = 1;
    }

    /**
     * Hides the cursor
     */
    hide() {
        this.renderedStyles['opacity'].current = 0;
    }

    /**
     * Loop
     */
    render() {
        // New cursor positions
        this.renderedStyles['tx'].current = cursor.x - this.bounds.width/2;
        this.renderedStyles['ty'].current = cursor.y - this.bounds.height/2;
        
        // Interpolation
        for (const key in this.renderedStyles ) {
            this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
        }
        
        // Apply interpolated values (smooth effect)
        this.DOM.el.style.transform = `translateX(${(this.renderedStyles['tx'].previous)}px) translateY(${this.renderedStyles['ty'].previous}px) scale(${this.renderedStyles['scale'].previous})`;
        this.DOM.el.style.opacity = this.renderedStyles['opacity'].previous;

        // loop...
        requestAnimationFrame(() => this.render());
    }
}