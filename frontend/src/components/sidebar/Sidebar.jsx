// import React from 'react'
// import './Sidebar.scss'

// const Sidebar = ({children}) => {
//   return (
//     <div className='layout'>
//     <div className='sidebar'>
//     <h2>Sidebar</h2>
//     </div>
//     <main>
//         {children}
//     </main>
//     </div>
//   )
// }

// export default Sidebar

import React, { useState } from "react";
import "./Sidebar.scss";
import { HiMenuAlt3 } from "react-icons/hi";
//import { RiProductHuntLine } from "react-icons/ri";
import { MdOutlineInventory } from "react-icons/md";
import menu from "../../data/SidebarData";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";


const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const navigate = useNavigate()

  const goHome = () => {
    navigate ('/')
  }

  return (
    <div className="layout">
      <div className="sidebar" style={{ width: isOpen ? "230px" : "60px" }}>
        <div className="top_section">
          <div className="logo" style={{ display: isOpen ? "block" : "none" }}>
            <MdOutlineInventory
              size={35}
              style={{ cursor: "pointer" }}
              onClick={goHome}
            />
          </div>

          <div
            className="bars"
            style={{ marginLeft: isOpen ? "100px" : "0px" }}
          >
            <HiMenuAlt3 onClick={toggle} />
          </div>
        </div>
        {menu.map((item, index) => {
          return <SidebarItem key={index} item={item} isOpen={isOpen} />;
        })}
      </div>

      <main
        style={{
          paddingLeft: isOpen ? "230px" : "60px",
          transition: "all .5s",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Sidebar;