import React from 'react'
import './Home.css'
import { RiProductHuntLine } from "react-icons/ri";
import {Link} from 'react-router-dom'
import heroImg from '../../assets/inv-img.png'

const Home = () => {
  return (
    <div className="home">
      <nav className="container --flex-between">
        <div className="logo">
          <RiProductHuntLine size={35} />
        </div>
        {/* <ul className="homelinks">
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <button className="--btn --btn-primary"></button>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <button className="--btn --btn-primary"></button>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul> */}
        <ul className="home-links">
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <button className="--btn --btn-primary">
              <Link to="/login" className="link-button">
                Login
              </Link>
            </button>
          </li>
          <li>
            <button className="--btn --btn-primary">
              <Link to="/dashboard" className="link-button">
                Dashboard
              </Link>
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero */}

      <section className=" container hero">
        <div className="hero-text">
          {/* <h2>Inventory {"&"} stock Management Solution</h2> */}
          <h2>ROBOTIC LAB INVENTORY MANAGEMENT SYSTEM</h2>
          
          <p>
            Reference site about Lorem Ipsum, giving information on its origins,
            as well as a random Lipsum generator.
          </p>
          <div className="hero-buttons">
            <button className="--btn --btn-secondary">
              <Link to="/dashboard" className="link-button">
                Free Trial 1 Month
              </Link>
            </button>
          </div>
          <div className="--flex-start">
            <NumberText num="14k" text="Brand Owners" />
            <NumberText num="23k" text="Active Users" />
            <NumberText num="500+" text="Partners" />
          </div>
        </div>

        <div className="hero-image">
          <img src={heroImg} alt="Inventory" />
        </div>
      </section>
    </div>
  );
}

const NumberText =({num, text}) => {
    return (
      <div className="--mr">
        <h3 className="--color-white">{num}</h3>
        <p className="--color-white">{text}</p>
      </div>
    );
}

export default Home
