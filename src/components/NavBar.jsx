import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <div className="navBar">
      <NavLink to={"/"}>Home</NavLink>
      <NavLink to={"/cat-fact"}>Cat fact</NavLink>
      <NavLink to={"/get-your-age"}>Get your age</NavLink>
    </div>
  );
}

export default NavBar;
