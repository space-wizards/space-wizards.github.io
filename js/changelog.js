var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const changelogUrl = 'https://moon.spacestation14.com/changelog.xml';
export function fetchChangelog() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(changelogUrl);
        if (!response.ok) {
            document.getElementById('changelog-reload-button').hidden = false;
            return;
        }
        const parser = new DOMParser();
        const changelog = parser.parseFromString(yield response.text(), 'text/xml');
        const versions = changelog.querySelectorAll('item');
        let outputHtml = "";
        for (const version of versions) {
            const date = new Date(Date.parse(version.querySelector('pubDate').innerHTML));
            const entries = Array.from(version.querySelectorAll('entry'))
                .map(entry => new ChangelogEntry(entry));
            const versionHtml = versionTemplate(date, entries);
            outputHtml = outputHtml.concat(versionHtml);
        }
        document.getElementById('changelog-output').innerHTML = outputHtml;
    });
}
const html = (strings, ...values) => String.raw({ raw: strings }, ...values);
const versionTemplate = (date, changes) => html `
        <article class="changelog-version">
            <h3 class="version-date">${date.toLocaleDateString('en-EN', {})}</h3>
            ${changes.map(value => changelogTemplate(value)).join('')}
        </article>
    `;
const changelogTemplate = (change) => html `
        <h4 class="change-author">${change.author}</h4>
        <ul class="version-changes">
        ${change.changes.map(entry => `<li class="version-change" data-type="${entry.type}">${entry.text}</li>`).join('')}
        </ul>`;
class ChangelogEntry {
    constructor(entry) {
        this._changes = [];
        this._author = entry.querySelector('author').innerHTML;
        const xmlChanges = entry.querySelectorAll('change');
        for (const change of xmlChanges) {
            this._changes.push({
                type: change.getAttribute('ss14:type'),
                text: change.innerHTML
            });
        }
    }
    get author() {
        return this._author;
    }
    get changes() {
        return this._changes;
    }
}
