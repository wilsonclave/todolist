const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const date = require(__dirname + '/date.js')

const items=[];
const workItems = [];

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res)=>{
    const today = date.getDay();
    res.render('list', {title:today, items:items})
});

app.post('/', (req, res)=>{
    const item = req.body.newItem;

    if(req.body.list === "Work List") {
        workItems.push(item);
        res.redirect('/work')
    } else {
        items.push(item);
        res.redirect('/');
    }
});


app.get('/work', (req, res)=>{
    res.render('list', {title:"Work List", items:workItems})
});


app.listen(3000, ()=>{
    console.log('Server now running on port 3000.');
})