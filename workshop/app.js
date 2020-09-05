import h from "./create-element.js";

function Page() {
  return h("div", { className: "page-layout" }, Header(), DogsList());
}

function Header() {
  return h("header", {}, h("span", { className: "logo" }, "🐶"), LoginForm());
}

function LoginForm() {
  return h(
    "form",
    {},
    h("input", {
      type: "email",
      name: "email",
      placeholder: "Email",
      "aria-label": "Email",
    }),
    h("input", {
      type: "password",
      name: "password",
      placeholder: "Password",
      "aria-label": "Password",
    }),
    h("button", {}, "Log in")
  );
}

function DogsList() {
  return h("ul", {}, h("li", {}, "No dogs found"));
}

const app = document.querySelector("#app");

function render() {
  app.innerHTML = "";
  app.append(Page());
}

render();
