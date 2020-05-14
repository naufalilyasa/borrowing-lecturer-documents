import dotenv from "dotenv";
dotenv.config();

const getServerApiUrl = () => {
  return "/api";
};

const callFetchAsync = async (url, method, body, headers = {}) => {
  try {
    const options = {
      headers: new Headers({
        "Content-Type": "application/json",
        ...headers,
      }),
      body,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(
      `http://localhost:5000${getServerApiUrl()}${url}`,
      {
        method,
        credentials: "same-origin",
        ...options,
      }
    );

    return await response.json();
  } catch (err) {
    return {
      success: false,
      data: err,
    };
  }
};

const postAsync = (url, body) => {
  return callFetchAsync(url, "POST", body);
};

export { postAsync };
