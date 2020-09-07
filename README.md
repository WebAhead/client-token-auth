# Client token authentication

Learn how to authenticate with an API, keep users logged in, and make authenticated requests using client-side JavaScript.

## Why APIs use token-based authentication

You may have used cookies to authenticate a user in the past. These are little bits of data that web browsers store and automatically send along with any request to the server. This means a server can set a cookie then expect to receive it on all future requests from that user.

However cookies are a web thing. If you're building a more general purpose API server (e.g. one that might serve both a web app and a native mobile app) you don't want to be limited to web technologies.

Token-based auth works anywhere. The server provides a token when a user logs in, and the client must manually send this token along with every request that needs to be authenticated. The presence of a valid token proves that the request was made on behalf of that user.

## Workshop setup

1. Clone this repo
1. `npm install`
1. `npm run dev`

Open http://localhost:8080 in your browser and you should see a form for logging in with an email and password. Open `workshop/app.js` and you can see the JavaScript that renders this form.

## Part 1: logging in

To log in we must send a `POST` request containing the user's email and password to our API server's login endpoint. The URL is `https://dogs-rest.herokuapp.com/v1/users/login/`.

Our API request functions live in `workshop/api.js`a different file to keep the code organised, so you'll need to look in there.

### Challenge 1

1. Edit the `login` function in `api.js` to:
   - submit the user details
   - remember to tell the server the content-type you're sending is JSON
   - log the JSON response to the console
1. Import this function in `app.js`
1. Use it in the form's submit handler

You can test this using `oli@o.com` as the email and `123` as the password. Fill out the form, submit it and you should see a user object logged in the console.

```json
{
  "access_token": "eyJhbG...",
  "id": 4,
  "name": "oli",
  "email": "oli@o.com"
}
```

<details>
<summary>Solution</summary>

```js
// api.js
export function login(email, password) {
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
```

```js
// app.js
onsubmit: (event) => {
  event.preventDefault();
  // get the submitted email/pw values
  const email = event.target.elements.email.value;
  const password = event.target.elements.password.value;
  login(email, password).then((user) => {
    console.log(user);
  });
};
```

</details>

## Part 2: persisting log in

Browser's store and send cookies automatically, since they're a built-in web feature. Our token is just a random string in a response body, which means we need to do some work to keep it around for future requests.

The easiest way to persist information across page loads is [`window.localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). You can use `window.localStorage.setItem` to store a string for later use.

### Challenge 2

1. Store the `access_token` property from the user response
1. Update the page to remove the login form and tell the user they're logged in
   - Hint: [`element.replaceWith()`](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith) might make this easier

<details>
<summary>Solution</summary>

```js
onsubmit: (event) => {
  event.preventDefault();
  const email = event.target.elements.email.value;
  const password = event.target.elements.password.value;
  login(email, password).then((user) => {
    // save the access token in localStorage so the user stays logged in
    window.localStorage.setItem("dogs-token", user.access_token);

    const messageEl = h("span", {}, `Hello ${user.name}`);
    welcomeEl.innerHTML = ""; // get rid of old children
    welcomeEl.append(messageEl);
    loginFormEl.replaceWith(welcomeEl); // swap out form for message & logout
  });
};
```

</details>

Now when you submit the login form you should see "Hello oli" appear on the page. If you check your dev tools localStorage (in Chrome this is in the "Application" tab) you should see your token stored there.

## Part 3: fetching user details

We now log in, and we're even persisting the token. If you refresh the page you should see the token is still there in localStorage in your dev tools.

Unfortunately we still just see the login form, since we only fetch the user details when the user actively logs in. However the whole point of storing the token was so the user _doesn't_ have to log in every time.

We need to check if there's a token, then fetch the user details from the API using it. The API has a `GET /users/me` endpoint for retrieving the logged in user. We need to send the token in our request's `authorization` header (with "Bearer" appended). The HTTP request should look like this:

```
GET https://dogs-rest.herokuapp.com/v1/users/me/

content-type: application/json
authorization: Bearer eyJHGB...
```

Once we have the user we can update the page to show the "logged in" welcome message again.

### Challenge 3

1. Edit the `getUser` function in `api.js`
   - it should take the `token` as an argument
   - then fetch the logged in user from `/users/me`
   - with the token in the authorization header of the request
1. When the page loads get the token from localStorage
1. If there is a token use `getUser` to fetch the user details
1. When you receive the user response update the page with the welcome message (just like after logging in)

<details>
<summary>Solution</summary>

```js
export function getUser(token) {
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
```

```js
const token = window.localStorage.getItem("dogs-token");
if (token) {
  getUser(token).then((user) => {
    const messageEl = h("span", {}, `Hello ${user.name}`);
    welcomeEl.innerHTML = "";
    welcomeEl.append(messageEl);
    loginFormEl.replaceWith(welcomeEl);
  });
}
```

</details>

Now when you refresh the page (and have previously logged in) it should fetch your user details with the persisted token and swap the form for the welcome message automatically.

## Part 4: logging out

Authenticating with tokens is _stateless_. This means we don't store anything about who is logged in or where in our database. All our server knows is whether the token is receives is valid and has not expired.

So there's no way to stop a token being valid once it's been issued. The _server_ can't log people out—all we can do is remove the token on the client so the UI forces the user to type their password in again.

### Challenge 4

1. Add a click handler to the `LogoutButton` at the bottom of the file
1. It should remove the token from localStorage and show the login form again
1. Add this button to the welcome message

<details>
<summary>Solution</summary>

```js
// ...

if (token) {
  getUser(token).then((user) => {
    // ...
    welcomeEl.append(messageEl, logoutEl);
    // ...
  }
}

function LoginForm() {
  // ...
  onsubmit: (event) => {
    // ...
    welcomeEl.append(messageEl, logoutEl);
    // ...
  }
}

function LogoutButton() {
  return h(
    "button",
    {
      onclick: () => {
        window.localStorage.removeItem("dogs-token");
        welcomeEl.replaceWith(loginFormEl);
      },
    },
    "Log out"
  );
}

```

</details>

Now clicking the logout button should remove the token from localStorage and show the form again. If you refresh the page you should only see the form—you'll have to enter your password again to log in.
