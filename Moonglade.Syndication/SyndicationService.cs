﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Moonglade.Configuration.Abstraction;
using Moonglade.Configuration.Settings;
using Moonglade.Data.Entities;
using Moonglade.Data.Infrastructure;
using Moonglade.Data.Spec;
using Moonglade.Utils;

namespace Moonglade.Syndication
{
    public interface ISyndicationService
    {
        Task<string> GetRssStringAsync(string categoryName = null);
        Task<string> GetAtomStringAsync();
    }

    public class SyndicationService : ISyndicationService
    {
        private readonly string _baseUrl;
        private readonly AppSettings _settings;
        private readonly IBlogConfig _blogConfig;
        private readonly IRepository<CategoryEntity> _catRepo;
        private readonly IRepository<PostEntity> _postRepo;

        private readonly FeedGenerator _feedGenerator;

        public SyndicationService(
            IOptions<AppSettings> settings,
            IBlogConfig blogConfig,
            IHttpContextAccessor httpContextAccessor,
            IRepository<CategoryEntity> catRepo,
            IRepository<PostEntity> postRepo)
        {
            _settings = settings.Value;
            _blogConfig = blogConfig;
            _catRepo = catRepo;
            _postRepo = postRepo;

            var acc = httpContextAccessor;
            _baseUrl = $"{acc.HttpContext.Request.Scheme}://{acc.HttpContext.Request.Host}";

            _feedGenerator = new()
            {
                HostUrl = _baseUrl,
                HeadTitle = _blogConfig.FeedSettings.RssTitle,
                HeadDescription = _blogConfig.FeedSettings.RssDescription,
                Copyright = _blogConfig.FeedSettings.RssCopyright,
                Generator = $"Moonglade v{Helper.AppVersion}",
                TrackBackUrl = _baseUrl
            };
        }

        public async Task<string> GetRssStringAsync(string categoryName = null)
        {
            var data = await GetDataAsync(categoryName);
            if (data is null) return null;

            _feedGenerator.FeedItemCollection = data;
            var xml = await _feedGenerator.WriteRssAsync();
            return xml;
        }

        public async Task<string> GetAtomStringAsync()
        {
            _feedGenerator.FeedItemCollection = await GetDataAsync();
            var xml = await _feedGenerator.WriteAtomAsync();
            return xml;
        }

        private async Task<IReadOnlyList<FeedEntry>> GetDataAsync(string categoryName = null)
        {
            IReadOnlyList<FeedEntry> itemCollection;
            if (!string.IsNullOrWhiteSpace(categoryName))
            {
                var cat = await _catRepo.GetAsync(c => c.RouteName == categoryName);
                if (cat is null) return null;

                itemCollection = await GetFeedEntriesAsync(cat.Id);
            }
            else
            {
                itemCollection = await GetFeedEntriesAsync();
            }

            return itemCollection;
        }

        private async Task<IReadOnlyList<FeedEntry>> GetFeedEntriesAsync(Guid? categoryId = null)
        {
            int? top = null;
            if (_blogConfig.FeedSettings.RssItemCount != 0)
            {
                top = _blogConfig.FeedSettings.RssItemCount;
            }

            var postSpec = new PostSpec(categoryId, top);
            var list = await _postRepo.SelectAsync(postSpec, p => p.PubDateUtc != null ? new FeedEntry
            {
                Id = p.Id.ToString(),
                Title = p.Title,
                PubDateUtc = p.PubDateUtc.Value,
                Description = _blogConfig.FeedSettings.UseFullContent ? p.PostContent : p.ContentAbstract,
                Link = $"{_baseUrl}/post/{p.PubDateUtc.Value.Year}/{p.PubDateUtc.Value.Month}/{p.PubDateUtc.Value.Day}/{p.Slug}",
                Author = _blogConfig.FeedSettings.AuthorName,
                AuthorEmail = _blogConfig.GeneralSettings.OwnerEmail,
                Categories = p.PostCategory.Select(pc => pc.Category.DisplayName).ToArray()
            } : null);

            // Workaround EF limitation
            // Man, this is super ugly
            if (_blogConfig.FeedSettings.UseFullContent && list.Any())
            {
                foreach (var simpleFeedItem in list)
                {
                    simpleFeedItem.Description = FormatPostContent(simpleFeedItem.Description);
                }
            }

            return list;
        }

        private string FormatPostContent(string rawContent)
        {
            return _settings.Editor == EditorChoice.Markdown ?
                ContentProcessor.MarkdownToContent(rawContent, ContentProcessor.MarkdownConvertType.Html, false) :
                rawContent;
        }
    }
}
