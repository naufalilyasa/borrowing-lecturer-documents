import axios from "axios";
require("dotenv").config();

const getServerApiUrl = () => {
  return "/api";
};

const callFetchAsync = async (url, method, body /*headers = {}*/) => {
  // console.log("Base api URL: ", process.env.BASE_API_URL);
  // try {
  //   const options = {
  //     headers: new Headers({
  //       "Content-Type": "application/json",
  //       ...headers,
  //     }),
  //     body,
  //   };

  //   if (body) {
  //     options.body = JSON.stringify(body);
  //   }
  //   console.log("body: ", body);

  //   const response = await fetch(`${getServerApiUrl()}${url}`, {
  //     method,
  //     // credentials: "same-origin",
  //     ...options,
  //   });

  //   return await response.json();
  // } catch (err) {
  //   return {
  //     success: false,
  //     data: err,
  //   };
  // }
  try {
    const response = await axios({
      proxy: {
        host: "localhost",
        port: 5000,
      },
      baseURL: `${getServerApiUrl()}`,
      url: `${url}`,
      method: method,
      withCredentials: false,
      headers: { "Content-type": "application/json" },
      responseType: "json",
      data: JSON.stringify(body),
    });
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

const postAsync = (url, body) => {
  return callFetchAsync(url, "POST", body);
};

export { postAsync };
