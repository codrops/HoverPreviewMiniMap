import SplitType from 'split-type';
import { wrapLines } from './utils';
import { gsap } from 'gsap';
import { animationDefaults } from './gsapConfig';

/**
 * Class representing a text line element that reveals itself by animating its translateY value
 */
export class TextLinesReveal {
    // DOM elements
    DOM = {
        // main element (a text DOM element)
        el: null
    }
    // Split Type instance
    SplitTypeInstance;
    // Checks if the Split Type lines are visible or not
    isVisible;
    // Animation timelines
    inTimeline;
    outTimeline;

    /**
     * Constructor.
     * @param {Element} DOM_el - a text DOM element
     */
    constructor(DOM_el) {
        this.DOM = {
            el: DOM_el
        };

        this.SplitTypeInstance = new SplitType(this.DOM.el, { types: 'lines' });
        // Wrap the lines (div with class .oh)
        // The inner child will be the one animating the transform
        wrapLines(this.SplitTypeInstance.lines, 'div', 'oh');
        
        this.initEvents();
    }

    /**
     * Animates the lines in.
     * @return {GSAP Timeline} the animation timeline
     * @param {Boolean} animation - with or without animation.
     */
    in(animation = true) {
        // Lines are visible
        this.isVisible = true;

        gsap.killTweensOf(this.SplitTypeInstance.lines);
        this.inTimeline = gsap.timeline({defaults: animationDefaults})
        .addLabel('start', 0)
        .set(this.SplitTypeInstance.lines, {
            y: '150%',
            rotate: 10
        }, 'start');

        if ( animation ) {
            this.inTimeline.to(this.SplitTypeInstance.lines, {
                y: '0%',
                rotate: 0,
                stagger: 0.02
            }, 'start');
        }
        else {
            this.inTimeline.to(this.SplitTypeInstance.lines, {
                y: '0%'
            }, 'start');
        }
        
        return this.inTimeline;
    }

    /**
     * Animates the lines out.
     * @param {Boolean} animation - with or without animation.
     * @return {GSAP Timeline} the animation timeline
     */
    out(animation = true) {
        // Lines are invisible
        this.isVisible = false;

        gsap.killTweensOf(this.SplitTypeInstance.lines);
        
        this.outTimeline = gsap.timeline({defaults: animationDefaults}).addLabel('start', 0);
        
        if ( animation ) {
            this.outTimeline.to(this.SplitTypeInstance.lines, {
                y: '-150%',
                rotate: -5,
                stagger: 0.02
            }, 'start');
        }
        else {
            this.outTimeline.set(this.SplitTypeInstance.lines, {
                y: '-150%',
            }, 'start');
        }

        return this.outTimeline;
    }

    /**
     * Initializes some events.
     */
    initEvents() {
        // Re-initialize the Split Text on window resize.
        window.addEventListener('resize', () => {
            // Re-split text
            // https://github.com/lukePeavey/SplitType#instancesplitoptions-void
            this.SplitTypeInstance.split();

            // Need to wrap again the new lines elements (div with class .oh)
            wrapLines(this.SplitTypeInstance.lines, 'div', 'oh');
                
            // Hide the lines
            if ( !this.isVisible ) {
                gsap.set(this.SplitTypeInstance.lines, {y: '105%'});
            }
        });
    }
}