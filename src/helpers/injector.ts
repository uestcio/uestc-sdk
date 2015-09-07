

export class Injector {
    private providerCache: { [id: string]: any };
    private instanceCache: { [id: string]: any };
    
    constructor () {
        this.providerCache = {};
        this.instanceCache = {};
    }
    
    get (dependent: string): any {
        var instance: any = null;
        var provider: any = null;
        if (!(instance = this.instanceCache[dependent])) {
            if(provider = this.providerCache[dependent]) {
                instance = new this.providerCache[dependent];
            }
            else {
                console.log('Error find denpency: ' + dependent);
            }
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

export var injector: Injector = new Injector();
