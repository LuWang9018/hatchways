const getPosts = require('../models/Api');

//======================================ERROR CODE=====================================
// 0: good
// 1: tag is not array
// 2: "Tags parameter is required
// 3: sortBy parameter is invalid
// 4: direction parameter is invalid

//======================================HELPERS=====================================
function inputCheck(tags, sortBy, direction) {
  let hasError = 0;

  //tags
  const tagsArr = JSON.parse(tags);

  if (!tags) hasError = 2;
  if (!Array.isArray(tagsArr)) hasError = 1;

  //sortBy
  const acceptableFields = ['id', 'reads', 'likes', 'popularity'];
  if (!acceptableFields.includes(sortBy)) hasError = 3;

  //direction
  const acceptableDirection = ['asc', 'desc'];
  if (!acceptableDirection.includes(direction)) hasError = 4;

  return hasError;
}

//======================================APIS=====================================
async function ping(ctx, next) {
  const result = {
    success: true,
  };

  ctx.status = 200;
  ctx.state.result = result;
}

async function posts(ctx, next) {
  const { tags, sortBy, direction } = ctx.query;

  const checkResult = inputCheck(tags, sortBy, direction);
  switch (checkResult) {
    case 1:
      ctx.state.result = {
        error: 'Tags parameter is not an array',
      };
      ctx.status = 400;
      break;
    case 2:
      ctx.state.result = {
        error: 'Tags parameter is required',
      };
      ctx.status = 400;
      break;
    case 3:
      ctx.state.result = {
        error: 'sortBy parameter is invalid',
      };
      ctx.status = 400;
      break;
    case 4:
      ctx.state.result = {
        error: 'direction parameter is invalid',
      };
      ctx.status = 400;
      break;

    default:
      const postsResult = await getPosts(tags, sortBy, direction);
      ctx.state.result = postsResult;
      ctx.status = 200;
  }

  await next();
}

async function outputResult(ctx) {
  if (ctx.state.result) {
    ctx.body = ctx.state.result;
  } else {
    ctx.status = 404;
  }
}

const api = router => {
  router.get('/api/ping', ping, outputResult);
  router.get('/api/posts', posts, outputResult);
};

export default api;
