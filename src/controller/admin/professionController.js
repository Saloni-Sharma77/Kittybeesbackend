const profession = require('../../schema/professionSchema')

//create  new profession 
exports.createProfession = async(req,res)=>{
    try {
        const {name} = req.body
        const exists = await profession.findOne({name})
        if(exists){
            return res.status(400).json({ message: "profession already exists" });
        }
        const newProfession = new profession({name})
        await newProfession.save()
        res.status(201).json({ message: "Profesion created successfully", newProfession });

    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}

//get all profession

exports.getAllProfessions = async(req,res)=>{
    try {
        const result = await profession.find()
        if(result){
            res.status(200).json({res:result})
        }
        else{
            res.status(200).json({msg:'no user found'})
        }
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}

//get Profession by id 
exports.getProfessionById = async (req, res) => {
  try {
    const professionName = await profession.findById(req.params.id);
    if (!professionName) return res.status(404).json({ message: "profession not found" });
    res.status(200).json({ message: "profession fetched successfully", professionName });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


//update profession by id 
exports.updateProfession = async(req,res)=>{
    try {
       const professionName = await profession.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
       if (!professionName) return res.status(404).json({ message: "Profession not found" });
       res.status(200).json({ message: "Profession updated successfully", professionName });
     } catch (err) {
       res.status(500).json({ message: "Internal server error", error: err.message });
     }
}

// delete profession by id 
exports.deleteProfession = async (req, res) => {
  try {
    const professionName = await profession.findByIdAndDelete(req.params.id);
    if (!professionName) return res.status(404).json({ message: "profession not found" });
    res.status(200).json({ message: "profession deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
