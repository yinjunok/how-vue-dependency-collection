# mini MVVM 实现

运行命令查看运行效果
```
yarn install
yarn run all
```

依赖收集的核心就是: **取值的时候收集依赖, 设置值的时候把值交给订阅者**

```ts
/**
 * 把普通对象转换成可观察的对象.
 * @param key {string} 要转换的属性
 * @param val {any} 属性的值
 */
private defineReactive(key, val) {
    type Sub = (val: number | string) => void;

    const subs: Sub[] = []; // 观察 key 的订阅者

    Object.defineProperty(this, key, {
      get() {
        // 将对象放入订阅者数组.
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
        // 设置值的时候把新值发送给订阅者.
        subs.forEach(sub => sub(val));
      }
    });
  }
```

```ts
/**
 * 给对象添加观察者
 * @param key {string} 要观察对象的属性
 * @param cb {function} 当有新值的时候触发的回调
 */
public watch(key: string, cb: (val) => void) {
  // BELT 是 V 的静态属性, 将它当成传送带.
  // 通过 BELT 将观察者送到观察者数组.
  V.BELT = {
    key,
    cb,
  };

  // 手动触发一次取值操作,
  // 保证将观察者放入观察者数组中
  const val = this[key];
  cb(val);

  V.BELT = null;
}
```

在编译模板的时候, 模板变量就一个观察者, 把这个观察者的放入订阅数组里.

```ts
private parseHTML() {
  const childNodes = this.fragment.childNodes;
  const reg = /\{\{(.*)\}\}/;

  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    const text = node.textContent;
    if (text === null) {
      continue;
    }

    const match = text.match(reg);
    if (match !== null) {
      // 将观察者放入 subs 数组中
      this.vm.watch(match[1], (val) => {
        node.textContent = val;
      })
    }

    if ((node as HTMLElement).nodeType === 1) {
      this.dealWithElement(node as HTMLElement);
    }
  }
}
```

参考:   
https://github.com/DMQ/mvvm  
https://segmentfault.com/a/1190000011153487  
