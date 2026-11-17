import {library} from "@fortawesome/fontawesome-svg-core";
import {
    faCircleInfo,
    faEnvelope,
    faHouse,
    faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import {faGithub} from "@fortawesome/free-brands-svg-icons";

/**
 * Only the icons the app uses are registered, so the rest of Font Awesome is tree-shaken out of
 * the bundle.
 *
 * Using a new icon (`icon="fa-solid fa-xyz"`)? Add it here too, otherwise it renders as nothing
 * (the dev console logs "Could not find one or more icon(s)").
 */
library.add(
    // fa-solid
    faCircleInfo,
    faEnvelope,
    faHouse,
    faPaperPlane,
    // fa-brands
    faGithub,
);
