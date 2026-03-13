const {getLanguageById, submitBatch, submitToken} = require("../Utils/problemUtility");
const Problem = require("../model/problem");



const createProblem=async(req,res)=>{
    const{title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body

    try{

      if(!Array.isArray(visibleTestCases)){
        return res.status(400).send("visibleTestCases must be an Array");
      }

      if(!Array.isArray(referenceSolution)){
        return res.status(400).send("referenceSolution must be an Array");
      }
      for(const {language,completeCode} of referenceSolution){

    const languageId=getLanguageById(language);
      // Creating Batch submission
    const submissions = visibleTestCases.map((testcase)=>({
        source_code: completeCode,
        language_id:languageId,
        stdin:testcase.input,
        expected_output: testcase.output
    }));

    
    const submitResult = await submitBatch(submissions);

    console.log(submitResult);

    if(!Array.isArray(submitResult)){
      return res.status(500).send("submitBatch returned an Invalid Response");
    }

    console.log("submitResult:", submitResult);

    const resultToken = submitResult.map((value)=>value.token);

    const testResult= await submitToken(resultToken);

    for(const test of testResult){
      if(test.status.id!==3){
      return   res.status(400).send("Error Occured during test execution");
      }
    }
        
      }


      //We can store in our db

  const userProblem = await Problem.create({
    ...req.body,
    problemCreator: req.result._id
   });

   res.status(201).send("Problem Saved Successfully");
}
catch(err){
   res.status(400).send("Error: "+err);
}
}

const updateProblem=async(req,res)=>{
  const {id}=req.params;

  const{title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body;

  try{

    if(!id)
      res.status(400).send("Missing ID Field");

    const DsaProblem= await Problem.findById(id);
    if(!DsaProblem)
      return res.status(400).send("ID is not present in server");

    for(const {language,completeCode} of referenceSolution){

    const languageId=getLanguageById(language);
      // Creating Batch submission
    const submissions = visibleTestCases.map((testcase)=>({
        source_code: completeCode,
        language_id:languageId,
        stdin:testcase.input,
        expected_output: testcase.output
    }));

    
    const submitResult = await submitBatch(submissions);

    console.log(submitResult);

    if(!Array.isArray(submitResult)){
      return res.status(500).send("submitBatch returned an Invalid Response");
    }

    console.log("submitResult:", submitResult);

    const resultToken = submitResult.map((value)=>value.token);

    const testResult= await submitToken(resultToken);

    for(const test of testResult){
      if(test.status.id!==3){
      return   res.status(400).send("Error Occured during test execution");
      }
    }
        
      }

    const newProblem = await   Problem.findByIdAndUpdate(id, {...req.body}, {runValidators:true, new:true});
    res.status(200).send(newProblem);
  }
  catch(err){
        res.status(500).send("Error "+err) ;  
      }
}

const deleteProblem=async(req,res)=>{

  const {id} = req.params;

  try{

    if(!id)
      return res.status(400).send("ID is Missing");

    const deletedProblem = await Problem.findByIdAndDelete(id);

    if(!deletedProblem)
      return res.status(404).send("Problem is Missing");

    res.status(200).send("Successfully Deleted");
  }
  catch(err){
     res.status(500).send("Error "+err);
  }
}

const  getProblemById=async(req,res)=>{

  const {id} = req.params;

  try{

    if(!id)
      return res.status(400).send("ID is Missing");

   const getProblem = await Problem.findById(id).select(' _id title description difficulty tags visibleTestCases startCode referenceSolution  ');

    if(!getProblem)
      return res.status(404).send("Problem is Missing");

    res.status(200).send(getProblem);
  }
  catch(err){
     res.status(500).send("Error "+err);
  }
  
}

const  getAllProblem=async(req,res)=>{
  


  try{

    
   const getProblem = await Problem.find({}).select('_id title difficulty tags');

    if(getProblem.length==0)
      return res.status(404).send("Problem is Missing");

    res.status(200).send(getProblem);
  }
  catch(err){
     res.status(500).send("Error "+err);
  }
  
}


const solvedAllProblembyUser=async(req,res)=>{
    try{
       const userId = req.result._id;
       const user = await User.findById(userId).populate({
        path:"problemSolved",
        select:"_id title difficulty tags"
       }); 
       res.status(200).send(user.problemSolved);
    }
    catch(err){
      res.status(500).send("Server Error");
    }
}

const submittedProblem = async(req,res)=>{
  try{
    const userId = req.user._id;
    const problmeId = req.params.pid;

    const ans = await Submission.find({userId, problemId});
    if(ans.length==0)
      res.status(200).send("No Submission is present");

    res.status(200).send(ans);
  }
  catch(err){
    res.status(500).send("Internal Server Error");
  }
}


module.exports = {createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, solvedAllProblembyUser,submittedProblem};
