import { createApp } from 'vue';
import App from './App.vue';

// 创建 Vue 应用
const app = createApp(App);
app.mount('#app');

function test() {
    let a=12;
     let b =- -5;
     console.log((5 | 3) & 7);
     console.log(10 & 6 | 2);
     console.log(5 ^ 3 ^ 1);

}
test();
