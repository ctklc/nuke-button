export const apiURL = process.env.REACT_APP_API_URL;

const responseHandler = (response: Response) => {
  if (response.ok) {
    return response.json();
  }

  throw new Error(response.statusText);
};

export const getDelay = (url = apiURL as string, signal?: AbortSignal) =>
  fetch(url, { signal }).then(responseHandler);

export default { getDelay };
