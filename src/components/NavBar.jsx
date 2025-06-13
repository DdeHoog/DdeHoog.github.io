import React, { useState } from 'react'

const NavBar = ({ onLogoClick, onPlanetClick, showTooltipOnHeroContentVisible }) => {

    return (
        <nav>
            <nav 
                className="navbar fixed top-0 left-0 w-full h-[60px] bg-black/70 fflex justify-between px-8 
                            text-white font-bold z-10 box-border font-sans"
            >
                <div className="group relative">
                    <a 
                        href="#hero" 
                        onClick={onLogoClick}
                        className="no-underline text-white font-bold tracking-wider cursor-pointer
                                    text-2xl sm:text-3xl md:text-4xl lg:text-4xl ml-[-0.5rem]"
                    >
                        DDH
                    </a>{/* Click to reset camera */}

                    {/*Tooltip on hover*/}
                    <div 
                        className={`fixed flex items-center gap-2 text-white font-normal
                                    opacity-0 pointer-events-none transition-opacity duration-2000 ease-in-out z-20
                                    box-border font-sans mt-[-15px] ml-[15px] -translate-y-1/2 left-[70px] sm:left-[100px] md:left-[110px]
                                    text-[0.8rem] group-hover:opacity-100 whitespace-nowrap ${showTooltipOnHeroContentVisible ? 'opacity-100 pointer-events-auto' : 'group-hover:opacity-100'}`}>
                        <div className="w-0 h-0 border-y-8 border-r-12 border-y-transparent border-r-white"></div>
                        <p>Click here to reset</p>
                    </div>
                </div>
                <ul 
                    className="navbar-right">
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
            </nav>
        </nav>
    );
};

export default NavBar;