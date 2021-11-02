const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const _ = require('lodash');

mongoose.connect("mongodb://localhost:27017/todoDB", { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const itemsSchema = {
    name: String
}

const listSchema =  {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model('List', listSchema);

const Item = mongoose.model('Item', itemsSchema);

const item1 = {
    name: "Welcome to your todolist."
};
const item2 = {
    name: "Hit + to add and item."
};
const item3 = {
    name: "<-- Hit this to delete and item."
};

const defaultItems = [item1, item2, item3];


app.get('/', (req, res)=>{

    Item.find({},(err, foundItems)=>{
        if(foundItems.length===0) {
            Item.insertMany(defaultItems,(err)=>{
                if (err) {
                    console.log(err);
                } else {    
                    console.log('Successfully added items to database.');
                }
            });
            res.redirect('/');
        } else {
            res.render('list', {title:"Today", items:foundItems})
        }   
    });
});

app.get('/:customListName', (req, res)=>{
    const customListName = _.upperFirst(req.params.customListName);

    List.findOne({name:customListName},(err, foundList)=>{
        if(!err){
            if(!foundList){
                const newList = new List ({
                    name: customListName,
                    items: defaultItems
                });
                newList.save();
                res.redirect('/' + customListName)
            } else {
                res.render('list', {title:foundList.name, items:foundList.items})
            }
        }
    })
});

app.post('/', (req, res)=>{
    const item = req.body.newItem;
    const listTitle = req.body.list;

    const newItem = new Item({
        name: item
    });
    
    if(listTitle === "Today") {
        newItem.save();
        res.redirect('/');
    } else {
        List.findOne({name:listTitle}, (err, foundList)=>{
            foundList.items.push(newItem);
            foundList.save();
            res.redirect('/' + listTitle)
        })
    }   
});

app.post('/delete', (req, res)=>{
    const checkedItemID = req.body.checkbox;
    const listName = req.body.list;
    console.log(listName);

    if(listName === "Today") {
        Item.findByIdAndRemove({_id:checkedItemID}, (err)=>{
            if(!err){
                console.log('Successfully deleted from database.');
                res.redirect('/');
            }
        });
    } else {
        List.findOneAndUpdate(
            {name:listName},
            {$pull: {items: {_id:checkedItemID}}},
            (err, foundList)=>{
                if(!err){
                    console.log('Successfully deleted item.');
                    res.redirect('/' + listName)
                }
            })
    }
});


app.listen(3000, ()=>{
    console.log('Server now running on port 3000.');
})