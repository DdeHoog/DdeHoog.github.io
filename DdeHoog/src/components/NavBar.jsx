import React from 'react'

const NavBar = ({ onLogoClick }) => {

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
                    <li><a href="#portfolio">Portfolio</a></li>
                    <li><a href="#experience">Experience</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;