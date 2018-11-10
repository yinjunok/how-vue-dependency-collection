import Compile from './compile';

interface IMethods {
  [anyComputed: string]: () => any;
}

interface IData {
  [anyData: string]: string | number;
}

interface IOptions {
  el: string;
  data: IData;
  methods: IMethods;
}

// 传送带, 把订阅者传送到 vm 实例属性的订阅者.
interface IBelt {
  key: string;
  cb: (val) => void;
}

class V {
  public static BELT: IBelt | null = null;

  public $data: IData;
  public $el: string;
  public methods: IMethods;
  constructor(options: IOptions) {
    this.$el = options.el;
    this.$data = options.data;
    this.methods = options.methods;
    Object.keys(options.data).forEach(key => {
      this.defineReactive(key, options.data[key]);
    });

    this.initMethods();
    this.compile();
  }

  // 观察者
  // key 观察的属性
  // cb 属性发生变化时的回调
  public watch(key: string, cb: (val) => void) {
    V.BELT = {
      key,
      cb,
    };

    // 触发依赖收集
    const val = this[key];
    cb(val);

    V.BELT = null;
  }

  private compile() {
    return new Compile(this);
  }

  private defineReactive(key, val) {
    type Sub = (val: number | string) => void;

    const subs: Sub[] = []; // 订阅者

    Object.defineProperty(this, key, {
      get() {
        if (
          V.BELT !== null &&
          V.BELT.key === key &&
          subs.indexOf(V.BELT.cb) === -1
        ) {
          subs.push(V.BELT.cb);
        }
        return val;
      },
      set(newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        subs.forEach(sub => sub(val));
      }
    });
  }

  // 初始化方法, 把 this 绑定到方法
  private initMethods() {
    const methods = this.methods;
    Object.keys(methods).forEach(key => {
      methods[key] = methods[key].bind(this);
    });
  }
}

export default V;
