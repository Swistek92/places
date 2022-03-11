import React, { useState } from 'react';
import './MainNavigation.css';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import MainHeder from './MainHeader';
import Backdrop from '../UIElements/Backdrop';
const MainNavigation = (props) => {
  const [drawIsOpen, setDrawIsOpen] = useState(false);

  const openDrawHandler = () => {
    setDrawIsOpen(true);
  };
  const closeDrawHandler = () => {
    setDrawIsOpen(false);
  };
  return (
    <React.Fragment>
      {drawIsOpen && <Backdrop onClick={closeDrawHandler} />}

      <SideDrawer show={drawIsOpen} onClick={closeDrawHandler}>
        <nav className='main-nagiation__draw-nav'>
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeder>
        <button className='main-navigation__menu-btn' onClick={openDrawHandler}>
          <span />
          <span />
          <span />
        </button>
        <h1 className='main-nagivation__title'>
          <Link to='/'> your places</Link>
        </h1>
        <nav className='main-navigation__header-nav'>
          <NavLinks />
        </nav>
      </MainHeder>
    </React.Fragment>
  );
};

export default MainNavigation;
