import { whenReady } from "./util.js";
function onLoaded() {
    setupVideoIntersectionObserver();
}
function setupVideoIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
        return;
    }
    let observer = new IntersectionObserver(intersectionCallback);
    let videos = document.querySelectorAll("video");
    for (let i = 0; i < videos.length; i++) {
        let video = videos[i];
        if (video.paused && !video.autoplay) {
            video.attributes["was-paused"] = true;
        }
        observer.observe(video);
    }
}
function intersectionCallback(entries, observer) {
    for (const entry of entries) {
        let element = entry.target;
        if (entry.isIntersecting) {
            if (!element.attributes["was-paused"]) {
                element.play();
            }
        }
        else {
            if (element.paused && !element.autoplay) {
                element.attributes["was-paused"] = true;
            }
            element.pause();
        }
    }
}
whenReady(onLoaded);
