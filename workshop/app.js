import h from "./create-element.js";
import { login, getUser } from "./api.js";

// El is short for  Element: i.e. these variables refer to DOM nodes
const loginFormEl = LoginForm();
const welcomeEl = h("main", {});
const logoutEl = LogoutButton();

// render the initial UI to the page
const app = document.querySelector("#app");
app.append(loginFormEl);

// creates the form to log in:
// <form><input type="email"><input type="password"><button>Log in</button>
function LoginForm() {
  return h(
    "form",
    {
      id: "loginForm",
      onsubmit: (event) => {
        event.preventDefault();
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

// Creates the logout button
// <button>Log out</button>
function LogoutButton() {
  return h("button", {}, "Log out");
}
