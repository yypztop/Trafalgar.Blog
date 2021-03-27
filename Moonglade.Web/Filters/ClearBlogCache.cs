﻿using Microsoft.AspNetCore.Mvc.Filters;
using Moonglade.Caching;

namespace Moonglade.Web.Filters
{
    public class ClearPagingCountCache : ActionFilterAttribute
    {
        private readonly IBlogCache _cache;

        public ClearPagingCountCache(IBlogCache cache)
        {
            _cache = cache;
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            base.OnActionExecuted(context);
            _cache.Remove(CacheDivision.General, "postcount");
            _cache.Remove(CacheDivision.PostCountCategory);
            _cache.Remove(CacheDivision.PostCountTag);
        }
    }

    public class ClearBlogCache : ActionFilterAttribute
    {
        private readonly IBlogCache _cache;

        private readonly string _cacheKey;
        private readonly CacheDivision _division;

        public ClearBlogCache(CacheDivision division, string cacheKey, IBlogCache cache)
        {
            _division = division;
            _cacheKey = cacheKey;
            _cache = cache;
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            base.OnActionExecuted(context);
            _cache.Remove(_division, _cacheKey);
        }
    }
}
