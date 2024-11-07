import { __awaiter } from 'tslib';

async function getRandomImageUrl() {
  const { replacementImages = [], activeImages = [] } = await chrome.storage.local.get(['replacementImages', 'activeImages']);
  const imagesToUse = activeImages.length > 0 ? activeImages : [chrome.runtime.getURL('images/replacement-img.png')];

  return imagesToUse[Math.floor(Math.random() * imagesToUse.length)];
}

async function replaceImages(imageSelector: string) {
  const pictures = Array.from(document.querySelectorAll(imageSelector));

  for (const picture of pictures) {
      const img = picture.querySelector('img');
      if (img && img.alt.toLowerCase().includes("trump")) {
          const randomImageUrl = await getRandomImageUrl();
          img.src = randomImageUrl;
          img.alt = "Replaced image";
          img.style.width = '100%';
          img.style.height = 'auto';
          img.style.objectFit = 'cover';

          picture.querySelectorAll('source').forEach((source) => {
              source.srcset = randomImageUrl;
          });
      }
  }
}

window.addEventListener('load', () => {
  replaceImages('picture');
});
