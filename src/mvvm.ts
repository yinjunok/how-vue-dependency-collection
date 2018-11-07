import observe from './observer';
import Compile from './compile';

interface IData {
  [anyDataName: string]: object | number | string;
}

interface IComputed {
  [anyComputed: string]: () => {} 
}

export interface IMvvm {
  data: IData;
  el: string | HTMLElement;
  computed: IComputed;
  methods: IComputed;
  watch?: IComputed;
}

export default class Mvvm {
  /**
   * name
   */
  public $compile: Compile;
  public el: string | HTMLElement;
  public data: IData;

  public constructor(options: IMvvm) {
    this.data = options.data;
    this.el = options.el;

    const data = options.data;
    Object.keys(data).forEach(key => {
      this.proxyData(key);
    });

    observe(data);
    this.initComputed(options.computed);

    this.$compile = new Compile(this, this.el);
  }

  private proxyData(key: string) {
    Object.defineProperty(this, key, {
      get() {
        return this.data[key];
      },
      set(newVal) {
        this.data[key] = newVal;
      }
    });
  }

  private initComputed(computed: IComputed) {
    if (typeof computed !== 'object') {
      return;
    }

    Object.keys(computed).forEach(key => {
      Object.defineProperty(this, key, {
        get: computed[key],
        set() {
          throw new Error('计算属性无法被赋值');
        }
      });
    });
  }
}
