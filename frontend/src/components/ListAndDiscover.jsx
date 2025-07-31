import React, { useState } from "react";
import "./ListAndDiscover.css";
import { IoDiamondOutline, IoSearchOutline } from "react-icons/io5";
import { TfiLocationPin } from "react-icons/tfi";
import { useNavigate } from "react-router";

const ListAndDiscover = () => {
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleSearchItem = async () => {
    if (!searchItem && !searchLocation) return;
    navigate(`/allproducts?search=${searchItem}&location=${searchLocation}`);
  };

  return (
    <div className="list-discover-container">
      {/* Left Section */}
      <div
        className="list-discover-section list-discover-left"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dnc91rlep/image/upload/v1753991936/listAndDiscover_wmq1jt.png')",
        }}
      >
        <div className="list-discover-overlay">
          <h2 className="list-discover-heading">List Your Assets</h2>
          <p className="list-discover-text">Earn money from your things</p>
          <button className="list-discover-btn">Start Earning</button>
        </div>
      </div>

      {/* Right Section */}
      <div
        className="list-discover-section list-discover-right"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dnc91rlep/image/upload/v1753991921/listAndDiscover2_drcp9m.png')",
        }}
      >
        <div className="list-discover-overlay">
          <h2 className="list-discover-heading">Discover Item</h2>
          <p className="list-discover-text">Get access to anything</p>
          <div className="abc-unique-search-bar">
            <div className="abc-unique-search-bar-container">
              <input
                type="text"
                className="abc-unique-search-input"
                placeholder="Item"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
              />
            </div>
            <div className="abc-unique-search-divider"></div>
            <div className="abc-unique-search-bar-container">
              <input
                type="text"
                className="abc-unique-location-input"
                placeholder="Location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <div className="abc-unique-search-button">
              <button
                className="abc-unique-search-button"
                onClick={handleSearchItem}
              >
                <IoSearchOutline />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListAndDiscover;
