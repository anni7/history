import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

const credentials = require('./credentials.json');

/**
 * Parse querystring from route
 * @param {string} find query name
 * @param {string} from route or URL
 * @returns {string}
 */
function parseQueryString(find, from) {
  if (!find || !from) return '';
  const parts = RegExp(`[?&]${find}(=([^&#]*)|&|#|$)`).exec(from);
  return parts ? parts[2] : '';
}

//app // container // Near By Page //
// location is provided by react-router-dom
function NearbyPage({ location: { search: query } }) { //console.log of location = http://192.168.0.14:3000/Nearby
  const coordinates = parseQueryString('coordinates', query); //console.log of parseQueryString = find & from

    const [listImages, setImages] = React.useState('ToDo');

  // this side effect will execute for every commit phase (occurs after render phase)
  React.useEffect(() => {
    async function fetchData() {

      const serviceRoot = 'https://www.flickr.com/services/rest/';
      const baseQuery = `?method=flickr.photos.search&api_key=${credentials.flickr.api_key}&format=json&nojsoncallback=5`;
      const geoQuery = '&lat=49.282705&lon=-123.115326&radius=1';
      const serviceUrl = `${serviceRoot}${baseQuery}${geoQuery}`;

      const response = await fetch(serviceUrl);
      const result = await response.json();

      // console.log(result);
      // console.log(listImages);
      const flickrImgPath = (image) => `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_s.jpg`;

      const images = result.photos.photo.map((photo) => ({
        caption: photo.title,
        src: flickrImgPath(photo),
      }));

      setImages(images.map((img) => (
        <li key={img.src}>
          <img src={img.src} alt={img.title} />
        </li>
      )));
    }
    fetchData();
  }, []);

  return (
    <article style={{backgroundColor: "#ffffff"}}>
      <Helmet>
        <title>Nearby Images</title>
        <meta name="description" content="Description of Nearby" />
      </Helmet>

      <div style={{
            fontSize: 20,
            color: "#000000",
            textAlign: "center",
            marginTop: 20,
            }}>
        <FormattedMessage {...messages.header} />
      </div>
      {coordinates}

      <div class="container"
          style={{
            width: 600,
            backgroundColor: "black",
            paddingLeft: 15,
            display: "block",
            margin: "auto",
            }}>
        <div class="images"
          style={{
            display: "grid",
            gridTemplateColumns: " 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
            gridRowGap: 7,
            gridColumnGap: 7,
            width: 500,
            marginTop: 20,
            listStyleType: "none",
            paddingTop: 50,
            }}> {listImages}
        </div> {/* <!-- end of images --> */}
      </div> {/* <!-- end of container --> */}
    </article>
  )
}

export default memo(NearbyPage);
