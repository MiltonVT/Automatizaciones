/**
 * Constants used across the test suite
 */

// Load environment variables
const STUDIO_URL = process.env.STUDIO_URL || 'https://studio.alfa.envs.veritran.com/';
const USERNAME = process.env.USERNAME || 'marias';
const PASSWORD = process.env.PASSWORD || 'V3r1tr4n';
const APP_NAME = process.env.APP_NAME || 'ALPHA_EASY_VT_SERVICESS';
const BRANCH = process.env.BRANCH || 'main';

export const URLS = {
  STUDIO_ALFA: STUDIO_URL,
};

export const CREDENTIALS = {
  USERNAME,
  PASSWORD,
};

export const APPLICATION = {
  NAME: APP_NAME,
  BRANCH: BRANCH,
};

export const TIMEOUTS = {
  NAVIGATION: 180000,
  ELEMENT_WAIT: 60000,
  APP_LOAD: 120000,
  SHORT_WAIT: 5000,
};

export const TEST_DATA = {
  EXPECTED_TITLE: 'Studio',
};
