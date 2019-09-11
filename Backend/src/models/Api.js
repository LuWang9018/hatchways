const nodeFetch = require('node-fetch');

//==================================================
//Helpers
//==================================================
function getUnique(arr, comp) {
  const unique = arr
    .map(e => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e])
    .map(e => arr[e]);

  return unique;
}

async function getPosts(tags, sortBy = 'id', direction = 'asc') {
  const tagsArr = JSON.parse(tags);

  let result = { posts: [] };
  for (let i = 0; i < tagsArr.length; i++) {
    let data = await getData(tagsArr[i]);
    result = { posts: result.posts.concat(data.posts) };
  }

  result.posts = getUnique(result.posts, 'id');
  result.posts.sort((a, b) => {
    if (direction === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else if (direction === 'desc') {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  return result;
}

//==================================================
//Api
//==================================================
const callApi = async (url, method, options = {}) => {
  const fetchOptions = {
    method: method || 'GET',
    credentials: 'include',
  };
  if (options.params) {
    url += '?tag=' + options.params;
  }

  const data = await nodeFetch(url, fetchOptions).then(res => {
    if (res.status === 200) {
      return res.json();
    }
    return null;
  });
  return data;
};

//==================================================
// Cache
//==================================================
var LRU = require('lru-cache'),
  options = {
    max: 500,
    maxAge: 1000 * 60 * 60,
  },
  cache = new LRU(options);

async function getData(tag) {
  // Check if the data is in the cache
  var data = cache.get('tags:' + tag);

  // The key was not in the cache so data is undefined
  if (!data) {
    // Get the data from the database
    data = await callApi(
      'https://hatchways.io/api/assessment/blog/posts',
      'GET',
      {
        params: tag,
      }
    );

    // Store the data in the cache
    cache.set('tags:' + tag, data);
  }

  return data;
}

module.exports = {
  callApi,
  getPosts,
};
