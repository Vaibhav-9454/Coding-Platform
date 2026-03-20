const Problem = require("../model/problem");
const Submission = require("../model/Submission");

const {getLanguageById, submitBatch, submitToken} = require("../Utils/problemUtility");


const submitCode = async(req,res)=>{
   try{
        const userId = req.user._id;
        const problemId = req.params.id;

        let {code, language}=req.body;

        if(!userId||!code||!problemId||!language)
            return res.status(400).send("Some field missing");
         
        if(language==='cpp')
            language='c++'

        // FETCH THE PROBLEM FROM DATABASE
        const problem = await  Problem.findById(problemId);
         // testcases(Hidden)

        //FIRST WE STOE THE CODE IN THE DATABASE SO THAT WHENEVER JUDGE0 CRACHESE THEN WE HAVE THE CODE
       const  submittedResult = await  Submission.create({
           userId,
           problemId,
           code,
           language,
           status:'pending',
           testCasesTotal:problem.hiddenTestCases.length
        })

        //Now code is submitted to judge0

        const languageId = getLanguageById(language);
        const submissions =problem.hiddenTestCases.map((testcase)=>({
        source_code: code,
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

            //updated submitResult
           let testCasesPassed = 0;
           let runtime = 0;
           let memory = 0;
           let status = 'accepted';
           let errorMessage=null;

            for(const test of testResult){
                if(test.status.id==3){
                    testCasesPassed++;
                    runtime = runtime+parseFloat(test.time);
                    memory = Math.max(memory, test.memory);
                }

                else{
                      if(test.status.id==4){
                        status = 'error'
                        errorMessage = test.stderr;
                      }
                     else
                        status = 'wrong'
                    errorMessage = test.stderr;
                }
            }

          //  store the result in db in submission
          submittedResult.status = status;
          submittedResult.testCasesPassed = testCasesPassed;
          submittedResult.errorMessage = errorMessage;
          submittedResult.runtime = runtime;
          submittedResult.memory = memory;


          await submittedResult.save();
          res.status(201).send(submittedResult);
          //Problem ko insert karenge userSchema ke problemSolved mein if it is not present there.

          if(!req.user.problemSolved.includes(problemId)){
               req.user.problemSolved.push(problemId);
               await req.user.save();
          }
          const accepted =(status == 'accepted')
          res.status(201).json({
            accepted,
            totalTestCases: submittedResult.testCasesTotal,
            passedTestCases: testCasesPassed,
            runtime,
            memory
          });
   }
   catch(err){
          res.status(500).send("Internal server Error:"+ err);
   }
}

const runCode = async(req,res)=>{
    try{
        const userId = req.user._id;
        const problemId = req.params.id;

        const {code, language}=req.body;

        if(!userId||!code||!problemId||!language)
            return res.status(400).send("Some field missing");

        // FETCH THE PROBLEM FROM DATABASE
        const problem = await  Problem.findById(problemId);
         // testcases(Hidden)

        //FIRST WE STOE THE CODE IN THE DATABASE SO THAT WHENEVER JUDGE0 CRACHESE THEN WE HAVE THE CODE
       

        //Now code is submitted to judge0

        const languageId = getLanguageById(language);
        const submissions = problem.visibleTestCases.map((testcase)=>({
        source_code: code,
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
            let testCasesPassed = 0;
            let runtime = 0;
            let memory =0;
            let status = true;
            let errorMessage = null;
            for(const test of testResult){
                if(test.status_id==3){
                    testCasesPassed++;
                    runtime = runtime+parseFloat(test.time)
                    memory = Math.max(memory, test.memory);

                }else{
                    if(test.status_id==4){
                        status=false
                        errorMessage=test.stderr
                    }
                    else{
                        status = false
                        errorMessage = test.stderr
                    }
                }
            }

   res.status(201).json({
            accepted,
            totalTestCases: submitResult.testCasesTotal,
            passedTestCases: testCasesPassed,
            runtime,
            memory
          });
   }
   catch(err){
          res.status(500).send("Internal server Error:"+ err);
   }
}
module.exports = {submitCode, runCode};