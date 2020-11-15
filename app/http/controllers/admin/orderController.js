const Order=require('../../../models/order')
// populate method hai kisi ki id se uski puri details dene ke liye
function orderController() {
    return {
         index(req,res){
           
           Order.find({status:{$ne:'completed'}},null,{sort:{'createdAt':-1}}).
           populate('customerid','-password').exec((err,orders) => {
             
              if(req.xhr){
                return res.json(orders);
              }

               res.render('admin/orders')
           })

         }
     }
}

module.exports = orderController