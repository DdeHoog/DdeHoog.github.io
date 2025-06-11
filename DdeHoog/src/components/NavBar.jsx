import React from 'react'

const NavBar = ({ onLogoClick, onPlanetClick }) => {

    return (
        <nav>
            <div className="navbar">
                <div className="navbar-left group relative">
                    <a href="#hero" onClick={onLogoClick}>DDH</a>{/* Click to reset camera */}

                    {/*Tooltip on hover*/}
                    <div className="hover-tooltip">
                        <div className="arrow"></div>
                        <p>Click here to reset</p>
                    </div>
                </div>
                <ul className="navbar-right">
                      <li>
                        <button 
                        onClick={() => onPlanetClick("portfolio", [-3.42, 4.605, -1.17])}
                        className="text-orange-300 hover:text-orange-400"
                        >
                        Portfolio
                        </button>
                    </li>
                    <li>
                        <button 
                        onClick={() => onPlanetClick("experience", [3.755, 4.28, 0])}
                        className="text-blue-300 hover:text-blue-400"
                        >
                        Experience
                        </button>
                    </li>
                    <li>
                        <button 
                        onClick={() => onPlanetClick("about", [2, 5.67, -2.21])}
                        className="text-pink-300 hover:text-pink-400"
                        >
                        About
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;