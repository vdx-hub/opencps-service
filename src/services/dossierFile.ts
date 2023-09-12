import axios from "axios";

export async function sinhGiayPhepPdf({ token, templateCid, templateData, responseFileName }) {
  await axios({
    method: 'POST',
    url: `http://core-ext:3000/docxtemplate/generatePdf`,
    headers: {
      'Content-Type': 'application/json',
      'token': token,
      'responseType': 'arraybuffer'
    },
    timeout: 60000,
    data: {
      "keepTemp": true,
      "templateCid": templateCid,
      "templateData": templateData,
      "responseFileName": responseFileName
    }
  }).then(res => {
    return res.data
  }).catch(function (error) {
    let responeBX = {
      'error': 500,
      msg: 'No response'
    }
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('err', error.response);
      return error.response.data || responeBX;
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }
    return {
      status: 500,
      message: 'Undefined Internal server error'
    }
  });
}