import V from './v';

const v: any = new V({
  el: 'container',
  data: {
    input: '',
    number: 2,
  },
  computed: {},
});

const input: any = document.getElementById('input');
const btn: any = document.getElementById('btn');

input.oninput = (e: any) => {
  v.input = e.target.value;
};

btn.onclick = () => {
  v.number += 1;
}

