﻿using System;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Threading.Tasks;
using MemoryCache.Testing.Moq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moonglade.Configuration;
using Moonglade.Configuration.Abstraction;
using Moonglade.Configuration.Settings;
using Moonglade.ImageStorage;
using Moonglade.Utils;
using Moonglade.Web.Controllers;
using Moonglade.Web.Models;
using Moonglade.Web.SiteIconGenerator;
using Moq;
using NUnit.Framework;

namespace Moonglade.Web.Tests.Controllers
{
    [TestFixture]
    [ExcludeFromCodeCoverage]
    public class AssetsControllerTests
    {
        private MockRepository _mockRepository;

        private Mock<ILogger<AssetsController>> _mockLogger;
        private Mock<IOptions<AppSettings>> _mockAppSettings;
        private Mock<IBlogConfig> _mockBlogConfig;
        private Mock<IWebHostEnvironment> _mockWebHostEnv;
        private Mock<IOptions<ImageStorageSettings>> _mockImageStorageSettings;
        private Mock<IBlogImageStorage> _mockAsyncImageStorageProvider;
        private Mock<ISiteIconGenerator> _mockSiteIconGenerator;

        [SetUp]
        public void Setup()
        {
            _mockRepository = new(MockBehavior.Default);

            _mockLogger = _mockRepository.Create<ILogger<AssetsController>>();
            _mockAppSettings = _mockRepository.Create<IOptions<AppSettings>>();
            _mockBlogConfig = _mockRepository.Create<IBlogConfig>();
            _mockWebHostEnv = _mockRepository.Create<IWebHostEnvironment>();
            _mockAsyncImageStorageProvider = _mockRepository.Create<IBlogImageStorage>();
            _mockSiteIconGenerator = _mockRepository.Create<ISiteIconGenerator>();
            _mockImageStorageSettings = _mockRepository.Create<IOptions<ImageStorageSettings>>();
        }

        private AssetsController CreateAssetsController()
        {
            return new(
                _mockLogger.Object,
                _mockAppSettings.Object,
                _mockImageStorageSettings.Object,
                _mockAsyncImageStorageProvider.Object,
                _mockBlogConfig.Object,
                _mockSiteIconGenerator.Object,
                _mockWebHostEnv.Object);
        }

        [Test]
        public async Task GetImage_CDN()
        {
            const string filename = "test.png";

            _mockImageStorageSettings.Setup(p => p.Value).Returns(new ImageStorageSettings
            {
                CDNSettings = new()
                {
                    CDNEndpoint = "https://fake-cdn.edi.wang/images",
                    EnableCDNRedirect = true
                }
            });

            var ctl = CreateAssetsController();

            var memCacheMock = new Mock<IMemoryCache>();
            var result = await ctl.Image(filename, memCacheMock.Object);
            Assert.IsInstanceOf(typeof(RedirectResult), result);
            if (result is RedirectResult rdResult)
            {
                var resultUrl = _mockImageStorageSettings.Object.Value.CDNSettings.CDNEndpoint.CombineUrl(filename);
                Assert.That(rdResult.Url, Is.EqualTo(resultUrl));
            }
        }

        [Test]
        public async Task Image_Null()
        {
            const string filename = "test.png";

            _mockImageStorageSettings.Setup(p => p.Value).Returns(new ImageStorageSettings
            {
                CDNSettings = new()
                {
                    EnableCDNRedirect = false
                }
            });

            _mockAppSettings.Setup(p => p.Value).Returns(new AppSettings
            {
                CacheSlidingExpirationMinutes = new()
                {
                    { "Image", 996 }
                }
            });

            var memCacheMock = Create.MockedMemoryCache();
            _mockAsyncImageStorageProvider.Setup(p => p.GetAsync(It.IsAny<string>()))
                .Returns(Task.FromResult((ImageInfo)null));

            var ctl = CreateAssetsController();
            var result = await ctl.Image(filename, memCacheMock);

            Assert.IsInstanceOf<NotFoundResult>(result);
        }

