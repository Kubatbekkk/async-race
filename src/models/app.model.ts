import { ViewModel } from './view.model';

export interface AppModel {
    view: ViewModel;

    start(): void;
}
