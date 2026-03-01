export class ServiceConfigDto<T> {
    imports: any[];
    inject: any[];
    useFactory: (...args: any[]) => T
}