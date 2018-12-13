FROM node:8.12.0

RUN mkdir -p /elements
WORKDIR /elements

COPY yarn.lock package.json lerna.json .yarnrc ./
COPY .yarn-offline-mirror ./.yarn-offline-mirror
COPY node_modules ./node_modules

RUN yarn install --offline --frozen-lockfile

COPY packages ./packages
COPY .git ./.git
COPY e2e ./e2e

CMD ["/elements/e2e/run.sh"]
