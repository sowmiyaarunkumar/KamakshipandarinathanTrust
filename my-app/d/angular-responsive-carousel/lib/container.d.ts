import { Properties as CarouselProperties } from './interfaces';
export declare class Container {
    private carouselProperties;
    private utils;
    private cells;
    newPositionIndex: number;
    isPositionCorrection: boolean;
    initialPositionX: number;
    initialElementPositionX: number;
    isLocked: boolean;
    pullLimit: number;
    startTime: number;
    startX: number;
    moveX: number;
    isSwipeInProgress: boolean;
    get visibleWidth(): any;
    get overflowCellsLimit(): any;
    get images(): any;
    get element(): HTMLElement;
    get freeScroll(): boolean;
    get fullCellWidth(): number;
    get numberOfVisibleCells(): any;
    get transitionDuration(): number;
    get transitionTimingFunction(): "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";
    get cellLength(): any;
    get cellLengthInLightDOMMode(): any;
    get tooFewCells(): boolean;
    get disabled(): boolean;
    get margin(): number;
    get isLightDOM(): boolean;
    constructor(carouselProperties: CarouselProperties, utils: any, cells: any);
    updateProperties(carouselProperties: CarouselProperties): void;
    init(): void;
    handleTouchstart(): void;
    handleHorizontalSwipe(): void;
    handleTouchend(simpleProcessing?: boolean): void;
    move(): void;
    getMovePositionX(): number;
    getDistance(): number;
    detectPulled(): {
        edge: string;
        positionX: number;
        overflowX: number;
    } | undefined;
    slowdownOnPull(_positionX: number): number;
    finishMoving(): void;
    getInertia(): number;
    getAlignedPositionOnPull(newPositionX: number): number;
    getCurrentPositionX(): number;
    getEndPosition(): number;
    transformPositionX(value: number, duration?: number): void;
    getWidth(): number;
    setWidth(): void;
    setInitialPosition(position: number): void;
    getElementPosition(): DOMRect;
    getInitialElementPositionX(): number;
    clearInitialValues(): void;
    getDirection(): "left" | "right" | undefined;
}
