export function login(email, password) {
  // POST https://dogs-rest.herokuapp.com/v1/users/login/
  return fetch("https://dogs-rest.herokuapp.com/v1/users/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "content-type": "application/json" },
  }).then((res) => {
    if (!res.ok) {
      const error = new Error("HTTP error");
      error.status = res.status;
      throw error;
    } else {
      return res.json();
    }
  });
}

export function getUser(token) {
  // POST https://dogs-rest.herokuapp.com/v1/users/me/
  return fetch("https://dogs-rest.herokuapp.com/v1/users/me/", {
    headers: { authorization: `Bearer ${token}` },
  }).then((res) => {
    if (!res.ok) {
      const error = new Error("HTTP error");
      error.status = res.status;
      throw error;
    } else {
      return res.json();
    }
  });
}
