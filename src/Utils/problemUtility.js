
const axios = require('axios');
const getLanguageById =(lang)=>{

    const language={
        "c++":54,
        "java":62,
        "javascript":63
    }

    return language[lang.toLowerCase()];//
    //[]->is used  Because  key is dynamic, not fixed

}
const submitBatch = async (submissions)=>{


const options = {
  method: 'POST',
  url: 'https://ce.judge0.com/submissions/batch',
  headers: {
   'Content-Type': 'application/json'
},

  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	}
  catch (error) {
  console.log("Judge GET error:", error.response?.data);
  throw error;
}
}

return await fetchData();
}



const waiting = async(timer)=>{
  setTimeout(()=>{
  return 1;
  },timer);
}

const submitToken = async (resultToken) => {
  try {
    const response = await axios.get(
      "https://ce.judge0.com/submissions/batch",
      {
        params: {
          tokens: resultToken.join(","),
          base64_encoded: true
        }
      }
    );

    return response.data.submissions;

  } catch (error) {
    console.log("Error: "+ error);
    throw error;
  }
};

module.exports= {getLanguageById,submitBatch, submitToken};




