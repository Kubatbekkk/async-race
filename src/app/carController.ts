import { apiProvider } from '../api/apiProvider';
import { CarStatuses, ResponseStatuses } from '../api/statuses';
import { EngineResponse, EngineStatus } from '../models/car.model';
import { Paths } from '../api/paths';
import { Methods } from '../api/methods';
import { state } from './state';

export class CarController {
  public carId: number;

  public animateCarIds: {[id: number]: number};

  constructor() {
    this.animateCarIds = state.getAnimateCarIds();
  }

  public animateCar(id: number): void {
    const track = document.getElementById('track') as HTMLDivElement;
    const car = document.getElementById(`car-${id}`) as unknown as SVGSVGElement;
    const chars: EngineResponse = state.getCharsByCarId(id);
    const duration: number = chars.distance / chars.velocity;
    const flagWidth = 28;
    const distance: number = track.clientWidth - car.clientWidth - flagWidth;
    const start = performance.now();
    const draw = (progress: number): void => {
      car.style.transform = `translateX(${progress * distance}px)`;
    };
    const timing = (timeFraction: number): number => timeFraction;
    const animate = (time: number): void => {
      let timeFraction: number = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      const progress: number = timing(timeFraction);
      draw(progress);
      if (timeFraction < 1) {
        this.animateCarIds[id] = requestAnimationFrame(animate.bind(this));
        state.setAnimateCarId(id, this.animateCarIds[id]);
      }
    };
    this.animateCarIds[id] = requestAnimationFrame(animate.bind(this));
    state.deleteAnimateCarId(id);
  }

  public stopAnimateCar(id: number): void {
    cancelAnimationFrame(this.animateCarIds[id]);
    state.deleteAnimateCarId(id);
  }

  public cancelAllCarsAnimation(): void {
    Object.values(this.animateCarIds).forEach(value => {
      cancelAnimationFrame(value);
    });
    this.animateCarIds = {};
    state.resetAnimateCarIds();
  }

  public runAllCarsAnimation(): void {
    Object.values(this.animateCarIds).forEach(value => {
      this.animateCar(value);
    });
  }

  public resetCar(id: number): void {
    const car = document.getElementById(`car-${id}`) as unknown as SVGSVGElement;
    car.style.transform = 'translateX(0px)';
  }

  public async startCar(id: number): Promise<EngineResponse> {
    const response = await fetch(`${apiProvider}${Paths.Engine}?id=${id}&status=${CarStatuses.Started}`, {
      method: Methods.Patch
    });
    const data: EngineResponse = await response.json();
    return data;
  }

  public async stopCar(id: number): Promise<EngineResponse> {
    const response = await fetch(`${apiProvider}${Paths.Engine}?id=${id}&status=${CarStatuses.Stopped}`, {
      method: Methods.Patch
    });
    this.stopAnimateCar(id);
    const data: EngineResponse = await response.json();
    state.deleteCarChars(id);
    this.resetCar(id);
    return data;
  }

  public async driveCar(id: number): Promise<EngineStatus> {
    const response = await fetch(`${apiProvider}${Paths.Engine}?id=${id}&status=${CarStatuses.Drive}`, {
      method: Methods.Patch
    });
    const status = response.status === ResponseStatuses.Ok;
    if (!status) {
      this.stopAnimateCar(id);
    }

    return status ? { success: id } : { success: false };
  }

  public async raceCar(id: number): Promise<EngineStatus> {
    return this.startCar(id).then(async (response: EngineResponse) => {
      state.setCarChars(id, response);
      this.animateCarIds = state.getAnimateCarIds();
      this.animateCar(id);
      return this.driveCar(id);
    }).then((response: EngineStatus) => {
      if (!response.success) throw new Error('you lose!');
      return response;
    });
  }

  public async raceCars(ids: number[]): Promise<EngineStatus> {
    return Promise.any(ids.map((id) => this.raceCar(id))).then((response: EngineStatus) => {
      console.log(response, 'win');
      const cars = state.getCars();
      cars.forEach((car) => {
        if (car.id === response.success) {
          alert(`${car.name} wins this race!`);
        }
      });
      return response;
    });
  }

  public async resetCars(ids: number[]): Promise<EngineResponse[]> {
    return Promise.all(ids.map((id) => this.stopCar(id)));
  }
}
