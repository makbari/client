import "./styles/index.scss";
const app: HTMLElement | null = document.getElementById("app");
if (app) {
  app.innerHTML = `<h1>Hello Typescript from ${
    __DEV__ ? "development" : "production"
  }</h1>`;
}
console.log("environment is in development: ", __DEV__);
