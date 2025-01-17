import { AfterViewChecked, AfterViewInit, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Slick component
 */
export declare class SlickCarouselComponent implements OnDestroy, OnChanges, AfterViewInit, AfterViewChecked {
    private el;
    private zone;
    private platformId;
    config: any;
    afterChange: EventEmitter<{
        event: any;
        slick: any;
        currentSlide: number;
        first: boolean;
        last: boolean;
    }>;
    beforeChange: EventEmitter<{
        event: any;
        slick: any;
        currentSlide: number;
        nextSlide: number;
    }>;
    breakpoint: EventEmitter<{
        event: any;
        slick: any;
        breakpoint: any;
    }>;
    destroy: EventEmitter<{
        event: any;
        slick: any;
    }>;
    init: EventEmitter<{
        event: any;
        slick: any;
    }>;
    $instance: any;
    private currentIndex;
    slides: any[];
    initialized: boolean;
    private _removedSlides;
    private _addedSlides;
    /**
     * Constructor
     */
    constructor(el: ElementRef, zone: NgZone, platformId: string);
    /**
     * On component destroy
     */
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
    /**
     * On component view checked
     */
    ngAfterViewChecked(): void;
    /**
     * init slick
     */
    initSlick(): void;
    addSlide(slickItem: SlickItemDirective): void;
    removeSlide(slickItem: SlickItemDirective): void;
    /**
     * Slick Method
     */
    slickGoTo(index: number): void;
    slickNext(): void;
    slickPrev(): void;
    slickPause(): void;
    slickPlay(): void;
    unslick(): void;
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SlickCarouselComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SlickCarouselComponent, "ngx-slick-carousel", ["slick-carousel"], { "config": "config"; }, { "afterChange": "afterChange"; "beforeChange": "beforeChange"; "breakpoint": "breakpoint"; "destroy": "destroy"; "init": "init"; }, never, ["*"]>;
}
export declare class SlickItemDirective implements OnInit, OnDestroy {
    el: ElementRef;
    private platformId;
    private carousel;
    constructor(el: ElementRef, platformId: string, carousel: SlickCarouselComponent);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SlickItemDirective, [null, null, { host: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<SlickItemDirective, "[ngxSlickItem]", never, {}, {}, never>;
}
