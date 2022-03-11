import React from 'react';
import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: '2222222222222',
    description: ' loaded',
    imageUrl:
      'https://www.flytap.com/-/media/Flytap/new-tap-pages/destinations/europe/russia/moscow/destinations-moscow-banner-mobile-1024x553.jpg',
    address: 'Moscow The Moscow Kremlin, Moscow, Russia, ',
    location: {
      lat: 55.755825,
      lng: 37.617298,
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'moscow',
    description: ' loaded',
    imageUrl:
      'https://www.flytap.com/-/media/Flytap/new-tap-pages/destinations/europe/russia/moscow/destinations-moscow-banner-mobile-1024x553.jpg',
    address: 'Moscow The Moscow Kremlin, Moscow, Russia, ',
    location: {
      lat: 55.755825,
      lng: 37.617298,
    },
    creator: 'u2',
  },
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;

// key={place.id}
//           id={place.id}
//           image={place.imageUrl}
//           title={place.title}
//           description={place.description}
//           addres={place.address}
//           creator={place.creator}
//           coordinates={place.location}
