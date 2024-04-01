export function whenReady(ready) {
    if (document.readyState !== "loading") {
        ready();
    }
    else {
        document.addEventListener("DOMContentLoaded", ready);
    }
}
export function ensureOk(response) {
    if (!response.ok) {
        throw new Error("Response was not ok!");
    }
}
