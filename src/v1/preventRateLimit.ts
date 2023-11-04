export function preventRateLimit() {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function(...args) {
            const now = new Date().getTime();
            const elapsedTime = now - this.constructor.lastRequest.getTime();

            if (elapsedTime < 1000) {
                return new Promise(resolve => setTimeout(() => {
                    this.constructor.lastRequest = new Date();
                    return resolve(originalMethod.apply(this, args));
                }, 1000));
            }
            else {
                return originalMethod.apply(this, args);
            }
        }
    }
}
