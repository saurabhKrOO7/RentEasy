import React, { useState } from "react";
import "./Home.css";
import { IoDiamondOutline, IoSearchOutline } from "react-icons/io5";
import { TfiLocationPin } from "react-icons/tfi";
import FeaturedItems from "../components/FeaturedItems";
import ListAndDiscover from "../components/ListAndDiscover";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleSearchItem = async () => {
    if (!searchItem && !searchLocation) return;
    navigate(`/allproducts?search=${searchItem}&location=${searchLocation}`);
  };
  const handleCategory = (category) => {
    if (!category) return;
    navigate(`/allproducts?category=${category}`);
  };
  return (
    <div className="unique-homepage">
      {/* Hero Section */}
      <div className="unique-hero-section">
        <div className="unique-hero-content">
          <div className="unique-hero-text">
            <h1 className="unique-title">Rent Anything</h1>
            <h1 className="unique-title">From Anyone</h1>
            <p className="unique-subtitle">
              Access thousands of items, safely and
            </p>
            <p className="unique-subtitle">for sustainable living</p>
          </div>
          <div></div>
        </div>

        {/* Search Bar */}
        <div className="unique-search-bar">
          <div className="unique-search-bar-container">
            <IoDiamondOutline className="landing-icon" />
            <input
              type="text"
              className="unique-search-input"
              placeholder="Search Item"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />
          </div>
          <div className="unique-search-divider"></div>
          <div className="unique-search-bar-container">
            <TfiLocationPin className="landing-icon" />
            <input
              type="text"
              className="unique-location-input"
              placeholder="Enter Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
          <div className="unique-search-button">
            <button className="unique-search-button" onClick={handleSearchItem}>
              <IoSearchOutline />
            </button>
          </div>
        </div>
      </div>
      <div className="show-container">
        <div className="show-card">
          <div className="show-icon">
            <img src="../images/hero1.png" alt="hero1" />
          </div>
          <h3>Access More</h3>
          <p>Pursue passions. Get things done</p>
        </div>
        <div className="show-card">
          <div className="show-icon">
            <img src="../images/hero2.png" alt="hero2" />
          </div>
          <h3>Help The Planet</h3>
          <p>Live lighter. Reduce waste</p>
        </div>
        <div className="show-card">
          <div className="show-icon">
            <img src="../images/hero3.png" alt="hero2" />
          </div>
          <h3>Save Money</h3>
          <p>Buy less. Rent for a fraction of cost</p>
        </div>
      </div>

      {/* feature container */}
      <h1>Feature Categories</h1>
      <div className="feature-grid-container">
        <div
          className="feature-grid-item film"
          onClick={() => handleCategory("Travel")}
        >
          <h2 className="feature-title">Film & Photography</h2>
          <div className="feature-overlay">
            <p>
              Capture life moments with our high-quality cameras and accessories
            </p>
          </div>
        </div>
        <div
          className="feature-grid-item electronics"
          onClick={() => handleCategory("Electronics")}
        >
          <h2 className="feature-title">Electronics</h2>
          <div className="feature-overlay">
            <p>Laptop, Regrigerator, Sewing Machines and much more</p>
          </div>
        </div>
        <div
          className="feature-grid-item houses"
          onClick={() => handleCategory("Furnitures")}
        >
          <h2 className="feature-title">Furnitures</h2>
          <div className="feature-overlay">
            <p>Get the best quality furniture at affordable prices</p>
          </div>
        </div>
        <div
          className="feature-grid-item vehicles"
          onClick={() => handleCategory("Vehicles")}
        >
          <h2 className="feature-title">Vehicles</h2>
          <div className="feature-overlay">
            <p>Car, Bike, Scooter, and much more</p>
          </div>
        </div>
        <div
          className="feature-grid-item clothes"
          onClick={() => handleCategory("Event Equipment")}
        >
          <h2 className="feature-title">Events</h2>
          <div className="feature-overlay">
            <p>Get the best deals on events and tickets</p>
          </div>
        </div>
      </div>
      <FeaturedItems />
      <div className="about-container">
        <div className="about-images">
          <img
            src="https://res.cloudinary.com/dnc91rlep/image/upload/v1753991950/about_rvpjrv.png"
            alt="Person with laptop"
            className="img1"
          />
        </div>
        <div className="about-text">
          <h1>About RentEase</h1>
          <h3>Convenient access to any item</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore dolore magna aliqua. Ut enim ad
            minim veniam.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident.
          </p>
        </div>
      </div>
      <ListAndDiscover />
    </div>
  );
};

export default Home;
