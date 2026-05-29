import React, { useState } from 'react'
import { SECTIONS } from '../scene/sections';

const NavBar = ({ onLogoClick, onPlanetClick, showTooltipOnHeroContentVisible }) => {

    return (
        <nav
            className="fixed top-0 left-0 w-full h-[60px] bg-black/70 flex justify-between px-4 md:px-8
                        items-center text-white font-bold z-10 box-border font-display"
        >
            <div className="group relative flex items-center">
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
                                box-border font-sans mt-[35px] ml-[15px] -translate-y-1/2 left-[70px] sm:left-[100px] md:left-[110px]
                                text-[0.8rem] group-hover:opacity-100 whitespace-nowrap ${showTooltipOnHeroContentVisible ? 'opacity-100 pointer-events-auto' : 'group-hover:opacity-100'}
                             `}>

                    <div className="w-0 h-0 border-y-8 border-r-12 border-y-transparent border-r-white"></div>
                    <p>Click here to reset</p>
                </div>
            </div>


            <ul
                className="sm:flex gap-4 mt-4 -mr-2 sm:mr-0 sm:mt-4">
                    {SECTIONS.map((section) => (
                        <li key={section.id}>
                            <button
                                onClick={() => onPlanetClick(section.id, section.position)}
                                className={section.navColor}
                            >
                                {section.navLabel}
                            </button>
                        </li>
                    ))}
                </ul>
        </nav>
    );
};

export default NavBar;