import V from './v';

class Compile {
  public container: HTMLElement;
  public fragment: DocumentFragment;
  public vm: V;
  constructor(vm: V) {
    const container = document.getElementById(vm.$el);
    if (container === null) {
      throw new Error('容器元素没找到');
    }
    this.vm = vm;
    this.container = container;
    this.fragment = this.node2fragment();
    this.parseHTML();
    this.container.appendChild(this.fragment);
  }

  private node2fragment() {
    const fragment = document.createDocumentFragment();
    const container = this.container;
    let node = container.firstChild;
    while (node) {
      fragment.appendChild(node);
      node = container.firstChild;
    }
    return fragment;
  }

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
        this.vm.watch(match[1], (val) => {
          node.textContent = val;
        })
      }

      if ((node as HTMLElement).nodeType === 1) {
        this.dealWithElement(node as HTMLElement);
      }
    }
  }

  private dealWithElement(node: HTMLElement) {
    const attrs = node.attributes;
    for (let i = 0; i < attrs.length; ++i) {
      const attr = attrs[i];
      if (this.isCommond(attr.name)) {
        const event = attr.name.split(':')[1];
        node.addEventListener(event, this.vm.methods[attr.value]);
      }
    }
  }

  private isCommond(name: string): boolean {
    const pre = name.split(':');
    return pre[0] === 'v-on';
  }
}

export default Compile;
