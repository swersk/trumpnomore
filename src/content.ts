(function () {
  'use strict';

  const quotes = [
      { text: "Be yourself; everyone else is taken.", source: "Oscar Wilde" },
      { text: "Dream big and dare to fail.", source: "Norman Vaughan" },
      { text: "Simplicity is the ultimate sophistication.", source: "Leonardo da Vinci" },
      { text: "Believe you can, and you're halfway there.", source: "Theodore Roosevelt" },
      { text: "Actions speak louder than words.", source: "Proverb" },
      { text: "Life is short. Smile while you still have teeth.", source: "Unknown" },
      { text: "To love and be loved is everything.", source: "T. Tolis" },
      { text: "Do small things with great love.", source: "Mother Teresa" },
      { text: "This too shall pass.", source: "Persian Proverb" },
      { text: "It always seems impossible until it’s done.", source: "Nelson Mandela" }
  ];

  const replacementImages = [
      'images/replacement-img.png',
      'images/replacement-img2.png',
      'images/replacement-img3.png',
  ];

  // Function to get a random quote
//   function getRandomQuote() {
//       return quotes[Math.floor(Math.random() * quotes.length)];
//   }

  // Function to replace content containing "Trump" with a random quote
//   function replaceContent(containerSelector: string, textSelector: string) {
//       const container = document.querySelector(containerSelector);
//       if (!container) return;

//       const elements = Array.from(container.querySelectorAll(textSelector)).filter((el) => 
//           el.textContent?.includes("Trump")
//       );

//       elements.forEach((el) => {
//           const quote = getRandomQuote();
//           el.innerHTML = `<span style="background-color: lightgray; border: 1px solid gray; padding: 2px;"><span>${quote.text}</span><small>- ${quote.source}</small></span>`;
//       });
//   }

  // Function to get a random image URL from the array
  function getRandomImageUrl() {
      const randomImage = replacementImages[Math.floor(Math.random() * replacementImages.length)];
      return chrome.runtime.getURL(randomImage);
  }

  // Function to replace images with a "Trump" alt text with a random replacement image
  function replaceImages(imageSelector: string) {
      const pictures = Array.from(document.querySelectorAll(imageSelector));

      pictures.forEach((picture) => {
          const img = picture.querySelector('img');
          if (img && img.alt.toLowerCase().includes("trump")) {
              const randomImageUrl = getRandomImageUrl();
              img.src = randomImageUrl;
              img.alt = "Replaced image";
              img.style.width = '100%';
              img.style.height = 'auto';
              img.style.objectFit = 'cover';

              picture.querySelectorAll('source').forEach((source) => {
                  source.srcset = randomImageUrl;
              });
          }
      });
  }

  // Event listener to trigger content and image replacement on page load
  window.addEventListener('load', () => {
    //   replaceContent(
    //       '.layout__content-wrapper.layout-homepage__content-wrapper', // CNN container selector
    //       'span, a, li, h2'   
    //   );
      replaceImages('picture');
  });

})();
