import axios from 'axios'; //request send krne ke liye
import Noty from 'noty'; //for notify to user
import initAdmin from './admin';
import moment from 'moment';

let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter=document.querySelector("#cart-counter");

function updateCart(pizza){
   axios.post('/update-cart',pizza).then((res)=>{
    //    console.log(res)
       cartCounter.innerText = res.data.totalQty;
  
       new Noty({
           type:'success',
           timeout:500,
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

//Remove alert message
const alertMsg = document.getElementById("sucess-alert")

if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove();
    },2000)
}



//change orders status
let statuses=document.querySelectorAll(".status_line")
// console.log(statuses)
const hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order);
let time = document.createElement('small')

function updateStatus(order) {

    statuses.forEach((status) => {
        status.classList.remove('step-completed');
        status.classList.remove('current');

    });

  let stepCompleted = true;
  statuses.forEach((status) => {
      let dataProp=status.dataset.status
    //   console.log(dataProp)
      if(stepCompleted){
          status.classList.add('step-completed');
      }
      if(dataProp === order.status){
          stepCompleted = false;
          time.innerText = moment(order.upadtedAt).format('hh:mm A');
          status.appendChild(time)
          if(status.nextElementSibling){
            status.nextElementSibling.classList.add('current')
          } 
      }
  });
}

updateStatus(order);

//socket
let socket = io()

//join
if(order){
socket.emit('join',`order_${order._id}`);
}

let adminAreaPath = window.location.pathname;

if(adminAreaPath.includes('admin')){
    initAdmin(socket)
    socket.emit('join','adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.upadtedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    
    new Noty({
        type:'success',
        timeout:500,
        progressBar:false,
     //    layout:"bottomLeft"
        text:'Order Updated'
    }).show();
    console.log(data)
})