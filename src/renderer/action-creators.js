import { openExternal } from 'shell'
import twitterClient from './twitter-client';

export const OPEN_URL = 'OPEN_URL';
export const SELECT_LIST = 'SELECT_LIST';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const UPDATE_HOME_TIMELINE_TWEET = 'UPDATE_HOME_TIMELINE_TWEET';
export const UPDATE_HOME_TIMELINE_TWEETS = 'UPDATE_HOME_TIMELINE_TWEETS';
export const UPDATE_LISTS = 'UPDATE_LISTS';
export const UPDATE_SEARCHED_TWEET = 'UPDATE_SEARCHED_TWEET';
export const UPDATE_SEARCHED_TWEETS = 'UPDATE_SEARCHED_TWEETS';

export function fetchAccount() {
  return (dispatch) => {
    twitterClient.fetchAccount().then(({ account }) => {
      dispatch(updateAccount(account));
      dispatch(fetchTweets(account));
    });
  };
}

export function fetchTweets(account) {
  return (dispatch) => {
    twitterClient.fetchTweets({ screenName: account.screen_name }).then(({ tweets }) => {
      dispatch(updateHomeTimelineTweets(tweets));
      dispatch(subscribeStream());
    });
  };
}

export function fetchLists() {
  return (dispatch) => {
    twitterClient.fetchLists().then(({ lists }) => {
      dispatch(updateLists(lists));
    });
  };
}

export function openUrl(url) {
  openExternal(url);
  return {
    url,
    type: OPEN_URL
  }
}

export function searchTweets(queryString) {
  return (dispatch) => {
    twitterClient.searchTweets({ queryString }).then(({ tweets }) => {
      dispatch(updateSearchedTweets(tweets));
      dispatch(subscribeFilteredStream({ queryString }));
    });
  };
}

function subscribeFilteredStream({ queryString }) {
  return (dispatch) => {
    twitterClient.subscribeFilteredStream({ queryString }).on('tweeted', (tweet) => {
      dispatch(updateSearchedTweet(tweet));
    });
  };
}

function subscribeStream() {
  return (dispatch) => {
    twitterClient.subscribeStream().on('tweeted', (tweet) => {
      dispatch(updateHomeTimelineTweet(tweet));
    });
  };
}

export function selectList(listId) {
  return {
    listId,
    type: SELECT_LIST
  }
}

function updateAccount(account) {
  return {
    account,
    type: UPDATE_ACCOUNT
  };
}

function updateHomeTimelineTweet(tweet) {
  return {
    tweet,
    type: UPDATE_HOME_TIMELINE_TWEET
  };
}

function updateHomeTimelineTweets(tweets) {
  return {
    tweets,
    type: UPDATE_HOME_TIMELINE_TWEETS
  };
}

function updateLists(lists) {
  return {
    lists,
    type: UPDATE_LISTS
  };
}

function updateSearchedTweet(tweet) {
  return {
    tweet,
    type: UPDATE_SEARCHED_TWEET
  }
}

function updateSearchedTweets(tweets) {
  return {
    tweets,
    type: UPDATE_SEARCHED_TWEETS
  }
}
