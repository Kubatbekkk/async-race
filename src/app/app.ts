import { AppController } from './appController';
import { AppView } from './appView';
import { AppModel } from '../models/app.model';

class App implements AppModel {
    public view: AppView
    private controller: AppController

    constructor() {
        this.controller = new AppController()
        this.view = new AppView()
    }
    async start(): Promise<void> {
        await this.controller.getCars()
        await this.view.renderHeader()
        await this.view.render()
        await this.view.routing()
    }
}

export default App