const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Planning = require('../models/Planning');
const User = require('../models/User');
var fetchuser = require('../middleware/fetchuser');


// ROUTE 1
// api to add new trips to application ( by admin only )

router.post('/addtrip', fetchuser, async (req, res) => {
    const user = await User.findById(req.user.id);
    try {
        
        const { city, type ,place } = req.body;
        if (user.admin=="true") {
            const entry = new Trip({ city, type,place, date: req.body.date });
            const savedEntry = await entry.save();
            res.json(savedEntry);
        }
        else {
            res.status(500).send("Not Allowed");
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occured");
    }
})



// ROUTE 2
// user can search destination by city/place/type of destination

router.post('/search', fetchuser, async (req, res) => {
    let city=req.query.city?req.query.city:null;
    let place=req.query.place?req.query.place:null;
    let type=req.query.type?req.query.type:null;
    try {
        if(city){
        const trips = await Trip.find({city:city});
        res.json(trips);
        }
        else if(place){
            const trips = await Trip.find({place:place});
            res.json(trips);
        }
        else{
            const trips = await Trip.find({type:type});
            res.json(trips);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occured");
    }
})



// ROUTE 3
// user can save personal trip details
router.post('/newplan', fetchuser, async (req, res) => {
   
    try {
        const { title,city,place,startdate,returndate,description } = req.body;
            const entry = new Planning({ title,city,place,startdate,returndate,description, date: req.body.date,user:req.user.id });
            const savedEntry = await entry.save();
            res.json(savedEntry);
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occured");
    }
})


// ROUTE 4
// fetching all personal plans of user
router.get('/fetchallplan', fetchuser, async (req, res) => {
    try {
        const plans = await Planning.find({ user: req.user.id });
        res.json(plans);
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occured");
    }
})


// ROUTE 5
// deleting a personal plan
router.delete('/deleteplan/:id', fetchuser, async (req, res) => {
    try {
    let plan = await Planning.findById(req.params.id);
    if(!plan){
        return res.status(404).send("Not Found");
    }
    if(plan.user.toString()!=req.user.id){
        return res.status(404).send("Not allowed");
    }
    plan = await Planning.findByIdAndDelete(req.params.id); 
    res.json({"Success": "Plan deleted",plan: plan});
  } catch (error) {
      console.log(error);
      res.status(500).send("Some error occured"); 
  }
  })





// ROUTE 6
// api to update personal plan

router.put('/updateplan/:id', fetchuser, async (req, res) => {
    const { title,city,place,startdate,returndate,description } = req.body;
    const newPlan = {};
    if (title) {
        newPlan.title = title;
    }
    if (city) {
        newPlan.city = city;
    }
    if (place) {
        newPlan.place = place;
    }
    if (startdate) {
        newPlan.startdate = startdate;
    }
    if (returndate) {
        newPlan.returndate = returndate;
    }
    if (description) {
        newPlan.description = description;
    }
    try {
        let plan = await Planning.findById(req.params.id);
        if (!plan) {
            return res.status(404).send("Plan not Found");
        }
        if (plan.user.toString() != req.user.id) {
            return res.status(404).send("Not allowed");
        }
        plan = await Planning.findByIdAndUpdate(req.params.id, { $set: newPlan }, { new: true });
        res.json({ plan });
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occured");
    }
})


// ROUTE 7
// api to share plan with everyone
router.put('/shareplan/:id', fetchuser, async (req, res) => {
    let newPlan={};
    try {
        let plan = await Planning.findById(req.params.id);
        if (!plan) {
            return res.status(404).send("Plan not Found");
        }
        if (plan.user.toString() != req.user.id) {
            return res.status(404).send("Not allowed");
        }
        newPlan.shared=true;
        plan = await Planning.findByIdAndUpdate(req.params.id, { $set: newPlan }, { new: true });
        res.json({ plan });
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occured");
    }
})


// ROUTE 8
// api to fetch shared plan by others
router.get('/fetchallsharedplan', fetchuser, async (req, res) => {
    try {
        const plans = await Planning.find({shared:true});
        res.json(plans);
    } catch (error) {
        console.log(error);
        res.status(500).send("Some error occured");
    }
})


module.exports = router