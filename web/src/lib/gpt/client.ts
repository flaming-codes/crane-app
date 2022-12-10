import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ apiKey: process.env.VITE_OPENAI_API_KEY });
export const client = new OpenAIApi(configuration);

/*
const response = await openai.createCompletion({
  model: 'text-davinci-003',
  prompt:
    "Define the most relevant category tags for the following text:\n\n\"Read, manipulate and write voxel spaces. Voxel spaces are read from text-based output files of the 'AMAPVox' software. 'AMAPVox' is a LiDAR point cloud voxelisation software that aims at estimating leaf area through several theoretical/numerical approaches. See more in the article Vincent et al. (2017) <doi:10.23708/1AJNMP> and the technical note Vincent et al. (2021) <doi:10.23708/1AJNMP>.\"\n\n- Voxel Spaces\n- LiDAR Point Cloud\n- Leaf Area Estimation\n- Vincent et al. (2017)\n- Vincent et al. (2021)\n\nWrite an API-call for Node.js to send the previous request.\n\nconst request = require('request');\n\nrequest.post({\n    headers: {'content-type' : 'application/x-www-form-urlencoded'},\n    url:     'https://example.com/api',\n    body:    \"Read, manipulate and write voxel spaces. Voxel spaces are read from text-based output files of the 'AMAPVox' software. 'AMAPVox' is a LiDAR point cloud voxelisation software that aims at estimating leaf area through several theoretical/numerical approaches. See more in the article Vincent et al. (2017) <doi:10.23708/1AJNMP> and the technical note Vincent et al. (2021) <doi:10.23708/1AJNMP>.\"\n}, function(error, response, body){\n    console.log(body);\n});",
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0
});
*/
