

export class Injector {
    private providerCache: { [id: string]: any };
    private instanceCache: { [id: string]: any };
    
    constructor () {
        this.providerCache = {};
        this.instanceCache = {};
    }
    
    get (dependent: string): any {
        var instance: any;
        if (!(instance = this.instanceCache[dependent])) {
            instance = new this.providerCache[dependent];
        }
        return instance;
    }
    
    mock (name: string, instance: any) {
        this.instanceCache[name] = instance;
    }
    
    register (name: string, provider: any) {
        this.providerCache[name] = provider;
    }
}
