export class Slide {
    constructor(carouselProperties, utils, cells, container) {
        this.carouselProperties = carouselProperties;
        this.utils = utils;
        this.cells = cells;
        this.container = container;
        this.slideLength = 0;
        this.isSlideInProgress = false;
        this.counter = 0;
        this._counter = 0;
        this.distance = 0;
        this.distanceAbs = 0;
        this.isNotClickOnArrow = false;
        this.initialPositionX = 0;
        this.currentPositionX = 0;
        /* The slide length has been limited by the limitSlideLength() method */
        this.isSlideLengthLimited = false;
        this.init();
    }
    get fullCellWidth() {
        return this.carouselProperties.cellWidth + this.carouselProperties.margin;
    }
    get margin() {
        return this.carouselProperties.margin;
    }
    get minSwipeDistance() {
        return this.carouselProperties.minSwipeDistance;
    }
    get numberOfVisibleCells() {
        return this.utils.numberOfVisibleCells;
    }
    get visibleCellsOverflowContainer() {
        return this.utils.visibleCellsOverflowContainer;
    }
    /* The position to which the container returns after each slide
     * in the light DUM tree mode.
     */
    get fixedContainerPosition() {
        return -(this.overflowCellsLimit * this.fullCellWidth);
    }
    get overflowCellsLimit() {
        return this.utils.overflowCellsLimit;
    }
    get images() {
        return this.carouselProperties.images;
    }
    /* Number of cell elements in the DUM tree */
    get cellLength() {
        if (this.isLightDOM) {
            return this.cells.cellLengthInLightDOMMode;
        }
        else {
            if (this.images) {
                return this.images.length;
            }
            else {
                return this.cells.cellLength;
            }
        }
    }
    get isLightDOM() {
        return this.carouselProperties.lightDOM || this.carouselProperties.loop;
    }
    updateProperties(carouselProperties) {
        this.carouselProperties = carouselProperties;
        this.setVisibleWidth();
    }
    init() {
        this.visibleWidth = this.carouselProperties.visibleWidth || this.carouselProperties.hostElement.clientWidth;
    }
    handleTouchstart() {
        /* Touchstart event is not called for arrow */
        this.isNotClickOnArrow = true;
        this.isSlideLengthLimited = false;
        if (!this.isSlideInProgress) {
            this.initialPositionX = this.container.getCurrentPositionX();
        }
    }
    handleTouchend() {
        if (!this.isNotClickOnArrow) {
            return;
        }
        this.currentPositionX = this.container.getCurrentPositionX();
        this.distanceAbs = Math.abs(this.initialPositionX - this.currentPositionX);
        this.distance = this.initialPositionX - this.currentPositionX;
        this.direction = this.getDirection();
        this.isNotClickOnArrow = false;
        this.handleSlide();
    }
    handleTransitionend() {
        this.setCounter();
        this.isSlideInProgress = false;
        if (this.isLightDOM) {
            this.alignContainerFast();
        }
    }
    handleSlide(customSlideLength = undefined) {
        let isUsingButton = customSlideLength;
        let newPositionX;
        if (isUsingButton && this.isSlideInProgress || !this.direction) {
            return;
        }
        /* Custom slide length is used in arrows */
        if (customSlideLength) {
            this.slideLength = this.limitSlideLength(customSlideLength);
            if (!this.isSlideInProgress) {
                this.initialPositionX = this.container.getCurrentPositionX();
            }
        }
        else {
            this.slideLength = this.getSlideLength(this.distanceAbs);
        }
        /* Store intermediate counter value */
        this._counter = this.getPreliminaryCounter();
        if (this.direction === 'left') {
            if (!customSlideLength) {
                this.slideLength = this.limitSlideLength(this.getSlideLength(this.distanceAbs));
            }
            this._counter = this.getPreliminaryCounter();
            let isSlidesEnd = this.isSlidesEnd(this._counter);
            newPositionX = this.getPositionByIndex(this._counter);
            if (isSlidesEnd) {
                this._counter = this.counter;
                newPositionX = this.getPositionByIndex(this.counter);
                this.slideLength = 0;
            }
        }
        if (this.direction === 'right') {
            if (!customSlideLength) {
                this.slideLength = this.getSlideLength(this.distanceAbs);
            }
            if (this._counter < 0) {
                this._counter = this.counter;
                this.slideLength = this.counter;
            }
            newPositionX = this.getPositionByIndex(this.counter - this.slideLength);
        }
        if (this.container.getCurrentPositionX() !== newPositionX) {
            this.isSlideInProgress = true;
            this.container.transformPositionX(newPositionX);
        }
    }
    next(length = 1) {
        this.direction = 'left';
        this.handleSlide(length);
    }
    prev(length = 1) {
        this.direction = 'right';
        this.handleSlide(length);
    }
    select(index) {
        if (index > this.cellLength - 1) {
            return;
        }
        if (index > this.counter) {
            let length = index - this.counter;
            this.next(length);
        }
        if (index < this.counter) {
            let length = this.counter - index;
            this.prev(length);
        }
    }
    getPreliminaryCounter() {
        if (this.direction === 'left') {
            return this.counter + this.slideLength;
        }
        if (this.direction === 'right') {
            return this.counter - this.slideLength;
        }
        return 0;
    }
    /*
     * Limits the length of the slide during calls to the next() and prev()
     * methods if the specified position is outside the cell length
     */
    limitSlideLength(slideLength) {
        if (slideLength > 1) {
            for (var i = 0; i < slideLength; i++) {
                let newCounter = this.counter + (slideLength - i);
                if (!this.isSlidesEnd(newCounter)) {
                    slideLength = slideLength - i;
                    this.isSlideLengthLimited = i > 0;
                    break;
                }
            }
        }
        return slideLength;
    }
    /* Offset the container to show the last cell completely */
    getPositionCorrection(counter) {
        let correction = 0;
        let isLastSlide = this.isLastSlide(counter);
        if (this.carouselProperties.loop || this.direction === "right") {
            return 0;
        }
        if (this.isSlideLengthLimited || isLastSlide) {
            let cellsWidth = this.cells.cellLengthInLightDOMMode * this.fullCellWidth;
            if (this.visibleWidth < cellsWidth) {
                correction = -(this.numberOfVisibleCells * this.fullCellWidth - this.visibleWidth - this.margin);
            }
            if (correction >= -this.margin) {
                correction = 0;
            }
        }
        return correction;
    }
    getSlideLength(distanceAbs) {
        let isLastSlide = this.isLastSlide(this.counter);
        /* If the last cell does not fit entirely, then the
         * length of the swipe to the left, from the extreme
         * right position, may be shorter than usual.
         */
        if (isLastSlide && this.direction === "right") {
            distanceAbs = distanceAbs + this.visibleWidth % this.fullCellWidth;
        }
        let length = Math.floor(distanceAbs / this.fullCellWidth);
        if (distanceAbs % this.fullCellWidth >= this.minSwipeDistance) {
            length++;
        }
        return length;
    }
    getDistanceAbs() {
        return Math.abs(this.initialPositionX - this.currentPositionX);
    }
    getDirection() {
        const direction = Math.sign(this.initialPositionX - this.currentPositionX);
        if (direction === -1) {
            return 'right';
        }
        if (direction === 1) {
            return 'left';
        }
        return undefined;
    }
    isSlidesEnd(counter) {
        let margin = this.visibleCellsOverflowContainer ? 1 : 0;
        let imageLength = this.images ? this.images.length : this.cells.cellLength;
        if (this.carouselProperties.loop) {
            return false;
        }
        else {
            return (imageLength - counter + margin) < this.numberOfVisibleCells;
        }
    }
    isLastSlide(counter) {
        return this.isSlidesEnd(counter + 1);
    }
    setCounter() {
        if (this.direction === 'left') {
            this.counter = this.counter + this.slideLength;
        }
        if (this.direction === 'right') {
            this.counter = this.counter - this.slideLength;
        }
    }
    getPositionByIndex(_counter) {
        let correction = this.getPositionCorrection(this.counter + this.slideLength);
        let position;
        if (correction !== 0) {
            correction = correction + this.fullCellWidth;
        }
        if (this.direction === 'right') {
            correction = 0;
        }
        if (this.isLightDOM && this.isLightDOMMode(_counter) ||
            this.isLightDOM && this.ifLeftDOMModeAtEnd(_counter)) {
            let initialPosition = this.getPositionWithoutCorrection(this.initialPositionX);
            let counterDifference = _counter - this.counter;
            position = initialPosition - ((counterDifference * this.fullCellWidth) - correction);
        }
        else {
            position = -((_counter * this.fullCellWidth) - correction);
        }
        position = this.provideSafePosition(position);
        return position;
    }
    provideSafePosition(position) {
        const endPosition = this.container.getEndPosition();
        if (this.direction === 'left') {
            if (position > 0) {
                position = 0;
            }
        }
        if (this.direction === 'right') {
            if (position < endPosition) {
                position = endPosition;
            }
        }
        return position;
    }
    getPositionWithoutCorrection(value) {
        let remainder = Math.round(value) % this.fullCellWidth;
        if (remainder !== 0) {
            return value - (this.fullCellWidth + remainder);
        }
        else {
            return value;
        }
    }
    isNextArrowDisabled() {
        return this.isLastSlide(this.counter) ||
            (!this.visibleCellsOverflowContainer && this.cellLength <= this.numberOfVisibleCells) ||
            (this.visibleCellsOverflowContainer && this.cellLength < this.numberOfVisibleCells);
    }
    isPrevArrowDisabled() {
        return this.counter === 0;
    }
    alignContainerFast() {
        if (this.isLightDOMMode(this.counter)) {
            let positionX = this.fixedContainerPosition;
            this.container.transformPositionX(positionX, 0);
            this.cells.setCounter(this.counter);
            this.cells.lineUp();
        }
        else if (this.ifLeftDOMModeToBeginning(this.counter)) {
            /* If we have already exited the light DOM mode but
             * the cells are still out of place
             */
            if (this.cells.ifSequenceOfCellsIsChanged()) {
                let positionX = -(this.counter * this.fullCellWidth);
                this.container.transformPositionX(positionX, 0);
                this.cells.setCounter(this.counter);
                this.cells.lineUp();
            }
        }
        else if (this.ifLeftDOMModeAtEnd(this.counter)) {
            let containerPositionX = this.container.getCurrentPositionX();
            let containerWidth = this.container.getWidth();
            this.visibleWidth;
            if (this.isLastSlide(this.counter) &&
                containerWidth + containerPositionX >= this.visibleWidth) {
                return;
            }
            let correction = this.getPositionCorrection(this.counter);
            if (correction !== 0) {
                correction = correction + this.fullCellWidth;
            }
            if (this.direction === 'right') {
                correction = 0;
            }
            let positionX = this.fixedContainerPosition + correction;
            this.container.transformPositionX(positionX, 0);
            this.cells.setCounter(this.counter);
            this.cells.lineUp();
        }
    }
    isLightDOMMode(counter) {
        let flag;
        let remainderOfCells = this.images.length - this.overflowCellsLimit - this.numberOfVisibleCells;
        if (!this.isLightDOM) {
            return false;
        }
        if (counter > this.overflowCellsLimit && this.direction === "left" &&
            counter <= remainderOfCells) {
            flag = true;
        }
        if (counter >= this.overflowCellsLimit && this.direction === "right" &&
            counter < remainderOfCells) {
            flag = true;
        }
        if (this.counter > this.overflowCellsLimit && this.direction === "left" &&
            this.counter <= remainderOfCells) {
            flag = true;
        }
        if (this.counter >= this.overflowCellsLimit && this.direction === "right" &&
            this.counter < remainderOfCells) {
            flag = true;
        }
        return flag;
    }
    ifLeftDOMModeAtEnd(counter) {
        let flag;
        let remainderOfCells = this.images.length - this.overflowCellsLimit - this.numberOfVisibleCells;
        if (counter >= remainderOfCells) {
            flag = true;
        }
        if (this.counter >= remainderOfCells) {
            flag = true;
        }
        return flag;
    }
    ifLeftDOMModeToBeginning(counter) {
        let flag;
        if (counter <= this.overflowCellsLimit) {
            flag = true;
        }
        if (this.counter <= this.overflowCellsLimit) {
            flag = true;
        }
        return flag;
    }
    setVisibleWidth() {
        this.visibleWidth = this.carouselProperties.visibleWidth || this.carouselProperties.hostElement.clientWidth;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLXJlc3BvbnNpdmUtY2Fyb3VzZWwvc3JjL2xpYi9zbGlkZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQSxNQUFNLE9BQU8sS0FBSztJQW9FZCxZQUFvQixrQkFBc0MsRUFDOUMsS0FBVSxFQUNWLEtBQVUsRUFDVixTQUFjO1FBSE4sdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUM5QyxVQUFLLEdBQUwsS0FBSyxDQUFLO1FBQ1YsVUFBSyxHQUFMLEtBQUssQ0FBSztRQUNWLGNBQVMsR0FBVCxTQUFTLENBQUs7UUF0RTFCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBQ3hCLHNCQUFpQixHQUFZLEtBQUssQ0FBQztRQUVuQyxZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBQ3BCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUV4QixzQkFBaUIsR0FBWSxLQUFLLENBQUM7UUFDbkMscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBQzdCLHFCQUFnQixHQUFXLENBQUMsQ0FBQztRQUU3Qix3RUFBd0U7UUFDeEUseUJBQW9CLEdBQVksS0FBSyxDQUFDO1FBMkRsQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQTFERCxJQUFJLGFBQWE7UUFDYixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztJQUM5RSxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ04sT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDO0lBQzFDLENBQUM7SUFFRCxJQUFJLGdCQUFnQjtRQUNoQixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNwRCxDQUFDO0lB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SUFBSSxnQkFBZ0IsRUFBRTtZQUNsQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ2Y7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsd0JBQXdCLENBQUMsT0FBZTtRQUNwQyxJQUFJLElBQUksQ0FBQztRQUVULElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUNwQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ2Y7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ3pDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDZjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxlQUFlO1FBQ1gsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO0lBQ2hILENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UHJvcGVydGllcyBhcyBDYXJvdXNlbFByb3BlcnRpZXN9IGZyb20gJy4vaW50ZXJmYWNlcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFByb3BlcnRpZXMge1xyXG4gICAgY2Fyb3VzZWxQcm9wZXJ0aWVzOiBDYXJvdXNlbFByb3BlcnRpZXM7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTbGlkZSB7XHJcbiAgICBzbGlkZUxlbmd0aDogbnVtYmVyID0gMDtcclxuICAgIGlzU2xpZGVJblByb2dyZXNzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBkaXJlY3Rpb246ICdsZWZ0JyB8ICdyaWdodCcgfCB1bmRlZmluZWQ7XHJcbiAgICBjb3VudGVyOiBudW1iZXIgPSAwO1xyXG4gICAgX2NvdW50ZXI6IG51bWJlciA9IDA7XHJcbiAgICBkaXN0YW5jZTogbnVtYmVyID0gMDtcclxuICAgIGRpc3RhbmNlQWJzOiBudW1iZXIgPSAwO1xyXG4gICAgdmlzaWJsZVdpZHRoITogbnVtYmVyO1xyXG4gICAgaXNOb3RDbGlja09uQXJyb3c6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGluaXRpYWxQb3NpdGlvblg6IG51bWJlciA9IDA7XHJcbiAgICBjdXJyZW50UG9zaXRpb25YOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIC8qIFRoZSBzbGlkZSBsZW5ndGggaGFzIGJlZW4gbGltaXRlZCBieSB0aGUgbGltaXRTbGlkZUxlbmd0aCgpIG1ldGhvZCAqL1xyXG4gICAgaXNTbGlkZUxlbmd0aExpbWl0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBnZXQgZnVsbENlbGxXaWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jYXJvdXNlbFByb3BlcnRpZXMuY2VsbFdpZHRoICsgdGhpcy5jYXJvdXNlbFByb3BlcnRpZXMubWFyZ2luO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBtYXJnaW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2Fyb3VzZWxQcm9wZXJ0aWVzLm1hcmdpbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbWluU3dpcGVEaXN0YW5jZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jYXJvdXNlbFByb3BlcnRpZXMubWluU3dpcGVEaXN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbnVtYmVyT2ZWaXNpYmxlQ2VsbHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXRpbHMubnVtYmVyT2ZWaXNpYmxlQ2VsbHM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHZpc2libGVDZWxsc092ZXJmbG93Q29udGFpbmVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnV0aWxzLnZpc2libGVDZWxsc092ZXJmbG93Q29udGFpbmVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIFRoZSBwb3NpdGlvbiB0byB3aGljaCB0aGUgY29udGFpbmVyIHJldHVybnMgYWZ0ZXIgZWFjaCBzbGlkZSBcclxuICAgICAqIGluIHRoZSBsaWdodCBEVU0gdHJlZSBtb2RlLiBcclxuICAgICAqL1xyXG4gICAgZ2V0IGZpeGVkQ29udGFpbmVyUG9zaXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIC0odGhpcy5vdmVyZmxvd0NlbGxzTGltaXQgKiB0aGlzLmZ1bGxDZWxsV2lkdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBvdmVyZmxvd0NlbGxzTGltaXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXRpbHMub3ZlcmZsb3dDZWxsc0xpbWl0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbWFnZXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2Fyb3VzZWxQcm9wZXJ0aWVzLmltYWdlcztcclxuICAgIH1cclxuXHJcbiAgICAvKiBOdW1iZXIgb2YgY2VsbCBlbGVtZW50cyBpbiB0aGUgRFVNIHRyZWUgKi9cclxuICAgIGdldCBjZWxsTGVuZ3RoKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzTGlnaHRET00pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHMuY2VsbExlbmd0aEluTGlnaHRET01Nb2RlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmltYWdlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNlbGxzLmNlbGxMZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzTGlnaHRET00oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2Fyb3VzZWxQcm9wZXJ0aWVzLmxpZ2h0RE9NIHx8IHRoaXMuY2Fyb3VzZWxQcm9wZXJ0aWVzLmxvb3A7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYXJvdXNlbFByb3BlcnRpZXM6IENhcm91c2VsUHJvcGVydGllcyxcclxuICAgICAgICBwcml2YXRlIHV0aWxzOiBhbnksXHJcbiAgICAgICAgcHJpdmF0ZSBjZWxsczogYW55LFxyXG4gICAgICAgIHByaXZhdGUgY29udGFpbmVyOiBhbnkpIHtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlUHJvcGVydGllcyhjYXJvdXNlbFByb3BlcnRpZXM6IENhcm91c2VsUHJvcGVydGllcykge1xyXG4gICAgICAgIHRoaXMuY2Fyb3VzZWxQcm9wZXJ0aWVzID0gY2Fyb3VzZWxQcm9wZXJ0aWVzO1xyXG4gICAgICAgIHRoaXMuc2V0VmlzaWJsZVdpZHRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLnZpc2libGVXaWR0aCA9IHRoaXMuY2Fyb3VzZWxQcm9wZXJ0aWVzLnZpc2libGVXaWR0aCB8fCB0aGlzLmNhcm91c2VsUHJvcGVydGllcy5ob3N0RWxlbWVudC5jbGllbnRXaWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUb3VjaHN0YXJ0KCkge1xyXG4gICAgICAgIC8qIFRvdWNoc3RhcnQgZXZlbnQgaXMgbm90IGNhbGxlZCBmb3IgYXJyb3cgKi9cclxuICAgICAgICB0aGlzLmlzTm90Q2xpY2tPbkFycm93ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmlzU2xpZGVMZW5ndGhMaW1pdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc1NsaWRlSW5Qcm9ncmVzcykge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxQb3NpdGlvblggPSB0aGlzLmNvbnRhaW5lci5nZXRDdXJyZW50UG9zaXRpb25YKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVRvdWNoZW5kKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc05vdENsaWNrT25BcnJvdykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3VycmVudFBvc2l0aW9uWCA9IHRoaXMuY29udGFpbmVyLmdldEN1cnJlbnRQb3NpdGlvblgoKTtcclxuICAgICAgICB0aGlzLmRpc3RhbmNlQWJzID0gTWF0aC5hYnModGhpcy5pbml0aWFsUG9zaXRpb25YIC0gdGhpcy5jdXJyZW50UG9zaXRpb25YKTtcclxuICAgICAgICB0aGlzLmRpc3RhbmNlID0gdGhpcy5pbml0aWFsUG9zaXRpb25YIC0gdGhpcy5jdXJyZW50UG9zaXRpb25YO1xyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gdGhpcy5nZXREaXJlY3Rpb24oKTtcclxuICAgICAgICB0aGlzLmlzTm90Q2xpY2tPbkFycm93ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTbGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVRyYW5zaXRpb25lbmQoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRDb3VudGVyKCk7XHJcbiAgICAgICAgdGhpcy5pc1NsaWRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0xpZ2h0RE9NKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWxpZ25Db250YWluZXJGYXN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVNsaWRlKGN1c3RvbVNsaWRlTGVuZ3RoOiBudW1iZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQpIHtcclxuICAgICAgICBsZXQgaXNVc2luZ0J1dHRvbiA9IGN1c3RvbVNsaWRlTGVuZ3RoO1xyXG4gICAgICAgIGxldCBuZXdQb3NpdGlvblg7XHJcblxyXG4gICAgICAgIGlmIChpc1VzaW5nQnV0dG9uICYmIHRoaXMuaXNTbGlkZUluUHJvZ3Jlc3MgfHwgIXRoaXMuZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIEN1c3RvbSBzbGlkZSBsZW5ndGggaXMgdXNlZCBpbiBhcnJvd3MgKi9cclxuICAgICAgICBpZiAoY3VzdG9tU2xpZGVMZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5zbGlkZUxlbmd0aCA9IHRoaXMubGltaXRTbGlkZUxlbmd0aChjdXN0b21TbGlkZUxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNTbGlkZUluUHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbFBvc2l0aW9uWCA9IHRoaXMuY29udGFpbmVyLmdldEN1cnJlbnRQb3NpdGlvblgoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2xpZGVMZW5ndGggPSB0aGlzLmdldFNsaWRlTGVuZ3RoKHRoaXMuZGlzdGFuY2VBYnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogU3RvcmUgaW50ZXJtZWRpYXRlIGNvdW50ZXIgdmFsdWUgKi9cclxuICAgICAgICB0aGlzLl9jb3VudGVyID0gdGhpcy5nZXRQcmVsaW1pbmFyeUNvdW50ZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuICAgICAgICAgICAgaWYgKCFjdXN0b21TbGlkZUxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZUxlbmd0aCA9IHRoaXMubGltaXRTbGlkZUxlbmd0aCh0aGlzLmdldFNsaWRlTGVuZ3RoKHRoaXMuZGlzdGFuY2VBYnMpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fY291bnRlciA9IHRoaXMuZ2V0UHJlbGltaW5hcnlDb3VudGVyKCk7XHJcbiAgICAgICAgICAgIGxldCBpc1NsaWRlc0VuZCA9IHRoaXMuaXNTbGlkZXNFbmQodGhpcy5fY291bnRlcik7XHJcbiAgICAgICAgICAgIG5ld1Bvc2l0aW9uWCA9IHRoaXMuZ2V0UG9zaXRpb25CeUluZGV4KHRoaXMuX2NvdW50ZXIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlzU2xpZGVzRW5kKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb3VudGVyID0gdGhpcy5jb3VudGVyO1xyXG5cclxuICAgICAgICAgICAgICAgIG5ld1Bvc2l0aW9uWCA9IHRoaXMuZ2V0UG9zaXRpb25CeUluZGV4KHRoaXMuY291bnRlcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlTGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcbiAgICAgICAgICAgIGlmICghY3VzdG9tU2xpZGVMZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVMZW5ndGggPSB0aGlzLmdldFNsaWRlTGVuZ3RoKHRoaXMuZGlzdGFuY2VBYnMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fY291bnRlciA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIgPSB0aGlzLmNvdW50ZXI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlTGVuZ3RoID0gdGhpcy5jb3VudGVyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBuZXdQb3NpdGlvblggPSB0aGlzLmdldFBvc2l0aW9uQnlJbmRleCh0aGlzLmNvdW50ZXIgLSB0aGlzLnNsaWRlTGVuZ3RoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lci5nZXRDdXJyZW50UG9zaXRpb25YKCkgIT09IG5ld1Bvc2l0aW9uWCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzU2xpZGVJblByb2dyZXNzID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIudHJhbnNmb3JtUG9zaXRpb25YKG5ld1Bvc2l0aW9uWCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQobGVuZ3RoOiBudW1iZXIgPSAxKSB7XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAnbGVmdCc7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVTbGlkZShsZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXYobGVuZ3RoOiBudW1iZXIgPSAxKSB7XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAncmlnaHQnO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlU2xpZGUobGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3QoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChpbmRleCA+IHRoaXMuY2VsbExlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGluZGV4ID4gdGhpcy5jb3VudGVyKSB7XHJcbiAgICAgICAgICAgIGxldCBsZW5ndGggPSBpbmRleCAtIHRoaXMuY291bnRlcjtcclxuICAgICAgICAgICAgdGhpcy5uZXh0KGxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaW5kZXggPCB0aGlzLmNvdW50ZXIpIHtcclxuICAgICAgICAgICAgbGV0IGxlbmd0aCA9IHRoaXMuY291bnRlciAtIGluZGV4O1xyXG4gICAgICAgICAgICB0aGlzLnByZXYobGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHJlbGltaW5hcnlDb3VudGVyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50ZXIgKyB0aGlzLnNsaWRlTGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50ZXIgLSB0aGlzLnNsaWRlTGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyogIFxyXG4gICAgICogTGltaXRzIHRoZSBsZW5ndGggb2YgdGhlIHNsaWRlIGR1cmluZyBjYWxscyB0byB0aGUgbmV4dCgpIGFuZCBwcmV2KCkgXHJcbiAgICAgKiBtZXRob2RzIGlmIHRoZSBzcGVjaWZpZWQgcG9zaXRpb24gaXMgb3V0c2lkZSB0aGUgY2VsbCBsZW5ndGggXHJcbiAgICAgKi9cclxuICAgIGxpbWl0U2xpZGVMZW5ndGgoc2xpZGVMZW5ndGg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChzbGlkZUxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZUxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3Q291bnRlciA9IHRoaXMuY291bnRlciArIChzbGlkZUxlbmd0aCAtIGkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1NsaWRlc0VuZChuZXdDb3VudGVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlTGVuZ3RoID0gc2xpZGVMZW5ndGggLSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTbGlkZUxlbmd0aExpbWl0ZWQgPSBpID4gMDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2xpZGVMZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyogT2Zmc2V0IHRoZSBjb250YWluZXIgdG8gc2hvdyB0aGUgbGFzdCBjZWxsIGNvbXBsZXRlbHkgKi9cclxuICAgIGdldFBvc2l0aW9uQ29ycmVjdGlvbihjb3VudGVyOm51bWJlcikge1xyXG4gICAgICAgIGxldCBjb3JyZWN0aW9uID0gMDtcclxuICAgICAgICBsZXQgaXNMYXN0U2xpZGUgPSB0aGlzLmlzTGFzdFNsaWRlKGNvdW50ZXIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jYXJvdXNlbFByb3BlcnRpZXMubG9vcCB8fCB0aGlzLmRpcmVjdGlvbiA9PT0gXCJyaWdodFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNTbGlkZUxlbmd0aExpbWl0ZWQgfHwgaXNMYXN0U2xpZGUpIHtcclxuICAgICAgICAgICAgbGV0IGNlbGxzV2lkdGggPSB0aGlzLmNlbGxzLmNlbGxMZW5ndGhJbkxpZ2h0RE9NTW9kZSAqIHRoaXMuZnVsbENlbGxXaWR0aDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZpc2libGVXaWR0aCA8IGNlbGxzV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIGNvcnJlY3Rpb24gPSAtKHRoaXMubnVtYmVyT2ZWaXNpYmxlQ2VsbHMgKiB0aGlzLmZ1bGxDZWxsV2lkdGggLSB0aGlzLnZpc2libGVXaWR0aCAtIHRoaXMubWFyZ2luKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNvcnJlY3Rpb24gPj0gLXRoaXMubWFyZ2luKSB7XHJcbiAgICAgICAgICAgICAgICBjb3JyZWN0aW9uID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvcnJlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2xpZGVMZW5ndGgoZGlzdGFuY2VBYnM6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBpc0xhc3RTbGlkZSA9IHRoaXMuaXNMYXN0U2xpZGUodGhpcy5jb3VudGVyKTtcclxuXHJcbiAgICAgICAgLyogSWYgdGhlIGxhc3QgY2VsbCBkb2VzIG5vdCBmaXQgZW50aXJlbHksIHRoZW4gdGhlIFxyXG4gICAgICAgICAqIGxlbmd0aCBvZiB0aGUgc3dpcGUgdG8gdGhlIGxlZnQsIGZyb20gdGhlIGV4dHJlbWUgXHJcbiAgICAgICAgICogcmlnaHQgcG9zaXRpb24sIG1heSBiZSBzaG9ydGVyIHRoYW4gdXN1YWwuIFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChpc0xhc3RTbGlkZSAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gXCJyaWdodFwiKSB7XHJcbiAgICAgICAgICAgIGRpc3RhbmNlQWJzID0gZGlzdGFuY2VBYnMgKyB0aGlzLnZpc2libGVXaWR0aCAlIHRoaXMuZnVsbENlbGxXaWR0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsZW5ndGggPSBNYXRoLmZsb29yKGRpc3RhbmNlQWJzIC8gdGhpcy5mdWxsQ2VsbFdpZHRoKTtcclxuXHJcbiAgICAgICAgaWYgKGRpc3RhbmNlQWJzICUgdGhpcy5mdWxsQ2VsbFdpZHRoID49IHRoaXMubWluU3dpcGVEaXN0YW5jZSkge1xyXG4gICAgICAgICAgICBsZW5ndGgrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBsZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlzdGFuY2VBYnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMuaW5pdGlhbFBvc2l0aW9uWCAtIHRoaXMuY3VycmVudFBvc2l0aW9uWCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlyZWN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IE1hdGguc2lnbih0aGlzLmluaXRpYWxQb3NpdGlvblggLSB0aGlzLmN1cnJlbnRQb3NpdGlvblgpO1xyXG5cclxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3JpZ2h0JztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2xlZnQnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBpc1NsaWRlc0VuZChjb3VudGVyOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgbWFyZ2luID0gdGhpcy52aXNpYmxlQ2VsbHNPdmVyZmxvd0NvbnRhaW5lciA/IDEgOiAwO1xyXG4gICAgICAgIGxldCBpbWFnZUxlbmd0aCA9IHRoaXMuaW1hZ2VzID8gdGhpcy5pbWFnZXMubGVuZ3RoIDogdGhpcy5jZWxscy5jZWxsTGVuZ3RoO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jYXJvdXNlbFByb3BlcnRpZXMubG9vcCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIChpbWFnZUxlbmd0aCAtIGNvdW50ZXIgKyBtYXJnaW4pIDwgdGhpcy5udW1iZXJPZlZpc2libGVDZWxscztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaXNMYXN0U2xpZGUoY291bnRlcjogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNTbGlkZXNFbmQoY291bnRlciArIDEpXHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q291bnRlcigpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG4gICAgICAgICAgICB0aGlzLmNvdW50ZXIgPSB0aGlzLmNvdW50ZXIgKyB0aGlzLnNsaWRlTGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY291bnRlciA9IHRoaXMuY291bnRlciAtIHRoaXMuc2xpZGVMZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFBvc2l0aW9uQnlJbmRleChfY291bnRlcjogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IGNvcnJlY3Rpb24gPSB0aGlzLmdldFBvc2l0aW9uQ29ycmVjdGlvbih0aGlzLmNvdW50ZXIgKyB0aGlzLnNsaWRlTGVuZ3RoKTtcclxuICAgICAgICBsZXQgcG9zaXRpb247XHJcblxyXG4gICAgICAgIGlmIChjb3JyZWN0aW9uICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGNvcnJlY3Rpb24gPSBjb3JyZWN0aW9uICsgdGhpcy5mdWxsQ2VsbFdpZHRoXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcclxuICAgICAgICAgICAgY29ycmVjdGlvbiA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0xpZ2h0RE9NICYmIHRoaXMuaXNMaWdodERPTU1vZGUoX2NvdW50ZXIpIHx8XHJcbiAgICAgICAgICAgIHRoaXMuaXNMaWdodERPTSAmJiB0aGlzLmlmTGVmdERPTU1vZGVBdEVuZChfY291bnRlcikpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBpbml0aWFsUG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uV2l0aG91dENvcnJlY3Rpb24odGhpcy5pbml0aWFsUG9zaXRpb25YKTtcclxuICAgICAgICAgICAgbGV0IGNvdW50ZXJEaWZmZXJlbmNlID0gX2NvdW50ZXIgLSB0aGlzLmNvdW50ZXI7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gaW5pdGlhbFBvc2l0aW9uIC0gKChjb3VudGVyRGlmZmVyZW5jZSAqIHRoaXMuZnVsbENlbGxXaWR0aCkgLSBjb3JyZWN0aW9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IC0oKF9jb3VudGVyICogdGhpcy5mdWxsQ2VsbFdpZHRoKSAtIGNvcnJlY3Rpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcG9zaXRpb24gPSB0aGlzLnByb3ZpZGVTYWZlUG9zaXRpb24ocG9zaXRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gcG9zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdmlkZVNhZmVQb3NpdGlvbihwb3NpdGlvbjogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZW5kUG9zaXRpb24gPSB0aGlzLmNvbnRhaW5lci5nZXRFbmRQb3NpdGlvbigpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPCBlbmRQb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSBlbmRQb3NpdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBvc2l0aW9uV2l0aG91dENvcnJlY3Rpb24odmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIGxldCByZW1haW5kZXIgPSBNYXRoLnJvdW5kKHZhbHVlKSAlIHRoaXMuZnVsbENlbGxXaWR0aDtcclxuXHJcbiAgICAgICAgaWYgKHJlbWFpbmRlciAhPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgLSAodGhpcy5mdWxsQ2VsbFdpZHRoICsgcmVtYWluZGVyKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzTmV4dEFycm93RGlzYWJsZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNMYXN0U2xpZGUodGhpcy5jb3VudGVyKSB8fCBcclxuICAgICAgICAoIXRoaXMudmlzaWJsZUNlbGxzT3ZlcmZsb3dDb250YWluZXIgJiYgdGhpcy5jZWxsTGVuZ3RoIDw9IHRoaXMubnVtYmVyT2ZWaXNpYmxlQ2VsbHMpIHx8XHJcbiAgICAgICAgKHRoaXMudmlzaWJsZUNlbGxzT3ZlcmZsb3dDb250YWluZXIgJiYgdGhpcy5jZWxsTGVuZ3RoIDwgdGhpcy5udW1iZXJPZlZpc2libGVDZWxscylcclxuICAgIH1cclxuXHJcbiAgICBpc1ByZXZBcnJvd0Rpc2FibGVkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvdW50ZXIgPT09IDA7XHJcbiAgICB9XHJcblxyXG4gICAgYWxpZ25Db250YWluZXJGYXN0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzTGlnaHRET01Nb2RlKHRoaXMuY291bnRlcikpIHtcclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uWCA9IHRoaXMuZml4ZWRDb250YWluZXJQb3NpdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIudHJhbnNmb3JtUG9zaXRpb25YKHBvc2l0aW9uWCwgMCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNlbGxzLnNldENvdW50ZXIodGhpcy5jb3VudGVyKTtcclxuICAgICAgICAgICAgdGhpcy5jZWxscy5saW5lVXAoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaWZMZWZ0RE9NTW9kZVRvQmVnaW5uaW5nKHRoaXMuY291bnRlcikpIHtcclxuICAgICAgICAgICAgLyogSWYgd2UgaGF2ZSBhbHJlYWR5IGV4aXRlZCB0aGUgbGlnaHQgRE9NIG1vZGUgYnV0IFxyXG4gICAgICAgICAgICAgKiB0aGUgY2VsbHMgYXJlIHN0aWxsIG91dCBvZiBwbGFjZSBcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNlbGxzLmlmU2VxdWVuY2VPZkNlbGxzSXNDaGFuZ2VkKCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb3NpdGlvblggPSAtKHRoaXMuY291bnRlciAqIHRoaXMuZnVsbENlbGxXaWR0aCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci50cmFuc2Zvcm1Qb3NpdGlvblgocG9zaXRpb25YLCAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzLnNldENvdW50ZXIodGhpcy5jb3VudGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHMubGluZVVwKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaWZMZWZ0RE9NTW9kZUF0RW5kKHRoaXMuY291bnRlcikpIHtcclxuICAgICAgICAgICAgbGV0IGNvbnRhaW5lclBvc2l0aW9uWCA9IHRoaXMuY29udGFpbmVyLmdldEN1cnJlbnRQb3NpdGlvblgoKTtcclxuICAgICAgICAgICAgbGV0IGNvbnRhaW5lcldpZHRoID0gdGhpcy5jb250YWluZXIuZ2V0V2lkdGgoKTtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlV2lkdGg7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xhc3RTbGlkZSh0aGlzLmNvdW50ZXIpICYmXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXJXaWR0aCArIGNvbnRhaW5lclBvc2l0aW9uWCA+PSB0aGlzLnZpc2libGVXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgY29ycmVjdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb25Db3JyZWN0aW9uKHRoaXMuY291bnRlcik7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29ycmVjdGlvbiAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29ycmVjdGlvbiA9IGNvcnJlY3Rpb24gKyB0aGlzLmZ1bGxDZWxsV2lkdGhcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcbiAgICAgICAgICAgICAgICBjb3JyZWN0aW9uID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uWCA9IHRoaXMuZml4ZWRDb250YWluZXJQb3NpdGlvbiArIGNvcnJlY3Rpb247XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci50cmFuc2Zvcm1Qb3NpdGlvblgocG9zaXRpb25YLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5jZWxscy5zZXRDb3VudGVyKHRoaXMuY291bnRlcik7XHJcbiAgICAgICAgICAgIHRoaXMuY2VsbHMubGluZVVwKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzTGlnaHRET01Nb2RlKGNvdW50ZXI6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBmbGFnO1xyXG4gICAgICAgIGxldCByZW1haW5kZXJPZkNlbGxzID0gdGhpcy5pbWFnZXMubGVuZ3RoIC0gdGhpcy5vdmVyZmxvd0NlbGxzTGltaXQgLSB0aGlzLm51bWJlck9mVmlzaWJsZUNlbGxzO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXNMaWdodERPTSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY291bnRlciA+IHRoaXMub3ZlcmZsb3dDZWxsc0xpbWl0ICYmIHRoaXMuZGlyZWN0aW9uID09PSBcImxlZnRcIiAmJlxyXG4gICAgICAgICAgICBjb3VudGVyIDw9IHJlbWFpbmRlck9mQ2VsbHMpIHtcclxuICAgICAgICAgICAgZmxhZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY291bnRlciA+PSB0aGlzLm92ZXJmbG93Q2VsbHNMaW1pdCAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gXCJyaWdodFwiICYmXHJcbiAgICAgICAgICAgIGNvdW50ZXIgPCByZW1haW5kZXJPZkNlbGxzKSB7XHJcbiAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY291bnRlciA+IHRoaXMub3ZlcmZsb3dDZWxsc0xpbWl0ICYmIHRoaXMuZGlyZWN0aW9uID09PSBcImxlZnRcIiAmJlxyXG4gICAgICAgICAgICB0aGlzLmNvdW50ZXIgPD0gcmVtYWluZGVyT2ZDZWxscykge1xyXG4gICAgICAgICAgICBmbGFnID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvdW50ZXIgPj0gdGhpcy5vdmVyZmxvd0NlbGxzTGltaXQgJiYgdGhpcy5kaXJlY3Rpb24gPT09IFwicmlnaHRcIiAmJlxyXG4gICAgICAgICAgICB0aGlzLmNvdW50ZXIgPCByZW1haW5kZXJPZkNlbGxzKSB7XHJcbiAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZsYWc7XHJcbiAgICB9XHJcblxyXG4gICAgaWZMZWZ0RE9NTW9kZUF0RW5kKGNvdW50ZXI6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBmbGFnO1xyXG4gICAgICAgIGxldCByZW1haW5kZXJPZkNlbGxzID0gdGhpcy5pbWFnZXMubGVuZ3RoIC0gdGhpcy5vdmVyZmxvd0NlbGxzTGltaXQgLSB0aGlzLm51bWJlck9mVmlzaWJsZUNlbGxzO1xyXG5cclxuICAgICAgICBpZiAoY291bnRlciA+PSByZW1haW5kZXJPZkNlbGxzKSB7XHJcbiAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY291bnRlciA+PSByZW1haW5kZXJPZkNlbGxzKSB7XHJcbiAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZsYWc7XHJcbiAgICB9XHJcblxyXG4gICAgaWZMZWZ0RE9NTW9kZVRvQmVnaW5uaW5nKGNvdW50ZXI6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBmbGFnO1xyXG5cclxuICAgICAgICBpZiAoY291bnRlciA8PSB0aGlzLm92ZXJmbG93Q2VsbHNMaW1pdCkge1xyXG4gICAgICAgICAgICBmbGFnID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvdW50ZXIgPD0gdGhpcy5vdmVyZmxvd0NlbGxzTGltaXQpIHtcclxuICAgICAgICAgICAgZmxhZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmxhZztcclxuICAgIH1cclxuXHJcbiAgICBzZXRWaXNpYmxlV2lkdGgoKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlV2lkdGggPSB0aGlzLmNhcm91c2VsUHJvcGVydGllcy52aXNpYmxlV2lkdGggfHwgdGhpcy5jYXJvdXNlbFByb3BlcnRpZXMuaG9zdEVsZW1lbnQuY2xpZW50V2lkdGg7XHJcbiAgICB9XHJcbn0iXX0=