const getPosts = require('../models/Api').getPosts;

//======================================ERROR CODE=====================================
// 0: good
// 1: tag is not array
// 2: Tags parameter is required
// 3: sortBy parameter is invalid
// 4: direction parameter is invalid

//==================================================
//Helpers
//==================================================
function inputCheck(tags, sortBy, direction) {
  //tags
  if (!tags) return 2;

  const tagsArr = JSON.parse(tags);

  if (!Array.isArray(tagsArr)) return 1;

  //sortBy
  const acceptableFields = ['id', 'reads', 'likes', 'popularity'];
  if (sortBy && !acceptableFields.includes(sortBy)) return 3;

  //direction
  const acceptableDirection = ['asc', 'desc'];
  if (direction && !acceptableDirection.includes(direction)) return 4;

  return 0;
}

//==================================================
//API
//==================================================
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

module.exports = {
  api,
};
