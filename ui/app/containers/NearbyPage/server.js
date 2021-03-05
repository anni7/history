const credentials = require('./credentials.json');

const app = express();
const port = 3008;

app.get('/api/geo', async (req, res) => {
  try {
    const serviceRoot = 'https://www.flickr.com/services/rest/';
    const baseQuery = `?method=flickr.photos.search&api_key=${credentials.flickr.api_key}&format=json&nojsoncallback=1`;
    const geoQuery = '&lat=49.282705&lon=-123.115326&radius=1';

    const serviceUrl = `${serviceRoot}${baseQuery}${geoQuery}`;
    const response = await fetch(serviceUrl);
    const result = await response.json();

    // image url docs https://www.flickr.com/services/api/misc.urls.html
    const flickrImgPath = (image) => `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg`;

    const images = result.photos.photo.map((photo) => ({
      caption: photo.title,
      src: flickrImgPath(photo),
    }));

    res.send({ images });
  } catch (error) {
    res.send({ error: error.message });
  }
});
