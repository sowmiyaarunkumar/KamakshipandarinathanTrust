import { Properties as CarouselProperties, Image } from './interfaces';
export interface Cell {
    index: number;
    positionX: number;
    img: {
        image: Image;
        imageIndex: number;
    };
}
export declare class ImageUtils {
    cellStack: Cell[];
    element: any;
    constructor(element: HTMLElement | undefined);
    getImages(): Cell[];
    filter(cell: Cell): boolean;
}
export declare class Cells {
    private carouselProperties;
    private utils;
    cells: HTMLCollection | undefined;
    element: HTMLElement;
    visibleWidth: number | undefined;
    counter: number;
    imageUtils: ImageUtils;
    get images(): any;
    get cellLength(): number;
    get fullCellWidth(): number;
    get cellLengthInLightDOMMode(): any;
    get numberOfVisibleCells(): any;
    get overflowCellsLimit(): any;
    get isLightDOM(): boolean;
    constructor(carouselProperties: CarouselProperties, utils: any);
    updateProperties(carouselProperties: CarouselProperties): void;
    lineUp(): void;
    ifSequenceOfCellsIsChanged(): boolean;
    getCellPositionInContainer(cellIndexInDOMTree: number): number;
    getCellIndexInContainer(cellIndexInDOMTree: number): any;
    getImage(cellIndex: number): {
        image: any;
        imageIndex: any;
    } | undefined;
    getImageIndex(cellIndexInDOMTree: number): any;
    setCounter(value: number): void;
    init(carouselProperties: CarouselProperties): void;
}
