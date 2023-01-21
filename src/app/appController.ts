import { apiProvider } from '../api/apiProvider';
import { Paths } from '../api/paths';
import { CarResponse, ControllerModel, CarRequest } from '../models/controller.model';
import { Methods } from '../api/methods';
import { state } from './state';
import { ResponseStatuses } from '../api/statuses';

export class AppController implements ControllerModel {
  public async getCars(page = 1, limit = 7): Promise<void> {
    const response = await fetch(`${apiProvider}${Paths.Garage}?` + new URLSearchParams({
      _page: page.toString(),
      _limit: limit.toString()
    }), {
      method: Methods.Get
    });
    if (response.status === ResponseStatuses.Ok) {
      const data: CarResponse[] = await response.json();
      state.setCars(data);
      state.setCarsAmount(Number(response.headers.get('X-Total-Count')));
    }
  }

  public async getCar(id: number): Promise<CarResponse | undefined> {
    try {
      const response = await fetch(`${apiProvider}${Paths.Garage}/${id}`);
      if (response.status === ResponseStatuses.Ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.log(`id ${id} is not found`);
    }
    return Promise.resolve(undefined);
  }

  public async createCar(body: CarRequest): Promise<void> {
    const response = await fetch(`${apiProvider}${Paths.Garage}`, {
      method: Methods.Post,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data: CarResponse = await response.json();
    state.addCar(data);
  }

  public async updateCar(id: number, body: CarRequest): Promise<void> {
    const response = await fetch(`${apiProvider}${Paths.Garage}/${id}`, {
      method: Methods.Put,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data: CarResponse = await response.json();
    state.updateCar(data);
  }

  public async deleteCar(id: number): Promise<void> {
    const response = await fetch(`${apiProvider}${Paths.Garage}/${id}`, {
      method: Methods.Delete
    });
    if (response.status === ResponseStatuses.Ok) {
      await this.getCars();
    } else if (response.status === ResponseStatuses.NotFound) {
      console.log(`id ${id} is not found`);
    }
  }
}
