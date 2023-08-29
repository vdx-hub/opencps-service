import axios from 'axios';
import qs from 'qs'
const OPENCPS_ENDPOINT = "http://kiemthu.mt.gov.vn:9001/o/rest/v2"

async function callOpencps({ token, method, url, headers, data }) {
  const reqheaders = {
    'Authorization': `Bearer ${token}`,
    'groupid': '53152',
    ...headers
  }
  const reqUrl = `${OPENCPS_ENDPOINT}${url}`

  return await axios({
    method,
    url: reqUrl,
    headers: reqheaders,
    timeout: 60000,
    data
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
      return error.response.data || responeBX;
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error('reqUrl:', reqUrl);
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('reqUrl:', reqUrl);
      console.error('Error', error.message);
    }
    return {
      status: 500,
      message: 'Undefined Internal server error'
    }
  });
}

export async function doAction({ token, actionCode, payment, assignUsers, actionNote, dossierId }) {
  let data = qs.stringify({
    actionCode,
    payment,
    assignUsers,
    actionNote
  });
  const config = {
    token,
    method: "POST",
    headers: {
      'groupId': '53152',
      'content-type': 'application/x-www-form-urlencoded'
    },
    url: `/dossiers/${dossierId}/actions`,
    data: data
  }

  return await callOpencps(config).then(res => {
    if (res?.data) {
      return res.data
    }
    else {
      return res
    }
  }).catch(function (error) {
    let responeBX = {
      'error': 500,
      msg: 'No response'
    }
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return error.response.data || responeBX;
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log('doAction', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('doAction Error', error.message);
    }
    return {
      status: 500,
      message: 'Undefined Internal server error'
    }
  });
}