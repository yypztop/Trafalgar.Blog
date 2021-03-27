﻿using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

namespace Moonglade.Web.SiteIconGenerator
{
    public interface ISiteIconGenerator
    {
        void GenerateIcons(string sourceImagePath, string directory);
    }

    public class FileSystemIconGenerator : ISiteIconGenerator
    {
        public void GenerateIcons(string sourceImagePath, string directory)
        {
            if (!File.Exists(sourceImagePath))
            {
                throw new FileNotFoundException("Can not find source image for generating favicons.", sourceImagePath);
            }

            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
                if (!Directory.Exists(directory))
                {
                    throw new DirectoryNotFoundException("Can not find target directory to save generated favicons");
                }
            }

            var ext = Path.GetExtension(sourceImagePath);
            if (ext is not null && ext.ToLower() is not ".png")
            {
                throw new FormatException("Source file is not an PNG image.");
            }

            void WriteImageFiles(string prefix, IEnumerable<int> sizes)
            {
                foreach (var size in sizes)
                {
                    var destFileName = $"{prefix}{size}x{size}.png";
                    var destPath = Path.Join(directory, destFileName);
                    ResizeImageToFile(sourceImagePath, size, size, destPath, ImageFormat.Png);
                }
            }

            // How to OOP design these? May be don't need over design?
            var dic = new Dictionary<string, int[]>
            {
                { "android-icon-", new[] { 36, 48, 72, 96, 144, 192 } },
                { "favicon-", new[] { 16, 32, 96 } },
                { "apple-icon-", new[] { 57, 60, 72, 76, 114, 120, 144, 152, 180 } }
            };

            foreach (var (key, value) in dic)
            {
                WriteImageFiles(key, value);
            }

            // Here comes the extras, Apple, always so special!
            ResizeImageToFile(sourceImagePath, 192, 192, Path.Join(directory, "apple-icon.png"), ImageFormat.Png);
            ResizeImageToFile(sourceImagePath, 192, 192, Path.Join(directory, "apple-icon-precomposed.png"), ImageFormat.Png);

            // This will save actually a PNG file.
            // ResizeImageToFile(sourceImagePath, 16, 16, Path.Join(directory, "favicon.ico"), ImageFormat.Icon);
            // Must use this:
            GenerateStandardFaviconIco(Path.Join(directory, "favicon-16x16.png"), Path.Join(directory, "favicon.ico"));
        }

        private static readonly object FileLock = new object();

        private static void GenerateStandardFaviconIco(string originImagePath, string icoFilePath)
        {
            var fs = new FileStream(originImagePath, FileMode.Open, FileAccess.Read);
            using (fs)
            {
                using var image = new Bitmap(fs);

                // Wrong color and incorrect ico image, but since mordern browsers only use 'favicon-16x16.png', this .ico file is considerable fine.
                var icon = Icon.FromHandle(image.GetHicon());

                using var icoFs = new FileStream(icoFilePath, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                lock (FileLock)
                {
                    icon.Save(icoFs);
                    icoFs.Flush();
                }
            }
        }

        private static void ResizeImageToFile(string originImagePath, int toWidth, int toHeight, string savePath, ImageFormat format)
        {
            var fs = new FileStream(originImagePath, FileMode.Open, FileAccess.Read);
            var resizedImage = ResizeImage(fs, toWidth, toHeight);
            resizedImage.Save(savePath, format);
        }

        private static Bitmap ResizeImage(Stream originImageStream, int toWidth, int toHeight)
        {
            using (originImageStream)
            {
                using var image = new Bitmap(originImageStream);
                var resized = new Bitmap(toWidth, toHeight);
                using var graphics = Graphics.FromImage(resized);
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.DrawImage(image, 0, 0, toWidth, toHeight);
                return resized;
            }
        }
    }
}
