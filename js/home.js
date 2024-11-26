var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createApp } from "./vue/petite-vue.es.js";
import { whenReady } from "./util.js";
import { getServerList } from "./hub_api.js";
import { fetchChangelog } from "./changelog.js";
let SELECTED_GALLERY_IMG;
let SELECTED_THUMB;
let GALLERY_IMGS = {};
let GALLERY_THUMBS = {};
function setupGallery() {
    let imgs = document.querySelectorAll(".gallery-img");
    for (var i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        let imgId = img.dataset.galleryId;
        GALLERY_IMGS[imgId] = img;
        if (img.classList.contains("active")) {
            SELECTED_GALLERY_IMG = img;
        }
    }
    let thumbs = document.querySelectorAll(".gallery-thumb");
    for (var i = 0; i < thumbs.length; i++) {
        let thumb = thumbs[i];
        let imgId = thumb.dataset.galleryId;
        GALLERY_THUMBS[imgId] = thumb;
        if (GALLERY_IMGS[imgId] == SELECTED_GALLERY_IMG) {
            thumb.classList.add("active");
            SELECTED_THUMB = thumb;
        }
        thumb.addEventListener("click", event => {
            switchToImage(imgId);
        });
    }
}
function switchToImage(imgId) {
    let selected = SELECTED_GALLERY_IMG;
    let selectedThumb = SELECTED_THUMB;
    let newSelected = GALLERY_IMGS[imgId];
    let newSelectedThumb = GALLERY_THUMBS[imgId];
    selected.classList.remove("active");
    newSelected.classList.add("active");
    selectedThumb.classList.remove("active");
    newSelectedThumb.classList.add("active");
    SELECTED_GALLERY_IMG = newSelected;
    SELECTED_THUMB = newSelectedThumb;
}
function serverEntry(entry) {
    return {
        $template: "#server-entry-template",
        entry: entry,
        get statusData() {
            return entry.statusData;
        },
        get address() {
            return entry.address;
        },
        get roundStartedAgo() {
            if (entry.statusData.round_start_time == null) {
                return null;
            }
            let roundStart = Date.parse(entry.statusData.round_start_time);
            let now = Date.now();
            let diffMinutes = (now - roundStart) / 60000;
            let diffFormatted = diffMinutes.toLocaleString("en-US", { maximumFractionDigits: 0 });
            return `${diffFormatted} minute${diffFormatted == "1" ? "" : "s"}`;
        }
    };
}
const HomePageServerListSize = 5;
const HomePageLanguageTag = "lang:en";
function isServerListValid(server) {
    var _a;
    let tags = server.inferredTags.concat((_a = server.statusData.tags) !== null && _a !== void 0 ? _a : []);
    for (let tag of tags) {
        if (tag.startsWith(HomePageLanguageTag))
            return true;
    }
    return false;
}
function shortServerList() {
    return {
        servers: [],
        loading: true,
        mounted() {
            return __awaiter(this, void 0, void 0, function* () {
                let servers = yield getServerList();
                servers = servers.filter(isServerListValid);
                servers.sort((a, b) => b.statusData.players - a.statusData.players);
                servers = servers.slice(0, HomePageServerListSize);
                this.servers = servers;
                this.loading = false;
            });
        }
    };
}
function setupServerList() {
    createApp({
        serverEntry,
        shortServerList
    }).mount("#home-servers");
}
whenReady(() => {
    setupGallery();
    setupServerList();
    fetchChangelog();
});
