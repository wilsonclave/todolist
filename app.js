const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');


const items=[];
const workItems = [];

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res)=>{
    
    res.render('list', {title:"Today", items:items})
});

app.post('/', (req, res)=>{
    const item = req.body.newItem;
    const listTitle = req.body.list;

    if(listTitle === "Today") {
        items.push(item);
        res.redirect('/');
    } else {
        workItems.push(item);
        res.render('list',{title:listTitle, items:workItems})
    }
});

app.post('/delete', (req, res)=>{
    const checkedItem = req.body.list;
    console.log(checkedItem);

   

})


app.get('/work', (req, res)=>{
    res.render('list', {title:"Work", items:workItems})
});


app.listen(3000, ()=>{
    console.log('Server now running on port 3000.');
})