import React from 'react';

import GithubIcon from './images/github.svg';
import TelegramIcon from './images/telegram.svg';

import './style.css';

class MainMenu extends React.Component {
  render() {
    return (
      <div className='main-menu'>
        <main className='main-menu__main'>
          <header className='main-menu__header'>
            <h1 className='main-menu__title'>
              Roosters Fight
            </h1>
          </header>
          <nav className='main-menu__menu menu'>
            <ul className='menu__list'>
              <li className='menu__item'>
                <button className='menu__button'>Play</button>
              </li>
            </ul>
          </nav>
        </main>
        <footer className='main-menu__footer'>
          <ul className='main-menu__socials socials'>
            <li className='socials__item'>
              <a
                className='socials__link socials__link_github'
                href='https://github.com/michailRemmele/roosters-fight'
                target='_blank'
                rel='noopener noreferrer'
              >
                <GithubIcon className='socials__icon'/>
              </a>
            </li>
            <li className='socials__item'>
              <a
                className='socials__link socials__link_telegram'
                href='https://t.me/misha_pishet_dvizhok'
                target='_blank'
                rel='noopener noreferrer'
              >
                <TelegramIcon className='socials__icon'/>
              </a>
            </li>
          </ul>
        </footer>
      </div>
    );
  }
}

MainMenu.propTypes = {};

export default MainMenu;
