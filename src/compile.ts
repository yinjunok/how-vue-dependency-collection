import Mvvm from './mvvm';
import Watcher from './watcher';

class Compile {
  public el: HTMLElement;
  public vm: Mvvm;
  constructor(vm, el) {
    this.el = el;
    this.vm = vm;
  }
}

export default Compile;
