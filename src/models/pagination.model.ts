export interface PaginationModel {
    init(): Promise<string>;
    render(): Promise<string>;
}
