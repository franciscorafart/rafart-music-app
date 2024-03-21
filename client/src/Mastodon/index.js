import { useEffect } from "react";
import * as MastodonTimeline from "@idotj/mastodon-embed-timeline";

// docs
// https://gitlab.com/idotj/mastodon-embed-timeline#examples

const MastodonFeed = () => {
    useEffect(() => {
        new MastodonTimeline.Init({
            instanceUrl: "https://mastodon.social",
            timelineType: "profile",
            userId: "110293157326459130",
            profileName: "@rafart",
            defaultTheme: "dark",
            dateLocale: "en-US",
            hideUnlisted: true,
            btnSeeMore: "",
            btnReload: "More news",
          }
          );
    }, []);
    return (
        <div id="mt-container" class="mt-container">
            <div class="mt-body" role="feed">
                <div class="mt-loading-spinner"></div>
            </div>
        </div>
    );
}

export default MastodonFeed;