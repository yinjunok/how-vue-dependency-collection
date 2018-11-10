/* tslint:disable */
import V from './v';

new V({
  el: 'container',
  data: {
    input: '',
    number: 2,
  },
  methods: {
    handle(e) {
      this.input = e.target.value;
    },
    add() {
      this.number += 1;
    }
  },
});

