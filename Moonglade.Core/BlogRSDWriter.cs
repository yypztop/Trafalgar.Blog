﻿using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using Moonglade.Utils;

namespace Moonglade.Core
{
    public interface IRSDWriter
    {
        Task<byte[]> GetRSDStreamArray(string siteRootUrl);
    }

    public class BlogRSDWriter : IRSDWriter
    {
        public async Task<byte[]> GetRSDStreamArray(string siteRootUrl)
        {
            await using var ms = new MemoryStream();
            var writerSettings = new XmlWriterSettings { Encoding = Encoding.UTF8, Async = true };
            await using (var writer = XmlWriter.Create(ms, writerSettings))
            {
                await writer.WriteStartDocumentAsync();

                // Rsd tag
                writer.WriteStartElement("rsd");
                writer.WriteAttributeString("version", "1.0");

                // Service 
                writer.WriteStartElement("service");
                writer.WriteElementString("engineName", $"Moonglade {Helper.AppVersion}");
                writer.WriteElementString("engineLink", "https://moonglade.blog");
                writer.WriteElementString("homePageLink", siteRootUrl);

                // APIs
                writer.WriteStartElement("apis");

                // MetaWeblog
                writer.WriteStartElement("api");
                writer.WriteAttributeString("name", "MetaWeblog");
                writer.WriteAttributeString("preferred", "true");
                writer.WriteAttributeString("apiLink", $"{siteRootUrl}metaweblog");
                writer.WriteAttributeString("blogID", siteRootUrl);
                await writer.WriteEndElementAsync();

                // End APIs
                await writer.WriteEndElementAsync();

                // End Service
                await writer.WriteEndElementAsync();

                // End Rsd
                await writer.WriteEndElementAsync();

                await writer.WriteEndDocumentAsync();
            }

            await ms.FlushAsync();
            return ms.ToArray();
        }
    }
}
