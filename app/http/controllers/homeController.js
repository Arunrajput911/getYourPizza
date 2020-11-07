const Menu=require("../../models/menu")

function homeController(){
    return {
       index(req,res) {
            //func mai async lagana padega
            // const pizzas = await Menu.find()

            // return res.render('home',{pizza:pizzas})

            Menu.find().then((pizzas) => {
                // console.log(pizzas)
                return res.render("home",{pizza:pizzas})
            })
            
        }
    }
}

module.exports = homeController 