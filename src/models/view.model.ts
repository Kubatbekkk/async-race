export interface ViewModel {
    init(): Promise<string>;
    render(): Promise<void>;
}

export enum PagePaths {
    Garage = 'garage',
    Winners = 'winners'
}
