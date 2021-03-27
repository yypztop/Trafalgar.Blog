﻿using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Moonglade.Syndication;
using NUnit.Framework;

namespace Moonglade.Tests
{
    [TestFixture]
    [ExcludeFromCodeCoverage]
    public class FileSystemOpmlWriterTests
    {
        [Test]
        public async Task WriteOpmlFile()
        {
            var catInfos = new List<KeyValuePair<string, string>>
            {
                new("Work 996", "work-996")
            };
            var siteRootUrl = "https://996.icu";

            var info = new OpmlDoc
            {
                SiteTitle = $"Work 996 - OPML",
                ContentInfo = catInfos,
                HtmlUrl = $"{siteRootUrl}/post",
                XmlUrl = $"{siteRootUrl}/rss",
                XmlUrlTemplate = $"{siteRootUrl}/rss/[catTitle]",
                HtmlUrlTemplate = $"{siteRootUrl}/category/[catTitle]"
            };

            var writer = new MemoryStreamOpmlWriter();
            var bytes = await writer.GetOpmlStreamDataAsync(info);

            Assert.IsNotNull(bytes);
        }
    }
}
