interface IData {
  [anyDataName: string]: any;
}

interface IComputed {
  [anyComputed: string]: () => {} 
}

interface IMvvm {
  data: IData;
  el: string | HTMLElement;
  computed: IComputed;
  methods: IComputed;
  watch: IComputed;
}

export default class Mvvm {
  /**
   * name
   */
  public $options: IMvvm;
  public $compile: any;
  public $el: string | HTMLElement;
  public constructor(params: IMvvm) {
    this.$options = params;
    this.$el = params.el;
  }
}
