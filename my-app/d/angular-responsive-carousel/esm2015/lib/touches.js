export class Touches {
    constructor(properties) {
        this.eventType = undefined;
        this.handlers = {};
        this.startX = 0;
        this.startY = 0;
        this.lastTap = 0;
        this.doubleTapMinTimeout = 300;
        this.tapMinTimeout = 200;
        this.touchstartTime = 0;
        this.i = 0;
        this.isMousedown = false;
        this._touchListeners = {
            "touchstart": "handleTouchstart",
            "touchmove": "handleTouchmove",
            "touchend": "handleTouchend"
        };
        this._mouseListeners = {
            "mousedown": "handleMousedown",
            "mousemove": "handleMousemove",
            "mouseup": "handleMouseup",
            "wheel": "handleWheel"
        };
        this._otherListeners = {
            "resize": "handleResize"
        };
        /*
         * Listeners
         */
        /* Touchstart */
        this.handleTouchstart = (event) => {
            this.elementPosition = this.getElementPosition();
            this.touchstartTime = new Date().getTime();
            if (this.eventType === undefined) {
                this.getTouchstartPosition(event);
            }
            this.runHandler("touchstart", event);
        };
        /* Touchmove */
        this.handleTouchmove = (event) => {
            const touches = event.touches;
            // Pan
            if (this.detectPan(touches)) {
                this.runHandler("pan", event);
            }
            // Pinch
            if (this.detectPinch(event)) {
                this.runHandler("pinch", event);
            }
            // Linear swipe
            switch (this.detectLinearSwipe(event)) {
                case "horizontal-swipe":
                    event.swipeType = "horizontal-swipe";
                    this.runHandler("horizontal-swipe", event);
                    break;
                case "vertical-swipe":
                    event.swipeType = "vertical-swipe";
                    this.runHandler("vertical-swipe", event);
                    break;
            }
            // Linear swipe
            if (this.detectLinearSwipe(event) ||
                this.eventType === 'horizontal-swipe' ||
                this.eventType === 'vertical-swipe') {
                this.handleLinearSwipe(event);
            }
        };
        /* Touchend */
        this.handleTouchend = (event) => {
            const touches = event.touches;
            // Double Tap
            if (this.detectDoubleTap()) {
                this.runHandler("double-tap", event);
            }
            // Tap
            this.detectTap();
            this.runHandler("touchend", event);
            this.eventType = 'touchend';
            if (touches && touches.length === 0) {
                this.eventType = undefined;
                this.i = 0;
            }
        };
        /* Mousedown */
        this.handleMousedown = (event) => {
            this.isMousedown = true;
            this.elementPosition = this.getElementPosition();
            this.touchstartTime = new Date().getTime();
            if (this.eventType === undefined) {
                this.getMousedownPosition(event);
            }
            this.runHandler("mousedown", event);
        };
        /* Mousemove */
        this.handleMousemove = (event) => {
            //event.preventDefault();
            if (!this.isMousedown) {
                return;
            }
            // Pan
            this.runHandler("pan", event);
            // Linear swipe
            switch (this.detectLinearSwipe(event)) {
                case "horizontal-swipe":
                    event.swipeType = "horizontal-swipe";
                    this.runHandler("horizontal-swipe", event);
                    break;
                case "vertical-swipe":
                    event.swipeType = "vertical-swipe";
                    this.runHandler("vertical-swipe", event);
                    break;
            }
            // Linear swipe
            if (this.detectLinearSwipe(event) ||
                this.eventType === 'horizontal-swipe' ||
                this.eventType === 'vertical-swipe') {
                this.handleLinearSwipe(event);
            }
        };
        /* Mouseup */
        this.handleMouseup = (event) => {
            // Tap
            this.detectTap();
            this.isMousedown = false;
            this.runHandler("mouseup", event);
            this.eventType = undefined;
            this.i = 0;
        };
        /* Wheel */
        this.handleWheel = (event) => {
            this.runHandler("wheel", event);
        };
        /* Resize */
        this.handleResize = (event) => {
            this.runHandler("resize", event);
        };
        this.properties = properties;
        this.element = this.properties.element;
        this.elementPosition = this.getElementPosition();
        this.toggleEventListeners('addEventListener');
    }
    get touchListeners() {
        return this.properties.touchListeners ? this.properties.touchListeners : this._touchListeners;
    }
    get mouseListeners() {
        return this.properties.mouseListeners ? this.properties.mouseListeners : this._mouseListeners;
    }
    get otherListeners() {
        return this.properties.otherListeners ? this.properties.otherListeners : this._otherListeners;
    }
    destroy() {
        this.toggleEventListeners('removeEventListener');
    }
    toggleEventListeners(action) {
        let listeners;
        if (this.properties.listeners === 'mouse and touch') {
            listeners = Object.assign(this.touchListeners, this.mouseListeners);
        }
        else {
            listeners = this.detectTouchScreen() ? this.touchListeners : this.mouseListeners;
        }
        if (this.properties.resize) {
            listeners = Object.assign(listeners, this.otherListeners);
        }
        for (var listener in listeners) {
            const handler = listeners[listener];
            // Window
            if (listener === "resize") {
                if (action === 'addEventListener') {
                    window.addEventListener(listener, this[handler], false);
                }
                if (action === 'removeEventListener') {
                    window.removeEventListener(listener, this[handler], false);
                }
                // Document
            }
            else if (listener === 'mouseup' || listener === "mousemove") {
                if (action === 'addEventListener') {
                    document.addEventListener(listener, this[handler], { passive: false });
                }
                if (action === 'removeEventListener') {
                    document.removeEventListener(listener, this[handler], false);
                }
                // Element
            }
            else {
                if (action === 'addEventListener') {
                    this.element.addEventListener(listener, this[handler], false);
                }
                if (action === 'removeEventListener') {
                    this.element.removeEventListener(listener, this[handler], false);
                }
            }
        }
    }
    addEventListeners(listener) {
        const handler = this._mouseListeners[listener];
        window.addEventListener(listener, this[handler], false);
    }
    removeEventListeners(listener) {
        const handler = this._mouseListeners[listener];
        window.removeEventListener(listener, this[handler], false);
    }
    handleLinearSwipe(event) {
        //event.preventDefault();
        this.i++;
        if (this.i > 3) {
            this.eventType = this.getLinearSwipeType(event);
        }
        if (this.eventType === 'horizontal-swipe') {
            this.runHandler('horizontal-swipe', event);
        }
        if (this.eventType === 'vertical-swipe') {
            this.runHandler('vertical-swipe', event);
        }
    }
    runHandler(eventName, response) {
        if (this.handlers[eventName]) {
            this.handlers[eventName](response);
        }
    }
    /*
     * Detection
     */
    detectPan(touches) {
        return touches.length === 1 && !this.eventType || this.eventType === 'pan';
    }
    detectDoubleTap() {
        if (this.eventType != undefined) {
            return;
        }
        const currentTime = new Date().getTime();
        const tapLength = currentTime - this.lastTap;
        clearTimeout(this.doubleTapTimeout);
        if (tapLength < this.doubleTapMinTimeout && tapLength > 0) {
            return true;
        }
        else {
            this.doubleTapTimeout = setTimeout(() => {
                clearTimeout(this.doubleTapTimeout);
            }, this.doubleTapMinTimeout);
        }
        this.lastTap = currentTime;
        return undefined;
    }
    detectTap() {
        if (this.eventType != undefined) {
            return;
        }
        const currentTime = new Date().getTime();
        const tapLength = currentTime - this.touchstartTime;
        if (tapLength > 0) {
            if (tapLength < this.tapMinTimeout) {
                this.runHandler("tap", event);
            }
            else {
                this.runHandler("longtap", event);
            }
        }
    }
    detectPinch(event) {
        const touches = event.touches;
        return (touches.length === 2 && this.eventType === undefined) || this.eventType === 'pinch';
    }
    detectLinearSwipe(event) {
        const touches = event.touches;
        if (touches) {
            if (touches.length === 1 && !this.eventType || this.eventType === 'horizontal-swipe' || this.eventType === 'vertical-swipe') {
                return this.getLinearSwipeType(event);
            }
        }
        else {
            if (!this.eventType || this.eventType === 'horizontal-swipe' || this.eventType === 'vertical-swipe') {
                return this.getLinearSwipeType(event);
            }
        }
        return undefined;
    }
    getLinearSwipeType(event) {
        if (this.eventType !== 'horizontal-swipe' && this.eventType !== 'vertical-swipe') {
            const movementX = Math.abs(this.moveLeft(0, event) - this.startX);
            const movementY = Math.abs(this.moveTop(0, event) - this.startY);
            if ((movementY * 3) > movementX) {
                return 'vertical-swipe';
            }
            else {
                return 'horizontal-swipe';
            }
        }
        else {
            return this.eventType;
        }
    }
    getElementPosition() {
        return this.element.getBoundingClientRect();
    }
    getTouchstartPosition(event) {
        this.startX = event.touches[0].clientX - this.elementPosition.left;
        this.startY = event.touches[0].clientY - this.elementPosition.top;
    }
    getMousedownPosition(event) {
        this.startX = event.clientX - this.elementPosition.left;
        this.startY = event.clientY - this.elementPosition.top;
    }
    moveLeft(index, event) {
        const touches = event.touches;
        if (touches) {
            return touches[index].clientX - this.elementPosition.left;
        }
        else {
            return event.clientX - this.elementPosition.left;
        }
    }
    moveTop(index, event) {
        const touches = event.touches;
        if (touches) {
            return touches[index].clientY - this.elementPosition.top;
        }
        else {
            return event.clientY - this.elementPosition.top;
        }
    }
    detectTouchScreen() {
        var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
        var mq = function (query) {
            return window.matchMedia(query).matches;
        };
        if (('ontouchstart' in window)) {
            return true;
        }
        // include the 'heartz' as a way to have a non matching MQ to help terminate the join
        // https://git.io/vznFH
        var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
        return mq(query);
    }
    /* Public properties and methods */
    on(event, handler) {
        if (event) {
            this.handlers[event] = handler;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91Y2hlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItcmVzcG9uc2l2ZS1jYXJvdXNlbC9zcmMvbGliL3RvdWNoZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBYUEsTUFBTSxPQUFPLE9BQU87SUEyQ2hCLFlBQVksVUFBc0I7UUF2Q2xDLGNBQVMsR0FBYyxTQUFTLENBQUM7UUFDakMsYUFBUSxHQUFRLEVBQUUsQ0FBQztRQUNuQixXQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFFWix3QkFBbUIsR0FBRyxHQUFHLENBQUM7UUFDMUIsa0JBQWEsR0FBRyxHQUFHLENBQUM7UUFDcEIsbUJBQWMsR0FBRyxDQUFDLENBQUM7UUFDbkIsTUFBQyxHQUFXLENBQUMsQ0FBQztRQUNkLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBRXBCLG9CQUFlLEdBQVE7WUFDbkIsWUFBWSxFQUFFLGtCQUFrQjtZQUNoQyxXQUFXLEVBQUUsaUJBQWlCO1lBQzlCLFVBQVUsRUFBRSxnQkFBZ0I7U0FDL0IsQ0FBQTtRQUNELG9CQUFlLEdBQVE7WUFDbkIsV0FBVyxFQUFFLGlCQUFpQjtZQUM5QixXQUFXLEVBQUUsaUJBQWlCO1lBQzlCLFNBQVMsRUFBRSxlQUFlO1lBQzFCLE9BQU8sRUFBRSxhQUFhO1NBQ3pCLENBQUE7UUFDRCxvQkFBZSxHQUFRO1lBQ25CLFFBQVEsRUFBRSxjQUFjO1NBQzNCLENBQUE7UUFnRkQ7O1dBRUc7UUFFSCxnQkFBZ0I7UUFFaEIscUJBQWdCLEdBQUcsQ0FBQyxLQUFVLEVBQUUsRUFBRTtZQUM5QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ2pELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUUzQyxJQUFJ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QUMsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDO1NBQ25EO0lBQ0wsQ0FBQztJQUVELGlCQUFpQjtRQUNiLElBQUksUUFBUSxHQUFHLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0RCxJQUFJLEVBQUUsR0FBRyxVQUFTLEtBQVU7WUFDeEIsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUM1QyxDQUFDLENBQUE7UUFFRCxJQUFJLENBQUMsY0FBYyxJQUFJLE1BQU0sQ0FBQyxFQUFFO1lBQzVCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxxRkFBcUY7UUFDckYsdUJBQXVCO1FBQ3ZCLElBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdFLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFHRCxtQ0FBbUM7SUFDbkMsRUFBRSxDQUFDLEtBQWdCLEVBQUUsT0FBaUI7UUFDbEMsSUFBSSxLQUFLLEVBQUU7WUFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQztTQUNsQztJQUNMLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgUHJvcGVydGllcyB7XHJcbiAgICBlbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgIGxpc3RlbmVycz86ICdhdXRvJyB8ICdtb3VzZSBhbmQgdG91Y2gnO1xyXG4gICAgdG91Y2hMaXN0ZW5lcnM/OiBhbnk7XHJcbiAgICBtb3VzZUxpc3RlbmVycz86IGFueTtcclxuICAgIG90aGVyTGlzdGVuZXJzPzogYW55O1xyXG4gICAgcmVzaXplPzogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgRXZlbnRUeXBlID0gdW5kZWZpbmVkIHwgJ3RvdWNoZW5kJyB8ICdwYW4nIHwgJ3BpbmNoJyB8ICdob3Jpem9udGFsLXN3aXBlJyB8ICd2ZXJ0aWNhbC1zd2lwZScgfCAndGFwJyB8ICdsb25ndGFwJztcclxuZXhwb3J0IHR5cGUgVG91Y2hIYW5kbGVyID0gJ2hhbmRsZVRvdWNoc3RhcnQnIHwgJ2hhbmRsZVRvdWNobW92ZScgfCAnaGFuZGxlVG91Y2hlbmQnO1xyXG5leHBvcnQgdHlwZSBNb3VzZUhhbmRsZXIgPSAnaGFuZGxlTW91c2Vkb3duJyB8ICdoYW5kbGVNb3VzZW1vdmUnIHwgJ2hhbmRsZU1vdXNldXAnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRvdWNoZXMge1xyXG4gICAgcHJvcGVydGllczogUHJvcGVydGllcztcclxuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gICAgZWxlbWVudFBvc2l0aW9uOiBDbGllbnRSZWN0O1xyXG4gICAgZXZlbnRUeXBlOiBFdmVudFR5cGUgPSB1bmRlZmluZWQ7XHJcbiAgICBoYW5kbGVyczogYW55ID0ge307XHJcbiAgICBzdGFydFggPSAwO1xyXG4gICAgc3RhcnRZID0gMDtcclxuICAgIGxhc3RUYXAgPSAwO1xyXG4gICAgZG91YmxlVGFwVGltZW91dDogYW55O1xyXG4gICAgZG91YmxlVGFwTWluVGltZW91dCA9IDMwMDtcclxuICAgIHRhcE1pblRpbWVvdXQgPSAyMDA7XHJcbiAgICB0b3VjaHN0YXJ0VGltZSA9IDA7XHJcbiAgICBpOiBudW1iZXIgPSAwO1xyXG4gICAgaXNNb3VzZWRvd24gPSBmYWxzZTtcclxuXHJcbiAgICBfdG91Y2hMaXN0ZW5lcnM6IGFueSA9IHtcclxuICAgICAgICBcInRvdWNoc3RhcnRcIjogXCJoYW5kbGVUb3VjaHN0YXJ0XCIsXHJcbiAgICAgICAgXCJ0b3VjaG1vdmVcIjogXCJoYW5kbGVUb3VjaG1vdmVcIixcclxuICAgICAgICBcInRvdWNoZW5kXCI6IFwiaGFuZGxlVG91Y2hlbmRcIlxyXG4gICAgfVxyXG4gICAgX21vdXNlTGlzdGVuZXJzOiBhbnkgPSB7XHJcbiAgICAgICAgXCJtb3VzZWRvd25cIjogXCJoYW5kbGVNb3VzZWRvd25cIixcclxuICAgICAgICBcIm1vdXNlbW92ZVwiOiBcImhhbmRsZU1vdXNlbW92ZVwiLFxyXG4gICAgICAgIFwibW91c2V1cFwiOiBcImhhbmRsZU1vdXNldXBcIixcclxuICAgICAgICBcIndoZWVsXCI6IFwiaGFuZGxlV2hlZWxcIlxyXG4gICAgfVxyXG4gICAgX290aGVyTGlzdGVuZXJzOiBhbnkgPSB7XHJcbiAgICAgICAgXCJyZXNpemVcIjogXCJoYW5kbGVSZXNpemVcIlxyXG4gICAgfVxyXG5cclxuICAgIGdldCB0b3VjaExpc3RlbmVycygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzLnRvdWNoTGlzdGVuZXJzID8gdGhpcy5wcm9wZXJ0aWVzLnRvdWNoTGlzdGVuZXJzIDogdGhpcy5fdG91Y2hMaXN0ZW5lcnM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG1vdXNlTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXMubW91c2VMaXN0ZW5lcnMgPyB0aGlzLnByb3BlcnRpZXMubW91c2VMaXN0ZW5lcnMgOiB0aGlzLl9tb3VzZUxpc3RlbmVycztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgb3RoZXJMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcGVydGllcy5vdGhlckxpc3RlbmVycyA/IHRoaXMucHJvcGVydGllcy5vdGhlckxpc3RlbmVycyA6IHRoaXMuX290aGVyTGlzdGVuZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXM6IFByb3BlcnRpZXMpIHtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMucHJvcGVydGllcy5lbGVtZW50O1xyXG4gICAgICAgIHRoaXMuZWxlbWVudFBvc2l0aW9uID0gdGhpcy5nZXRFbGVtZW50UG9zaXRpb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy50b2dnbGVFdmVudExpc3RlbmVycygnYWRkRXZlbnRMaXN0ZW5lcicpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy50b2dnbGVFdmVudExpc3RlbmVycygncmVtb3ZlRXZlbnRMaXN0ZW5lcicpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZUV2ZW50TGlzdGVuZXJzKGFjdGlvbjogJ2FkZEV2ZW50TGlzdGVuZXInIHwgJ3JlbW92ZUV2ZW50TGlzdGVuZXInKSB7XHJcbiAgICAgICAgbGV0IGxpc3RlbmVycztcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHJvcGVydGllcy5saXN0ZW5lcnMgPT09ICdtb3VzZSBhbmQgdG91Y2gnKSB7XHJcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IE9iamVjdC5hc3NpZ24odGhpcy50b3VjaExpc3RlbmVycywgdGhpcy5tb3VzZUxpc3RlbmVycyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGlzdGVuZXJzID0gdGhpcy5kZXRlY3RUb3VjaFNjcmVlbigpID8gdGhpcy50b3VjaExpc3RlbmVycyA6IHRoaXMubW91c2VMaXN0ZW5lcnM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcm9wZXJ0aWVzLnJlc2l6ZSkge1xyXG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSBPYmplY3QuYXNzaWduKGxpc3RlbmVycywgdGhpcy5vdGhlckxpc3RlbmVycyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBsaXN0ZW5lciBpbiBsaXN0ZW5lcnMpIHtcclxuICAgICAgICAgICAgY29uc3QgaGFuZGxlcjogTW91c2VIYW5kbGVyID0gbGlzdGVuZXJzW2xpc3RlbmVyXTtcclxuXHJcbiAgICAgICAgICAgIC8vIFdpbmRvd1xyXG4gICAgICAgICAgICBpZiAobGlzdGVuZXIgPT09IFwicmVzaXplXCIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT09ICdhZGRFdmVudExpc3RlbmVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGxpc3RlbmVyLCB0aGlzW2hhbmRsZXJdLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAncmVtb3ZlRXZlbnRMaXN0ZW5lcicpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihsaXN0ZW5lciwgdGhpc1toYW5kbGVyXSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBEb2N1bWVudFxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxpc3RlbmVyID09PSAnbW91c2V1cCcgfHwgbGlzdGVuZXIgPT09IFwibW91c2Vtb3ZlXCIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT09ICdhZGRFdmVudExpc3RlbmVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIobGlzdGVuZXIsIHRoaXNbaGFuZGxlcl0sIHtwYXNzaXZlOiBmYWxzZX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ3JlbW92ZUV2ZW50TGlzdGVuZXInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihsaXN0ZW5lciwgdGhpc1toYW5kbGVyXSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBFbGVtZW50XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAnYWRkRXZlbnRMaXN0ZW5lcicpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihsaXN0ZW5lciwgdGhpc1toYW5kbGVyXSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ3JlbW92ZUV2ZW50TGlzdGVuZXInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIobGlzdGVuZXIsIHRoaXNbaGFuZGxlcl0sIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGRFdmVudExpc3RlbmVycyhsaXN0ZW5lcjogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlcjogTW91c2VIYW5kbGVyID0gdGhpcy5fbW91c2VMaXN0ZW5lcnNbbGlzdGVuZXJdO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGxpc3RlbmVyLCB0aGlzW2hhbmRsZXJdLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcnMobGlzdGVuZXI6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXI6IE1vdXNlSGFuZGxlciA9IHRoaXMuX21vdXNlTGlzdGVuZXJzW2xpc3RlbmVyXTtcclxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihsaXN0ZW5lciwgdGhpc1toYW5kbGVyXSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBMaXN0ZW5lcnNcclxuICAgICAqL1xyXG5cclxuICAgIC8qIFRvdWNoc3RhcnQgKi9cclxuXHJcbiAgICBoYW5kbGVUb3VjaHN0YXJ0ID0gKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLmVsZW1lbnRQb3NpdGlvbiA9IHRoaXMuZ2V0RWxlbWVudFBvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy50b3VjaHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5ldmVudFR5cGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmdldFRvdWNoc3RhcnRQb3NpdGlvbihldmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJ1bkhhbmRsZXIoXCJ0b3VjaHN0YXJ0XCIsIGV2ZW50KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyogVG91Y2htb3ZlICovXHJcblxyXG4gICAgaGFuZGxlVG91Y2htb3ZlID0gKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICBjb25zdCB0b3VjaGVzID0gZXZlbnQudG91Y2hlcztcclxuXHJcbiAgICAgICAgLy8gUGFuXHJcbiAgICAgICAgaWYgKHRoaXMuZGV0ZWN0UGFuKHRvdWNoZXMpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucnVuSGFuZGxlcihcInBhblwiLCBldmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQaW5jaFxyXG4gICAgICAgIGlmICh0aGlzLmRldGVjdFBpbmNoKGV2ZW50KSkge1xyXG4gICAgICAgICAgICB0aGlzLnJ1bkhhbmRsZXIoXCJwaW5jaFwiLCBldmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBMaW5lYXIgc3dpcGVcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuZGV0ZWN0TGluZWFyU3dpcGUoZXZlbnQpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJob3Jpem9udGFsLXN3aXBlXCI6XHJcbiAgICAgICAgICAgICAgICBldmVudC5zd2lwZVR5cGUgPSBcImhvcml6b250YWwtc3dpcGVcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMucnVuSGFuZGxlcihcImhvcml6b250YWwtc3dpcGVcIiwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZXJ0aWNhbC1zd2lwZVwiOlxyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3dpcGVUeXBlID0gXCJ2ZXJ0aWNhbC1zd2lwZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ydW5IYW5kbGVyKFwidmVydGljYWwtc3dpcGVcIiwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBMaW5lYXIgc3dpcGVcclxuICAgICAgICBpZiAodGhpcy5kZXRlY3RMaW5lYXJTd2lwZShldmVudCkgfHxcclxuICAgICAgICAgICAgdGhpcy5ldmVudFR5cGUgPT09ICdob3Jpem9udGFsLXN3aXBlJyB8fFxyXG4gICAgICAgICAgICB0aGlzLmV2ZW50VHlwZSA9PT0gJ3ZlcnRpY2FsLXN3aXBlJykge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVMaW5lYXJTd2lwZShldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUxpbmVhclN3aXBlKGV2ZW50OiBhbnkpIHtcclxuICAgICAgICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuaSsrO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pID4gMykge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50VHlwZSA9IHRoaXMuZ2V0TGluZWFyU3dpcGVUeXBlKGV2ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmV2ZW50VHlwZSA9PT0gJ2hvcml6b250YWwtc3dpcGUnKSB7XHJcbiAgICAgICAgICAgIHRoaXMucnVuSGFuZGxlcignaG9yaXpvbnRhbC1zd2lwZScsIGV2ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmV2ZW50VHlwZSA9PT0gJ3ZlcnRpY2FsLXN3aXBlJykge1xyXG4gICAgICAgICAgICB0aGlzLnJ1bkhhbmRsZXIoJ3ZlcnRpY2FsLXN3aXBlJywgZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyogVG91Y2hlbmQgKi9cclxuXHJcbiAgICBoYW5kbGVUb3VjaGVuZCA9IChldmVudDogYW55KSA9PiB7XHJcbiAgICAgICAgY29uc3QgdG91Y2hlcyA9IGV2ZW50LnRvdWNoZXM7XHJcblxyXG4gICAgICAgIC8vIERvdWJsZSBUYXBcclxuICAgICAgICBpZiAodGhpcy5kZXRlY3REb3VibGVUYXAoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnJ1bkhhbmRsZXIoXCJkb3VibGUtdGFwXCIsIGV2ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRhcFxyXG4gICAgICAgIHRoaXMuZGV0ZWN0VGFwKCk7XHJcblxyXG4gICAgICAgIHRoaXMucnVuSGFuZGxlcihcInRvdWNoZW5kXCIsIGV2ZW50KTtcclxuICAgICAgICB0aGlzLmV2ZW50VHlwZSA9ICd0b3VjaGVuZCc7XHJcblxyXG4gICAgICAgIGlmICh0b3VjaGVzICYmIHRvdWNoZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRUeXBlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB0aGlzLmkgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyogTW91c2Vkb3duICovXHJcblxyXG4gICAgaGFuZGxlTW91c2Vkb3duID0gKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLmlzTW91c2Vkb3duID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmVsZW1lbnRQb3NpdGlvbiA9IHRoaXMuZ2V0RWxlbWVudFBvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy50b3VjaHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5ldmVudFR5cGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmdldE1vdXNlZG93blBvc2l0aW9uKGV2ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucnVuSGFuZGxlcihcIm1vdXNlZG93blwiLCBldmVudCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qIE1vdXNlbW92ZSAqL1xyXG5cclxuICAgIGhhbmRsZU1vdXNlbW92ZSA9IChldmVudDogYW55KSA9PiB7XHJcbiAgICAgICAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghdGhpcy5pc01vdXNlZG93bikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQYW5cclxuICAgICAgICB0aGlzLnJ1bkhhbmRsZXIoXCJwYW5cIiwgZXZlbnQpO1xyXG5cclxuICAgICAgICAvLyBMaW5lYXIgc3dpcGVcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuZGV0ZWN0TGluZWFyU3dpcGUoZXZlbnQpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJob3Jpem9udGFsLXN3aXBlXCI6XHJcbiAgICAgICAgICAgICAgICBldmVudC5zd2lwZVR5cGUgPSBcImhvcml6b250YWwtc3dpcGVcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMucnVuSGFuZGxlcihcImhvcml6b250YWwtc3dpcGVcIiwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZXJ0aWNhbC1zd2lwZVwiOlxyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3dpcGVUeXBlID0gXCJ2ZXJ0aWNhbC1zd2lwZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ydW5IYW5kbGVyKFwidmVydGljYWwtc3dpcGVcIiwgZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBMaW5lYXIgc3dpcGVcclxuICAgICAgICBpZiAodGhpcy5kZXRlY3RMaW5lYXJTd2lwZShldmVudCkgfHxcclxuICAgICAgICAgICAgdGhpcy5ldmVudFR5cGUgPT09ICdob3Jpem9udGFsLXN3aXBlJyB8fFxyXG4gICAgICAgICAgICB0aGlzLmV2ZW50VHlwZSA9PT0gJ3ZlcnRpY2FsLXN3aXBlJykge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVMaW5lYXJTd2lwZShldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiBNb3VzZXVwICovXHJcblxyXG4gICAgaGFuZGxlTW91c2V1cCA9IChldmVudDogYW55KSA9PiB7XHJcblxyXG4gICAgICAgIC8vIFRhcFxyXG4gICAgICAgIHRoaXMuZGV0ZWN0VGFwKCk7XHJcblxyXG4gICAgICAgIHRoaXMuaXNNb3VzZWRvd24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJ1bkhhbmRsZXIoXCJtb3VzZXVwXCIsIGV2ZW50KTtcclxuICAgICAgICB0aGlzLmV2ZW50VHlwZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmkgPSAwO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiBXaGVlbCAqL1xyXG5cclxuICAgIGhhbmRsZVdoZWVsID0gKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnJ1bkhhbmRsZXIoXCJ3aGVlbFwiLCBldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogUmVzaXplICovXHJcblxyXG4gICAgaGFuZGxlUmVzaXplID0gKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnJ1bkhhbmRsZXIoXCJyZXNpemVcIiwgZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJ1bkhhbmRsZXIoZXZlbnROYW1lOiBhbnksIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5oYW5kbGVyc1tldmVudE5hbWVdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlcnNbZXZlbnROYW1lXShyZXNwb25zZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogRGV0ZWN0aW9uXHJcbiAgICAgKi9cclxuXHJcbiAgICBkZXRlY3RQYW4odG91Y2hlczogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIHRvdWNoZXMubGVuZ3RoID09PSAxICYmICF0aGlzLmV2ZW50VHlwZSB8fCB0aGlzLmV2ZW50VHlwZSA9PT0gJ3Bhbic7XHJcbiAgICB9XHJcblxyXG4gICAgZGV0ZWN0RG91YmxlVGFwKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmV2ZW50VHlwZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICBjb25zdCB0YXBMZW5ndGggPSBjdXJyZW50VGltZSAtIHRoaXMubGFzdFRhcDtcclxuXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZG91YmxlVGFwVGltZW91dCk7XHJcblxyXG4gICAgICAgIGlmICh0YXBMZW5ndGggPCB0aGlzLmRvdWJsZVRhcE1pblRpbWVvdXQgJiYgdGFwTGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmRvdWJsZVRhcFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmRvdWJsZVRhcFRpbWVvdXQpO1xyXG4gICAgICAgICAgICB9LCB0aGlzLmRvdWJsZVRhcE1pblRpbWVvdXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxhc3RUYXAgPSBjdXJyZW50VGltZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBkZXRlY3RUYXAoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRUeXBlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgIGNvbnN0IHRhcExlbmd0aCA9IGN1cnJlbnRUaW1lIC0gdGhpcy50b3VjaHN0YXJ0VGltZTtcclxuXHJcbiAgICAgICAgaWYgKHRhcExlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHRhcExlbmd0aCA8IHRoaXMudGFwTWluVGltZW91dCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ydW5IYW5kbGVyKFwidGFwXCIsIGV2ZW50KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucnVuSGFuZGxlcihcImxvbmd0YXBcIiwgZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRldGVjdFBpbmNoKGV2ZW50OiBhbnkpIHtcclxuICAgICAgICBjb25zdCB0b3VjaGVzID0gZXZlbnQudG91Y2hlcztcclxuICAgICAgICByZXR1cm4gKHRvdWNoZXMubGVuZ3RoID09PSAyICYmIHRoaXMuZXZlbnRUeXBlID09PSB1bmRlZmluZWQpIHx8IHRoaXMuZXZlbnRUeXBlID09PSAncGluY2gnO1xyXG4gICAgfVxyXG5cclxuICAgIGRldGVjdExpbmVhclN3aXBlKGV2ZW50OiBhbnkpIHtcclxuICAgICAgICBjb25zdCB0b3VjaGVzID0gZXZlbnQudG91Y2hlcztcclxuXHJcbiAgICAgICAgaWYgKHRvdWNoZXMpIHtcclxuICAgICAgICAgICAgaWYgKHRvdWNoZXMubGVuZ3RoID09PSAxICYmICF0aGlzLmV2ZW50VHlwZSB8fCB0aGlzLmV2ZW50VHlwZSA9PT0gJ2hvcml6b250YWwtc3dpcGUnIHx8IHRoaXMuZXZlbnRUeXBlID09PSAndmVydGljYWwtc3dpcGUnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRMaW5lYXJTd2lwZVR5cGUoZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmV2ZW50VHlwZSB8fCB0aGlzLmV2ZW50VHlwZSA9PT0gJ2hvcml6b250YWwtc3dpcGUnIHx8IHRoaXMuZXZlbnRUeXBlID09PSAndmVydGljYWwtc3dpcGUnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRMaW5lYXJTd2lwZVR5cGUoZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldExpbmVhclN3aXBlVHlwZShldmVudDogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRUeXBlICE9PSAnaG9yaXpvbnRhbC1zd2lwZScgJiYgdGhpcy5ldmVudFR5cGUgIT09ICd2ZXJ0aWNhbC1zd2lwZScpIHtcclxuICAgICAgICAgICAgY29uc3QgbW92ZW1lbnRYID0gTWF0aC5hYnModGhpcy5tb3ZlTGVmdCgwLCBldmVudCkgLSB0aGlzLnN0YXJ0WCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vdmVtZW50WSA9IE1hdGguYWJzKHRoaXMubW92ZVRvcCgwLCBldmVudCkgLSB0aGlzLnN0YXJ0WSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoKG1vdmVtZW50WSAqIDMpID4gbW92ZW1lbnRYKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsLXN3aXBlJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnaG9yaXpvbnRhbC1zd2lwZSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ldmVudFR5cGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEVsZW1lbnRQb3NpdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRvdWNoc3RhcnRQb3NpdGlvbihldmVudDogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zdGFydFggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0O1xyXG4gICAgICAgIHRoaXMuc3RhcnRZID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5lbGVtZW50UG9zaXRpb24udG9wO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE1vdXNlZG93blBvc2l0aW9uKGV2ZW50OiBhbnkpIHtcclxuICAgICAgICB0aGlzLnN0YXJ0WCA9IGV2ZW50LmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0O1xyXG4gICAgICAgIHRoaXMuc3RhcnRZID0gZXZlbnQuY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcDtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlTGVmdChpbmRleDogYW55LCBldmVudDogYW55KSB7XHJcbiAgICAgICAgY29uc3QgdG91Y2hlcyA9IGV2ZW50LnRvdWNoZXM7XHJcblxyXG4gICAgICAgIGlmICh0b3VjaGVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0b3VjaGVzW2luZGV4XS5jbGllbnRYIC0gdGhpcy5lbGVtZW50UG9zaXRpb24ubGVmdDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZXZlbnQuY2xpZW50WCAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLmxlZnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vdmVUb3AoaW5kZXg6IGFueSwgZXZlbnQ6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHRvdWNoZXMgPSBldmVudC50b3VjaGVzO1xyXG5cclxuICAgICAgICBpZiAodG91Y2hlcykge1xyXG4gICAgICAgICAgICByZXR1cm4gdG91Y2hlc1tpbmRleF0uY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZXZlbnQuY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGV0ZWN0VG91Y2hTY3JlZW4oKSB7XHJcbiAgICAgICAgdmFyIHByZWZpeGVzID0gJyAtd2Via2l0LSAtbW96LSAtby0gLW1zLSAnLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgdmFyIG1xID0gZnVuY3Rpb24ocXVlcnk6IGFueSkge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93Lm1hdGNoTWVkaWEocXVlcnkpLm1hdGNoZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBpbmNsdWRlIHRoZSAnaGVhcnR6JyBhcyBhIHdheSB0byBoYXZlIGEgbm9uIG1hdGNoaW5nIE1RIHRvIGhlbHAgdGVybWluYXRlIHRoZSBqb2luXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXQuaW8vdnpuRkhcclxuICAgICAgICB2YXIgcXVlcnkgPSBbJygnLCBwcmVmaXhlcy5qb2luKCd0b3VjaC1lbmFibGVkKSwoJyksICdoZWFydHonLCAnKSddLmpvaW4oJycpO1xyXG4gICAgICAgIHJldHVybiBtcShxdWVyeSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qIFB1YmxpYyBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzICovXHJcbiAgICBvbihldmVudDogRXZlbnRUeXBlLCBoYW5kbGVyOiBGdW5jdGlvbikge1xyXG4gICAgICAgIGlmIChldmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZXJzW2V2ZW50XSA9IGhhbmRsZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19