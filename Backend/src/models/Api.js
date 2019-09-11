const nodeFetch = require('node-fetch');

Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

//remove duplicate
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

export async function getPosts(tags, sortBy = 'id', direction = 'asc') {
  const tagsArr = JSON.parse(tags);
  console.log('tagsArr', tagsArr, typeof tagsArr);
  console.log('direction', direction);

  let result = { posts: [] };
  for (let i = 0; i < tagsArr.length; i++) {
    let data = await callApi(
      'https://hatchways.io/api/assessment/blog/posts',
      'GET',
      {
        params: tagsArr[i],
      }
    );

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

export const callApi = async (url, method, options = {}) => {
  const fetchOptions = {
    method: method || 'GET',
    credentials: 'include',
  };
  if (options.headers) {
    fetchOptions.headers = options.headers;
  }
  if (options.body) {
    //console.log('body', options.body);-
    fetchOptions.body = options.body;
  }

  if (options.params) {
    url += '?tag=' + options.params;
  }

  console.log(url);
  const data = await nodeFetch(url, fetchOptions).then(res => {
    if (res.status === 200) {
      if (options.type === 'blob') return res.blob();
      return res.json();
    }
    return null;
  });
  return data;
};
