const express = require('express');

const app = express();

app.use(express.json());

let products = [
    {
        id:101,
        name:'Apple Iphone',
        price:80000
    },
    {
        id:102,
        name:'Apple Ipad',
        price:60000
    },
    {
        id:103,
        name:'Apple Macbook',
        price:180000
    },
    {
        id:104,
        name:'Apple Irpods',
        price:8000
    }
]

// Create API
app.post('/products',(req, res)=> {
    console.log(req.body);
    products.push(req.body);
    res.send("product added");
})
// Read API
app.get('/products',(req, res)=>{
    res.send(products);
})
// Update API
app.put('/products/:id',(req, res)=>{
console.log(req.params.id);
console.log(req.body); 
for(let i=0; i<products.length; i++){
    if(products[i].id == req.params.id){
        products[i].id = req.body.id;
        products[i].name = req.body.name;
        products[i].price = req.body.price;

    }
}
    res.send("product updated");
})
// Delete API
app.delete('/products/:id',(req, res)=>{
    console.log(req.params.id);
console.log(req.body); 
for(let i=0; i<products.length; i++){
    if(products[i].id ==req.params.id){
        products.splice(i,1);
    }
}
res.send("product deleted");

})

// app.get('/', (req, res) => {
//     res.send(products);
// })

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});