﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moonglade.Configuration.Abstraction;
using Moonglade.Configuration.Settings;
using Moonglade.Data.Entities;
using Moonglade.Data.Infrastructure;
using Moonglade.Data.Spec;

namespace Moonglade.Core
{
    public interface ISearchService
    {
        Task<IReadOnlyList<PostDigest>> SearchAsync(string keyword);
        Task<byte[]> GetOpenSearchStreamArray(string siteRootUrl);
        Task<byte[]> GetSiteMapStreamArrayAsync(string siteRootUrl);
    }

    public class SearchService : ISearchService
    {
        private readonly AppSettings _settings;
        private readonly IRepository<PostEntity> _postRepo;
        private readonly IRepository<PageEntity> _pageRepo;
        private readonly IBlogConfig _blogConfig;

        public SearchService(
            IOptions<AppSettings> settings,
            IRepository<PostEntity> postRepo,
            IBlogConfig blogConfig,
            IRepository<PageEntity> pageRepo)
        {
            _settings = settings.Value;
            _postRepo = postRepo;
            _blogConfig = blogConfig;
            _pageRepo = pageRepo;
        }

        public async Task<IReadOnlyList<PostDigest>> SearchAsync(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                throw new ArgumentNullException(keyword);
            }

            var postList = SearchByKeyword(keyword);

            var resultList = await postList.Select(p => new PostDigest
            {
                Title = p.Title,
                Slug = p.Slug,
                ContentAbstract = p.ContentAbstract,
                PubDateUtc = p.PubDateUtc.GetValueOrDefault(),
                Tags = p.Tags.Select(pt => new Tag
                {
                    NormalizedName = pt.NormalizedName,
                    DisplayName = pt.DisplayName
                })
            }).ToListAsync();

            return resultList;
        }

        public async Task<byte[]> GetOpenSearchStreamArray(string siteRootUrl)
        {
            await using var ms = new MemoryStream();
            var writerSettings = new XmlWriterSettings { Encoding = Encoding.UTF8, Async = true };
            await using (var writer = XmlWriter.Create(ms, writerSettings))
            {
                await writer.WriteStartDocumentAsync();
                writer.WriteStartElement("OpenSearchDescription", "http://a9.com/-/spec/opensearch/1.1/");
                writer.WriteAttributeString("xmlns", "http://a9.com/-/spec/opensearch/1.1/");

                writer.WriteElementString("ShortName", _blogConfig.FeedSettings.RssTitle);
                writer.WriteElementString("Description", _blogConfig.FeedSettings.RssDescription);

                writer.WriteStartElement("Image");
                writer.WriteAttributeString("height", "16");
                writer.WriteAttributeString("width", "16");
                writer.WriteAttributeString("type", "image/vnd.microsoft.icon");
                writer.WriteValue($"{siteRootUrl.TrimEnd('/')}/favicon.ico");
                await writer.WriteEndElementAsync();

                writer.WriteStartElement("Url");
                writer.WriteAttributeString("type", "text/html");
                writer.WriteAttributeString("template", $"{siteRootUrl.TrimEnd('/')}/search/{{searchTerms}}");
                await writer.WriteEndElementAsync();

                await writer.WriteEndElementAsync();
            }
            await ms.FlushAsync();
            return ms.ToArray();
        }

        public async Task<byte[]> GetSiteMapStreamArrayAsync(string siteRootUrl)
        {
            await using var ms = new MemoryStream();
            var writerSettings = new XmlWriterSettings { Encoding = Encoding.UTF8, Async = true };
            await using (var writer = XmlWriter.Create(ms, writerSettings))
            {
                await writer.WriteStartDocumentAsync();
                writer.WriteStartElement("urlset", _settings.SiteMap.UrlSetNamespace);

                // Posts
                var spec = new PostSitePageSpec();
                var posts = await _postRepo.SelectAsync(spec, p => new
                {
                    p.Slug,
                    p.PubDateUtc
                });

                foreach (var item in posts.OrderByDescending(p => p.PubDateUtc))
                {
                    var pubDate = item.PubDateUtc.GetValueOrDefault();

                    writer.WriteStartElement("url");
                    writer.WriteElementString("loc", $"{siteRootUrl}/post/{pubDate.Year}/{pubDate.Month}/{pubDate.Day}/{item.Slug.ToLower()}");
                    writer.WriteElementString("lastmod", pubDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
                    writer.WriteElementString("changefreq", _settings.SiteMap.ChangeFreq["Posts"]);
                    await writer.WriteEndElementAsync();
                }

                // Pages
                var pages = await _pageRepo.SelectAsync(page => new
                {
                    page.CreateTimeUtc,
                    page.Slug,
                    page.IsPublished
                });

                foreach (var item in pages.Where(p => p.IsPublished))
                {
                    writer.WriteStartElement("url");
                    writer.WriteElementString("loc", $"{siteRootUrl}/page/{item.Slug.ToLower()}");
                    writer.WriteElementString("lastmod", item.CreateTimeUtc.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
                    writer.WriteElementString("changefreq", _settings.SiteMap.ChangeFreq["Pages"]);
                    await writer.WriteEndElementAsync();
                }

                // Tag
                writer.WriteStartElement("url");
                writer.WriteElementString("loc", $"{siteRootUrl}/tags");
                writer.WriteElementString("lastmod", DateTime.UtcNow.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
                writer.WriteElementString("changefreq", _settings.SiteMap.ChangeFreq["Default"]);
                await writer.WriteEndElementAsync();

                // Archive
                writer.WriteStartElement("url");
                writer.WriteElementString("loc", $"{siteRootUrl}/archive");
                writer.WriteElementString("lastmod", DateTime.UtcNow.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
                writer.WriteElementString("changefreq", _settings.SiteMap.ChangeFreq["Default"]);
                await writer.WriteEndElementAsync();

                await writer.WriteEndElementAsync();
            }
            await ms.FlushAsync();
            return ms.ToArray();
        }

        private IQueryable<PostEntity> SearchByKeyword(string keyword)
        {
            var query = _postRepo.GetAsQueryable()
                                       .Where(p => !p.IsDeleted && p.IsPublished).AsNoTracking();

            var str = Regex.Replace(keyword, @"\s+", " ");
            var rst = str.Split(' ');
            if (rst.Length > 1)
            {
                // keyword: "dot  net rocks"
                // search for post where Title containing "dot && net && rocks"
                var result = rst.Aggregate(query, (current, s) => current.Where(p => p.Title.Contains(s)));
                return result;
            }
            else
            {
                // keyword: "dotnetrocks"
                var k = rst.First();
                var result = query.Where(p => p.Title.Contains(k) ||
                                              p.Tags.Select(t => t.DisplayName).Contains(k));
                return result;
            }
        }
    }
}
