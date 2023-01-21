import { CarResponse } from './controller.model';
import { EngineResponse } from './car.model';

export interface StateModel {
    winnersAmount: number;
    cars: Array<CarResponse>;
    carsAmount: number;
    selectedCarId: number | null;
    page: number;
    carsChars: {[id: number]: EngineResponse }
    winners: [],
    animateCarIds: {[page: number]: {[id: number]: number}};
    isAnimationPaused: {[page: number]: boolean};
}
