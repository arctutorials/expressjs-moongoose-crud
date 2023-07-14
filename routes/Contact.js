// Crud APIs
const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// /api/contact
router.post("/contact", async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save()
        .then((savedContact) => {
            console.log(savedContact);
            res.status(201).json({msg: "Contact successfully saved"});
        })
        .catch((error) => {
            console.log(error);

            if(error.code === 11000 && error.keyPattern && error.keyPattern.emailAddress) {
                res.status(500).json({msg: "Email address already in use"});
            }
            else {
                res.status(500).json({msg: "Unable to create new contact"});
            }
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({msg: "Unable to save new contact"});
    }
})


// READ Functionality - Read All Contacts
router.get('/contact', async (req, res) => {
    try {
        Contact.find()
        .then((contacts) => {
            console.log(contacts);
            res.status(200).json({contacts: contacts});
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({msg: "Unable to get contacts"});
        })
    } catch(error){
        console.log(error);
        res.status(500).json({msg: "Unable to get contacts"});
    }
});

// Read Functionality - Read Single Contact
// api/contact/534534
router.get('/contact/:id', async (req, res) => {
    try {
        const id = req.params.id;
        Contact.findById(id)
        .then((contact) => {
            console.log(contact);
            res.status(200).json({contact: contact});
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({msg: "Unable to find the contact"});
        })
    } catch(error){
        console.log(error);
        res.status(500).json({msg: "Unable to find the contact"});
    }
})

// Search Functionality - Search Contacts 

router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm;

        const searchRegex = new RegExp(searchTerm, "i");

        await Contact.find({
            $or: [
                { firstName: searchRegex},
                { lastName: searchRegex},
                { emailAddress: searchRegex}
            ]
        })
        .then((contacts) => {
            if(contacts.length){
                res.status(200).json({contacts: contacts});
            } else {
                res.status(200).json({contacts: [], msg: "No matching records found"});
            }
            
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({msg: "Unable to find contacts"});
        })
    } catch(error){
        console.log(error);
        res.status(500).json({msg: "No matching records found"});
    }
})

// Update Functionality 
router.put('/contact/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const updatedContact = req.body;
        await Contact.findOneAndUpdate({_id: id}, updatedContact, {new: true})
        .then((updatedContact) => {
            console.log(updatedContact);
            res.status(200).json({msg: "Contact successfully updated", contact: updatedContact});
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({msg: "Unable to update the contact"});
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({msg: "Unable to update the contact"});
    }
});

// Tyoes of deletes 
// 1. Soft Delete -> update the field "active" -> Y/N
// 2. Hard Delete -> deletion of the record/document 

router.delete('/contact/:id', async (req, res) => { 
    try {
        const id = req.params.id;
        await Contact.findByIdAndDelete(id)
        .then((deletedContact) => {
            console.log(deletedContact);
            res.status(200).json({msg: "Contact Successfully deleted", contact: deletedContact});
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({msg: "Unable to delete the contact"});
        })
    } catch(error){
        console.log(error);
        res.status(500).json({msg: "Unable to delete the contact"});
    }
});

module.exports = router;