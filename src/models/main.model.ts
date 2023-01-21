export interface MainModel {
    init(): Promise<string>;
    trackInit(): Promise<string>;
    render(): Promise<string>;
}
