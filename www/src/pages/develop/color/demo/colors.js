import { colors, tokens } from '@carbon/colors';
import { ArrowLeft20 } from '@carbon/icons-react';
import { Link } from 'gatsby';
import React from 'react';
import { Grid, Row, Column } from '../../../../components/Layout';

export default function BasicColorExample() {
  return (
    <div>
      <header>
        <Grid fluid>
          <Row>
            <Column breakpoints={[['lg', 4]]}>
              <Link to="/develop/color">
                <ArrowLeft20 />
                Color
              </Link>
              <h1>Basic Usage</h1>
            </Column>
            <Column>
              <p>Basic examples for color</p>
            </Column>
          </Row>
        </Grid>
      </header>
      <section>
        <Grid fluid>
          <Row>
            <Column>
              <article>
                <header>
                  <h2>All colors</h2>
                </header>
              </article>
            </Column>
          </Row>
          <Row>
            <Column>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(colors).map(key => (
                    <tr key={key}>
                      <td>
                        <pre>
                          <code>{key}</code>
                        </pre>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div
                            style={{
                              width: 50,
                              height: 50,
                              backgroundColor: colors[key],
                              marginRight: '0.5rem',
                              outline: '1px solid #8a3ffc',
                            }}
                          />
                          {colors[key]}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Column>
          </Row>
        </Grid>
      </section>
    </div>
  );
}
