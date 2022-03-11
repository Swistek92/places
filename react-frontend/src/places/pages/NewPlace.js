import React from 'react';
import './PlaceForm.css';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';

const NewPlace = () => {
  const [formState, InputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  // const DescriptionInputHandler = useCallback((id, value, isValid) => {}, []);

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend
  };

  return (
    <form className='place-form' onSubmit={placeSubmitHandler}>
      <Input
        id='title'
        element='input'
        type='text'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Place enter a valid title'
        onInput={InputHandler}
      />
      <Input
        id='description'
        element='textarea'
        label='Description'
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
        errorText='Place enter a description(at last 5 characters).'
        onInput={InputHandler}
      />
      <Input
        id='address'
        element='input'
        label='Address'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Place enter a valid address.'
        onInput={InputHandler}
      />
      <Button type='submit' disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  );
};

export default NewPlace;