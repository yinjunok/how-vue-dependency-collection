let DEP_ID = 0;


class Dep {
  public static target: Dep | null = null;
  public id: number;
  public subscribers: any[];
  constructor() {
    this.id = DEP_ID++;
    this.subscribers = [];
  }

  public depend() {
    if (Dep.target !== null) {
      Dep.target.addSub(Dep.target);
    }
  }

  public addSub(sub) {
    this.subscribers.push(sub);
  }

  public notify() {
    this.subscribers.forEach(sub => sub.update());
  }
}

export default Dep;