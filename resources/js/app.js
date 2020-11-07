import axios from 'axios'; //request send krne ke liye
import Noty from 'noty'; //for notify to user

let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter=document.querySelector("#cart-counter");

function updateCart(pizza){
   axios.post('/update-cart',pizza).then((res)=>{
    //    console.log(res)
       cartCounter.innerText = res.data.totalQty;

       new Noty({
           type:'success',
           timeout:1000,
           progressBar:false,
        //    layout:"bottomLeft"
           text:'item added to cart'
       }).show();
   }).catch(err => {
    new Noty({
        type:'error',
        timeout:1000,
        progressBar:false,
     //    layout:"bottomLeft"
        text:'Something went wrong'
    }).show();
   })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click',(e) => {
       const pizza = JSON.parse(btn.dataset.pizza)
       updateCart(pizza);
// console.log(pizza)
    })
})