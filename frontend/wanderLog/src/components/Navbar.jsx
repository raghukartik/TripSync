import React, { useState } from "react";
import Logo from "../assets/Logo.png";
import ProfileInfo from "./cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "./Input/SearchBar";

const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSearchNote, handleClearSearch }) => {
  const navigate = useNavigate();
  const isToken = localStorage.getItem("token");
  
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => { 
    if(searchQuery){
      onSearchNote(searchQuery);
    }
  }

  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  } 

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <img src={Logo} alt="travel Story" className="h-9" />

      {isToken && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={({target}) => {
              setSearchQuery(target.value)
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />

          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </>
      )}
    </div>
  );
};

export default Navbar;
