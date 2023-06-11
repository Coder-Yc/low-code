class EventEmitter {
    // 订阅者列表
    subscriber = {};
    // 订阅
    subscribe(key, fn) {
      if (!Array.isArray(this.subscriber[key])) {
        this.subscriber[key] = [];
      }
      this.subscriber[key].push(fn);
    }
  
    // 取消单个订阅
    unsubscribe(key, fn) {
      const subscribers = this.subscriber[key] || [];
      this.subscriber[key] = subscribers.filter((_fn) => _fn !== fn);
    }
  
    // 取消所有订阅
    unsubscribeAll(key) {
      this.subscriber[key] = [];
    }
  
    // 发布
    publish(key, ...args) {
      const subscribers = this.subscriber[key] || [];
  
      if (subscribers.length === 0) {
        console.log("has't subscriber");
      }
  
      subscribers.forEach((subscriber) => {
        subscriber.apply(this, args);
      });
    }
  }
  let a = new EventEmitter()
  export default a