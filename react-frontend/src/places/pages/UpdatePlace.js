import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import './PlaceForm.css';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: '22222222222222222',
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
    title: 'moscow1111',
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

const UpdatePlace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const placeId = useParams().placeId;

  const [formState, InputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );
  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true
      );
    }

    setIsLoading(false);
  }, [setFormData, identifiedPlace]);

  if (!identifiedPlace) {
    return (
      <div className='center'>
        <Card>
          <h1> Could not find place!</h1>
        </Card>
      </div>
    );
  }

  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (isLoading) {
    return (
      <div className='center'>
        <h2>Loading....</h2>
      </div>
    );
  }

  return (
    <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
      <Input
        id='title'
        element='input'
        type='text'
        label='Titile'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid title'
        onInput={InputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id='description'
        element='text'
        label='Description'
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText='Please enter a valid Description(min 5 characters).'
        onInput={InputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type='submit' disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
