export class Carousel {
    constructor(properties, utils, cells, container, slide) {
        this.properties = properties;
        this.utils = utils;
        this.cells = cells;
        this.container = container;
        this.slide = slide;
        /* The slide length has been limited by the limitSlideLength() method */
        this.isSlideLengthLimited = false;
        this.isContentImages = true;
        this.isLazyLoad = true;
        this.isContainerLocked = true;
        this.alignCells = "left";
        this.initialContainerPosition = 0;
        this.containerPullLimit = 100;
        this.handleTouchstart = (event) => {
            this.container.handleTouchstart();
            this.slide.handleTouchstart(event);
        };
        this.handleHorizontalSwipe = (event) => {
            this.container.handleHorizontalSwipe();
        };
        this.handleTouchend = (event) => {
            if (this.properties.freeScroll) {
                this.container.handleTouchend();
            }
            else {
                this.container.handleTouchend(true);
                this.slide.handleTouchend(event);
            }
        };
        this.isNextArrowDisabled = () => {
            return this.slide.isNextArrowDisabled();
        };
        this.isPrevArrowDisabled = () => {
            return this.slide.isPrevArrowDisabled();
        };
        this.init();
    }
    get cellLength() {
        return this.cells.cellLength;
    }
    get cellLengthInLightDOMMode() {
        if (this.images) {
            let cellLength = this.numberOfVisibleCells + this.overflowCellsLimit * 2;
            if (cellLength > this.images.length) {
                cellLength = this.images.length;
            }
            return cellLength;
        }
        else {
            return this.cellLength;
        }
    }
    get lastCellIndex() {
        return this.images.length ? (this.images.length - 1) : (this.cells.cellLength - 1);
    }
    get overflowCellsLimit() {
        return this.utils.overflowCellsLimit;
    }
    get cellLimit() {
        if (this.isLightDOM) {
            let cellLimit = this.numberOfVisibleCells + this.overflowCellsLimit * 2;
            if (cellLimit < this.numberOfVisibleCells) {
                cellLimit = this.numberOfVisibleCells;
            }
            return cellLimit;
        }
        else {
            return this.properties.images.length;
        }
    }
    get isLightDOM() {
        return this.properties.lightDOM || this.properties.loop;
    }
    get images() {
        return this.properties.images;
    }
    get margin() {
        return this.properties.margin;
    }
    get minSwipeDistance() {
        return this.properties.minSwipeDistance;
    }
    get transitionDuration() {
        return this.properties.transitionDuration;
    }
    get transitionTimingFunction() {
        return this.properties.transitionTimingFunction;
    }
    get fullCellWidth() {
        return this.properties.cellWidth + this.margin;
    }
    get numberOfVisibleCells() {
        return this.utils.numberOfVisibleCells;
    }
    get lapCounter() {
        return Math.floor(this.slide.counter / this.cellLengthInLightDOMMode);
    }
    get slideCounter() {
        return this.slide.counter;
    }
    updateProperties(properties) {
        this.properties = properties;
    }
    init() {
        this.cellsElement = this.properties.cellsElement;
        this.visibleWidth = this.properties.visibleWidth || this.cellsElement.parentElement.clientWidth;
    }
    destroy() {
        clearInterval(this.autoplayId);
    }
    lineUpCells() {
        this.cells.lineUp();
    }
    handleTransitionend() {
        this.slide.handleTransitionend();
    }
    getImage(index) {
        return this.cells.getImage(index);
    }
    next(length = 1) {
        if (!this.isNextArrowDisabled()) {
            this.slide.next(length);
        }
    }
    prev(length = 1) {
        this.slide.prev(length);
    }
    autoplay() {
        this.autoplayId = setInterval(() => {
            this.next();
        }, this.properties.autoplayInterval);
    }
    stopAutoplay() {
        if (this.autoplayId) {
            clearInterval(this.autoplayId);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLXJlc3BvbnNpdmUtY2Fyb3VzZWwvc3JjL2xpYi9jYXJvdXNlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLE9BQU8sUUFBUTtJQTZGakIsWUFDWSxVQUFzQixFQUN0QixLQUFVLEVBQ1YsS0FBVSxFQUNWLFNBQWMsRUFDZCxLQUFVO1FBSlYsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixVQUFLLEdBQUwsS0FBSyxDQUFLO1FBQ1YsVUFBSyxHQUFMLEtBQUssQ0FBSztRQUNWLGNBQVMsR0FBVCxTQUFTLENBQUs7UUFDZCxVQUFLLEdBQUwsS0FBSyxDQUFLO1FBL0Z0Qix3RUFBd0U7UUFDeEUseUJBQW9CLEdBQVksS0FBSyxDQUFDO1FBRXRDLG9CQUFlLEdBQVksSUFBSSxDQUFDO1FBRWhDLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFDM0Isc0JBQWlCLEdBQVksSUFBSSxDQUFDO1FBQ2xDLGVBQVUsR0FBc0IsTUFBTSxDQUFDO1FBQ3ZDLDZCQUF3QixHQUFXLENBQUMsQ0FBQztRQUVyQyx1QkFBa0IsR0FBRyxHQUFHLENBQUM7UUEyR3pCLHFCQUFnQixHQUFHLENBQUMsS0FBVSxFQUFFLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFBO1FBRUQsMEJBQXFCLEdBQUcsQ0FBQyxLQUFVLEVBQUUsRUFBRTtZQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDM0MsQ0FBQyxDQUFBO1FBRUQsbUJBQWMsR0FBRyxDQUFDLEtBQVUsRUFBRSxFQUFFO1lBQzVCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUU7Z0JBQzVCLElB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Q0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzNCO0lBQ0wsQ0FBQztJQUVELElBQUksQ0FBQyxTQUFpQixDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFVRCxRQUFRO1FBQ0osSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFO1lBQy9CLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQixDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxZQUFZO1FBQ1IsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDbEM7SUFDTCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1Byb3BlcnRpZXN9IGZyb20gJy4vaW50ZXJmYWNlcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2Fyb3VzZWwge1xyXG4gICAgY2VsbHNFbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICAvKiBUaGUgc2xpZGUgbGVuZ3RoIGhhcyBiZWVuIGxpbWl0ZWQgYnkgdGhlIGxpbWl0U2xpZGVMZW5ndGgoKSBtZXRob2QgKi9cclxuICAgIGlzU2xpZGVMZW5ndGhMaW1pdGVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgaXNDb250ZW50SW1hZ2VzOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHZpc2libGVXaWR0aCE6IG51bWJlcjtcclxuICAgIGlzTGF6eUxvYWQ6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgaXNDb250YWluZXJMb2NrZWQ6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgYWxpZ25DZWxsczogXCJsZWZ0XCIgfCBcImNlbnRlclwiID0gXCJsZWZ0XCI7XHJcbiAgICBpbml0aWFsQ29udGFpbmVyUG9zaXRpb246IG51bWJlciA9IDA7XHJcbiAgICBhdXRvcGxheUlkOiBhbnk7XHJcbiAgICBjb250YWluZXJQdWxsTGltaXQgPSAxMDA7XHJcblxyXG4gICAgZ2V0IGNlbGxMZW5ndGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHMuY2VsbExlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY2VsbExlbmd0aEluTGlnaHRET01Nb2RlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmltYWdlcykge1xyXG4gICAgICAgICAgICBsZXQgY2VsbExlbmd0aCA9IHRoaXMubnVtYmVyT2ZWaXNpYmxlQ2VsbHMgKyB0aGlzLm92ZXJmbG93Q2VsbHNMaW1pdCAqIDI7XHJcbiAgICAgICAgICAgIGlmIChjZWxsTGVuZ3RoID4gdGhpcy5pbWFnZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBjZWxsTGVuZ3RoID0gdGhpcy5pbWFnZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjZWxsTGVuZ3RoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNlbGxMZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBsYXN0Q2VsbEluZGV4KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmltYWdlcy5sZW5ndGggPyAodGhpcy5pbWFnZXMubGVuZ3RoIC0gMSkgOiAodGhpcy5jZWxscy5jZWxsTGVuZ3RoIC0gMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG92ZXJmbG93Q2VsbHNMaW1pdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51dGlscy5vdmVyZmxvd0NlbGxzTGltaXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNlbGxMaW1pdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0xpZ2h0RE9NKSB7XHJcbiAgICAgICAgICAgIGxldCBjZWxsTGltaXQgPSB0aGlzLm51bWJlck9mVmlzaWJsZUNlbGxzICsgdGhpcy5vdmVyZmxvd0NlbGxzTGltaXQgKiAyO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNlbGxMaW1pdCA8IHRoaXMubnVtYmVyT2ZWaXNpYmxlQ2VsbHMpIHtcclxuICAgICAgICAgICAgICAgIGNlbGxMaW1pdCA9IHRoaXMubnVtYmVyT2ZWaXNpYmxlQ2VsbHM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjZWxsTGltaXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcGVydGllcy5pbWFnZXMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNMaWdodERPTSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzLmxpZ2h0RE9NIHx8IHRoaXMucHJvcGVydGllcy5sb29wO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbWFnZXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcGVydGllcy5pbWFnZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG1hcmdpbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzLm1hcmdpbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbWluU3dpcGVEaXN0YW5jZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzLm1pblN3aXBlRGlzdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRyYW5zaXRpb25EdXJhdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzLnRyYW5zaXRpb25EdXJhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXMudHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmdWxsQ2VsbFdpZHRoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXMuY2VsbFdpZHRoICsgdGhpcy5tYXJnaW47XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG51bWJlck9mVmlzaWJsZUNlbGxzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnV0aWxzLm51bWJlck9mVmlzaWJsZUNlbGxzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsYXBDb3VudGVyKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuc2xpZGUuY291bnRlciAvIHRoaXMuY2VsbExlbmd0aEluTGlnaHRET01Nb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2xpZGVDb3VudGVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNsaWRlLmNvdW50ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBwcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzLFxyXG4gICAgICAgIHByaXZhdGUgdXRpbHM6IGFueSxcclxuICAgICAgICBwcml2YXRlIGNlbGxzOiBhbnksXHJcbiAgICAgICAgcHJpdmF0ZSBjb250YWluZXI6IGFueSxcclxuICAgICAgICBwcml2YXRlIHNsaWRlOiBhbnkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlUHJvcGVydGllcyhwcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuY2VsbHNFbGVtZW50ID0gdGhpcy5wcm9wZXJ0aWVzLmNlbGxzRWxlbWVudDtcclxuICAgICAgICB0aGlzLnZpc2libGVXaWR0aCA9IHRoaXMucHJvcGVydGllcy52aXNpYmxlV2lkdGggfHwgdGhpcy5jZWxsc0VsZW1lbnQhLnBhcmVudEVsZW1lbnQhLmNsaWVudFdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmF1dG9wbGF5SWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGxpbmVVcENlbGxzKCkge1xyXG4gICAgICAgIHRoaXMuY2VsbHMubGluZVVwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVG91Y2hzdGFydCA9IChldmVudDogYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuaGFuZGxlVG91Y2hzdGFydCgpO1xyXG4gICAgICAgIHRoaXMuc2xpZGUuaGFuZGxlVG91Y2hzdGFydChldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSG9yaXpvbnRhbFN3aXBlID0gKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5oYW5kbGVIb3Jpem9udGFsU3dpcGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUb3VjaGVuZCA9IChldmVudDogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvcGVydGllcy5mcmVlU2Nyb2xsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmhhbmRsZVRvdWNoZW5kKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaGFuZGxlVG91Y2hlbmQodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGUuaGFuZGxlVG91Y2hlbmQoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUcmFuc2l0aW9uZW5kKCkge1xyXG4gICAgICAgIHRoaXMuc2xpZGUuaGFuZGxlVHJhbnNpdGlvbmVuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEltYWdlKGluZGV4Om51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNlbGxzLmdldEltYWdlKGluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KGxlbmd0aDogbnVtYmVyID0gMSkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc05leHRBcnJvd0Rpc2FibGVkKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZS5uZXh0KGxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByZXYobGVuZ3RoOiBudW1iZXIgPSAxKSB7XHJcbiAgICAgICAgdGhpcy5zbGlkZS5wcmV2KGxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNOZXh0QXJyb3dEaXNhYmxlZCA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zbGlkZS5pc05leHRBcnJvd0Rpc2FibGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNQcmV2QXJyb3dEaXNhYmxlZCA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zbGlkZS5pc1ByZXZBcnJvd0Rpc2FibGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXV0b3BsYXkoKSB7XHJcbiAgICAgICAgdGhpcy5hdXRvcGxheUlkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICB9LCB0aGlzLnByb3BlcnRpZXMuYXV0b3BsYXlJbnRlcnZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcEF1dG9wbGF5KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmF1dG9wbGF5SWQpIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmF1dG9wbGF5SWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==