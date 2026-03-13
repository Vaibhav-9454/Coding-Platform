const express =require('express');
const problemRouter = express.Router();
//const express=require('../middleware/adminMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {createProblem,updateProblem, deleteProblem, getProblemById, getAllProblem, solvedAllProblembyUser, submittedProblem} = require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");


//REQUIRED ADMIN ACCESS
problemRouter.post("/create",adminMiddleware, createProblem);
problemRouter.put("/update/:id",adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware, deleteProblem);

problemRouter.get("/problemById/:id",userMiddleware,  getProblemById);
problemRouter.get("/getAllProblem",userMiddleware, getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware, solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:pid", userMiddleware,submittedProblem);

module.exports = problemRouter;







// JSON GIVEN DATA TO SAVE OR CREATE THE PROBLEM

// {
//   "title": "Two Sum",
//   "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
//   "difficulty": "easy",
//   "tags": "array",

//   "visibleTestCases": [
//     {
//       "input": "nums = [2,7,11,15], target = 9",
//       "output": "[0,1]",
//       "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]"
//     },
//     {
//       "input": "nums = [3,2,4], target = 6",
//       "output": "[1,2]",
//       "explanation": "Because nums[1] + nums[2] == 6"
//     }
//   ],

//   "hiddenTestCases": [
//     {
//       "input": "nums = [3,3], target = 6",
//       "output": "[0,1]"
//     },
//     {
//       "input": "nums = [1,5,3,7], target = 8",
//       "output": "[0,3]"
//     }
//   ],

//   "startCode": [
//     {
//       "language": "javascript",
//       "initialCode": "function twoSum(nums, target) {\n  // Write your code here\n}"
//     },
//     {
//       "language": "java",
//       "initialCode": "class Solution {\n  public int[] twoSum(int[] nums, int target) {\n      // Write your code here\n  }\n}"
//     },
//     {
//       "language": "c++",
//       "initialCode": "#include <vector>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n  // Write your code here\n}"
//     }
//   ],

//   "problemCreator": "PUT_VALID_USER_OBJECT_ID_HERE",

//   "referenceSolution": {
//     "language": "javascript",
//     "completeCode": "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n}"
//   }
// }
