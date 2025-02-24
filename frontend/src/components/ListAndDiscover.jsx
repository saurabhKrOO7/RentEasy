import React from "react";
import "./ListAndDiscover.css";
import { IoDiamondOutline, IoSearchOutline } from "react-icons/io5";
import { TfiLocationPin } from "react-icons/tfi";

const ListAndDiscover = () => {
  return (
    <div className="list-discover-container">
      {/* Left Section */}
      <div
        className="list-discover-section list-discover-left"
        style={{ backgroundImage: "url('../../images/listAndDiscover.png')" }}
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
        style={{ backgroundImage: "url('../../images/listAndDiscover2.png')" }}
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
              />
            </div>
            <div className="abc-unique-search-divider"></div>
            <div className="abc-unique-search-bar-container">
              <input
                type="text"
                className="abc-unique-location-input"
                placeholder="Location"
              />
            </div>
            <div className="abc-unique-search-button">
              <button className="abc-unique-search-button">
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
