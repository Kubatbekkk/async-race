import { EngineResponse } from '../models/car.model';
import { CarResponse } from '../models/controller.model';
import { StateModel } from '../models/state.model';
import { CARS_LIMIT_PER_PAGE } from './consts';
import { GetWinners } from '../models/winners.model';

class State {
  public state: StateModel;

  constructor() {
    this.state = this.getEmptyState();
  }

  public getEmptyState(): StateModel {
    return {
      cars: [],
      carsAmount: 0,
      selectedCarId: null,
      page: 1,
      carsChars: {},
      winners: [],
      winnersAmount: 0,
      animateCarIds: {},
      isAnimationPaused: {}
    };
  }

  public setCars(cars: CarResponse[]): void {
    this.state = { ...this.state, cars };
  }

  public setCarsAmount(amount: number): void {
    this.state = { ...this.state, carsAmount: amount };
  }

  public setSelectedCar(id: number): void {
    this.state = { ...this.state, selectedCarId: id };
  }

  public setPage(page: number): void {
    this.state = { ...this.state, page };
  }

  public addCar(car: CarResponse): void {
    if (this.state.cars.length < CARS_LIMIT_PER_PAGE) {
      this.state = {
        ...this.state,
        cars: [...this.state.cars, car],
        carsAmount: this.state.carsAmount + 1
      };
    } else {
      this.state = {
        ...this.state,
        carsAmount: this.state.carsAmount + 1
      };
    }
  }

  public updateCar(updatedCar: CarResponse): void {
    this.state = {
      ...this.state,
      cars: this.state.cars.map((car: CarResponse) => {
        return car.id === updatedCar.id ? updatedCar : car;
      })
    };
  }

  public getCars(): CarResponse[] {
    return this.state.cars;
  }

  public getCarsAmount(): number {
    return this.state.carsAmount;
  }

  public getPage(): number {
    return this.state.page;
  }

  public getSelectedCar(): number | null {
    return this.state.selectedCarId;
  }

  public setCarChars(id: number, chars: EngineResponse) {
    this.state.carsChars[id] = chars;
  }

  public deleteCarChars(id: number): void {
    delete this.state.carsChars[id];
  }

  public getCharsByCarId(id: number): EngineResponse {
    return this.state.carsChars[id];
  }

  public setAnimateCarId(carId: number, animateCarId: number): void {
    this.state.animateCarIds = {
      ...this.state.animateCarIds,
      [this.state.page]: { ...this.state.animateCarIds[this.state.page], [carId]: animateCarId }
    };
  }

  public deleteAnimateCarId(carId: number): void {
    if (typeof this.state.animateCarIds[this.state.page] === 'object') {
      delete this.state.animateCarIds[this.state.page][carId];
    }
  }

  public getAnimateCarIds(): {[id: number]: number} {
    return this.state.animateCarIds[this.state.page]
      ? this.state.animateCarIds[this.state.page]
      : {};
  }

  public resetAnimateCarIds(): void {
    this.state.animateCarIds[this.state.page] = {};
  }

  public pauseAnimationPage(): void {
    this.state.isAnimationPaused[this.state.page] = true;
  }

  public startAnimationPage(): void {
    this.state.isAnimationPaused[this.state.page] = false;
  }

  public isAnimationOnPagePaused(): boolean {
    return this.state.isAnimationPaused[this.state.page]
      ? this.state.isAnimationPaused[this.state.page]
      : false;
  }

  public isDriveForCarInProgress(id: number): boolean {
    return this.state.animateCarIds[this.state.page]
      ? Boolean(this.state.animateCarIds[this.state.page][id])
      : false;
  }

  public isDriveForAllCarsInProgress(): boolean {
    return this.state.animateCarIds[this.state.page]
      ? this.state.cars.every((car) => {
        return this.isDriveForCarInProgress(car.id);
      })
      : false;
  }

  public getWinners(): GetWinners[] {
    return this.state.winners;
  }

  public setWinnersAmount(amount: number): void {
    this.state = { ...this.state, winnersAmount: amount };
  }

  public getWinnersAmount(): number {
    return this.state.winnersAmount;
  }
}

export const state = new State();
