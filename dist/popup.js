(function () {
  'use strict';

  /******************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }

  typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };

  var _a;
  const defaultImagePath = chrome.runtime.getURL('images/replacement-img.png');
  const deleteButton = document.getElementById('delete-selected');
  // Update the active images list and refresh the display
  function updateActiveImages() {
      return __awaiter(this, void 0, void 0, function* () {
          const checkboxes = document.querySelectorAll('#saved-images input[type="checkbox"]');
          const activeImages = Array.from(checkboxes)
              .filter((checkbox) => checkbox.checked)
              .map((checkbox) => checkbox.value);
          yield chrome.storage.local.set({ activeImages });
          displaySavedImages(); // Refresh to update the "Active" labels
      });
  }
  // Update the "Delete Selected" button's state
  function updateDeleteButtonState() {
      const checkboxes = document.querySelectorAll('#saved-images input[type="checkbox"]');
      const isAnyChecked = Array.from(checkboxes).some((checkbox) => checkbox.checked);
      deleteButton.disabled = !isAnyChecked;
  }
  // Display all saved images, including the default image, with checkboxes and active labels
  function displaySavedImages() {
      return __awaiter(this, void 0, void 0, function* () {
          const { replacementImages = [], activeImages = [] } = yield chrome.storage.local.get(['replacementImages', 'activeImages']);
          const savedImagesContainer = document.getElementById('saved-images');
          savedImagesContainer.innerHTML = ''; // Clear previous images
          // Add the default image with "Default" label and active indicator
          const defaultContainer = document.createElement('div');
          const defaultImg = document.createElement('img');
          defaultImg.src = defaultImagePath;
          defaultImg.alt = "Default Image";
          const defaultCheckbox = document.createElement('input');
          defaultCheckbox.type = 'checkbox';
          defaultCheckbox.value = defaultImagePath;
          defaultCheckbox.checked = activeImages.length === 0 || activeImages.includes(defaultImagePath); // If no images are selected, default is active
          defaultCheckbox.addEventListener('change', updateActiveImages);
          const defaultLabel = document.createElement('span');
          defaultLabel.innerText = "Default";
          defaultLabel.style.fontWeight = 'bold';
          const activeLabel = document.createElement('span');
          activeLabel.classList.add('active-label');
          activeLabel.innerText = defaultCheckbox.checked ? 'Active' : '';
          defaultContainer.appendChild(defaultCheckbox);
          defaultContainer.appendChild(defaultImg);
          defaultContainer.appendChild(defaultLabel);
          if (defaultCheckbox.checked)
              defaultContainer.appendChild(activeLabel); // Only show "Active" if in use
          savedImagesContainer.appendChild(defaultContainer);
          // Display user-uploaded images with checkboxes
          replacementImages.forEach((imageUrl) => {
              const imgContainer = document.createElement('div');
              const img = document.createElement('img');
              img.src = imageUrl;
              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.value = imageUrl;
              checkbox.checked = activeImages.includes(imageUrl); // Only mark as active if previously selected
              checkbox.addEventListener('change', updateActiveImages);
              const activeLabel = document.createElement('span');
              activeLabel.classList.add('active-label');
              activeLabel.innerText = checkbox.checked ? 'Active' : '';
              imgContainer.appendChild(checkbox);
              imgContainer.appendChild(img);
              if (checkbox.checked)
                  imgContainer.appendChild(activeLabel); // Only show "Active" if in use
              savedImagesContainer.appendChild(imgContainer);
          });
          updateDeleteButtonState();
      });
  }
  // Function to delete selected images
  function deleteSelectedImages() {
      return __awaiter(this, void 0, void 0, function* () {
          const checkboxes = document.querySelectorAll('#saved-images input[type="checkbox"]:checked');
          const selectedUrls = Array.from(checkboxes).map(checkbox => checkbox.value);
          const { replacementImages } = yield chrome.storage.local.get('replacementImages');
          const updatedImages = (replacementImages === null || replacementImages === void 0 ? void 0 : replacementImages.filter((imageUrl) => !selectedUrls.includes(imageUrl))) || [];
          yield chrome.storage.local.set({ replacementImages: updatedImages });
          displaySavedImages(); // Refresh displayed images
      });
  }
  // Save new images without setting them as active by default and refresh the page
  (_a = document.getElementById('add')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
      const uploadInput = document.getElementById('upload');
      const statusText = document.getElementById('status');
      if (!uploadInput || !uploadInput.files)
          return;
      const files = uploadInput.files;
      if (files.length > 3) {
          statusText.innerText = "You can upload a maximum of 3 images.";
          return;
      }
      const imageUrls = [];
      for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // Convert image to Base64
          const base64 = yield new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
          });
          imageUrls.push(base64);
      }
      const { replacementImages = [] } = yield chrome.storage.local.get('replacementImages');
      yield chrome.storage.local.set({ replacementImages: [...replacementImages, ...imageUrls] });
      statusText.innerText = "Images saved successfully!";
      displaySavedImages(); // Refresh displayed images
  }));
  // Delete selected images on button click
  deleteButton.addEventListener('click', deleteSelectedImages);
  // Initialize images display on popup load
  document.addEventListener('DOMContentLoaded', displaySavedImages);

})();
