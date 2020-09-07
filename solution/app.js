import h from "./create-element.js";
import { login, getUser } from "./api.js";

// El is short for  Element: i.e. these variables refer to DOM nodes
const loginFormEl = LoginForm();
const welcomeEl = h("main", {});
const logoutEl = LogoutButton();

// render the initial UI to the page
const app = document.querySelector("#app");
app.append(loginFormEl);

// if we have a stored token that means the user is logged in
// fetch that user from the server and show a welcome message
const token = window.localStorage.getItem("dogs-token");
if (token) {
  getUser(token).then((user) => {
    const messageEl = h("span", {}, `Hello ${user.name}`);
    welcomeEl.innerHTML = "";
    welcomeEl.append(messageEl, logoutEl);
    loginFormEl.replaceWith(welcomeEl);
  });
}

// creates the form to log in:
// <form><input type="email"><input type="password"><button>Log in</button>
function LoginForm() {
  return h(
    "form",
    {
      id: "loginForm",
      onsubmit: (event) => {
        event.preventDefault();
        const email = event.target.elements.email.value;
        const password = event.target.elements.password.value;
        login(email, password).then((user) => {
          // save the access token in localStorage so the user stays logged in
          window.localStorage.setItem("dogs-token", user.access_token);

          // show the welcome message instead of the form
          const messageEl = h("span", {}, `Hello ${user.name}`);
          welcomeEl.innerHTML = "";
          welcomeEl.append(messageEl, logoutEl);
          loginFormEl.replaceWith(welcomeEl);
        });
      },
    },
    h("label", { for: "email" }, "Email"),
    h("input", {
      id: "email",
      type: "email",
      name: "email",
      placeholder: "Email",
    }),
    h("label", { for: "password" }, "Password"),
    h("input", {
      id: "password",
      type: "password",
      name: "password",
      placeholder: "Password",
      "aria-label": "Password",
    }),
    h("button", {}, "Log in")
  );
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
