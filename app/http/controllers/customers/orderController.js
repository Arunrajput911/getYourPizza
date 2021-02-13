const Order=require("../../../models/order");
const moment= require("moment");

function orderController() {
    return {
        store(req,res){
            //validate request
            const { phone,address } = req.body;
            if(!phone || !address){
                req.flash('error','All fields are reuired');
                return res.redirect("/cart");
            }

           const order = new Order({
               customerId:req.user._id, 
               items:req.session.cart.items,
               phone:phone,
               address
           })
            order.save().then(result => {
                Order.populate(result,{path:'customerId'},(err,placedOrder) => {
                    req.flash('success','Order placed sucessfully');
                    //delete krne ke liye cart
                    delete req.session.cart
    
                   //Emit
                   const eventEmitter = req.app.get('eventEmitter')
    
                   eventEmitter.emit('orderPlaced',result)
     
    
                    return res.redirect('/customer/orders')
                })
              
            }).catch(err => {
                req.flash('error','Something went wrong')
                return res.redirect('/cart')
            })
        },
        async index(req,res){
            //sort krne ke liye sort method
            const orders = await Order.find({ customerId:req.user._id },null,
                {sort:{ 'createdAt':-1 }})
            res.render('customers/orders',{orders:orders,moment:moment})
            // console.log(orders)
        },
        async show(req,res){
            const order = await Order.findById(req.params.id)
            //authorize user
            if(req.user._id.toString() === order.customerId.toString()){
                //becoz id object mai hoti hai
               return  res.render('customers/singleOrder',{order:order})
        } else {
          return  res.redirect('/')
        }
    }
 }

}

module.exports = orderController