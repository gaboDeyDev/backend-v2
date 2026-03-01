export class Sort<T> {
    key: keyof T;
    type: 'asc' | 'desc'
}

export class SearchDto<T> {
    data: Partial<T>;
    limit: number = 10;
    page: number = 1;
    sort: Sort<T>
}