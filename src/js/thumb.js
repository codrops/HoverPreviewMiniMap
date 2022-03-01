import { gsap } from 'gsap';
import { animationDefaults } from './gsapConfig';

/**
 * Class representing a thumb element (.thumb)
 */
export class Thumb {
    // DOM elements
    DOM = {
        // main element (.thumb)
        el: null,
        // .thumb__img
        img: null,
        // .thumb__img-inner
        imgInner: null,
        // .thumb__caption
        caption: null,
        // .thumb__caption-inner
        captionInner: null,
    }
    // the Preview instance associated with this Thumb
    preview;
    // Animation timelines
    hideTimeline;
    showTimeline;

    /**
     * Constructor.
     * @param {Element} DOM_el - the .thumb element
     * @param {Preview} previewInstance - the Preview instance associated with this Thumb
     */
    constructor(DOM_el, previewInstance) {
        this.DOM = {el: DOM_el};
        this.DOM.img = this.DOM.el.querySelector('.thumb__img');
        this.DOM.imgInner = this.DOM.img.querySelector('.thumb__img-inner');
        this.DOM.caption = this.DOM.el.querySelector('.thumb__caption');
        this.DOM.captionInner = this.DOM.caption.querySelector('.thumb__caption-inner');

        this.preview = previewInstance;
    }
    
    /**
     * Shows/Reveals the thumb.
     * @param {Boolean} animation - With or without animation
     */
    show(animation = true) {
        gsap.killTweensOf([this.DOM.imgInner, this.DOM.captionInner]);

        this.showTimeline = gsap.timeline({
            defaults: animationDefaults
        })
        .addLabel('start', 0)
        .set([this.DOM.imgInner, this.DOM.captionInner], {
            y: '105%'
        }, 'start');

        if ( animation ) {
            this.showTimeline.to([this.DOM.imgInner, this.DOM.captionInner], {
                y: '0%',
                //delay: options.delay || 0
            }, 'start');
        }
        else {
            this.showTimeline.set([this.DOM.imgInner, this.DOM.captionInner], {
                y: '0%'
            }, 'start');
        }
    }

    /**
     * Hides/Unreveals the thumb.
     * @param {Boolean} animation - With or without animation
     */
    hide(animation = true) {
        gsap.killTweensOf([this.DOM.imgInner, this.DOM.captionInner]);

        this.hideTimeline = gsap.timeline({defaults: animationDefaults}).addLabel('start', 0);
        this.hideTimeline[animation ? 'to' : 'set']([this.DOM.imgInner, this.DOM.captionInner], {
            y: '105%'
        }, 'start');
    }

    /**
     * Shows the preview elements.
     */
    showPreview() {
        this.preview.show();
    }

    /**
     * Hides the preview elements.
     */
    hidePreview() {
        this.preview.hide();
    }
}