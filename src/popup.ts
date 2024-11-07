import { __awaiter } from "tslib";

const defaultImagePath = chrome.runtime.getURL('images/replacement-img.png');
const deleteButton = document.getElementById('delete-selected') as HTMLButtonElement;

// Update the active images list and refresh the display
async function updateActiveImages() {
    const checkboxes = document.querySelectorAll('#saved-images input[type="checkbox"]');
    const activeImages = Array.from(checkboxes)
        .filter((checkbox) => (checkbox as HTMLInputElement).checked)
        .map((checkbox) => (checkbox as HTMLInputElement).value);

    await chrome.storage.local.set({ activeImages });
    displaySavedImages(); // Refresh to update the "Active" labels
}

// Update the "Delete Selected" button's state
function updateDeleteButtonState() {
    const checkboxes = document.querySelectorAll('#saved-images input[type="checkbox"]');
    const isAnyChecked = Array.from(checkboxes).some((checkbox) => (checkbox as HTMLInputElement).checked);
    deleteButton.disabled = !isAnyChecked;
}

// Display all saved images, including the default image, with checkboxes and active labels
async function displaySavedImages() {
    const { replacementImages = [], activeImages = [] } = await chrome.storage.local.get(['replacementImages', 'activeImages']);
    const savedImagesContainer = document.getElementById('saved-images') as HTMLDivElement;
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
    if (defaultCheckbox.checked) defaultContainer.appendChild(activeLabel); // Only show "Active" if in use
    savedImagesContainer.appendChild(defaultContainer);

    // Display user-uploaded images with checkboxes
    replacementImages.forEach((imageUrl: string) => {
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
        if (checkbox.checked) imgContainer.appendChild(activeLabel); // Only show "Active" if in use
        savedImagesContainer.appendChild(imgContainer);
    });

    updateDeleteButtonState();
}

// Function to delete selected images
async function deleteSelectedImages() {
    const checkboxes = document.querySelectorAll('#saved-images input[type="checkbox"]:checked') as NodeListOf<HTMLInputElement>;
    const selectedUrls = Array.from(checkboxes).map(checkbox => checkbox.value);

    const { replacementImages } = await chrome.storage.local.get('replacementImages');
    const updatedImages = replacementImages?.filter((imageUrl: string) => !selectedUrls.includes(imageUrl)) || [];

    await chrome.storage.local.set({ replacementImages: updatedImages });
    displaySavedImages(); // Refresh displayed images
}

// Save new images without setting them as active by default and refresh the page
document.getElementById('add')?.addEventListener('click', async () => {
    const uploadInput = document.getElementById('upload') as HTMLInputElement;
    const statusText = document.getElementById('status') as HTMLParagraphElement;

    if (!uploadInput || !uploadInput.files) return;

    const files = uploadInput.files;
    if (files.length > 3) {
        statusText.innerText = "You can upload a maximum of 3 images.";
        return;
    }

    const imageUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Convert image to Base64
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        
        imageUrls.push(base64);
    }

    const { replacementImages = [] } = await chrome.storage.local.get('replacementImages');
    await chrome.storage.local.set({ replacementImages: [...replacementImages, ...imageUrls] });
    statusText.innerText = "Images saved successfully!";
    displaySavedImages(); // Refresh displayed images
});

// Delete selected images on button click
deleteButton.addEventListener('click', deleteSelectedImages);

// Initialize images display on popup load
document.addEventListener('DOMContentLoaded', displaySavedImages);
