import h from "./create-element.js";

let state = {};

function setState(newState) {
  Object.assign(state, newState);
  render();
}

function Page() {
  return h("div", { className: "page-layout" }, Header(), DogsList());
}

function Header() {
  return h("header", {}, h("span", { className: "logo" }, "🐶"), LoginForm());
}

const API = "https://dogs-rest.herokuapp.com/v1/";

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

// fetch the dogs array from the API server
// then update the state object so the render() function re-runs
// DogsList will now have access to dogs and will show them
fetch(API + "dogs")
  .then((res) => res.json())
  .then((dogs) => setState({ dogs }));

function DogsList() {
  let dogItems = [];
  if (!state.dogs) {
    // when we first render there are no dogs
    dogItems.push(h("li", {}, "No dogs found"));
  } else {
    // once the fetch has run there will be dogs
    for (let dog of state.dogs) {
      const dogItem = h(
        "li",
        {},
        h("h3", {}, dog.name)
        // h("img", { src: dog.image, alt: "", width: 300, height: 300 })
      );
      dogItems.push(dogItem);
    }
  }
  return h("ul", {}, ...dogItems);
}

const app = document.querySelector("#app");

function render() {
  app.innerHTML = "";
  app.append(Page());
}

render();
