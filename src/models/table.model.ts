export interface TableModel {
    init(): Promise<string>;
    render(): Promise<string>;
}
