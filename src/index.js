import './css/style.css';
import { markupgallery } from './JS/mark-up';
import ApiServiceConstructor from './JS/api-service';
import LoadMoreBtn from './JS/loadmoreBnt';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');


const apiserviceconstructor = new ApiServiceConstructor();

const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchService);


function onSearch(event) {
    event.preventDefault();
// очищуємо контейнер з картками при новому запиті і додаємо нові картки
    clearContainer();
    // збираємо термін для пошуку у set
    apiserviceconstructor.query =
        event.currentTarget.elements.searchQuery.value.trim();
    if (apiserviceconstructor.query === '') {
        return Notify.info(`Enter a word to search for images.`);
    }
    loadMoreBtn.show();
    // при зміні пошуку та сабміті форми робимо пошук з 1 сторінки
    apiserviceconstructor.resetPage();
    fetchService();
}
async function fetchService() {
    loadMoreBtn.disable();
    try {
        const data = await apiserviceconstructor.fetchService();
        if (data.total === 0) {
            Notify.info(`Sorry, there are no images matching your search query: ${apiserviceconstructor.query}.Please try again.`);
            loadMoreBtn.hide();
            return;
        }
        appendMarkup(data);
        onPageScrollBy();
        lightbox.refresh();

        if (galleryList.children.length === data.totalHits) {
            Notify.info(`We're sorry, but you've reached the end of search results.`);
            loadMoreBtn.hide();
        } else {
            loadMoreBtn.enable();
            Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }
    } catch (error) {
        Notify.info(`Error`);
}
}


function appendMarkup(hits) {
    galleryList.insertAdjacentHTML('beforeend', markupgallery(hits));
}

function clearContainer() {
    galleryList.innerHTML = '';
}




function onPageScrollBy() {
    const { height: cardHeight } = 
        galleryList.firstElementChild.getBoundingClientRect();
window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}

// "Hooray! We found totalHits images."
// "We're sorry, but you've reached the end of search results.".