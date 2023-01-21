import { TableModel } from '../models/table.model';

export class WinnersTable implements TableModel {
  public template: string;

  public async init(): Promise<string> {
    this.template = `
        <h2 class="main-container__title" id="win-title">
            Winners (2)
        </h2>
        <div class="winners-page">
            <table>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Car</th>
                        <th>Car model</th>
                        <th>Wins</th>
                        <th>Best time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>
                            <svg class="car" id="car">
                                <use xlink:href="assets/images/sprite_car.svg#car"></use>
                            </svg>
                        </td>
                        <td>Nissan</td>
                        <td>1</td>
                        <td>10.3</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>
                            <svg class="car" id="car">
                                <use xlink:href="assets/images/sprite_car.svg#car"></use>
                            </svg>
                        </td>
                        <td>Dodge</td>
                        <td>2</td>
                        <td>9.3</td>
                    </tr>
                </tbody>
            </table>
        </div>`;
    return this.template;
  }

  public async render(): Promise<string> {
    await this.init();
    return this.template;
  }
}
