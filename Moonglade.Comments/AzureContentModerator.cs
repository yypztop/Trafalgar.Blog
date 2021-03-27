﻿using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.CognitiveServices.ContentModerator;

namespace Moonglade.Comments
{
    public class AzureContentModeratorSettings
    {
        public string OcpApimSubscriptionKey { get; set; }
        public string Endpoint { get; set; }
    }

    public class AzureContentModerator : ICommentModerator, IDisposable
    {
        private readonly IContentModeratorClient _client;

        public AzureContentModerator(AzureContentModeratorSettings settings)
        {
            _client = Authenticate(settings.OcpApimSubscriptionKey, settings.Endpoint);
        }

        private static IContentModeratorClient Authenticate(string key, string endpoint)
        {
            var client = new ContentModeratorClient(new ApiKeyServiceClientCredentials(key))
            {
                Endpoint = endpoint
            };
            return client;
        }

        public async Task<string> ModerateContent(string input)
        {
            byte[] textBytes = Encoding.UTF8.GetBytes(input);
            var stream = new MemoryStream(textBytes);
            var screenResult = await _client.TextModeration.ScreenTextAsync("text/plain", stream);

            if (screenResult.Terms is not null)
            {
                foreach (var item in screenResult.Terms)
                {
                    // TODO: Find a more efficient way
                    input = input.Replace(item.Term, "*");
                }
            }

            return input;
        }

        public async Task<bool> HasBadWord(params string[] input)
        {
            foreach (var s in input)
            {
                byte[] textBytes = Encoding.UTF8.GetBytes(s);
                var stream = new MemoryStream(textBytes);
                var screenResult = await _client.TextModeration.ScreenTextAsync("text/plain", stream);
                if (screenResult.Terms is not null)
                {
                    return true;
                }
            }

            return false;
        }

        public void Dispose()
        {
            _client?.Dispose();
        }
    }
}