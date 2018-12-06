import { colors } from '@carbon/colors';
import { ArrowRight32 } from '@carbon/icons-react';
import { keyHeights, px, spacing } from '@carbon/layout';
import { heading02, label01 } from '@carbon/type';
import { Link } from 'gatsby';
import { css } from 'glamor';
import React from 'react';
import { Grid, Row, Column } from '../../../components/Layout';

export default function ColorsPage() {
  return (
    <div {...container}>
      <header>
        <Grid fluid>
          <Row {...content} {...header}>
            <Column breakpoints={[['lg', 4]]}>
              <Link
                to="/"
                css={{
                  color: colors.blue60,
                  ...label01,
                }}>
                Home
              </Link>
              <h1 css={{ ...heading02, color: colors.gray80 }}>Color</h1>
            </Column>
            <Column>
              <p css={{ color: colors.gray80 }}>
                The colors and tokens for working with color.
              </p>
            </Column>
          </Row>
        </Grid>
      </header>
      <main {...main} id="main-content">
        <Grid fluid condensed padding>
          <Row>
            <Column breakpoints={[['sm', 4], ['md', 4], ['lg', 4]]}>
              <article {...tile}>
                <Link {...tileContent} to="/develop/color/demo/colors">
                  <header>Colors</header>
                  <ArrowRight32 {...tileIcon} />
                </Link>
              </article>
            </Column>
            <Column breakpoints={[['sm', 4], ['md', 4], ['lg', 4]]}>
              <article {...tile}>
                <Link {...tileContent} to="/develop/color/demo/tokens">
                  <header>Tokens</header>
                  <ArrowRight32 {...tileIcon} />
                </Link>
              </article>
            </Column>
          </Row>
        </Grid>
      </main>
    </div>
  );
}

const container = css({
  backgroundColor: colors.gray10,
  width: '100%',
  height: '100%',
  padding: `${spacing[5]} 0`,
});

const content = css({
  backgroundColor: colors.white,
});

const header = css({
  padding: `${spacing[5]} 0`,
  height: keyHeights[2],
});

const main = css({
  marginTop: px(2),
});

const tileContent = css({
  color: colors.gray80,
  display: 'flex',
  justifyContent: 'space-between',
  height: keyHeights[1],
  width: '100%',
  textDecoration: 'none',
});

const tileIcon = css({
  alignSelf: 'flex-end',
  fill: colors.gray60,
});

const tile = css({
  backgroundColor: colors.white,
  ':hover': {
    backgroundColor: colors.gray20,
  },
});
