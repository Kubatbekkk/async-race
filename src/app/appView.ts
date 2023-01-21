import { Header } from '../components/header';
import { Main } from '../components/main';
import { Footer } from '../components/footer';
import { ViewModel, PagePaths } from '../models/view.model';
import { Pagination } from '../components/pagination';
import { WinnersTable } from '../components/table';
import { TableModel } from '../models/table.model';

export class AppView implements ViewModel {
  public headerTemplate: string;

  public template: string;

  public header;

  public main;

  public pagination;

  public footer;

  public pagePaths: PagePaths;

  public winnersTable: TableModel;

  constructor() {
    this.header = new Header();
    this.main = new Main();
    this.pagination = new Pagination();
    this.footer = new Footer();
    this.pagePaths = PagePaths.Garage;
    this.winnersTable = new WinnersTable();
  }

  public async init(): Promise<string> {
    this.template = `
    <div id="router">
      <main class="main-container" id="main-container">
        ${this.pagePaths === PagePaths.Garage ? await this.initGaragePage.call(this) : await this.initWinnersPage.call(this) }
      </main>
      ${await this.footer.render()}
    </div>
    `;
    return this.template;
  }

  public async initHeader(): Promise<void> {
    this.headerTemplate = `
    ${await this.header.render()}
    `;
  }

  public async renderHeader(): Promise<void> {
    await this.initHeader();
    (document.querySelector('body') as HTMLBodyElement).insertAdjacentHTML('afterbegin', this.headerTemplate);
  }

  public async initGaragePage(): Promise<string> {
    return `
    ${await this.main.render()}
    ${await this.pagination.render()}
    `;
  }

  public async initWinnersPage(): Promise<string> {
    return `
    ${await this.winnersTable.render()}
    ${await this.pagination.render()}
    `;
  }

  public changePagePathToGarage() {
    this.pagePaths = PagePaths.Garage;
  }

  public changePagePathToWinners() {
    this.pagePaths = PagePaths.Winners;
  }

  public subscribe(): void {
    this.pagination.subscribeOnNext(this.updateMain.bind(this));
    this.pagination.subscribeOnPrev(this.updateMain.bind(this));
    this.pagination.subscribeOnStart(this.updateMain.bind(this));
    this.pagination.subscribeOnEnd(this.updateMain.bind(this));
    this.main.subscribeSelectCar();
    this.main.subscribeUpdateCar(this.updateMain.bind(this));
    this.main.subscribeDeleteCar(this.updateMain.bind(this));
    this.main.subscribeOnStart();
    this.main.subscribeOnStop();
    this.main.resetBtnsStatus();
  }

  public async updateMain(): Promise<void> {
    await this.main.updateTrack();
    await this.pagination.updatePagination();
    this.subscribe();
  }

  public async routing(): Promise<void> {
    this.header.subscribeOnGarage(this.changePagePathToGarage.bind(this), this.render.bind(this));
    this.header.subscribeOnWinners(this.changePagePathToWinners.bind(this), this.render.bind(this));
  }

  public async render(): Promise<void> {
    await this.init();
    (document.querySelector('body') as HTMLBodyElement).insertAdjacentHTML('beforeend', this.template);
    if (this.pagePaths === PagePaths.Garage) {
      this.subscribe();
      this.main.subscribeCreateCar(this.updateMain.bind(this));
      this.main.subscribeAddCars(this.updateMain.bind(this));
      this.main.updatePanelStatus();
      this.main.updateBtnsStatus();
      this.main.subscribeOnAsyncRace();
      this.main.subscribeOnResetRace();
    }
  }
}
