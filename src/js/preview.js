import { gsap } from 'gsap';
import { animationDefaults } from './gsapConfig';
import { TextLinesReveal } from './textLinesReveal';

/**
 * Class representing a preview
 */
export class Preview {
    // DOM elements
    DOM = {
        // main element (.preview__item)
        el: null,
        // .preview__img
        img: null,
        // .preview__img-inner
        imgInner: null,
        // .preview__item-cover
        cover: null,
        // all texts with class line-effect
        texts: null
    }
    // text lines reveal obj array
    arrTextLinesReveal = [];
    // Animation timeline
    showTimeline;

    /**
     * Constructor.
     * @param {Element} DOM_el - the .preview__item element
     */
    constructor(DOM_el) {
        this.DOM = {el: DOM_el};

        this.DOM.img = this.DOM.el.querySelector('.preview__img');
        this.DOM.imgInner = this.DOM.img.querySelector('.preview__img-inner');
        this.DOM.cover = this.DOM.el.querySelector('.preview__item-cover');
        this.DOM.texts = this.DOM.el.querySelectorAll('.line-effect');

        [...this.DOM.texts].forEach(text => {
            this.arrTextLinesReveal.push(new TextLinesReveal(text));
        });
    }

    /**
     * Shows/Unreveals the preview image+texts
     */
    show() {
        gsap.killTweensOf([this.DOM.cover, this.DOM.imgInner]);
        
        this.showTimeline = gsap.timeline({defaults: animationDefaults})
        .addLabel('start', 0)
        .set(this.DOM.el, {
            zIndex: 100
        }, 'start')
        .set(this.DOM.texts, {
            opacity: 1
        }, 'start')
        .to(this.DOM.cover, {
            scaleY: 1
        }, 'start')
        .to(this.DOM.imgInner, {
            scale: 1.05
        }, 'start')
        .to(this.DOM.img, {
            startAt: {
                filter: 'brightness(400%)'
            },
            filter: 'brightness(100%)'
        }, 'start');

        for(const instance of this.arrTextLinesReveal) {
            this.showTimeline.add(instance.in(), 'start');
        }
    }

    /**
     * Hides/Reveals the preview image+texts
     */
    hide() {
        if ( this.showTimeline ) this.showTimeline.kill();
        gsap.killTweensOf([this.DOM.cover, this.DOM.imgInner]);
        gsap.set(this.DOM.el, { zIndex: 1 });
        gsap.set(this.DOM.texts, { opacity: 0 });
        gsap.set(this.DOM.cover, { scaleY: 2 });
        gsap.set(this.DOM.imgInner, { scale: 1 });

        for(const instance of this.arrTextLinesReveal) {
            instance.out(false); // no animation
        }
    }
}