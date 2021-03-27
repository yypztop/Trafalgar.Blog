﻿using System;

namespace Moonglade.Notification.Client
{
    public class PingPayload
    {
        public PingPayload(
            string targetPostTitle, DateTime pingTimeUtc, string domain, string sourceIp, string sourceUrl, string sourceTitle)
        {
            TargetPostTitle = targetPostTitle;
            PingTimeUtc = pingTimeUtc;
            Domain = domain;
            SourceIp = sourceIp;
            SourceUrl = sourceUrl;
            SourceTitle = sourceTitle;
        }

        public string TargetPostTitle { get; set; }

        public DateTime PingTimeUtc { get; set; }

        public string Domain { get; set; }

        public string SourceIp { get; set; }

        public string SourceUrl { get; set; }

        public string SourceTitle { get; set; }
    }
}