        [Test]
        public async Task Image_File()
        {
            const string filename = "test.png";

            _mockImageStorageSettings.Setup(p => p.Value).Returns(new ImageStorageSettings
            {
                CDNSettings = new()
                {
                    EnableCDNRedirect = false
                }
            });

            _mockAppSettings.Setup(p => p.Value).Returns(new AppSettings
            {
                CacheSlidingExpirationMinutes = new()
                {
                    { "Image", 996 }
                }
            });

            var memCacheMock = Create.MockedMemoryCache();
            _mockAsyncImageStorageProvider.Setup(p => p.GetAsync(It.IsAny<string>()))
                .Returns(Task.FromResult(new ImageInfo
                {
                    ImageBytes = Array.Empty<byte>(),
                    ImageExtensionName = ".png"
                }));

            var ctl = CreateAssetsController();
            var result = await ctl.Image(filename, memCacheMock);

            Assert.IsInstanceOf<FileContentResult>(result);
        }

        [Test]
        public async Task Image_Exception()
        {
            const string filename = "test.png";

            _mockImageStorageSettings.Setup(p => p.Value).Returns(new ImageStorageSettings
            {
                CDNSettings = new()
                {
                    EnableCDNRedirect = false
                }
            });

            _mockAppSettings.Setup(p => p.Value).Returns(new AppSettings
            {
                CacheSlidingExpirationMinutes = new()
                {
                    { "Image", 996 }
                }
            });

            var memCacheMock = Create.MockedMemoryCache();
            _mockAsyncImageStorageProvider.Setup(p => p.GetAsync(It.IsAny<string>()))
                .Throws(new ArgumentException("996"));

            var ctl = CreateAssetsController();

            var result = await ctl.Image(filename, memCacheMock);

            Assert.IsInstanceOf<StatusCodeResult>(result);
            Assert.AreEqual(500, ((StatusCodeResult)result).StatusCode);
        }

        [Test]
        public async Task Image_Upload_NullFile()
        {
            var ctl = CreateAssetsController();
            var result = await ctl.Image((IFormFile)null, null);

            Assert.IsInstanceOf<BadRequestResult>(result);
        }

        [Test]
        public async Task Image_Upload_InvalidExtension()
        {
            _mockImageStorageSettings.Setup(p => p.Value).Returns(new ImageStorageSettings()
            {
                AllowedExtensions = new[] { ".png" }
            });

            IFormFile file = new FormFile(new MemoryStream(), 0, 1024, "996.jpg", "996.jpg");

            var ctl = CreateAssetsController();
            var result = await ctl.Image(file, null);

            Assert.IsInstanceOf<BadRequestResult>(result);
        }

        [Test]
        public async Task Image_Upload_EmptyAllowedExtensions()
        {
            _mockImageStorageSettings.Setup(p => p.Value).Returns(new ImageStorageSettings()
            {
                AllowedExtensions = Array.Empty<string>()
            });

            IFormFile file = new FormFile(new MemoryStream(), 0, 1024, "996.jpg", "996.jpg");

            var ctl = CreateAssetsController();
            var result = await ctl.Image(file, null);

            Assert.IsInstanceOf<StatusCodeResult>(result);
            Assert.AreEqual(500, ((StatusCodeResult)result).StatusCode);
        }

        [Test]
        public async Task Image_Upload_NullAllowedExtensions()
        {
            _mockImageStorageSettings.Setup(p => p.Value).Returns(new ImageStorageSettings()
            {
                AllowedExtensions = null
            });

            IFormFile file = new FormFile(new MemoryStream(), 0, 1024, "996.jpg", "996.jpg");

            var ctl = CreateAssetsController();
            var result = await ctl.Image(file, null);

            Assert.IsInstanceOf<StatusCodeResult>(result);
            Assert.AreEqual(500, ((StatusCodeResult)result).StatusCode);
        }

        [TestCase("<996>.png")]
        [TestCase(":icu.gif")]
        [TestCase("|.jpg")]
        [Platform(Include = "Win")]
        public async Task GetImage_InvalidFileNames(string filename)
        {
            var ctl = CreateAssetsController();

            var memCacheMock = new Mock<IMemoryCache>();
            var result = await ctl.Image(filename, memCacheMock.Object);
            Assert.IsInstanceOf(typeof(BadRequestObjectResult), result);
        }

