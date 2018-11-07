import Dep from './dep';

class Observer {
  public data: object;

  constructor(data) {
    this.data = data;
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
    });
  }

  private defineReactive(obj: object, key: string, val) {
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      get() {
        if (Dep.target !== null) {
          dep.depend();
        }
        return val;
      },
      set(newVal) {
        if (newVal === val) {
          return;
        }

        observe(newVal);
        val = newVal;
        dep.notify();
      }
    });
  }
}

function observe(data: object): Observer | void {
  if (typeof data !== 'object') {
    return;
  }
  
  return new Observer(data);
}

export default observe;