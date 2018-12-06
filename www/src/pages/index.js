import '../styles/styles.scss';

import React from 'react';
import Emoji from '../components/Emoji';
import Shell from '../components/Shell';
import { Grid, Row, Column } from '../components/Layout';

export default function Home() {
  return (
    <Shell>
      <Grid fluid>
        <Row>
          <Column>
            <h1>Hello there!</h1>
          </Column>
        </Row>
        <Row>
          <Column breakpoints={[['sm', 4], ['md', 4], ['lg', 8]]}>
            <p>
              If you're landing on this page, you might be a bit confused{' '}
              <Emoji aria-label="confused face">🤔</Emoji>. This page is the
              landing page for the development environment for Carbon Elements.
            </p>
            <p>
              If you're trying to find a specific example, try clicking on one
              of the elements above <Emoji aria-label="pointing up">👆</Emoji>
            </p>
          </Column>
        </Row>
      </Grid>
    </Shell>
  );
}
