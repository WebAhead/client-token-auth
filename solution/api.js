function request(url, options) {
  return fetch(url, options).then((response) => {
    if (!response.ok) {
      const error = new Error("HTTP Error");
      error.status = response.status;
      throw error;
    } else {
      return response.json();
    }
  });
}

export function login(loginData) {
  return request("https://dogs-rest.herokuapp.com/v1/users/login/", {
    method: "POST",
    body: JSON.stringify(loginData),
    headers: { "content-type": "application/json" },
  });
}

export function getUser(token) {
  return request("https://dogs-rest.herokuapp.com/v1/users/me/", {
    headers: { authorization: `Bearer ${token}` },
  });
}
