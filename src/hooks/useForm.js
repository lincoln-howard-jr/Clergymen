import { useState } from "react";

//  onSubmit : async Function
//    action performed on when form.submit is called
//  defaultValues : Object
//    the default values for the form
//  validation : Object
//    an object that maps field names to validation functions
export default function useForm (onSubmit=v=>console.log (v), defaultValues={}, validation={}) {

  const [values, setValues] = useState (defaultValues);
  const [validationErrors, setErr] = useState ({});

  const set = name => (e) => {
    if (e.target && e.target.value) return setValues (values => Object.assign (values, {[name]: e.target.value}));
    setValues (values => Object.assign (values, {[name]: e}));
  }

  const setAll = obj => {
    setValues (obj);
  }

  const get = name => {
    return values [name];
  }

  const status = name => {
    return validationErrors [name] ? 'invalid' : 'valid';
  }

  const validate = () => {
    let throwErr = false;
    for (const name in validation) {
      validation [name] (values [name]) ?
        setErr (errors => Object.assign (errors, {[name]: false}))
        :
        throwErr = true; setErr (errors => Object.assign (errors, {[name]: true}))
      ;
    }
    if (throwErr) {
      console.log (validationErrors);
      throw new Error ('validation error');
    }
  }

  const submit = async () => new Promise (async (resolve,reject) => {
    try {
      validate ();
      let result = await onSubmit (values);
      resolve (result);
    } catch (e) {
      reject (e);
    }
  });

  return {set, setAll, get, status, submit};

}