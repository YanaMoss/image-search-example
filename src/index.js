'use strict';
import './sass/main.scss';
import { getImages } from './js/getImages';
import card from './templates/card.hbs';
import _, { divide } from 'lodash';
import Notiflix from 'notiflix';
import 'simplelightbox';

const DEBOUNCE_DELAY = 300;
const limit = 100;
const searchQuery = document.querySelector('input');
const searchButton = document.querySelector('button');
const loadMoreButton = document.querySelector('.load-more');
const galleryImages = document.querySelector('.gallery');
const cardPhoto = document.querySelector('.photo-card');

let gallery;
let page = 1;
let dataImages = [];
let requestName = ' ';
let name = ' ';
let totalHits = ' ';

window.onload = () => {
  searchQuery.addEventListener('input', _.debounce(getSearchQuery, DEBOUNCE_DELAY));
  searchButton.addEventListener('click', sendSearchQuery);
  loadMoreButton.addEventListener('click', getLoadMore);

  function getSearchQuery(event) {
    if (event.target.value && event.target.value.trim() !== '') {
      name = event.target.value;
      searchQuery.setAttribute('value', name);
    } else {
      searchQuery.removeAttribute('value');
    }
  }

  function sendSearchQuery(event) {
    event.preventDefault();
    dataImages = [];
    renderImage();
  }

  function getLoadMore(event) {
    event.preventDefault();
    if (dataImages.length >= totalHits) {
      Notiflix.Notify.Failure("We're sorry, but you've reached the end of search results.");
      loadMoreButton.classList.add('is-hidden');
    } else {
      page += 1;
      renderImage();
    }
  }

  async function renderImage() {
    requestName = searchQuery.getAttribute('value');
    await getImages(requestName, page, limit)
      .then(response => {
        loadMoreButton.classList.remove('is-hidden');
        dataImages.push(...response.hits);
        totalHits = response.totalHits;
        galleryImages.innerHTML = card(dataImages);
        gallery = new SimpleLightbox('.gallery a');
      })
      .catch(err => {
        loadMoreButton.classList.add('is-hidden');
      });
    if (dataImages.length === undefined || dataImages.length === 0) {
      Notiflix.Notify.Failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      loadMoreButton.classList.add('is-hidden');
    } else {
      if (page === 1) {
        Notiflix.Notify.Info(`'Hooray! We found ${totalHits} images.'`);
      }
    }
  }

  cardPhoto.addEventListener('click', openImage);

  function openImage(event) {
    gallery.open();
  }
};
