'use strict'
const axios = require('axios');
export const getImages = async (requestName, page, limit) => {
   const baseUrl = `https://pixabay.com/api/?key=22644758-91a56f4647f302f87ea071930&q=${requestName}&page=${page}&per_page=${limit}&image_type=photo&orientation=horizontal&safesearch=true`;
   if (!requestName || requestName.trim() === '') {
      return [];
   };
   
   const response = await axios.get(baseUrl);
   return response.data;
};

