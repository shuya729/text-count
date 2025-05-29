import "./index.css";
import "./global.d.ts";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./screens/Layout";
import { Home } from "./screens/Home";
import { About } from "./screens/About";
import { Term } from "./screens/Term";
import { Contact } from "./screens/Contact";
import { Notfound } from "./screens/Notfound";
import { Privacy } from "./screens/Privacy";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/term" element={<Term />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/*" element={<Notfound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
