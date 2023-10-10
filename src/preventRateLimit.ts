export function preventRateLimit (): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any) {
      const now = new Date().getTime()
      const elapsedTime = now - this.constructor.lastRequest.getTime()

      if (elapsedTime < 1000) {
        return await new Promise(resolve => setTimeout(() => {
          this.constructor.lastRequest = new Date()
          resolve(originalMethod.apply(this, args))
        }, 1000))
      } else {
        return originalMethod.apply(this, args)
      }
    }
  }
}
