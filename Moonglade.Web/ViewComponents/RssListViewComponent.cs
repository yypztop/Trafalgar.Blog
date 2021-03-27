﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moonglade.Core;

namespace Moonglade.Web.ViewComponents
{
    public class RssListViewComponent : ViewComponent
    {
        private readonly ILogger<RssListViewComponent> _logger;

        private readonly ICategoryService _categoryService;

        public RssListViewComponent(ILogger<RssListViewComponent> logger, ICategoryService categoryService)
        {
            _logger = logger;
            _categoryService = categoryService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            try
            {
                var cats = await _categoryService.GetAll();
                var items = cats.Select(c => new KeyValuePair<string, string>(c.DisplayName, c.RouteName));

                return View(items);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error.");

                ViewBag.ComponentErrorMessage = e.Message;
                return View("~/Views/Shared/ComponentError.cshtml");
            }
        }
    }
}
