import React, { useEffect, useState } from 'react';
import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchplaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (error) {}
    };
    fetchplaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  // const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
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

// const DUMMY_PLACES = [
//   {
//     id: 'p1',
//     title: '2222222222222',
//     description: ' loaded',
//     imageUrl:
//       'https://www.flytap.com/-/media/Flytap/new-tap-pages/destinations/europe/russia/moscow/destinations-moscow-banner-mobile-1024x553.jpg',
//     address: 'Moscow The Moscow Kremlin, Moscow, Russia, ',
//     location: {
//       lat: 55.755825,
//       lng: 37.617298,
//     },
//     creator: 'u1',
//   },
//   {
//     id: 'p2',
//     title: 'moscow',
//     description: ' loaded',
//     imageUrl:
//       'https://www.flytap.com/-/media/Flytap/new-tap-pages/destinations/europe/russia/moscow/destinations-moscow-banner-mobile-1024x553.jpg',
//     address: 'Moscow The Moscow Kremlin, Moscow, Russia, ',
//     location: {
//       lat: 55.755825,
//       lng: 37.617298,
//     },
//     creator: 'u2',
//   },
// ];
