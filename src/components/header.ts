import { HeaderModel } from '../models/header.model';

export class Header implements HeaderModel {
  public template: string;

  public async init(): Promise<string> {
    this.template = `
        <header class="header-wrapper">
            <div class="header-container">
                <h1 class="header-container__title" id="app-title">
                    async race
                </h1>
                <div class="header-container__items">

                  <nav class="header-nav">
                    <div class="header-nav__item">
                        <button id="garage-btn" class="header__btn button">
                            Garage
                        </button>
                    </div>
                    <div class="header-nav__item">
                        <button id="winners-btn" class="header__btn button">
                            Winners
                        </button>
                    </div>
                  </nav>
                </div>
            </div>
        </header>`;
    return this.template;
  }

  public subscribeOnGarage(changePath: () => void, render: () => void): void {
    const garageBtn = document.getElementById('garage-btn') as HTMLButtonElement;
    garageBtn?.addEventListener('click', async (event: MouseEvent): Promise<void> => {
      event.preventDefault();
      const router = document.getElementById('router') as HTMLDivElement;
      if (router) {
        router.remove();
        changePath();
        await render();
      }
    });
  }

  public subscribeOnWinners(changePath: () => void, render: () => void): void {
    const winnersBtn = document.getElementById('winners-btn') as HTMLButtonElement;
    winnersBtn?.addEventListener('click', async (event: MouseEvent): Promise<void> => {
      event.preventDefault();
      const router = document.getElementById('router') as HTMLDivElement;
      if (router) {
        router.remove();
        changePath();
        await render();
      }
    });
  }

  public async render(): Promise<string> {
    await this.init();
    return this.template;
  }
}
