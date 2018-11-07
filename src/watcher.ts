import Mvvm from './mvvm';
import Dep from './Dep';

class Watcher {
  public vm: Mvvm;
  public getter: Function;
  public cb: Function;
  public depIds: object;
  public value: any;
  constructor(vm: Mvvm, expOrFn: string | Function, cb: Function) {
    this.vm = vm;
    this.cb = cb;
    this.depIds = {};

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = this.parseExp(expOrFn);
    }

    this.value = this.get();
  }

  private parseExp(exp: string): Function {
    const expArr = exp.split('.');

    return (obj) => {
      if (!obj) {
        return;
      }
      for (let i = 0; i < expArr.length; ++i) {
        obj = obj[expArr[i]];
      }
      return obj;
    }
  }

  public update() {
    const val = this.get();
    const oldVal = this.value;
    if (val !== oldVal) {
      this.value = val;
      this.cb.call(this.vm, val, oldVal);
    }
  }

  public addDep(dep: Dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this);
      this.depIds[dep.id] = dep;
    }
  }

  private get() {
    Dep.target = this;
    const val = this.getter.call(this.vm);
    Dep.target = null;
    return val;
  }
}

export default Watcher;