const order=require('../../../models/order')

const Order=require('../../../models/order')
function orderController() {
    return {
         index(req,res){
           // populate method hai kisi ki id se uski puri details dene ke liye
           order.find({status:{$ne:'completed'}},null,{sort:{'createdAt':-1}}).
           populate('customerId','-password').exec((err,orders) => {
            //  console.log(orders)
             //ajex call ke liye json data bhejna hai
              if(req.xhr){
                return res.json(orders);
              }

              return res.render('admin/orders')
           })

         }
     }
}

module.exports = orderController