        [Test]
        public async Task Manifest()
        {
            _mockBlogConfig.Setup(bc => bc.GeneralSettings).Returns(new GeneralSettings
            {
                SiteTitle = "Fake Title"
            });

            _mockWebHostEnv.Setup(p => p.WebRootPath).Returns(@"C:\35\404\996\251");
            _mockAppSettings.Setup(p => p.Value).Returns(new AppSettings());

            var ctl = CreateAssetsController();

            var result = await ctl.Manifest(_mockWebHostEnv.Object, null);
            Assert.IsInstanceOf(typeof(JsonResult), result);
            if (result is JsonResult jsonResult)
            {
                if (jsonResult.Value is ManifestModel model)
                {
                    Assert.IsTrue(model.ShortName == _mockBlogConfig.Object.GeneralSettings.SiteTitle);
                    Assert.IsTrue(model.Name == _mockBlogConfig.Object.GeneralSettings.SiteTitle);
                }
            }
        }

        [Test]
        public void CustomCss_Disabled()
        {
            _mockBlogConfig.Setup(bc => bc.CustomStyleSheetSettings).Returns(new CustomStyleSheetSettings
            {
                EnableCustomCss = false
            });

            _mockAppSettings.Setup(p => p.Value).Returns(new AppSettings());

            var ctl = CreateAssetsController();
            var result = ctl.CustomCss();
            Assert.IsInstanceOf(typeof(NotFoundResult), result);
        }

        [Test]
        public void CustomCss_TooLargeCss()
        {
            _mockBlogConfig.Setup(bc => bc.CustomStyleSheetSettings).Returns(new CustomStyleSheetSettings
            {
                EnableCustomCss = true,
                CssCode = new('a', 65536)
            });

            _mockAppSettings.Setup(p => p.Value).Returns(new AppSettings());

            var ctl = CreateAssetsController();

            var result = ctl.CustomCss();
            Assert.IsInstanceOf(typeof(ConflictObjectResult), result);
        }

        [Test]
        public void CustomCss_InvalidCss()
        {
            _mockBlogConfig.Setup(bc => bc.CustomStyleSheetSettings).Returns(new CustomStyleSheetSettings
            {
                EnableCustomCss = true,
                CssCode = "Work 996, Sick ICU!"
            });

            _mockAppSettings.Setup(p => p.Value).Returns(new AppSettings());

            var ctl = CreateAssetsController();

            var result = ctl.CustomCss();
            Assert.IsInstanceOf(typeof(ConflictObjectResult), result);
        }

        [Test]
        public void CustomCss_ValidCss()
        {
            _mockBlogConfig.Setup(bc => bc.CustomStyleSheetSettings).Returns(new CustomStyleSheetSettings
            {
                EnableCustomCss = true,
                CssCode = ".honest-man .hat { color: green !important;}"
            });

            _mockAppSettings.Setup(p => p.Value).Returns(new AppSettings());

            var ctl = CreateAssetsController();

            var result = ctl.CustomCss();
            Assert.IsInstanceOf(typeof(ContentResult), result);

            var content = (ContentResult)result;
            Assert.AreEqual("text/css", content.ContentType);
        }

        //[Test]
        //public void CaptchaImage_CrazySize()
        //{
        //    _mockAppSettings.Setup(p => p.Value).Returns(new AppSettings()
        //    {
        //        CaptchaSettings = new()
        //        {
        //            ImageHeight = 996,
        //            ImageWidth = 996
        //        }
        //    });

        //    var ms = new MemoryStream();
        //    var captchaMock = new Mock<ISessionBasedCaptcha>();
        //    captchaMock.Setup(p => p.GenerateCaptchaImageFileStream(It.IsAny<ISession>(), It.IsAny<int>(), It.IsAny<int>())).Returns(new FileStreamResult(ms, "image/png"));

        //    var ctl = CreateAssetsController();
        //    ctl.ControllerContext = new()
        //    {
        //        HttpContext = new DefaultHttpContext()
        //    };

        //    var result = ctl.CaptchaImage(captchaMock.Object);
        //}


    }
}
