import '../styles/styles.scss';

import {
  Content,
  Header,
  HeaderName,
  HeaderNavigation,
  SkipToContent,
} from 'carbon-components-react/lib/components/UIShell';
import React from 'react';
import { Link } from 'gatsby';

export default function Home({ children }) {
  return (
    <>
      <Header aria-label="IBM Elements">
        <SkipToContent />
        <HeaderName element={Link} to="/" href="">
          Elements
        </HeaderName>
        <HeaderNavigation aria-label="IBM Elements">
          <li role="none">
            <Link
              className="bx--header__menu-item"
              to="/develop/color"
              role="menuitem">
              Colors
            </Link>
          </li>
          <li role="none">
            <Link
              className="bx--header__menu-item"
              to="/develop/grid"
              role="menuitem">
              Grid
            </Link>
          </li>
          <li role="none">
            <Link
              className="bx--header__menu-item"
              to="/develop/icons"
              role="menuitem">
              Icons
            </Link>
          </li>
          <li role="none">
            <Link
              className="bx--header__menu-item"
              to="/develop/layout"
              role="menuitem">
              Layout
            </Link>
          </li>
          <li role="none">
            <Link
              className="bx--header__menu-item"
              to="/develop/type"
              role="menuitem">
              Type
            </Link>
          </li>
        </HeaderNavigation>
      </Header>
      <Content id="main-content">{children}</Content>
    </>
  );
}
