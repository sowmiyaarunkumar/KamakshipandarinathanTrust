import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { Touches } from './touches';
import { Carousel } from './carousel';
import { Container } from './container';
import { Cells } from './cells';
import { Slide } from './slide';
import { Utils } from './utils';
export class CarouselComponent {
    constructor(elementRef, ref) {
        this.elementRef = elementRef;
        this.ref = ref;
        this.minTimeout = 30;
        this.isVideoPlaying = false;
        this._isCounter = false;
        this._cellWidth = 200;
        this._loop = false;
        this._lightDOM = false;
        this.isMoving = false;
        this.isNgContent = false;
        this.events = new EventEmitter();
        this.height = 200;
        this.autoplay = false;
        this.autoplayInterval = 5000;
        this.pauseOnHover = true;
        this.dots = false;
        this.margin = 10;
        this.objectFit = 'cover';
        this.minSwipeDistance = 10;
        this.transitionDuration = 200;
        this.transitionTimingFunction = 'ease-out';
        this.counterSeparator = " / ";
        this.overflowCellsLimit = 3;
        this.listeners = 'mouse and touch';
        this.cellsToScroll = 1;
        this.freeScroll = false;
        this.arrows = true;
        this.arrowsOutside = false;
        this.arrowsTheme = 'light';
        this.hostClassCarousel = true;
        this.handleTouchstart = (event) => {
            this.touches.addEventListeners("mousemove", "handleMousemove");
            this.carousel.handleTouchstart(event);
            this.isMoving = true;
        };
        this.handleHorizontalSwipe = (event) => {
            event.preventDefault();
            this.carousel.handleHorizontalSwipe(event);
        };
        this.handleTouchend = (event) => {
            const touches = event.touches;
            this.carousel.handleTouchend(event);
            this.touches.removeEventListeners("mousemove", "handleMousemove");
            this.isMoving = false;
        };
        this.handleTap = (event) => {
            let outboundEvent = {
                name: 'click'
            };
            let nodes = Array.prototype.slice.call(this.cellsElement.children);
            let cellElement = event.srcElement.closest(".carousel-cell");
            const i = nodes.indexOf(cellElement);
            const cellIndex = nodes.indexOf(cellElement);
            if (this.images) {
                //outboundEvent.fileIndex = this.carousel.getFileIndex(i);
                //outboundEvent.file = this.carousel.getFile(cellIndex);
            }
            else {
                outboundEvent.cellIndex = cellIndex;
            }
        };
    }
    get isContainerLocked() {
        if (this.carousel) {
            return this.carousel.isContainerLocked;
        }
    }
    get slideCounter() {
        if (this.carousel) {
            return this.carousel.slideCounter;
        }
    }
    get lapCounter() {
        if (this.carousel) {
            return this.carousel.lapCounter;
        }
    }
    get isLandscape() {
        return window.innerWidth > window.innerHeight;
    }
    get isSafari() {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') !== -1) {
            return !(ua.indexOf('chrome') > -1);
        }
    }
    get counter() {
        let counter;
        if (this.loop) {
            counter = this.slideCounter % this.cellLength;
        }
        else {
            counter = this.slideCounter;
        }
        return counter + 1 + this.counterSeparator + this.cellLength;
    }
    get cellsElement() {
        return this.elementRef.nativeElement.querySelector('.carousel-cells');
    }
    get isArrows() {
        return this.arrows && !this.freeScroll;
    }
    get isCounter() {
        return this._isCounter && this.cellLength > 1;
    }
    get activeDotIndex() {
        return this.slideCounter % this.cellLength;
    }
    get cellLimit() {
        if (this.carousel) {
            return this.carousel.cellLimit;
        }
    }
    get carouselWidth() {
        return this.elementRef.nativeElement.clientWidth;
    }
    set images(images) {
        this._images = images;
    }
    get images() {
        return this._images;
    }
    set cellWidth(value) {
        if (value) {
            this._cellWidth = value;
        }
    }
    set isCounter(value) {
        if (value) {
            this._isCounter = value;
        }
    }
    set loop(value) {
        if (value) {
            this._loop = value;
        }
    }
    get loop() {
        if (this.images) {
            return this._loop;
        }
        else {
            return false;
        }
    }
    set lightDOM(value) {
        if (value) {
            this._lightDOM = value;
        }
    }
    get lightDOM() {
        if (this.images) {
            return this._lightDOM;
        }
        else {
            return false;
        }
    }
    onWindowResize(event) {
        if (this.utils.visibleWidth !== this.savedCarouselWidth) {
            this.resize();
        }
    }
    onMousemove(event) {
        if (this.autoplay && this.pauseOnHover) {
            this.carousel.stopAutoplay();
        }
    }
    onMouseleave(event) {
        if (this.autoplay && this.pauseOnHover) {
            this.carousel.autoplay();
        }
    }
    ngOnInit() {
        this.isNgContent = this.cellsElement.children.length > 0;
        this.touches = new Touches({
            element: this.cellsElement,
            listeners: this.listeners,
            mouseListeners: {
                "mousedown": "handleMousedown",
                "mouseup": "handleMouseup"
            }
        });
        this.touches.on('touchstart', this.handleTouchstart);
        this.touches.on('horizontal-swipe', this.handleHorizontalSwipe);
        this.touches.on('touchend', this.handleTouchend);
        this.touches.on('mousedown', this.handleTouchstart);
        this.touches.on('mouseup', this.handleTouchend);
        this.touches.on('tap', this.handleTap);
        this.setDimensions();
    }
    ngAfterViewInit() {
        this.initCarousel();
        this.cellLength = this.getCellLength();
        this.dotsArr = Array(this.cellLength).fill(1);
        this.ref.detectChanges();
        this.carousel.lineUpCells();
        this.savedCarouselWidth = this.carouselWidth;
        /* Start detecting changes in the DOM tree */
        this.detectDomChanges();
    }
    ngOnChanges(changes) {
        if (changes.width || changes.height || changes.images) {
            this.setDimensions();
            this.initCarousel();
            this.carousel.lineUpCells();
            this.ref.detectChanges();
        }
    }
    ngOnDestroy() {
        this.touches.destroy();
        //this.carousel.destroy();
    }
    initCarousel() {
        this.carouselProperties = {
            id: this.id,
            cellsElement: this.elementRef.nativeElement.querySelector('.carousel-cells'),
            hostElement: this.elementRef.nativeElement,
            images: this.images,
            cellWidth: this.getCellWidth(),
            loop: this.loop,
            autoplayInterval: this.autoplayInterval,
            overflowCellsLimit: this.overflowCellsLimit,
            visibleWidth: this.width,
            margin: this.margin,
            minSwipeDistance: this.minSwipeDistance,
            transitionDuration: this.transitionDuration,
            transitionTimingFunction: this.transitionTimingFunction,
            videoProperties: this.videoProperties,
            eventHandler: this.events,
            freeScroll: this.freeScroll,
            lightDOM: this.lightDOM
        };
        this.utils = new Utils(this.carouselProperties);
        this.cells = new Cells(this.carouselProperties, this.utils);
        this.container = new Container(this.carouselProperties, this.utils, this.cells);
        this.slide = new Slide(this.carouselProperties, this.utils, this.cells, this.container);
        this.carousel = new Carousel(this.carouselProperties, this.utils, this.cells, this.container, this.slide);
        if (this.autoplay) {
            this.carousel.autoplay();
        }
    }
    resize() {
        this.landscapeMode = this.isLandscape;
        this.savedCarouselWidth = this.carouselWidth;
        this.carouselProperties.cellWidth = this.getCellWidth();
        this.cells.updateProperties(this.carouselProperties);
        this.carousel.updateProperties(this.carouselProperties);
        this.container.updateProperties(this.carouselProperties);
        this.slide.updateProperties(this.carouselProperties);
        this.utils.updateProperties(this.carouselProperties);
        this.carousel.lineUpCells();
        this.slide.select(0);
        this.ref.detectChanges();
    }
    detectDomChanges() {
        const observer = new MutationObserver((mutations) => {
            this.onDomChanges();
        });
        var config = {
            attributes: true,
            childList: true,
            characterData: true
        };
        observer.observe(this.cellsElement, config);
    }
    onDomChanges() {
        this.cellLength = this.getCellLength();
        this.carousel.lineUpCells();
        this.ref.detectChanges();
    }
    setDimensions() {
        this.hostStyleHeight = this.height + 'px';
        this.hostStyleWidth = this.width + 'px';
    }
    getImage(index) {
        return this.carousel.getImage(index);
    }
    handleTransitionendCellContainer(event) {
        if (event.target['className'] === 'carousel-cells') {
            this.carousel.handleTransitionend();
        }
    }
    getCellWidth() {
        let elementWidth = this.carouselWidth;
        if (this.cellsToShow) {
            let margin = this.cellsToShow > 1 ? this.margin : 0;
            let totalMargin = margin * (this.cellsToShow - 1);
            return (elementWidth - totalMargin) / this.cellsToShow;
        }
        if (this._cellWidth === '100%') {
            return elementWidth;
        }
        else {
            return this._cellWidth;
        }
    }
    next() {
        this.carousel.next(this.cellsToScroll);
        this.carousel.stopAutoplay();
    }
    prev() {
        this.carousel.prev(this.cellsToScroll);
        this.carousel.stopAutoplay();
    }
    isNextArrowDisabled() {
        if (this.carousel) {
            return this.carousel.isNextArrowDisabled();
        }
    }
    isPrevArrowDisabled() {
        if (this.carousel) {
            return this.carousel.isPrevArrowDisabled();
        }
    }
    getCellLength() {
        if (this.images) {
            return this.images.length;
        }
        else {
            return this.cellsElement.children.length;
        }
    }
}
CarouselComponent.decorators = [
    { type: Component, args: [{
                selector: 'carousel, [carousel]',
                template: "<div class=\"carousel-counter\" *ngIf=\"isCounter\">{{counter}}</div>\r\n\r\n<div class=\"carousel-container\" [class.carousel-moving]=\"isMoving\">\r\n\t<div class=\"carousel-cells\" #cells (transitionend)=\"handleTransitionendCellContainer($event)\">\r\n\t\t<ng-content></ng-content>\r\n\r\n\t\t<ng-template ngFor let-image [ngForOf]=\"images\" let-i=\"index\">\r\n\t\t\t<div class=\"carousel-cell\" \r\n\t\t\t\t[style.width]=\"getCellWidth()+'px'\"\r\n\t\t\t\t[style.border-radius]=\"borderRadius+'px'\"\r\n\t\t\t\t*ngIf=\"i < cellLimit\">\r\n\t\t\t\t<!-- Image -->\r\n\t\t\t\t<img \r\n\t\t\t\t\t*ngIf=\"getImage(i) && getImage(i)['image']\" \r\n\t\t\t\t\t[src]=\"getImage(i)['image']['path']\"\r\n\t\t\t\t\t[style.object-fit]=\"objectFit\"\r\n\t\t\t\t\tdraggable=\"false\" />\r\n\r\n\t\t\t</div>\r\n\t\t</ng-template>\r\n\t</div>\r\n\r\n\t<div class=\"carousel-dots\" *ngIf=\"dots\">\r\n\t\t<div class=\"carousel-dot\" [class.carousel-dot-active]=\"i === activeDotIndex\" *ngFor=\"let dot of dotsArr; index as i\"></div>\r\n\t</div>\r\n</div>\r\n\r\n<div class=\"carousel-arrows\" \r\n\t[class.carousel-arrows-outside]=\"arrowsOutside\" \r\n\t[class.carousel-dark-arrows]=\"arrowsTheme === 'dark'\"\r\n\t*ngIf=\"isArrows\">\r\n\t\r\n\t<div class=\"carousel-arrow carousel-arrow-prev\" [class.carousel-arrow-disabled]=\"isPrevArrowDisabled()\" (click)=\"prev()\"></div>\r\n\t<div class=\"carousel-arrow carousel-arrow-next\" [class.carousel-arrow-disabled]=\"isNextArrowDisabled()\" (click)=\"next()\"></div>\r\n</div>",
                styles: [":host{position:relative;display:block;top:0;left:0;width:100%;height:100%;-webkit-user-select:none;user-select:none;z-index:10000;transform-origin:top left;box-sizing:border-box}:host .carousel-container{overflow:hidden;width:100%;height:100%;cursor:grab}:host .carousel-container.carousel-moving{cursor:grabbing}:host .carousel-counter{text-align:right;position:absolute;z-index:30;transition:opacity .2s;top:8px;right:24px;border-radius:13px;background-color:rgba(23,37,68,.3);font-size:11px;color:#fff;padding:5px 7px;line-height:normal}:host ::ng-deep .carousel-cells{transition:transform .2s;width:100%;height:100%;display:block;will-change:transform}:host ::ng-deep .carousel-cells .carousel-cell.swiper-prev-image{transform:translate3d(-100%,0,0)}:host ::ng-deep .carousel-cells .carousel-cell.swiper-next-image{transform:translate3d(100%,0,0)}:host ::ng-deep .carousel-cells .carousel-cell{width:100%;height:100%;position:absolute;overflow:hidden}:host ::ng-deep .carousel-cells .carousel-cell img,:host ::ng-deep .carousel-cells .carousel-cell video{width:100%;height:100%;position:relative;object-fit:contain}:host ::ng-deep .carousel-cells .carousel-cell img.swiper-hide{display:none}:host ::ng-deep .carousel-cells .carousel-cell .carousel-play{position:absolute;top:0;left:0;bottom:0;right:0;z-index:1}:host .carousel-arrow{width:40px;height:40px;background-color:#fff;background-repeat:no-repeat;background-size:31px;background-position:50%;border-radius:100px;position:absolute;top:50%;margin-top:-20px;z-index:10;cursor:pointer;box-shadow:0 0 5px rgba(0,0,0,.15)}:host .carousel-arrow-prev{left:10px;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0Ij48cGF0aCBkPSJNMTUuNDEgMTYuNTlMMTAuODMgMTJsNC41OC00LjU5TDE0IDZsLTYgNiA2IDYgMS40MS0xLjQxeiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMFYweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==)}:host .carousel-arrow-next{right:10px;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0Ij48cGF0aCBkPSJNOC41OSAxNi41OUwxMy4xNyAxMiA4LjU5IDcuNDEgMTAgNmw2IDYtNiA2LTEuNDEtMS40MXoiLz48cGF0aCBkPSJNMCAwaDI0djI0SDBWMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4=)}:host .carousel-arrows-outside .carousel-arrow-prev{left:-60px}:host .carousel-arrows-outside .carousel-arrow-next{right:-60px}:host .carousel-dark-arrows .carousel-arrow{filter:invert(1)}:host .carousel-arrow-disabled{cursor:default;opacity:.5}:host .carousel-dots{position:absolute;left:0;right:0;bottom:0;z-index:10;text-align:center}:host .carousel-dots .carousel-dot{display:inline-block;border:2px solid #fff;border-radius:100px;margin:4px;width:8px;height:8px}:host .carousel-dots .carousel-dot-active{background-color:#fff}"]
            },] }
];
CarouselComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
CarouselComponent.propDecorators = {
    events: [{ type: Output }],
    id: [{ type: Input }],
    height: [{ type: Input }],
    width: [{ type: Input }],
    autoplay: [{ type: Input }],
    autoplayInterval: [{ type: Input }],
    pauseOnHover: [{ type: Input }],
    dots: [{ type: Input }],
    borderRadius: [{ type: Input }],
    margin: [{ type: Input }],
    objectFit: [{ type: Input }],
    minSwipeDistance: [{ type: Input }],
    transitionDuration: [{ type: Input }],
    transitionTimingFunction: [{ type: Input }],
    videoProperties: [{ type: Input }],
    counterSeparator: [{ type: Input }],
    overflowCellsLimit: [{ type: Input }],
    listeners: [{ type: Input }],
    cellsToShow: [{ type: Input }],
    cellsToScroll: [{ type: Input }],
    freeScroll: [{ type: Input }],
    arrows: [{ type: Input }],
    arrowsOutside: [{ type: Input }],
    arrowsTheme: [{ type: Input }],
    images: [{ type: Input }],
    cellWidth: [{ type: Input, args: ['cellWidth',] }],
    isCounter: [{ type: Input, args: ['counter',] }],
    loop: [{ type: Input, args: ['loop',] }],
    lightDOM: [{ type: Input, args: ['lightDOM',] }],
    hostClassCarousel: [{ type: HostBinding, args: ['class.carousel',] }],
    hostStyleHeight: [{ type: HostBinding, args: ['style.height',] }],
    hostStyleWidth: [{ type: HostBinding, args: ['style.width',] }],
    onWindowResize: [{ type: HostListener, args: ['window:resize', ['$event'],] }],
    onMousemove: [{ type: HostListener, args: ['mousemove', ['$event'],] }],
    onMouseleave: [{ type: HostListener, args: ['mouseleave', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1yZXNwb25zaXZlLWNhcm91c2VsL3NyYy9saWIvY2Fyb3VzZWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFhLFlBQVksRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQTJCLE1BQU0sZUFBZSxDQUFDO0FBR3BLLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNwQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3RDLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDOUIsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUM5QixPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBVTlCLE1BQU0sT0FBTyxpQkFBaUI7SUE4TDFCLFlBQ1ksVUFBc0IsRUFDdEIsR0FBc0I7UUFEdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQXRMbEMsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNoQixtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUNoQyxlQUFVLEdBQVksS0FBSyxDQUFDO1FBRTVCLGVBQVUsR0FBb0IsR0FBRyxDQUFDO1FBQ2xDLFVBQUssR0FBWSxLQUFLLENBQUM7UUFDdkIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixhQUFRLEdBQVksS0FBSyxDQUFDO1FBQzFCLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBeUVuQixXQUFNLEdBQXlCLElBQUksWUFBWSxFQUFXLENBQUM7UUFHNUQsV0FB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LFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzsyQkFPcEMsWUFBWSxTQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgVmlld0NoaWxkLCBFdmVudEVtaXR0ZXIsIEhvc3RCaW5kaW5nLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPdXRwdXQsIE9uRGVzdHJveSwgU2ltcGxlQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge0ltYWdlc30gZnJvbSAnLi9pbnRlcmZhY2VzJztcclxuaW1wb3J0IHtUb3VjaGVzfSBmcm9tICcuL3RvdWNoZXMnO1xyXG5pbXBvcnQge0Nhcm91c2VsfSBmcm9tICcuL2Nhcm91c2VsJztcclxuaW1wb3J0IHtDb250YWluZXJ9IGZyb20gJy4vY29udGFpbmVyJztcclxuaW1wb3J0IHtDZWxsc30gZnJvbSAnLi9jZWxscyc7XHJcbmltcG9ydCB7U2xpZGV9IGZyb20gJy4vc2xpZGUnO1xyXG5pbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHtQcm9wZXJ0aWVzIGFzIENhcm91c2VsUHJvcGVydGllc30gZnJvbSAnLi9pbnRlcmZhY2VzJztcclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnY2Fyb3VzZWwsIFtjYXJvdXNlbF0nLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2Nhcm91c2VsLmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWycuL2Nhcm91c2VsLmNvbXBvbmVudC5zYXNzJ11cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBDYXJvdXNlbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XHJcbiAgICBjYXJvdXNlbDphbnk7XHJcbiAgICBjb250YWluZXI6YW55O1xyXG4gICAgdXRpbHM6YW55O1xyXG4gICAgY2VsbHM6YW55O1xyXG4gICAgc2xpZGU6YW55O1xyXG4gICAgX2lkITogc3RyaW5nO1xyXG4gICAgX2ltYWdlcyE6IEltYWdlcztcclxuICAgIHRvdWNoZXM6IGFueTtcclxuICAgIGxhbmRzY2FwZU1vZGU6IGFueTtcclxuICAgIG1pblRpbWVvdXQgPSAzMDtcclxuICAgIGlzVmlkZW9QbGF5aW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBfaXNDb3VudGVyOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBfd2lkdGghOiBudW1iZXI7XHJcbiAgICBfY2VsbFdpZHRoOiBudW1iZXIgfCAnMTAwJScgPSAyMDA7XHJcbiAgICBfbG9vcDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgX2xpZ2h0RE9NOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBpc01vdmluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgaXNOZ0NvbnRlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGNlbGxMZW5ndGghOiBudW1iZXI7XHJcbiAgICBkb3RzQXJyOiBhbnk7XHJcbiAgICBjYXJvdXNlbFByb3BlcnRpZXMhOiBDYXJvdXNlbFByb3BlcnRpZXM7XHJcbiAgICBzYXZlZENhcm91c2VsV2lkdGghOiBudW1iZXI7XHJcblxyXG4gICAgZ2V0IGlzQ29udGFpbmVyTG9ja2VkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNhcm91c2VsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhcm91c2VsLmlzQ29udGFpbmVyTG9ja2VkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2xpZGVDb3VudGVyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNhcm91c2VsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhcm91c2VsLnNsaWRlQ291bnRlcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxhcENvdW50ZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2Fyb3VzZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2Fyb3VzZWwubGFwQ291bnRlcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzTGFuZHNjYXBlKCkge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aCA+IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNTYWZhcmkoKTogYW55IHtcclxuICAgICAgICBjb25zdCB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBpZiAodWEuaW5kZXhPZignc2FmYXJpJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAhKHVhLmluZGV4T2YoJ2Nocm9tZScpID4gLTEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgY291bnRlcigpIHtcclxuICAgICAgICBsZXQgY291bnRlcjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubG9vcCkge1xyXG4gICAgICAgICAgICBjb3VudGVyID0gdGhpcy5zbGlkZUNvdW50ZXIgJSB0aGlzLmNlbGxMZW5ndGg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY291bnRlciA9IHRoaXMuc2xpZGVDb3VudGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvdW50ZXIgKyAxICsgdGhpcy5jb3VudGVyU2VwYXJhdG9yICsgdGhpcy5jZWxsTGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjZWxsc0VsZW1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJvdXNlbC1jZWxscycpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0Fycm93cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJvd3MgJiYgIXRoaXMuZnJlZVNjcm9sbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNDb3VudGVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0NvdW50ZXIgJiYgdGhpcy5jZWxsTGVuZ3RoID4gMTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgYWN0aXZlRG90SW5kZXgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2xpZGVDb3VudGVyICUgdGhpcy5jZWxsTGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjZWxsTGltaXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2Fyb3VzZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2Fyb3VzZWwuY2VsbExpbWl0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgY2Fyb3VzZWxXaWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xpZW50V2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgQE91dHB1dCgpIGV2ZW50czogRXZlbnRFbWl0dGVyIDwgYW55ID4gPSBuZXcgRXZlbnRFbWl0dGVyIDwgYW55ID4gKCk7XHJcblxyXG4gICAgQElucHV0KCkgaWQhOiBudW1iZXI7XHJcbiAgICBASW5wdXQoKSBoZWlnaHQ6IG51bWJlciA9IDIwMDtcclxuICAgIEBJbnB1dCgpIHdpZHRoITogbnVtYmVyO1xyXG4gICAgQElucHV0KCkgYXV0b3BsYXk6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpIGF1dG9wbGF5SW50ZXJ2YWw6IG51bWJlciA9IDUwMDA7XHJcbiAgICBASW5wdXQoKSBwYXVzZU9uSG92ZXI6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgQElucHV0KCkgZG90czogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgQElucHV0KCkgYm9yZGVyUmFkaXVzITogbnVtYmVyO1xyXG4gICAgQElucHV0KCkgbWFyZ2luOiBudW1iZXIgPSAxMDtcclxuICAgIEBJbnB1dCgpIG9iamVjdEZpdDogJ2NvbnRhaW4nIHwgJ2NvdmVyJyB8ICdub25lJyA9ICdjb3Zlcic7XHJcbiAgICBASW5wdXQoKSBtaW5Td2lwZURpc3RhbmNlOiBudW1iZXIgPSAxMDtcclxuICAgIEBJbnB1dCgpIHRyYW5zaXRpb25EdXJhdGlvbjogbnVtYmVyID0gMjAwO1xyXG4gICAgQElucHV0KCkgdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uOiAnZWFzZScgfCAnZWFzZS1pbicgfCAnZWFzZS1vdXQnIHwgJ2Vhc2UtaW4tb3V0JyB8ICdsaW5lYXInID0gJ2Vhc2Utb3V0JztcclxuICAgIEBJbnB1dCgpIHZpZGVvUHJvcGVydGllczogYW55O1xyXG4gICAgQElucHV0KCkgY291bnRlclNlcGFyYXRvcjogc3RyaW5nID0gXCIgLyBcIjtcclxuICAgIEBJbnB1dCgpIG92ZXJmbG93Q2VsbHNMaW1pdDogbnVtYmVyID0gMztcclxuICAgIEBJbnB1dCgpIGxpc3RlbmVyczogJ2F1dG8nIHwgJ21vdXNlIGFuZCB0b3VjaCcgPSAnbW91c2UgYW5kIHRvdWNoJztcclxuICAgIEBJbnB1dCgpIGNlbGxzVG9TaG93ITogbnVtYmVyO1xyXG4gICAgQElucHV0KCkgY2VsbHNUb1Njcm9sbDogbnVtYmVyID0gMTtcclxuICAgIEBJbnB1dCgpIGZyZWVTY3JvbGw6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpIGFycm93czogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBASW5wdXQoKSBhcnJvd3NPdXRzaWRlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKSBhcnJvd3NUaGVtZTogJ2xpZ2h0JyB8ICdkYXJrJyA9ICdsaWdodCc7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHNldCBpbWFnZXMoaW1hZ2VzOiBJbWFnZXMgJiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9pbWFnZXMgPSBpbWFnZXM7XHJcbiAgICB9XHJcbiAgICBnZXQgaW1hZ2VzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbWFnZXM7XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KCdjZWxsV2lkdGgnKSBzZXQgY2VsbFdpZHRoKHZhbHVlOiBudW1iZXIgfCAnMTAwJScpIHtcclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2VsbFdpZHRoID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBJbnB1dCgnY291bnRlcicpIHNldCBpc0NvdW50ZXIodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5faXNDb3VudGVyID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBJbnB1dCgnbG9vcCcpIHNldCBsb29wKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvb3AgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvb3AoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb29wO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KCdsaWdodERPTScpIHNldCBsaWdodERPTSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9saWdodERPTSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGlnaHRET00oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9saWdodERPTTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuY2Fyb3VzZWwnKSBob3N0Q2xhc3NDYXJvdXNlbDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLmhlaWdodCcpIGhvc3RTdHlsZUhlaWdodCE6IHN0cmluZztcclxuICAgIEBIb3N0QmluZGluZygnc3R5bGUud2lkdGgnKSBob3N0U3R5bGVXaWR0aCE6IHN0cmluZztcclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJywgWyckZXZlbnQnXSlcclxuICAgIG9uV2luZG93UmVzaXplKGV2ZW50OiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy51dGlscy52aXNpYmxlV2lkdGggIT09IHRoaXMuc2F2ZWRDYXJvdXNlbFdpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzaXplKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ21vdXNlbW92ZScsIFsnJGV2ZW50J10pXHJcbiAgICBvbk1vdXNlbW92ZShldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLmF1dG9wbGF5ICYmIHRoaXMucGF1c2VPbkhvdmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2Fyb3VzZWwuc3RvcEF1dG9wbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBbJyRldmVudCddKVxyXG4gICAgb25Nb3VzZWxlYXZlKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXV0b3BsYXkgJiYgdGhpcy5wYXVzZU9uSG92ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jYXJvdXNlbC5hdXRvcGxheSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXHJcbiAgICAgICAgcHJpdmF0ZSByZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHRoaXMuaXNOZ0NvbnRlbnQgPSB0aGlzLmNlbGxzRWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAwO1xyXG5cclxuICAgICAgICB0aGlzLnRvdWNoZXMgPSBuZXcgVG91Y2hlcyh7XHJcbiAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuY2VsbHNFbGVtZW50LFxyXG4gICAgICAgICAgICBsaXN0ZW5lcnM6IHRoaXMubGlzdGVuZXJzLFxyXG4gICAgICAgICAgICBtb3VzZUxpc3RlbmVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJtb3VzZWRvd25cIjogXCJoYW5kbGVNb3VzZWRvd25cIixcclxuICAgICAgICAgICAgICAgIFwibW91c2V1cFwiOiBcImhhbmRsZU1vdXNldXBcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudG91Y2hlcy5vbigndG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlVG91Y2hzdGFydCk7XHJcbiAgICAgICAgdGhpcy50b3VjaGVzLm9uKCdob3Jpem9udGFsLXN3aXBlJywgdGhpcy5oYW5kbGVIb3Jpem9udGFsU3dpcGUpO1xyXG4gICAgICAgIHRoaXMudG91Y2hlcy5vbigndG91Y2hlbmQnLCB0aGlzLmhhbmRsZVRvdWNoZW5kKTtcclxuICAgICAgICB0aGlzLnRvdWNoZXMub24oJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlVG91Y2hzdGFydCk7XHJcbiAgICAgICAgdGhpcy50b3VjaGVzLm9uKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVUb3VjaGVuZCk7XHJcbiAgICAgICAgdGhpcy50b3VjaGVzLm9uKCd0YXAnLCB0aGlzLmhhbmRsZVRhcCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RGltZW5zaW9ucygpO1xyXG4gICAgfVxyXG5cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgICAgICB0aGlzLmluaXRDYXJvdXNlbCgpO1xyXG4gICAgICAgIHRoaXMuY2VsbExlbmd0aCA9IHRoaXMuZ2V0Q2VsbExlbmd0aCgpO1xyXG4gICAgICAgIHRoaXMuZG90c0FyciA9IEFycmF5KHRoaXMuY2VsbExlbmd0aCkuZmlsbCgxKTtcclxuICAgICAgICB0aGlzLnJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICAgICAgdGhpcy5jYXJvdXNlbC5saW5lVXBDZWxscygpO1xyXG4gICAgICAgIHRoaXMuc2F2ZWRDYXJvdXNlbFdpZHRoID0gdGhpcy5jYXJvdXNlbFdpZHRoO1xyXG5cclxuICAgICAgICAvKiBTdGFydCBkZXRlY3RpbmcgY2hhbmdlcyBpbiB0aGUgRE9NIHRyZWUgKi9cclxuICAgICAgICB0aGlzLmRldGVjdERvbUNoYW5nZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICAgICAgaWYgKGNoYW5nZXMud2lkdGggfHwgY2hhbmdlcy5oZWlnaHQgfHwgY2hhbmdlcy5pbWFnZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREaW1lbnNpb25zKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdENhcm91c2VsKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2Fyb3VzZWwubGluZVVwQ2VsbHMoKTtcclxuICAgICAgICAgICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuZ09uRGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLnRvdWNoZXMuZGVzdHJveSgpO1xyXG4gICAgICAgIC8vdGhpcy5jYXJvdXNlbC5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdENhcm91c2VsKCkge1xyXG4gICAgICAgIHRoaXMuY2Fyb3VzZWxQcm9wZXJ0aWVzID0ge1xyXG4gICAgICAgICAgICBpZDogdGhpcy5pZCxcclxuICAgICAgICAgICAgY2VsbHNFbGVtZW50OiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY2Fyb3VzZWwtY2VsbHMnKSxcclxuICAgICAgICAgICAgaG9zdEVsZW1lbnQ6IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxyXG4gICAgICAgICAgICBpbWFnZXM6IHRoaXMuaW1hZ2VzLFxyXG4gICAgICAgICAgICBjZWxsV2lkdGg6IHRoaXMuZ2V0Q2VsbFdpZHRoKCksXHJcbiAgICAgICAgICAgIGxvb3A6IHRoaXMubG9vcCxcclxuICAgICAgICAgICAgYXV0b3BsYXlJbnRlcnZhbDogdGhpcy5hdXRvcGxheUludGVydmFsLFxyXG4gICAgICAgICAgICBvdmVyZmxvd0NlbGxzTGltaXQ6IHRoaXMub3ZlcmZsb3dDZWxsc0xpbWl0LFxyXG4gICAgICAgICAgICB2aXNpYmxlV2lkdGg6IHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXHJcbiAgICAgICAgICAgIG1pblN3aXBlRGlzdGFuY2U6IHRoaXMubWluU3dpcGVEaXN0YW5jZSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbixcclxuICAgICAgICAgICAgdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uOiB0aGlzLnRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbixcclxuICAgICAgICAgICAgdmlkZW9Qcm9wZXJ0aWVzOiB0aGlzLnZpZGVvUHJvcGVydGllcyxcclxuICAgICAgICAgICAgZXZlbnRIYW5kbGVyOiB0aGlzLmV2ZW50cyxcclxuICAgICAgICAgICAgZnJlZVNjcm9sbDogdGhpcy5mcmVlU2Nyb2xsLFxyXG4gICAgICAgICAgICBsaWdodERPTTogdGhpcy5saWdodERPTVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudXRpbHMgPSBuZXcgVXRpbHModGhpcy5jYXJvdXNlbFByb3BlcnRpZXMpO1xyXG4gICAgICAgIHRoaXMuY2VsbHMgPSBuZXcgQ2VsbHModGhpcy5jYXJvdXNlbFByb3BlcnRpZXMsIHRoaXMudXRpbHMpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gbmV3IENvbnRhaW5lcih0aGlzLmNhcm91c2VsUHJvcGVydGllcywgdGhpcy51dGlscywgdGhpcy5jZWxscyk7XHJcbiAgICAgICAgdGhpcy5zbGlkZSA9IG5ldyBTbGlkZSh0aGlzLmNhcm91c2VsUHJvcGVydGllcywgdGhpcy51dGlscywgdGhpcy5jZWxscywgdGhpcy5jb250YWluZXIpO1xyXG4gICAgICAgIHRoaXMuY2Fyb3VzZWwgPSBuZXcgQ2Fyb3VzZWwodGhpcy5jYXJvdXNlbFByb3BlcnRpZXMsIHRoaXMudXRpbHMsIHRoaXMuY2VsbHMsIHRoaXMuY29udGFpbmVyLCB0aGlzLnNsaWRlKTtcclxuICAgIFxyXG4gICAgICAgIGlmICh0aGlzLmF1dG9wbGF5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2Fyb3VzZWwuYXV0b3BsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMubGFuZHNjYXBlTW9kZSA9IHRoaXMuaXNMYW5kc2NhcGU7XHJcbiAgICAgICAgdGhpcy5zYXZlZENhcm91c2VsV2lkdGggPSB0aGlzLmNhcm91c2VsV2lkdGg7XHJcblxyXG4gICAgICAgIHRoaXMuY2Fyb3VzZWxQcm9wZXJ0aWVzLmNlbGxXaWR0aCA9IHRoaXMuZ2V0Q2VsbFdpZHRoKCk7XHJcbiAgICAgICAgdGhpcy5jZWxscy51cGRhdGVQcm9wZXJ0aWVzKHRoaXMuY2Fyb3VzZWxQcm9wZXJ0aWVzKTtcclxuICAgICAgICB0aGlzLmNhcm91c2VsLnVwZGF0ZVByb3BlcnRpZXModGhpcy5jYXJvdXNlbFByb3BlcnRpZXMpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnVwZGF0ZVByb3BlcnRpZXModGhpcy5jYXJvdXNlbFByb3BlcnRpZXMpO1xyXG4gICAgICAgIHRoaXMuc2xpZGUudXBkYXRlUHJvcGVydGllcyh0aGlzLmNhcm91c2VsUHJvcGVydGllcyk7XHJcbiAgICAgICAgdGhpcy51dGlscy51cGRhdGVQcm9wZXJ0aWVzKHRoaXMuY2Fyb3VzZWxQcm9wZXJ0aWVzKTtcclxuICAgICAgICB0aGlzLmNhcm91c2VsLmxpbmVVcENlbGxzKCk7XHJcbiAgICAgICAgdGhpcy5zbGlkZS5zZWxlY3QoMCk7XHJcbiAgICAgICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGRldGVjdERvbUNoYW5nZXMoKSB7XHJcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25Eb21DaGFuZ2VzKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBjb25maWcgPSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXHJcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgICAgICAgY2hhcmFjdGVyRGF0YTogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmNlbGxzRWxlbWVudCwgY29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkRvbUNoYW5nZXMoKSB7XHJcbiAgICAgICAgdGhpcy5jZWxsTGVuZ3RoID0gdGhpcy5nZXRDZWxsTGVuZ3RoKCk7XHJcbiAgICAgICAgdGhpcy5jYXJvdXNlbC5saW5lVXBDZWxscygpO1xyXG4gICAgICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXREaW1lbnNpb25zKCkge1xyXG4gICAgICAgIHRoaXMuaG9zdFN0eWxlSGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyAncHgnO1xyXG4gICAgICAgIHRoaXMuaG9zdFN0eWxlV2lkdGggPSB0aGlzLndpZHRoICsgJ3B4JztcclxuICAgIH1cclxuXHJcbiAgICBnZXRJbWFnZShpbmRleDpudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jYXJvdXNlbC5nZXRJbWFnZShpbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVG91Y2hzdGFydCA9IChldmVudDogYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy50b3VjaGVzLmFkZEV2ZW50TGlzdGVuZXJzKFwibW91c2Vtb3ZlXCIsIFwiaGFuZGxlTW91c2Vtb3ZlXCIpO1xyXG4gICAgICAgIHRoaXMuY2Fyb3VzZWwuaGFuZGxlVG91Y2hzdGFydChldmVudCk7XHJcbiAgICAgICAgdGhpcy5pc01vdmluZyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSG9yaXpvbnRhbFN3aXBlID0gKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuY2Fyb3VzZWwuaGFuZGxlSG9yaXpvbnRhbFN3aXBlKGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUb3VjaGVuZCA9IChldmVudDogYW55KSA9PiB7XHJcbiAgICAgICAgY29uc3QgdG91Y2hlcyA9IGV2ZW50LnRvdWNoZXM7XHJcbiAgICAgICAgdGhpcy5jYXJvdXNlbC5oYW5kbGVUb3VjaGVuZChldmVudCk7XHJcbiAgICAgICAgdGhpcy50b3VjaGVzLnJlbW92ZUV2ZW50TGlzdGVuZXJzKFwibW91c2Vtb3ZlXCIsIFwiaGFuZGxlTW91c2Vtb3ZlXCIpO1xyXG4gICAgICAgIHRoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUYXAgPSAoZXZlbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgIGxldCBvdXRib3VuZEV2ZW50OiBhbnkgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdjbGljaydcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5jZWxsc0VsZW1lbnQuY2hpbGRyZW4pO1xyXG4gICAgICAgIGxldCBjZWxsRWxlbWVudCA9IGV2ZW50LnNyY0VsZW1lbnQuY2xvc2VzdChcIi5jYXJvdXNlbC1jZWxsXCIpO1xyXG4gICAgICAgIGNvbnN0IGkgPSBub2Rlcy5pbmRleE9mKGNlbGxFbGVtZW50KTtcclxuICAgICAgICBjb25zdCBjZWxsSW5kZXggPSBub2Rlcy5pbmRleE9mKGNlbGxFbGVtZW50KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VzKSB7XHJcbiAgICAgICAgICAgIC8vb3V0Ym91bmRFdmVudC5maWxlSW5kZXggPSB0aGlzLmNhcm91c2VsLmdldEZpbGVJbmRleChpKTtcclxuICAgICAgICAgICAgLy9vdXRib3VuZEV2ZW50LmZpbGUgPSB0aGlzLmNhcm91c2VsLmdldEZpbGUoY2VsbEluZGV4KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXRib3VuZEV2ZW50LmNlbGxJbmRleCA9IGNlbGxJbmRleDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVHJhbnNpdGlvbmVuZENlbGxDb250YWluZXIoZXZlbnQ6YW55KSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldFsnY2xhc3NOYW1lJ10gPT09ICdjYXJvdXNlbC1jZWxscycpIHtcclxuICAgICAgICAgICAgdGhpcy5jYXJvdXNlbC5oYW5kbGVUcmFuc2l0aW9uZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldENlbGxXaWR0aCgpIHtcclxuICAgICAgICBsZXQgZWxlbWVudFdpZHRoID0gdGhpcy5jYXJvdXNlbFdpZHRoO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jZWxsc1RvU2hvdykge1xyXG4gICAgICAgICAgICBsZXQgbWFyZ2luID0gdGhpcy5jZWxsc1RvU2hvdyA+IDEgPyB0aGlzLm1hcmdpbiA6IDA7XHJcbiAgICAgICAgICAgIGxldCB0b3RhbE1hcmdpbiA9IG1hcmdpbiAqICh0aGlzLmNlbGxzVG9TaG93IC0gMSk7XHJcbiAgICAgICAgICAgIHJldHVybiAoZWxlbWVudFdpZHRoIC0gdG90YWxNYXJnaW4pIC8gdGhpcy5jZWxsc1RvU2hvdztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9jZWxsV2lkdGggPT09ICcxMDAlJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudFdpZHRoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jZWxsV2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKSB7XHJcbiAgICAgICAgdGhpcy5jYXJvdXNlbC5uZXh0KHRoaXMuY2VsbHNUb1Njcm9sbCk7XHJcbiAgICAgICAgdGhpcy5jYXJvdXNlbC5zdG9wQXV0b3BsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmV2KCkge1xyXG4gICAgICAgIHRoaXMuY2Fyb3VzZWwucHJldih0aGlzLmNlbGxzVG9TY3JvbGwpO1xyXG4gICAgICAgIHRoaXMuY2Fyb3VzZWwuc3RvcEF1dG9wbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNOZXh0QXJyb3dEaXNhYmxlZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5jYXJvdXNlbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYXJvdXNlbC5pc05leHRBcnJvd0Rpc2FibGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzUHJldkFycm93RGlzYWJsZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2Fyb3VzZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2Fyb3VzZWwuaXNQcmV2QXJyb3dEaXNhYmxlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRDZWxsTGVuZ3RoKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmltYWdlcykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXMubGVuZ3RoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNlbGxzRWxlbWVudC5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19